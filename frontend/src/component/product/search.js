import React, { useState } from "react";
import './search.css'

const Search = ({history}) => {

    const [keyword, setKeyword] = useState('');

    const searchChangeFunction = (event) => {
        setKeyword(event.target.value);
    }

    const searchSubmitHandler = (e) => {
        e.preventDefault();

        if(keyword.trim()){
            history.push(`/products/${keyword}`);
        }
    }

    return(
        <>
            <form className="searchBox" onSubmit={searchSubmitHandler}>
                <input 
                    type="text"
                    className="search-box"
                    placeholder="Search a Product ..."
                    onChange={searchChangeFunction}
                />
                <input className="search-btn" type="submit" value="Search" />
            </form>
        </>
    );
}

export default Search;