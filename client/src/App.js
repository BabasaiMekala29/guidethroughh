import './App.css';
import { useState,useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from './components/SignUpPage.js';
import LoginPage from './components/LoginPage';
import CategoryPage from './components/CategoryPage.js';
import { UserContextProvider } from './UserContext.js'
import HomePage from './components/HomePage.js';
import Endgamee from './components/Endgamee.js'
import { useContext } from 'react';
import { UserContext } from './UserContext.js';
import PostModal from './components/PostModal.js'
import UserPosts from './components/UserPosts.js';
import SavedPosts from './components/SavedPosts.js';
import DetailedPost from './components/DetailedPost.js';
import SearchResultComp from './components/SearchResultComp.js';
import PostNotFound from './components/PostNotFound.js';
import { useParams } from 'react-router-dom';
function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#cd5909'
        // main: '#2b6278'
      },
      secondary: {
        main: '#FFDB58'
      }
    },
    // typography:{
    //   fontFamily:'Roboto',
    //   fontWeightLight: 400,
    //   fontWeightRegular: 500,
    //   fontWeightMedium: 600,
    //   fontWeightBold: 700,

    // }
  })
  return (
    <div className="App">
      <ThemeProvider theme={theme}>

        <UserContextProvider>
          <Router>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/signup' element={<SignupPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/category' element={<CategoryPage />} />
              <Route path='/category/:head/:subhead' element={<Endgamee />} />
              <Route path='/category/:head/:subhead/:section/postt' element={<ConditionalRoute a={<PostModal />} b={<HomePage />} />} />
              <Route path='/user/posts' element={<UserPosts />} />
              <Route path='/user/savedposts' element={<SavedPosts />} />
              <Route path='/post/:category/:subcategory/:section/:id' element={<PostisAvailable a={<DetailedPost />} b={<PostNotFound />} />} />
              <Route path="/search-results" element={<SearchResultComp />} />
            </Routes>
          </Router>
        </UserContextProvider>
      </ThemeProvider>
    </div>
  );
}

function PostisAvailable({ a, b }) {
  const { id } = useParams();
  const [postStatus, setPostStatus] = useState(null);

  useEffect(() => {
      const fetchPostStatus = async () => {
          try {
              const response = await fetch(`http://127.0.0.1:5000/checkpost/${id}/`);
              const data = await response.json();
              console.log(data);
              setPostStatus(data.message === "Post found");
          } catch (err) {
              console.log(err);
          }
      };

      fetchPostStatus();
  }, [id]);

  if (postStatus === null) {
      return <div>Loading...</div>;
  }

  return postStatus ? a : b;
}

function ConditionalRoute({ a, b }) {
  const { userInfo, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <div>Loading...</div>; // Render loading indicator if data is still being fetched
  }

  const isLoggedIn = !!userInfo?.username;
  console.log("conditional route ", userInfo);
  // Render Endgamee component if logged in, otherwise render LoginPage
  return isLoggedIn ? a : b
}

export default App;
