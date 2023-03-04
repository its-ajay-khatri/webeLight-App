import React, { useEffect, useState } from "react";
import { clearErrors, getProduct } from "../../actions/productActions";
import {useSelector, useDispatch} from 'react-redux'
import Loader from "../layout/loader/loader";
import ProductCard from '../home/productCard'
import '../home/home.css';
import Pagination from 'react-js-pagination';
import './products.css'
import { Typography, Slider } from "@material-ui/core";
import { useAlert } from "react-alert";

const categories = [
    "Laptop",
    "Mobile",
    "Bottom",
    "Top",
    "Attire",
    "Camera",
    "SmartPhones"
]

const Product = ({match}) => {

    const dispatch = useDispatch();

    const alert = useAlert();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0,25000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);

    const { products, loading, error, productsCount, resultPerPage, filteredProductsCount } = useSelector(state => state.products)        //coming from reducers/productReducer
    
    const keyword = match.params.keyword;                 //products/subs/............subs is category fetching from url

    console.log(resultPerPage, productsCount);
    //console.log(keyword);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    };

    useEffect(() => {

        if(error){
            alert.error(error);
            dispatch(clearErrors())
        }

        dispatch(getProduct(keyword, currentPage, price, category, ratings))                    //passing that category(keyword), getProduct is in the actions/productAction file, currentPage will send the number when a user click on that page(i.e. 2)
    }, [dispatch, keyword, currentPage, price,category, ratings, alert, error]);

    let count = filteredProductsCount;

    return(
        <>
            { loading ? <Loader /> : 
                <>
                    <div className="featured-products-section">
                        <h2 className="homeHeading">Products</h2>
                        <div className="featured-container" id="container">
                            { products && products.map((product) => (
                                <ProductCard key = {product._id} product = {product} />
                            )) }
                        </div>
                        
                        <div className="filterBox">
                            <Typography>Price</Typography>
                            <Slider 
                                value={price}
                                onChange={priceHandler}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                                min={0}
                                max={25000}
                            />
                            <Typography>Categories</Typography>
                            <ul className="categoryBox">
                                { categories.map((category) => (
                                    <li className="category-link"
                                        key={category}
                                        onClick={(e) => setCategory(category) } > 

                                        {category}
                                    </li>
                                )) }
                            </ul>

                            <fieldset>
                                <Typography component="legend">Ratings above</Typography>
                                <Slider 
                                    value={ratings}
                                    onChange={(e, newRating) => {
                                        setRatings(newRating);
                                    }}
                                    aria-labelledby="continous-slider"
                                    min={0}
                                    max={5}
                                    valueLabelDisplay="auto"
                                />
                            </fieldset>
                        </div>

                        { 
                            resultPerPage < productsCount && 
                            <div className="paginationBox">
                            <Pagination 
                                activePage={currentPage} 
                                itemsCountPerPage={resultPerPage} 
                                totalItemsCount={productsCount} 
                                onChange={setCurrentPageNo} 
                                nextPageText="Next" 
                                prevPageText="Prev"
                                firstPageText="First"
                                lastPageText="Last"
                                itemClass="page-item"
                                linkClass="page-link"
                                activeClass="pageItemActive"
                                activeLinkClass="pageLinkActive"
                            />
                        </div> }

                    </div>
                </>
            }
        </>
    );
};

export default Product;