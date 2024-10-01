import React, { useState,useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { Card, CardActions, CardHeader, CardContent, IconButton, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Modal, Chip, Collapse } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserContext } from '../UserContext';
import { Navigate } from 'react-router-dom';
import { LightTooltip } from './LightToolTip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function UserPostElement({ post }) {
    const [openModal, setOpenModal] = useState(false); // State for modal open/close
    const [open, setOpen] = React.useState(false);
    const [openEditDilog, setOpenEditDilog] = React.useState(false);
    const [redirect, setRedirect] = useState(false);
    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
    const [expanded, setExpanded] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const { isLoading } = useContext(UserContext);
    const maxWordCount = (post.section !== 'Advice' || post.section === "No-gos") ? 20 : Infinity;

    useEffect(() => {
        if (post.section !== 'Blog') {
            setTitle('no'); // Set default title for blog section
        }
    }, [post.section]);

    const validateAndSetDescription = (value) => {
        const words = value.trim().split(/\s+/); // Splitting the value by spaces to count words
        if (words.length <= maxWordCount) {
            setDescription(value); // Set description if within word limit
            setDescriptionError('');
        } else {
            setDescriptionError(`Maximum ${maxWordCount} words allowed`); // Show error if exceeding word limit
        }
    };

    console.log("userpostt ",post);
    const words = post.description.split(/\s+/);
    const trimmedDescription = words.slice(0, 30).join(' ');
    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const handleClickOpenEditDilog = () => {
        setOpenEditDilog(true);
    };

    const handleCloseEditDilog = () => {
        setOpenEditDilog(false);
    };
    const deletePost = async () => {

        try {
            const response = await fetch(`https://glidethrough-backend.vercel.app/post/${post._id}`);
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setRedirect(true);
            }
        }
        catch (err) {
            console.log(err);
        }

        handleClose();

    }
    if (redirect) {
        return <Navigate to={'/user/posts'} />
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpenModal = () => {
        // toggleExpand();
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const editPost = async () => {
        console.log("hello");
        setTitleError('');
        setDescriptionError('');
        const response = await fetch(`https://glidethrough-backend.vercel.app/edit/post/${post._id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, description }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const data = await response.json();
        console.log(data)
        // if (response.ok) {
        //     post = data;
        //     setRedirect(true);
        // }
        console.log("error or data ",data);
        if (data.errors) {
            setTitleError(data.errors.title);
            setDescriptionError(data.errors.description);
            console.log(data.errors)
        }
        else {
            post = data;
            setRedirect(true);
        }
    }
    const capitalizeFirstLetter = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    if (isLoading) {
        return <div>Loading...</div>; // Render loading indicator if data is still being fetched
    }
    return (
        <Card sx={{ marginBottom: '8px', width: "80%", display: 'flex', flexDirection: 'column' }}>
            <Chip label={`${post.category}>${post.subcategory}>${post.section}`} sx={{ fontWeight: '500', alignSelf: 'flex-start', marginLeft: '12px', marginTop: '12px' }} />

            <CardContent>
                <Typography>{format(new Date(post.createdAt), "dd-MMM-yyyy")}</Typography>
                {(post.section === 'Blog') ? <Typography sx={{ fontWeight: 'bold', fontSize: '26px' }}>{capitalizeFirstLetter(post?.title)}</Typography> : <Typography variant='h6' sx={{ fontWeight: 'bold', color: "text.secondary" }}>{post?.description}</Typography>}

            </CardContent>

            {(!expanded && post.section === 'Blog') &&
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {trimmedDescription}
                    </Typography>
                </CardContent>
            }
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                {(post.section === 'Blog') && <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {post.description}
                    </Typography>
                </CardContent>}
                <CardActions disableSpacing>
                    <LightTooltip title="Edit">
                        <IconButton onClick={handleClickOpenEditDilog}>
                            <EditIcon />
                        </IconButton>
                    </LightTooltip>
                    <LightTooltip title="Delete">
                        <IconButton onClick={handleClickOpen}>
                            <DeleteIcon />
                        </IconButton>
                    </LightTooltip>
                </CardActions>
            </Collapse>
            <CardActions disableSpacing sx={{ alignSelf: 'flex-end' }}>

                <IconButton onClick={toggleExpand} aria-label="expand">
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </CardActions>
            <React.Fragment>
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>
                        {"Are you sure, you want to Delete?"}
                    </DialogTitle>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={deletePost} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            <React.Fragment>

                <Dialog
                    fullWidth
                    open={openEditDilog}
                    onClose={handleCloseEditDilog}

                >
                    <DialogTitle>Edit Post</DialogTitle>
                    {(post.section === 'Blog') && 
                    <DialogContent>
                        <TextField
                            required
                            margin="dense"
                            id="title"
                            name="title"
                            label="Title"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <Typography color="error">{titleError}</Typography>
                    </DialogContent>
                    }
                    <DialogContent>
                        <TextField
                            required
                            margin='dense'
                            label='description'
                            type='text'
                            fullWidth
                            multiline
                            rows={(post.section === 'Blog') ? 5 : 1}
                            variant={(post.section === 'Blog') ? 'outlined' : 'standard'}
                            value={description}
                            onChange={e => validateAndSetDescription(e.target.value)}
                        />
                        
                        <Typography color="error">{descriptionError}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditDilog}>Cancel</Button>
                        <Button onClick={editPost}>Save</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

        </Card>
    );
}
