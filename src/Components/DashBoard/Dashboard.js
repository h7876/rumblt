import React, { Component } from 'react';
import MainHeader from '../Headers/Main Header/MainHeader'
import '../Headers/Login Header/LoginHeader.css'
import './Dashboard.css'
import DashFeed from './DashFeed/DashFeed'
import { connect } from 'react-redux';
import ChatUsers from './ChatUsers';
import axios from 'axios';
import RandomPost from './RandomPost';
//TODO: evaluate or remove this.
// eslint-disable-next-line
import SignOutButton from '../Login/signOut';
import InsertText from './Icons/InsertText'
import InsertQuote from './Icons/InsertQuote'
import InsertPhoto from './Icons/InsertPhoto'
import InsertLink from './Icons/InsertLink';
import InsertChat from './Icons/InsertChat';
import InsertAudio from './Icons/InsertAudio';
import InsertVideo from './Icons/InsertVideo';
import TextPost from './Post/TextPost';
import ImgPost from './Post/ImgPost';
import { getUserFollowers } from '../../reducers/following';

export class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            currentuser: [],
            posts: [],
            toggleTextPost: false,
            toggleImgPost: false,
            textInput: '',
            isDashCurrent: false,
        }
        this.getLoggedUser = this.getLoggedUser.bind(this);
        this.toggleTextInput = this.toggleTextInput.bind(this);
        this.toggleClose = this.toggleClose.bind(this);
        this.toggleImgPost = this.toggleImgPost.bind(this);
    }

    getAllPosts() {
        axios.get('/api/posts/').then((posts) => {
            this.setState({ posts: posts.data })
        })
    }

    toggleClose() {

        this.setState({ toggleTextPost: false }, () => { this.getAllPosts() })
        this.setState({ toggleImgPost: false }, () => { this.getAllPosts() })
    }

    getLoggedUser() {
        if (this.props.authUser === null) {
            window.location.href = '/#/';
        } else {
            axios.get(`/api/users/${this.props.authUser.uid}`).then((user) => {
                this.setState({ currentuser: user.data[0] })
            })
        }
    }

    getAllUsers() {
        axios.get('/api/users/').then((users) => {
        })
    }

    componentWillMount() {
        this.getLoggedUser();
    }

    componentDidMount() {
        document.body.background = '#36465d';
        this.setState({ isDashCurrent: true })
        this.getLoggedUser();
        this.getAllUsers();
        this.getAllPosts();
        // let followers = this.props.getUserFollowers(this.props.authUser.uid);
        // let {payload} = followers;
        // payload.then((res) => {
        //     console.log(res)
        // })
    }

    componentWillUnmount() {
        this.setState({ isDashCurrent: false })
    }

    toggleTextInput() {
        this.setState({ toggleTextPost: !this.state.toggleTextPost })
    }

    toggleImgPost() {
        this.setState({ toggleImgPost: !this.state.toggleImgPost })
    }

    render() {

        if (this.props.authUser !== null) {
            return (

                <div id='maindash'>
                    <div id='headerdiv'>
                        <MainHeader isDashCurrent={this.state.isDashCurrent} currentuser={this.state.currentuser} />
                    </div>
                    <div id="maincontent">
                        <div id="dashleft">
                            <div className="dashfeedtop">
                                <div className="profileimage">
                                    <img className="profileimage" src={this.state.currentuser.userimg} alt="" />
                                </div>
                                <div id="createnew">
                                    {this.state.toggleTextPost ?
                                        <div id="textpostwrapper">
                                            <TextPost toggleClose={this.toggleClose} />
                                        </div>
                                        :
                                        this.state.toggleImgPost ?
                                            <div id="textpostwrapper">
                                                <ImgPost toggleClose={this.toggleClose} />
                                            </div>
                                            :
                                            null
                                    }
                                    <div id={this.state.toggleTextPost || this.state.toggleImgPost ? "nodisplay" : "createnewwrapper"}>
                                        <div id="text" onClick={this.toggleTextInput}>
                                            <InsertText />
                                            <div className="atitle">
                                                Text
                                            </div>
                                        </div>
                                        {this.state.toggleTextPost ?
                                            <TextPost />
                                            :
                                            null
                                        }
                                        {this.state.toggleImgPost ?
                                            <ImgPost />
                                            :
                                            null
                                        }
                                        <div id="photo" onClick={this.toggleImgPost}>
                                            <InsertPhoto />
                                            <div className="atitle b">
                                                Photo
                                            </div>
                                        </div>
                                        <div id="quote">
                                            <InsertQuote />
                                            <div className="atitle">
                                                Quote
                                            </div>
                                        </div>
                                        <div id="addlink">
                                            <InsertLink />
                                            <div className="atitle b">
                                                Link
                                            </div>
                                        </div>
                                        <div id="addchat">
                                            <InsertChat />
                                            <div className="atitle">
                                                Chat
                                            </div>
                                        </div>
                                        <div id="addaudio">
                                            <InsertAudio />
                                            <div className="atitle b">
                                                Audio
                                            </div>
                                        </div>
                                        <div id="addvideo">
                                            <InsertVideo />
                                            <div className="atitle">
                                                Video
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {this.state.posts.map((post, i) => {
                                return (
                                    <div className="feed" key={post + i}>
                                        <DashFeed {...post} />
                                    </div>
                                )
                            })}
                        </div>
                        <div id="dashright">
                            <div id="chatheader">
                                FOLLOWING
                            </div>
                            <div id='dashchat'>
                                <div id='chatusercontainer'>
                                    <ChatUsers />
                                </div>
                            </div>
                            Explore all of Rumblt
                            <div className="randompost">
                                <RandomPost />
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                window.location.href = '/#/'
            )
        }
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
    getUserFollowers
});

const authCondition = (authUser) => !!authUser;

export default connect(mapStateToProps)(Dashboard);