import '../logo1.css';
import { Button } from '@mui/material'
import React from 'react'
import Header from './Header'
import BackgroundImage from '../images/new.jpg'
import MobileBgImage from '../images/pbg.jpg'
function HomePage() {
  return (
    <div style={{ position: 'relative' }}
    >
      <Header />
      <div id='mainContainer'
        // style={{
        //   backgroundImage: `url(${BackgroundImage})`,
        //   backgroundSize: 'cover',
        //   backgroundRepeat: 'no-repeat',
        //   height: '100vh',
        // }}
      >
        
          <div className="animated-text">
            <div>G<span></span>
              <div>Through </div>
            </div>
          </div>
          <Button id='exploreBtn' href='/category' variant="contained" size='large'>Explore</Button>
        </div>
      </div>
    
  )
}

export default HomePage