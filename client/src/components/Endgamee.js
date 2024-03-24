import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem, Snackbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SortIcon from '@mui/icons-material/Sort';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import Header from './Header';
import Bcard from './Bcard';
import { UserContext } from '../UserContext';
import PostModal from './PostModal';
import CloseIcon from '@mui/icons-material/Close';
import { LightTooltip } from './LightToolTip';
import { Link, useParams } from 'react-router-dom';

const pages = ['Blog', "No-gos", 'Advice', 'Q&A']; //No-gos Advice
const sortSections = ['Popular', 'Most Useful', 'Recent', 'None']; 

function Endgame() {
    const { userInfo } = useContext(UserContext);
    console.log(userInfo);
    const { head, subhead } = useParams();
    const [open, setOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState('Blog');
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElNavSortSec, setAnchorElNavSortSec] = React.useState(null);
    const [posts, setPosts] = useState([]);
    const [sectionCounts, setSectionCounts] = useState({}); // Object to store counts for each section
    const [openSnack, setOpenSnack] = React.useState(false);
    const [selectedSec, setSelectedSec] = useState('None');
    useEffect(() => {
        const fetchPosts = async () => {
            console.log("hiii")
            try {
                const response = await fetch(`http://127.0.0.1:5000/category/${head}/${subhead}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
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
    }, [head, subhead]);

    if(selectedItem==='Q&A'){
        if(!sortSections.includes('Unanswered')) sortSections.push('Unanswered');
    }
    else{
        if(sortSections.includes('Unanswered')) sortSections.pop();
    }
    const handleClickOpen = () => {
        setOpen(true);
        if (!userInfo?.username) {
            setOpenSnack(true);
            return;
        }
        return (
            <PostModal />
        )
    };

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnack(false);
    };

    const handleOpenNavMenuSort = (event) => {
        setAnchorElNavSortSec(event.currentTarget);
    };


    const handleCloseNavMenuSort = () => {
        setAnchorElNavSortSec(null);
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };


    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleBgColor = (page) => {
        handleCloseNavMenu();
        setSelectedItem(page);
    }
    const handleClick = async (sec) => {
        handleCloseNavMenuSort();
        setSelectedSec(sec);
        try {
            const response = await fetch(`http://127.0.0.1:5000/category/${head}/${subhead}/sortby/${sec}`);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const orderedData = await response.json();
            console.log(orderedData);
            setPosts(orderedData);

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div>
            <>
                <Header />
                <AppBar position="static" sx={{ backgroundColor: "#fefefe", color: '#000000' }}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: { xs: 'block', md: 'none' },
                                    }}
                                >
                                    {pages.map((page) => (
                                        <MenuItem key={page} onClick={() => handleBgColor(page)} sx={{ backgroundColor: selectedItem === page ? '#d5722e' : 'inherit' }}>
                                            <Typography textAlign="center">{page}{sectionCounts[page] !== undefined ? ` (${sectionCounts[page]})` : ` (0)`}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                                {userInfo?.username && (
                                    <LightTooltip title="New Post">
                                        <Link style={{ color: '#000000', marginLeft: 'auto' }} to={`/category/${head}/${subhead}/${selectedItem}/postt`}>
                                            <DriveFileRenameOutlineIcon onClick={handleClickOpen} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, width: 36, height: 36 }} />
                                        </Link>
                                    </LightTooltip>
                                )}
                                {!userInfo?.username && (
                                    <LightTooltip title="New Post">
                                        <Link style={{ color: '#000000', marginLeft: 'auto' }} >
                                            <DriveFileRenameOutlineIcon onClick={handleClickOpen} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, width: 36, height: 36 }} />
                                        </Link>
                                    </LightTooltip>
                                )}
                            </Box>
                            {userInfo?.username && (
                                <LightTooltip title="New Post">
                                    <Link style={{ color: '#000000' }} to={`/category/${head}/${subhead}/${selectedItem}/postt`}>
                                        <DriveFileRenameOutlineIcon onClick={handleClickOpen} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, width: 36, height: 36 }} />
                                    </Link>
                                </LightTooltip>
                            )}
                            {!userInfo?.username && (
                                <LightTooltip title="New Post">
                                    <Link style={{ color: '#000000' }} >
                                        <DriveFileRenameOutlineIcon onClick={handleClickOpen} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, width: 36, height: 36 }} />
                                    </Link>
                                </LightTooltip>
                            )}
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'space-around', alignItems: 'center' } }}>
                                {pages.map((page) => (
                                    <Button
                                        key={page}
                                        onClick={() => setSelectedItem(page)}
                                        sx={{ my: 2, color: '#000000', display: 'block', backgroundColor: selectedItem === page ? '#d5722e' : 'inherit' }}
                                    >
                                        {page}
                                        {sectionCounts[page] !== undefined ? ` (${sectionCounts[page]})` : ` (0)`}
                                    </Button>
                                ))}

                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                <Snackbar
                    open={openSnack}
                    autoHideDuration={6000}
                    onClose={handleCloseSnack}
                    message="Please login to create post"
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

            </>
            <Container style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', paddingTop: '12px' }}>
                <Typography >{head}{' > '}{subhead}</Typography>
                <Box>
                    <IconButton
                        size="large" onClick={handleOpenNavMenuSort}
                        color="inherit"
                    >
                        <SortIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNavSortSec}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNavSortSec)}
                        onClose={handleCloseNavMenuSort}

                    >
                        {sortSections.map((sec) => (
                            <MenuItem key={sec} onClick={() => handleClick(sec)} sx={{ backgroundColor: selectedSec === sec ? '#d5722e' : 'inherit' }}>
                                <Typography textAlign="center">{sec}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Container>
            <Container sx={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {
                    (posts.length === 0) ?
                        (<p>No posts found.</p>) :
                        posts.map(post => (
                            (post.section === selectedItem) &&
                            <Bcard key={post._id} post={post} />
                        ))}
            </Container>
        </div>
    );
}
export default Endgame;