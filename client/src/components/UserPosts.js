import React, { useState, useEffect, useContext } from 'react'
import { Container, Typography } from '@mui/material';
import { UserContext } from '../UserContext'
import Header from './Header';
import UserPostElement from './UserPostElement';
function UserPosts() {
    const { userInfo, isLoading } = useContext(UserContext);
    const [userPosts, setUserPosts] = useState([]);
    console.log(userInfo)
    const id = userInfo?._id || userInfo?.id;
    useEffect(() => {
        const fetchPosts = async () => {
            console.log("hiii")
            try {
                if(id){

                
                    const response = await fetch(`http://127.0.0.1:5000/user/${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch posts');
                    }
                    const data = await response.json();
                    console.log(data);
                    setUserPosts(data);
                }

            } catch (error) {
                console.log(error);
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
                    <Typography variant='h6' paddingLeft={'12px'} paddingTop={'12px'}>{`${userInfo?.username?.toUpperCase()}'s Posts`}</Typography>
                    <Container sx={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {(userPosts?.posts?.length === 0) ?
                            (<p>No posts found.</p>) :
                            userPosts.posts?.map(post => (
                                <UserPostElement key={post._id} post={post} />

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

export default UserPosts