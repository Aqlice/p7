import React, { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom"
import axios from 'axios'
import avatar from "../image/avatar.png"
import Comments from "./Comments"
import getAllPosts from "../pages/Home"
import heart from "../image/icons/heart.svg"

function Posts({ fname, message, postUserId, postId, date, like, getAllPosts }) {
    const token = JSON.parse(localStorage.token)
    const userId = JSON.parse(localStorage.userId)
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [likes, setLikes] = useState(false)

    const deletePost = () => {
        axios({
            method: "DELETE",
            url: `${process.env.REACT_APP_API_URL}api/posts/${postId} `,
            headers: {
                authorization: `Bearer ${token}`
            },
        })
            .then((res) => {
                setPosts(res.data)
                if (res.data.error)
                    console.log(res.data.error)
                getAllPosts()
            })
            .catch((err) => {
                console.log(err)
            }
            )
    }

    const getComments = () => {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API_URL}api/posts/${postId} `,
            headers: {
                authorization: `Bearer ${token}`
            },
        })
            .then((res) => {
                if (res.data) {
                    console.log("test", res.data)
                    setComments(res.data)
                }
                else
                    setComments('')
                if (res.data.error)
                    console.log(res.data.error)
            })
            .catch((err) => {
                console.log(err)
            }
            )
    }

    const createComment = (e) => {
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API_URL}api/posts/comments `,
            data: {
                user_id: userId,
                post_id: postId,
                comment: newComment
            },
            headers: {
                authorization: `Bearer ${token}`
            },
        }).then((res) => {
            console.log(res);
            setNewComment(res.data.comment)
            if (res.data.error) {
                console.log("la", res.data.errors)

            }
            getComments()
        })
            .catch((err) => {
                console.log(err);
            });
    }

    const addLike = () => {

        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API_URL}api/posts/like `,
            data: {
                user_id: userId,
                post_id: postId,
            },
            headers: {
                authorization: `Bearer ${token}`
            },
        })
            .then(() =>
                getAllPosts()
            )
        console.log("ici4")

        console.log("ici5")
    }
    return (
        <>
            <div className="post-container">
                <p>{message}</p>
                <p>{date}</p>
                <li onClick={addLike}>
                    <img src={heart} id="heart" />
                </li>
                <p> {like}</p>
                <li onClick={getComments} id="getComments">afficher les commentaires</li>
                <div className="comment-container" >
                    {comments.map(comments =>
                    (
                        <Comments
                            
                            id={comments.id}
                            comment={comments.comment}
                            comUserId={comments.user_id}
                            fname={comments.fName}
                            date={comments.creation_time} 
                            getComments={getComments}/>

                    )
                    )}
                    <form>
                        <input type="text" name="comment" id='comment' placeholder="commentaire" onChange={(e) => setNewComment
                            (e.target.value)} value={newComment}></input>
                        <li onClick={createComment} id="create-comment" className="active-btn">ajouter un commentaire</li>
                    </form>
                </div>
                {postUserId === userId ? (
                    <li onClick={deletePost} id="delete-post" className="active-btn">supprimer</li>)
                    : ("")
                }
            </div>
        </>
    )
}


export default Posts