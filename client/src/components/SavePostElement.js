import React, { useState, useContext } from 'react'
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, Container, Typography, IconButton, Snackbar, Button, Avatar, Chip, Collapse, CardActions } from '@mui/material';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { red } from '@mui/material/colors';
import { UserContext } from '../UserContext';
import { LightTooltip } from './LightToolTip';
import Divider from '@mui/material/Divider';

function SavePostElement({ post }) {
  const { userInfo } = useContext(UserContext);
  const id = userInfo?._id || userInfo?.id;
  const [openSnack, setOpenSnack] = React.useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const unsavePost = async () => {
    // console.log(id);
    try {
      const response = await fetch(`http://127.0.0.1:5000/unsavepost/${post._id}`, {
        method: 'PUT',
        body: JSON.stringify({ id, username: userInfo?.username }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setOpenSnack(true);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };
  const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <Card sx={{ marginBottom: '8px', width: "80%", display: 'flex', flexDirection: 'column' }}>

        <Chip label={`${post.category}>${post.subcategory}>${post.section}`} sx={{ fontWeight: '500', alignSelf: 'flex-start', marginLeft: '12px', marginTop: '12px' }} />

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
          {/* <Typography variant='h4' sx={{ fontWeight: 'bold' }} >{capitalizeFirstLetter(post?.title)}</Typography> */}
          {(post.section === 'Blog') ? <Typography sx={{ fontWeight: 'bold', fontSize: '26px' }}>{capitalizeFirstLetter(post?.title)}</Typography> : <Typography variant='h6' sx={{ fontWeight: 'bold', color: "text.secondary" }}>{post?.description}</Typography>}

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {(post.section === 'Blog') && <Typography variant="body2" color="text.secondary" sx={{ fontSize: '18px', marginTop: '8px' }}>
              {post?.description}
            </Typography>}
            {post.section === 'Q&A' && (<Typography marginTop={'20px'}>Responses: </Typography>)}
            <Container>
              {post.comments?.map(cmt => (
                (cmt.booked.includes(userInfo?.username)) &&
                <><Card sx={{ marginBottom: '8px', width: "80%" }} elevation={0}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {cmt.user[0].toUpperCase()}
                      </Avatar>
                    }

                    title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>{cmt.user}</span>}
                  />
                  <CardContent>
                    <Typography variant="body1" color="text.secondary">
                      {cmt.comment}
                    </Typography>
                  </CardContent>
                </Card>
                  <Divider /></>
              ))}
            </Container>
          </Collapse>
        </CardContent>
        <CardActions disableSpacing sx={{ alignSelf: 'flex-end' }}>
          <LightTooltip title="Unsave">
            <IconButton onClick={unsavePost} aria-label="recipe">
              <BookmarkRemoveIcon />
            </IconButton>
          </LightTooltip>
          <IconButton onClick={toggleExpand} aria-label="expand">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </CardActions>

      </Card>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        message="Post unsaved"
        action={
          <React.Fragment>
            <Button color="secondary" size="small" href='/user/savedposts' onClick={handleCloseSnack}>
              View saved
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
    </>
  )
}

export default SavePostElement