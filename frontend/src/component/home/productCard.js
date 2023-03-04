import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const Product = ({product}) => {

    const options = {
        edit: false,
        color: "rgba(20, 20, 20, 0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,    //width less then 600, to 20 else 25 will be the size
        value: 4.5,
        isHalf: true,
    };

    return (
        <>
                
                    <Link className="productCard" to={`/product/${product._id}`}>
                            <img src={product.images[0].url} alt={product.name} />

                            <div className="featured-inner">
                            <p>{product.name}</p>
                            <div className="featured-review">
                                <ReactStars {...options} /><span> ({product.numOfReviews} reviews) </span>
                            </div>
                            <span className="price-tag">{`₹${product.price}`}</span>
                            </div>
                    </Link>
                
        </>
    );
}

export default Product;