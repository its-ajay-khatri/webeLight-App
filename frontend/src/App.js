import React, { useEffect } from 'react';
import './App.css';
import Header from './component/layout/header/Header.js'
import Footer from './component/layout/footer/footer'
import Home from "./component/home/home"
import Loader from './component/layout/loader/loader';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WebFont from 'webfontloader';
import ProductDetails from './component/product/ProductDetails.js'
import Products from './component/product/products.js';
import Search from './component/product/search.js'
import LoginSignUp from './component/user/loginSignUp.js';

function App() {

  useEffect(() => {
    WebFont.load({
      google:{
        families:["Roboto","Droid Sans", "Chilanka"],
      }
    })
  }, []);

  return (
    <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/product/:id" component={ProductDetails} />
          <Route exact path="/products" component={Products} />
          <Route exact path="/search" component={Search} />
          <Route path="/products/:keyword" component={Products} />
          <Route path="/login" component={LoginSignUp} />
        </Switch>
        <Footer />
    </Router>
  );
}

export default App;
