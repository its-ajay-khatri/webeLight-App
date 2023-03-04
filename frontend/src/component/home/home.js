import React, { useEffect } from "react";
import { CgMouse } from 'react-icons/all'
import './home.css'
import Product from './productCard'
import MetaData from '../layout/MetaData';
import { clearErrors, getProduct } from "../../actions/productActions";
import {useSelector, useDispatch} from 'react-redux'
import Loader from "../layout/loader/loader";
import { useAlert } from "react-alert";

const Home = () => {

    const alert = useAlert();

    const dispatch = useDispatch();

    const{ loading, error, products } = useSelector(
        (state) => state.products
    );

    useEffect(() => {

        if(error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        dispatch(getProduct());
    }, [dispatch, error, alert]);

    return (
        <>
            { loading ? ( <Loader /> ) :( <>
            <MetaData title="Home" />
                <div className="banner">
                    <p>Welcome to Ecomemrce</p>

                    <h1>FOUND AMAZING PRODUCTS BELOW</h1>

                    <a href="#container">
                        <button>
                            Scroll <CgMouse />
                        </button>
                    </a>
                </div>

                <div className="featured-products-section">
                    <h2 className="homeHeading">Featured Products</h2>
                    <div className="featured-container" id="container">
                        { products && products.map(product =>(
                            <Product product={product} /> 
                        )) }
                    </div>
                </div>
            </>) }
        </>
    );
}

export default Home;