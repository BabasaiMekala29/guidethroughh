import React, { useState, useEffect, useContext } from 'react';
import { Button, AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu, Avatar, Chip } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import logoImg from '../images/logo.jpg';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import { LightTooltip } from './LightToolTip';
import { Popover } from '@mui/material';
import { red } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import { formatDistanceToNow } from 'date-fns';
import TipImage from '../images/tip.png'
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const DailytipTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#fae28a',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 240,
        fontSize: theme.typography.pxToRem(16),
        border: '1px solid #513c25',
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));
const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
function Header() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const { userInfo, setUserInfo, isLoading } = useContext(UserContext);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [tip, setTip] = useState({});
    const [searchValue, setSearchValue] = useState('');
    const [notificationsCount, setNotificationsCount] = useState(0);
    const userid = userInfo?.id || userInfo?._id;

    useEffect(() => {
        const fetchNotificationCount = async () => {
            if (userid) {
                try {
                    const response = await fetch(`https://glidethrough-backend.vercel.app/user/${userid}/notifications_count`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch post notifications');
                    }
                    const data = await response.json();
                    console.log("nots count", data);
                    setNotifications(data);
                    let count = 0;
                    for (let notification of data) {
                        if (!notification.viewed) count++;
                    }
                    setNotificationsCount(count);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        fetchNotificationCount();
    }, [userid]);


    useEffect(() => {
        const fetchTipNotification = async () => {
            if (userid) {
                try {
                    const response = await fetch(`https://glidethrough-backend.vercel.app/user/${userid}/tipNotification`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch post notifications');
                    }
                    const data = await response.json();
                    console.log("tip", data);
                    setTip(data);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        fetchTipNotification();
    }, [userid])

    if (isLoading) {
        return <div>Loading...</div>; // Render loading indicator if data is still being fetched
    }
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsLoggedOut(false);
    };

    function logout() {
        fetch('https://glidethrough-backend.vercel.app/logout', {
            credentials: "include",
            method: "POST"
        })
            .then(() => {
                setIsLoggedOut(true);
                setUserInfo(null);
            })
    }
    async function makeViewed(notif_id) {
        try {
            const response = await fetch(`https://glidethrough-backend.vercel.app/notifications/${notif_id}`, {
                method: 'PUT',
                body: JSON.stringify({ user: userid }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch post notifications');
            }
            const data = await response.json();
            console.log(data);
            // setNotificationsCount(data);
        }
        catch (err) {
            console.log(err);
        }
    }
    const handleNotificationsClick = async (event) => {
        handleMenuClose();
        setNotificationsAnchorEl(event.currentTarget);
        try {
            const response = await fetch(`https://glidethrough-backend.vercel.app/user/${userid}/notifications`);
            if (!response.ok) {
                throw new Error('Failed to fetch post notifications');
            }
            const data = await response.json();
            console.log("nots ", data);
            setNotifications(data);
        }
        catch (error) {
            console.error('Error fetching post notifications:', error);
        }
    };



    const handleNotificationsClose = () => {
        setNotificationsAnchorEl(null);
    };

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const showPosts = (e) => {
        handleMenuClose();
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            console.log('Search value:', searchValue);
            window.location.href = `/search-results?query=${searchValue}`;
        }
    };

    const username = userInfo?.username;
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>
                <IconButton
                    size="medium"
                    edge="end"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    href='/user/savedposts'
                    sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                >
                    <BookmarksIcon />
                    <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>Saved Posts</Typography>
                </IconButton>

            </MenuItem>

            <MenuItem onClick={() => showPosts()}>
                <Link to={'/user/posts'} style={{ textDecoration: "none", color: "inherit", fontSize: '20px', fontWeight: '500' }}>
                    <IconButton
                        size="medium"
                        edge="end"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                        sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                    >
                        <AutoAwesomeMotionIcon />
                        <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>My Posts</Typography>
                    </IconButton>
                </Link>

            </MenuItem>
        </Menu>
    );

    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {
                !username && (<> <Link to={'/login'} style={{ textDecoration: "none", color: "inherit" }}>
                    <MenuItem >
                        <IconButton
                            size="large"
                            color="inherit"
                        >
                            <Badge color="error">
                                <LoginIcon />
                            </Badge>
                        </IconButton>
                        <p>Login</p>
                    </MenuItem>
                </Link>
                    <Link to={'/signup'} style={{ textDecoration: "none", color: "inherit" }}>
                        <MenuItem>
                            <IconButton
                                size="large"
                                color="inherit"
                            >
                                <Badge color="error">
                                    <PersonAddIcon />
                                </Badge>
                            </IconButton>
                            <p>Sign up</p>
                        </MenuItem>
                    </Link> </>)}
            {username && (<>
                <MenuItem onClick={handleProfileMenuOpen}>
                    <IconButton
                        size="medium"
                        color="inherit"
                        href='/user/savedposts'
                        sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                    >
                        <BookmarksIcon />
                        <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>Saved Posts</Typography>
                    </IconButton>

                </MenuItem>
                <MenuItem onClick={() => showPosts()}>
                    <Link to={'/user/posts'} style={{ textDecoration: "none", color: "inherit", fontSize: '20px', fontWeight: '500' }} >
                        <IconButton
                            size="medium"
                            color="inherit"
                            sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                        >
                            <AutoAwesomeMotionIcon />
                            <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>My Posts</Typography>
                        </IconButton>

                    </Link>
                </MenuItem>
                <MenuItem onClick={handleNotificationsClick}>
                    <IconButton
                        size="medium"
                        color="inherit"
                    >
                        <Badge badgeContent={notificationsCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>Notifications</Typography>
                </MenuItem>
                <MenuItem onClick={logout}>
                    <IconButton
                        size="medium"
                        color="inherit"
                    >
                        <LogoutIcon />
                    </IconButton>
                    <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>Logout</Typography>
                </MenuItem>
            </>)}
        </Menu>
    );

    return (
        <>
            <Box>
                <AppBar sx={{ position: "fixed" }} elevation={0}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }} >
                        <Box sx={{ display: 'flex' }}>
                            <Link to={'/'}>
                                <Avatar src={logoImg} />
                            </Link>

                            <Search sx={{ display: { xs: 'none', md: 'block' } }} >
                                <SearchIconWrapper >
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    sx={{ width: 600 }}
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    value={searchValue}
                                    onChange={e => setSearchValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                            </Search>
                            <Search sx={{ display: { xs: 'block', md: 'none' },marginLeft:'12px' }}>
                                <SearchIconWrapper >
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    value={searchValue}
                                    onChange={e => setSearchValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                            </Search>
                        </Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center' } }}>
                            {
                                !username && (
                                    <>
                                        <Button href='/login' variant="text" size="small" sx={{ color: '#fefefe', marginRight: '4px' }}>login</Button>
                                        <Button href='/signup' variant="text" size="small" sx={{ color: "#fefefe" }}>sign up</Button>
                                    </>
                                )
                            }
                            {
                                username && (
                                    <>
                                        <Typography sx={{ color: "#fefefe", marginRight: '8px' }}>{`HELLO, ${username.toUpperCase()} !`}</Typography>
                                        <IconButton
                                            size="large"
                                            edge="end"
                                            onClick={handleProfileMenuOpen}
                                            color="inherit"
                                        >
                                            <AccountCircle />
                                        </IconButton>
                                        <DailytipTooltip title={
                                            <React.Fragment>
                                                <Chip label={"Now you know: "} size="small" sx={{ fontWeight: '600', backgroundColor: '#d5722e', marginRight: '4px' }} />
                                                <b>{tip.tip} </b>
                                            </React.Fragment>
                                        }>
                                            <IconButton
                                                size="large"
                                                edge="end"
                                                color="inherit"
                                            >
                                                <img src={TipImage} alt='Tip' height={'26px'} width={'26px'} />
                                            </IconButton>
                                        </DailytipTooltip>
                                        <LightTooltip title="Notifications">
                                            <IconButton
                                                size="large"
                                                edge='end'
                                                color="inherit"
                                                onClick={handleNotificationsClick}
                                            >
                                                <Badge badgeContent={notificationsCount} color="error">
                                                    <NotificationsIcon />
                                                </Badge>

                                            </IconButton>
                                        </LightTooltip>
                                        <LightTooltip title="Logout">
                                            <IconButton onClick={logout} size="large"
                                                edge='end'
                                                color="inherit">
                                                <LogoutIcon />
                                            </IconButton>
                                        </LightTooltip>

                                    </>
                                )
                            }
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
                            {username && <>
                                <DailytipTooltip title={
                                    <React.Fragment>
                                        <Chip label={"Now you know: "} size="small" sx={{ fontWeight: '600', backgroundColor: '#d5722e', marginRight: '4px' }} />
                                        <b>{tip.tip} </b>
                                    </React.Fragment>
                                }>
                                    <IconButton
                                        size="large"
                                        edge="end"
                                        color="inherit"
                                    >
                                        <img src={TipImage} alt='Tip' height={'26px'} width={'26px'} />
                                    </IconButton>
                                </DailytipTooltip></>}
                            <IconButton
                                size="large"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Offset />
                {renderMobileMenu}
                {renderMenu}
            </Box>
            {/* Notifications Popover */}
            <Popover
                open={Boolean(notificationsAnchorEl)}
                anchorEl={notificationsAnchorEl}
                onClose={handleNotificationsClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box marginTop={'0px'}>
                    {(notifications.length === 0) ?
                        (<div style={{ display: 'flex', padding: '8px', gap: '10px', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {'!'}
                            </Avatar>
                            <p>No notifications found.</p>
                        </div>) :
                        notifications.map(notification => (
                            <React.Fragment key={notification._id}>
                                <IconButton sx={{ display: 'flex', justifyContent: 'flex-start', padding: '10px', marginBottom: '10px', gap: '10px', alignItems: 'center', '&:hover': { backgroundColor: 'transparent' } }}
                                    href={`/post/${notification.category}/${notification.subcategory}/${notification.section}/${notification.postDetails}`}
                                    target='_blank' onClick={() => { makeViewed(notification._id) }}
                                >
                                    {/* {(!notification.viewed)&& <Typography variant='h3'>.</Typography>} */}
                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                        {notification.by[0].toUpperCase()}
                                    </Avatar>
                                    <Typography sx={{ fontWeight: notification.viewed ? '500' : 'bold' }} color={'text.primary'}>{`${notification.by} responded to your post as '${notification.commentText.substr(0, 3)}'...`}</Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'grey', alignSelf: 'flex-end' }}>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</Typography>
                                </IconButton>
                                <Divider />
                            </React.Fragment>

                        ))}
                </Box>
            </Popover>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={isLoggedOut}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="You are logged out"
                action={
                    <>
                        <IconButton href='/login' size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                            <LoginIcon sx={{ marginLeft: '6px', color: '#ffffff' }} />
                        </IconButton>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </>
                }
            />
        </>
    );
}

export default Header;
