import React, { useState, useEffect, useContext } from 'react'
import { formatDistanceToNow } from 'date-fns';
import { IconButton, Button, Snackbar, Avatar, Card, CardHeader, CardContent, CardActions, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import CloseIcon from '@mui/icons-material/Close';
import Upvote from '../images/upvote.png';
import Downvote from '../images/downvote.png';
import FilledUpvote from '../images/filledupvote.png'
import FilledDownvote from '../images/filleddownvote.png'
import { LightTooltip } from './LightToolTip';
import { UserContext } from '../UserContext';

function CommentComp({ cmt, post }) {
  const { userInfo } = useContext(UserContext);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoted, setDownvoted] = useState(false);
  const [downvoteCount, setDownvoteCount] = useState(0);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openSaveSnack, setOpenSaveSnack] = React.useState(false);

  useEffect(() => {
    const fetchInteractionsData = async () => {
      try {
        // Fetch initial upvote,downvote count from backend
        const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/comment/${cmt._id}/cominteractions/${userInfo?.username}`);
        console.log(`post/${post._id}/comment/${cmt._id}`);
        const data = await response.json();
        setUpvoteCount(data.pos);
        setDownvoteCount(data.neg);
        setUpvoted(data.upStatus);
        setDownvoted(data.downStatus);

        console.log("uvote", data);
      } catch (error) {
        console.error('Error fetching upvotes:', error);
      }
    };
    fetchInteractionsData();
  }, [userInfo?.username]);


  const handleUpvote = async () => {
    if (!userInfo || !userInfo.username) {
      setOpenSnack(true);
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/comment/${cmt._id}/upvote`, {
        method: 'PUT',
        body: JSON.stringify({ user: userInfo?.username }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUpvoted(!upvoted);
        if (downvoted) setDownvoted(!downvoted);
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
      const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/comment/${cmt._id}/downvote`, {
        method: 'PUT',
        body: JSON.stringify({ user: userInfo?.username }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDownvoted(!downvoted);
        if (upvoted) setUpvoted(!upvoted);
        setUpvoteCount(data.up);
        setDownvoteCount(data.down);
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
    }
  };


  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  const handleCloseSaveSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSaveSnack(false);
  };

  const handleSave = async () => {
    console.log("cmt", cmt)
    if (!userInfo || !userInfo?.username) {
      setOpenSnack(true);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/save`, {
        method: 'PUT',
        body: JSON.stringify({ user: userInfo?._id || userInfo?.id, cmtId: cmt._id, username: userInfo?.username }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOpenSaveSnack(true);
        // return;
      }

    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  }

  return (
    <>
      <Card sx={{ marginBottom: '8px', width: "80%" }} elevation={0}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }}>
              {cmt.user[0].toUpperCase()}
            </Avatar>
          }
          // title={cmt.user}
          title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>{cmt.user}</span>}
          subheader={<span style={{ fontSize: '14px' }}>{formatDistanceToNow(new Date(cmt.createdAt), { addSuffix: true })}</span>}
        />

        <CardContent>
          <Typography variant="body2" color="text.secondary" fontSize={'16px'}>
            {cmt.comment}
          </Typography>
        </CardContent>
        {post.section === 'Q&A' && (
          <CardActions disableSpacing>
            <LightTooltip title="Upvote">
              <IconButton sx={{ display: 'flex' }} onClick={handleUpvote}>
                {(upvoted) ? <img src={FilledUpvote} alt='filledupvote' height={'26px'} width={'26px'} /> : <img src={Upvote} alt='upvote' height={'36px'} width={'36px'} />}
                <Typography>{upvoteCount}</Typography>
              </IconButton>
            </LightTooltip>
            <LightTooltip title="Downvote">
              <IconButton sx={{ display: 'flex' }} onClick={handleDownvote}>
                {(downvoted) ? <img src={FilledDownvote} alt='filleddownvote' height={'26px'} width={'26px'} /> : <img src={Downvote} alt='downvote' height={'36px'} width={'36px'} />}
                <Typography>{downvoteCount}</Typography>
              </IconButton>
            </LightTooltip>
            <LightTooltip title="Save">
              <IconButton onClick={handleSave} >
                <BookmarksIcon />
              </IconButton>
            </LightTooltip>
          </CardActions>)}
      </Card>
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
              aria-label="close"
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
    </>
  )
}

export default CommentComp