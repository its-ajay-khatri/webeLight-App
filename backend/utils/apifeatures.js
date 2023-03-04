class ApiFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;                     //queryStr means the whole string ?keyword=product2&category=Mobile&price[gte]=1200&price[lte]=2000
    }

    search(){
        const keyword = this.queryStr.keyword ? {          //?keyword=samosa
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",          //case insensitive
            },
        } : {};

        //console.log(keyword);

        this.query = this.query.find({...keyword});         //Finding a product
        return this;
    }
    filter(){
        const queryCopy = {...this.queryStr}

        //console.log(queryCopy);

        //removing some field for category
        const removeFields = ["keyword","page","limit"];

        removeFields.forEach(key => delete queryCopy[key]);

        //filter for price and rating
        //console.log(queryCopy);
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

        //console.log(queryCopy);
        this.query = this.query.find(JSON.parse(queryStr));        //JSON to object(JSON.parse())
        
        //console.log(queryStr);
        
        return this; 
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;   //this.queryStr.page fetches page from the url and Number converts that string to num
    
        const skip = resultPerPage * (currentPage -1);

        this.query = this.query            //this.query will find all products
                    .limit(resultPerPage)    //limit is mongodb function, will fetch only that number of elements(i.e resultsperpage is 10, so it will fetch only 10 elements as of now)
                    .skip(skip);           
        return this;
    }
};

module.exports = ApiFeatures;