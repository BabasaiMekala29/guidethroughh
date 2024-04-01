import '../logo1.css';
import { Button } from '@mui/material'
import React from 'react'
import Header from './Header'
function HomePage() {
  return (
    <div style={{ position: 'relative' }}
    >
      <Header />
      <div id='mainContainer'>
        
          <div className="animated-text">
            <div>G<span></span>
              <div>Through </div>
            </div>
          </div>
          <p id='description'>Feeling lost, confused, or uncertain? <br />Don't worry, we've gotcha. Stop running circles;<br /> dive right in. Let the community guide you through. <br />Explore curated categories, uncover valuable insights and let it all glide through effortlessly. </p>
          <Button id='exploreBtn' href='/category' variant="contained" size='large'>Explore</Button>
        </div>
      </div>
    
  )
}

export default HomePage
