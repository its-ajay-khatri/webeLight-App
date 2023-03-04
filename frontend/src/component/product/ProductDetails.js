import React, { useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import './ProductDetails.css';
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productActions";
import ReactStars from "react-rating-stars-component";
import MetaData from '../layout/MetaData';
import ReviewCard from './reviewCard.js'
import Loader from "../layout/loader/loader";
import {useAlert} from 'react-alert';


const ProductDetails = ({match}) => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

    //console.log(match.params.id);

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearErrors())
        }
        dispatch(getProductDetails(match.params.id));
    }, [dispatch, match.params.id, error, alert]);


    const options = {
        edit: false,
        color: "rgba(20, 20, 20, 0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,    //width less then 600, to 20 else 25 will be the size
        value: product.ratings,
        isHalf: true,
    };

    return(
        <>
            <MetaData title={`${product.name} - Ecommerce`} />
                {loading ? <Loader /> : (
                    <>
                    <div className="productDetails">
                    <div className="product-detail-left">
                        <Carousel className="carosoul-class">
                            {product.images &&
                            product.images.map((item, i) => {
                                return(
                                    <img className="CarouselImage"
                                    key={i}
                                    src={item.url}
                                    alt={`${i} Slide`}
                                 />
                                );
                            })}
                        </Carousel>
                    </div>
                    <div className="product-detail-right">
                        <div className="detailsBlock-1">
                            <h2>{product.name}</h2>
                            <p>Product # {product._id}</p>
                        </div>
                        <div className="detailsBlock-2">
                            <ReactStars {...options} />
                            <span>({product.numOfReviews} Reviews)</span>
                        </div>
                        <div className="detailsBlock-3">
                            <h1>{`₹${product.price}`}</h1>
                            <div className="detailsBlock-3-1">
                                <div className="detailsBlock-3-1-1">
                                    <button>-</button>
                                    <input value="1" type="number" />
                                    <button>+</button>
                                </div>{}
                                <button className="add-to-cart">Add to Cart</button>
                            </div>
                            <p>Status : {" "}
                                <b className={product.Stock < 1 ? "redColor" : "greenColor"} >
                                    {product.Stock < 1 ? "OutOfStock" : "InStock" }
                                </b>
                            </p>
                        </div>
                        <div className="detailsBlock-4">
                            Description : <p>{product.description}</p>
                        </div>
                        <button className="submitReview">Submit Review</button>
                    </div>
                </div>

                <h3 className="reviewsheading">REVIEWS</h3>

                {product.reviews && product.reviews[0] ? (
                    <div className="reviews">
                        {product.reviews &&
                            product.reviews.map((review) => <ReviewCard review={review} />)
                        }
                    </div>
                ) : (
                    <p className="noReviews">No Reviews yet</p>
                )}
                    </>
                ) }
        </>
    );
}

export default ProductDetails;