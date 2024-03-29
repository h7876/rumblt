import React, { Component } from 'react';
import axios from 'axios'
import LoginHeader from '../Headers/Login Header/LoginHeader';
import rumblt from '../Headers/Login Header/icons/rumblt.svg';
import './Login.css';
import { connect } from 'react-redux';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
import LoginBoxes from './LoginBoxes';
import SignupForm from '../Signup/Signup';
import giphy_attr from '../../giphy/giphy_attr.png'

class Login extends Component {
    constructor() {
        super()
        this.state = {
            image: '',
            displaySignUp: false,
            displayLogIn: false,
            loginForm: false
        }
        this.toggleLoginForm = this.toggleLoginForm.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
        this.back = this.back.bind(this);
    }
    
    componentDidMount() {
        if(this.props.authUser === null){
            this.getRandomImage();
        }
        this.isLoggedIn();
    }

    isLoggedIn() {
        if (this.props.authUser !== null) {
            window.location.href = '/#/dashboard'
        }
        else {
            window.location.href = '/#/'
        }
    }

    getRandomImage() {
        var queries = ['shibe', 'doge', 'meme', 'art', 'anime', 'cats', 'funny', 'disney', 'food', 'coffee', 'animals', 'trippy', 'animals'];
        var query = queries[Math.floor(Math.random() * queries.length)]
        const key = process.env.REACT_APP_GIPHY_API_KEY
        axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${key}&tag=${query}&rating=PG`).then(res => {
            this.setState({ image: res.data.data.images.original.url })
            document.body.background = this.state.image;
            document.body.style.backgroundSize = "cover";
        }).catch(function (thrown) {
            if (axios.isCancel(thrown)) {
                console.log('Request canceled', thrown.message);
            } else {
                console.log("Error,", thrown.message)
            }
        })
    }

    toggleLoginForm() {
        this.setState({ loginForm: !this.state.loginForm });
    }

    back(){
        this.setState({
            displayLogIn: false,
            displaySignUp: false,
            loginForm: false
        })
    }

    render() {
        return (
            <div id="loginMain">
                <header>
                    <LoginHeader />
                </header>
                <div className='center'>
                    <div id="mainsignin">
                        <div id="fulllogo">
                            <img src={rumblt} alt="" />
                        </div>
                        <div id="subtitle">
                            <div className="subtop">
                                Come for what you discover.
                            </div>
                            <div className="subbottom">
                                Stay for what you love.
                            </div>
                        </div>
                        
                        <div className='signupform'>
                            <div id={this.state.displaySignUp ? "signupinfo" : "hideLogin"}>
                                <SignupForm goBack={this.back}/>
                            </div>
                            <div id={this.state.loginForm || this.state.displaySignUp ? "hideLogin" : "getstarted"}
                                onClick={() => { this.setState({ displaySignUp: true }) }}>
                                Get Started
                            </div>
                            <div id={this.state.loginForm ? "logininfo" : "hideLogin"}>
                                <LoginBoxes />
                            </div>
                            <div id={this.state.loginForm || this.state.displaySignUp ? "hideLogin" : "loginbutton"} onClick={this.toggleLoginForm}>
                                Log In
                            </div>
                            {this.state.loginForm || this.state.displaySignUp ? <button id="back" onClick={this.back}>Back</button> : null}
                        </div>
                    </div>
                </div>
                <img className="giphyAttr" src={giphy_attr} alt="Powered by Giphy" />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser
});

//TODO: evaluate if this is still needed.
// eslint-disable-next-line
const authCondition = (authUser) => !!authUser;

export default connect(mapStateToProps)(Login);