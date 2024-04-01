import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, Button, ButtonGroup, Snackbar, TextField, Container } from '@mui/material';
import { red } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import CloseIcon from '@mui/icons-material/Close';
import Upvote from '../images/upvote.png';
import Downvote from '../images/downvote.png';
import FilledUpvote from '../images/filledupvote.png'
import FilledDownvote from '../images/filleddownvote.png'
import Header from './Header';
import { LightTooltip } from './LightToolTip';
import CommentComp from './CommentComp';
import { UserContext } from '../UserContext';
import { useParams } from 'react-router-dom';

function DetailedPost() {
    const { userInfo,isLoading } = useContext(UserContext)
    const { category, subcategory, section, id } = useParams();
    const [load, setLoad] = useState(true)
    const [post, setPost] = useState(null);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [openSaveSnack, setOpenSaveSnack] = React.useState(false);
    const [comment, setComment] = useState('');
    const [commentsData, setCommentsData] = useState([]);
    const [upvoted, setUpvoted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [downvoted, setDownvoted] = useState(false);
    const [downvoteCount, setDownvoteCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [copiedMessage, setCopiedMessage] = useState('');
    console.log("blog card  ", userInfo?.username);


    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const response = await fetch(`https://glidethrough-backend.vercel.app/getpost/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                console.log(data);
                if (isMounted) {
                    setPost(data);
                    setLoad(false);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [id]);

    useEffect(() => {
        const fetchInteractionsData = async () => {
            try {
                const response = await fetch(`https://glidethrough-backend.vercel.app/post/${id}/interactions/${userInfo?.username}`);
                const data = await response.json();
                setUpvoteCount(data.positive);
                setDownvoteCount(data.negative);
                setLikeCount(data.fav);
                setUpvoted(data.uped);
                setDownvoted(data.downed);
                setLiked(data.impressed);
                // console.log(data.uped,data.downed,data.impressed)
            } catch (error) {
                console.error('Error fetching upvotes:', error);
            }
        };
        fetchInteractionsData();
    }, [id,userInfo?.username]);

    const commentLabel = (post?.section === 'Q&A') ? 'Responses:' : 'Comments:';
    const commentMesg = (post?.section === 'Q&A') ? 'No responses found' : 'No comments found';
    const butnText = (post?.section === 'Q&A') ? 'Send' : 'Comment';
    const userName = (!userInfo || !userInfo?.username) ? "X" : userInfo?.username[0].toUpperCase();
    useEffect(() => {
        // Fetch commentsData from server when component mounts
        if (post) {
            const fetchCommentsData = async () => {
                try {
                    const response = await fetch(`https://glidethrough-backend.vercel.app/post/${id}/comment`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch comments data');
                    }
                    const data = await response.json();
                    setCommentsData(data);
                    console.log(data)
                } catch (error) {
                    console.error('Error fetching comments data:', error);
                }
            };
            fetchCommentsData();
        }
    }, [post]);

    if (load) {
        return <div>Loading...</div>; // Render loading indicator if data is still being fetched
    }
    if (isLoading) {
        return <div>Loading...</div>; // Render loading indicator if data is still being fetched
    }
    const handleUpvote = async () => {
        if (!userInfo || !userInfo.username) {
            setOpenSnack(true);
            return;
        }
        try {
            const response = await fetch(`https://glidethrough-backend.vercel.app/post/${id}/upvote`, {
                method: 'PUT',
                body: JSON.stringify({ user: userInfo?.username }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setUpvoted(!upvoted);
                if(downvoted)setDownvoted(!downvoted);
                setUpvoteCount(data.up);
                setDownvoteCount(data.down);
            }
        } catch (error) {
            console.error('Error toggling upvote:', error);
        }
    };

    const handleDownvote = async () => {
        if (!userInfo || !userInfo.username) {
            setOpenSnack(true);
            return;
        }
        try {
            const response = await fetch(`https://glidethrough-backend.vercel.app/post/${id}/downvote`, {
                method: 'PUT',
                body: JSON.stringify({ user: userInfo?.username }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                if(upvoted)setUpvoted(!upvoted);
                setDownvoted(!downvoted);
                setUpvoteCount(data.up);
                setDownvoteCount(data.down);
            }
        } catch (error) {
            console.error('Error toggling downvote:', error);
        }
    };

    const handleLike = async () => {
        if (!userInfo || !userInfo.username) {
            setOpenSnack(true);
            return;
        }
        try {
            const response = await fetch(`https://glidethrough-backend.vercel.app/post/${id}/like`, {
                method: 'PUT',
                body: JSON.stringify({ user: userInfo?.username }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setLiked(!liked);
                setLikeCount(data);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleCloseSaveSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSaveSnack(false);
    };

    const handleSave = async () => {
        console.log(userInfo)
        if (!userInfo || !userInfo?.username) {
            setOpenSnack(true);
            return;
        }
        if (post) {
            try {
                const response = await fetch(`https://glidethrough-backend.vercel.app/post/${id}/save`, {
                    method: 'PUT',
                    body: JSON.stringify({ user: userInfo?._id || userInfo?.id }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setOpenSaveSnack(true);
                    // return;
                }

            } catch (error) {
                console.error('Error saving post:', error);
            }
        }
    };

    const capitalizeFirstLetter = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const commentField = document.getElementById('commentText');
    const addComment = async (comment) => {
        if (!userInfo || !userInfo?.username) {
            setOpenSnack(true);
            return;
        }
        console.log('title ', post._id);
        try {
            const response = await fetch(`https://glidethrough-backend.vercel.app/post/${id}/comment`, {
                method: 'PUT',
                body: JSON.stringify({ user: userInfo?.username, comment }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            // console.log(data);
            if (response.ok) {
                setCommentsData(data);
                await fetch(`https://glidethrough-backend.vercel.app/post/${id}/notify`, {
                    method: 'PUT',
                    body: JSON.stringify({ user: post.author._id, by: userInfo?.username, comment, category: post.category, subcategory: post.subcategory, section: post.section }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

            }
        } catch (error) {
            console.error('Error commenting post:', error);
        }

    }

    const handleShare = () => {
        const postLink = `https://glidethrough-frontend.vercel.app/post/${category}/${subcategory}/${section}/${id}`;
        const tempInput = document.createElement('input');
        tempInput.value = postLink;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        setCopiedMessage('Link copied to clipboard');
    };
    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnack(false);
    };

    return (
        <div>
            <Header />
            <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={handleCloseSnack}
                message="Please login to perform this action"
                action={
                    <React.Fragment>
                        <Button color="secondary" size="small" href='/login' onClick={handleCloseSnack}>
                            Login
                        </Button>
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={handleCloseSnack}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
            <Snackbar
                open={openSaveSnack}
                autoHideDuration={6000}
                onClose={handleCloseSaveSnack}
                message="Post saved"
                action={
                    <React.Fragment>
                        <Button color="secondary" size="small" href='/user/savedposts' onClick={handleCloseSaveSnack}>
                            View saved
                        </Button>
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={handleCloseSaveSnack}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />

            <Card sx={{ margin: 'auto', marginTop: '0', width: '75%'}}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }}>
                            {post?.author.username[0].toUpperCase()}

                        </Avatar>
                    }

                    title={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>{post.author.username}</span>}
                    subheader={format(new Date(post?.createdAt), "dd-MMM-yyyy")}
                />
                <CardContent>
                    {(post?.section === 'Blog') &&
                        <>
                            <Typography variant='h4' sx={{ fontWeight: 'bold' }} >{capitalizeFirstLetter(post?.title)}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '18px', marginTop: '8px' }}>
                                {post?.description}
                            </Typography>
                        </>
                    }
                    {(post?.section !== 'Blog') &&
                        <>
                            <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                                {post?.description}
                            </Typography>
                        </>
                    }
                    {/* <br /> */}

                </CardContent>
                <CardActions disableSpacing>

                    {post?.section !== 'Q&A' && (
                        <>
                            <LightTooltip title="I agree">
                                <IconButton sx={{ display: 'flex' }} onClick={handleUpvote}>
                                    {(upvoted)?<img src={FilledUpvote} alt='filledupvote' height={'26px'} width={'26px'} />:<img src={Upvote} alt='upvote' height={'36px'} width={'36px'} />}
                                    
                                    <Typography>{upvoteCount}</Typography>
                                </IconButton>
                            </LightTooltip>
                            <LightTooltip title="I disagree">
                                <IconButton sx={{ display: 'flex' }} onClick={handleDownvote}>
                                    {(downvoted)?<img src={FilledDownvote} alt='filleddownvote' height={'26px'} width={'26px'} />:<img src={Downvote} alt='downvote' height={'36px'} width={'36px'} />}
                                    <Typography>{downvoteCount}</Typography>
                                </IconButton>
                            </LightTooltip>
                            <LightTooltip title="That's helpful">
                                <IconButton onClick={handleLike}>
                                {(liked)?<FavoriteIcon />:<FavoriteBorderIcon />}
                                    <Typography>{likeCount}</Typography>
                                </IconButton>
                            </LightTooltip>
                            <LightTooltip title="Save">
                                <IconButton onClick={handleSave} >
                                    <BookmarksIcon />
                                </IconButton>
                            </LightTooltip>
                        </>)}

                    {/* <LightTooltip title="Share">
                        <IconButton onClick={handleShare}>
                            <ShareIcon />
                        </IconButton>
                    </LightTooltip> */}
                    <LightTooltip title={copiedMessage !== '' ? copiedMessage : "Share"}>
                        <IconButton onClick={handleShare}>
                            <ShareIcon />
                        </IconButton>
                    </LightTooltip>
                </CardActions>
                <Typography variant='h6' padding={'10px'}>{commentLabel} </Typography>
                <Container sx={{ display: 'flex', flexDirection: 'column', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', flexGrow: 1, marginBottom: '12px' }}>
                        <Avatar sx={{ bgcolor: red[500] }}>
                            {userName}
                        </Avatar>
                        <TextField id="commentText" label={`Add a ${commentLabel.substring(0, commentLabel.length - 2)}...`} variant="standard" sx={{ marginLeft: '10px', width: '100%' }} value={comment} onChange={e => setComment(e.target.value)} />
                    </div>

                    {comment.length > 0 && (
                        <ButtonGroup variant='text' sx={{ alignSelf: 'flex-end' }}>
                            <Button onClick={() => { commentField.value = ''; setComment('') }}>Cancel</Button>
                            <Button onClick={() => { commentField.value = ''; setComment(''); addComment(comment) }} >{butnText}</Button>
                        </ButtonGroup>
                    )}
                    <div>
                        {
                            (commentsData.length === 0) ?
                                (<p style={{ textAlign: 'center' }}>{commentMesg}</p>) :
                                commentsData.map(cmt => (<>
                                    <CommentComp key={cmt._id} cmt={cmt} post={post} />
                                    <Divider />
                                </>
                                ))}
                    </div>
                </Container>
            </Card>
        </div>
    )
}

export default DetailedPost
