import React from "react";
import playStoreIcon from '../../../images/playstore.png'
import AppStoreIcon from '../../../images/Appstore.png'
import './footer.css';

const Footer = () => {
    return(
        <>
            <footer id="footer">
                <div className="leftFooter">
                    <h4>Download out App</h4>
                    <p>Download App from Android and IOS mobile</p>
                    <img className="footer-logo" src={playStoreIcon} alt="Playstore" />
                    <img className="footer-logo" src={AppStoreIcon} alt="Appstore" />
                </div>
                <div className="midFooter">
                    <h1>Ecommerce.</h1>
                    <p>High Quality is our first Priority</p>

                    <p>Copyrights 2023 &copy; Ajay Khatri</p>
                </div>
                <div className="rightFooter">
                     <h4>Follow Us</h4>
                     <a href="#">Instagram</a>
                     <a href="#">Facebook</a>
                     <a href="#">Youtube</a>
                </div>
            </footer>
        </>
    );
}

export default Footer;