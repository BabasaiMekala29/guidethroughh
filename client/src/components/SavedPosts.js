import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography } from '@mui/material';
import { UserContext } from '../UserContext'
import Header from './Header';
import SavePostElement from './SavePostElement';

function SavedPosts() {
    const { userInfo, setUserInfo, isLoading } = useContext(UserContext);
    const [savedPosts, setSavedPosts] = useState([]);
    console.log(userInfo)
    const id = userInfo?._id || userInfo?.id;
    useEffect(() => {
        const fetchPosts = async () => {
            console.log("hiii")
            if (id) {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/savedposts/${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch posts');
                    }
                    const data = await response.json();
                    console.log("savedposts ", data);
                    setSavedPosts(data);

                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchPosts();
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>; // Render loading indicator if data is still being fetched
    }
    return (
        <div>
            <Header />
            {(userInfo?.username) && (

                (<>
                    <Typography variant='h5' paddingLeft={'12px'} paddingTop={'12px'} fontWeight={'bold'}>{'Saved Posts'}</Typography>
                    <Container sx={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {(savedPosts.length === 0) ?
                            (<p>No posts found.</p>) :
                            savedPosts.map(post => (
                                <SavePostElement key={post._id} post={post} />

                            ))}
                    </Container>
                </>)
            )}
            {!(userInfo?.username) && (
                <h2 style={{ textAlign: 'center' }}>You logged out!!</h2>
            )}

        </div>
    )
}

export default SavedPosts