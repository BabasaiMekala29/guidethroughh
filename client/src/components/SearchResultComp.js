import React,{useEffect, useState} from 'react'
import Header from './Header';
import { AppBar,Box,Toolbar,MenuItem,Typography, Container } from '@mui/material';
import Bcard from './Bcard';

const pages = ['Blog', "No-gos", 'Advice', 'Q&A'];
function SearchResultComp() {
    
    const [selectedItem, setSelectedItem] = useState('Blog');
    const [posts,setPosts] = useState([]);
    const [sectionCounts, setSectionCounts] = useState({}); 
    const searchValue = new URLSearchParams(window.location.search).get('query');
    const handleBgColor = (page) => {
        setSelectedItem(page);
    }

    useEffect(()=>{
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/search/${searchValue}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                console.log(data);
                setPosts(data);
                // Calculate counts for each section
                const counts = {};
                data.forEach(post => {
                    counts[post.section] = (counts[post.section] || 0) + 1;
                });
                setSectionCounts(counts);

            } catch (error) {
                console.log(error);
            }
        };

        fetchPosts();
    },[searchValue])

    return (
        <div>
            <Header />
            <AppBar position="static" sx={{ backgroundColor: "#fefefe", color: '#000000' }}>
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1,display:'flex',justifyContent:'space-between',padding:'10px' }}>
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={() => handleBgColor(page)} sx={{ backgroundColor: selectedItem === page ? '#d5722e' : 'inherit' }}>
                                    <Typography textAlign="center">{page}{sectionCounts[page] !== undefined ? ` (${sectionCounts[page]})` : ` (0)`}</Typography>
                                </MenuItem> 
                            ))}
                    </Box>
                </Toolbar>
            </AppBar>
            <Container sx={{marginTop:'12px'}}>
                <Typography padding={'12px'}>Search Results for: {searchValue}</Typography>
                {
                    (posts.length === 0) ?
                        (<p style={{textAlign:'center'}}>No posts found.</p>) :
                        posts.map(post => (
                            (post.section === selectedItem) &&
                            <Bcard key={post._id} post={post} />
                        ))}
            </Container>
        </div>
    );
}

export default SearchResultComp