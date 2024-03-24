import React, { useState, useEffect } from 'react'
import { Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';

function PostModal() {
    const [open, setOpen] = React.useState(true);
    const { head, subhead, section } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const labelText = (section === 'Q&A') ? 'Add question' : `Add ${section}`;
    const maxWordCount = (section === 'Advice' || section === "No-gos") ? 20 : Infinity;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setRedirect(true);
        setOpen(false);
    };
    useEffect(() => {
        if (section !== 'Blog') {
            setTitle('no'); // Set default title for blog section
        }
    }, [section]);
    const validateAndSetDescription = (value) => {
        const words = value.trim().split(/\s+/); // Splitting the value by spaces to count words
        if (words.length <= maxWordCount) {
            setDescription(value); // Set description if within word limit
            setDescriptionError('');
        } else {
            setDescriptionError(`Maximum ${maxWordCount} words allowed`); // Show error if exceeding word limit
        }
    };
    async function createPost(e) {
        e.preventDefault();
        setTitleError('');
        setDescriptionError('');
        const response = await fetch('http://127.0.0.1:5000/post', {
            method: 'POST',
            body: JSON.stringify({ title, description, upvote: 0, downvote: 0, likes: 0, category: head, subcategory: subhead, section }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();

        if (data.errors) {
            setTitleError(data.errors.title);
            setDescriptionError(data.errors.description);
            console.log(data.errors)
        }
        else {
            console.log(data);
            setRedirect(true);
            handleClose();
        }
    }

    if (redirect) {
        return <Navigate to={`/category/${head}/${subhead}`} />
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
            >
                <DialogTitle>Create Post</DialogTitle>
                <DialogContent>
                    <Typography>{head}{'>'}{subhead}{'>'}{section}</Typography>
                </DialogContent>

                {(section === 'Blog') && <DialogContent>



                    <TextField
                        required
                        margin="dense"
                        id="heading"
                        name="heading"
                        label="Add heading"
                        type="text"
                        fullWidth
                        variant="standard"
                        // value={title}
                        value={title}
                        onChange={e => setTitle(e.target.value)}

                    />
                    <Typography color="error">{titleError}</Typography>

                </DialogContent>}
                <DialogContent>

                    <TextField
                        required
                        margin="dense"
                        id={section}
                        name={section}
                        label={labelText}
                        type="text"
                        fullWidth
                        multiline
                        rows={(section === 'Blog') ? 5 : 1}
                        variant={(section === 'Blog') ? 'outlined' : 'standard'}
                        value={description}
                        onChange={e => validateAndSetDescription(e.target.value)}
                    />
                    <Typography color="error">{descriptionError}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={createPost}>Post</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default PostModal;
