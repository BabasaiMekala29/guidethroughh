import React from 'react'
import Header from './Header'

function SmallHomePage() {
  return (
    <div style={{backgroundColor:'#fae28a',height: '100vh'}}>
        <Header />
        <div className="animated-text-small">
            <div>G<span></span>
              <div>Through </div>
            </div>
          </div>
          <Button href='/category' variant="contained" size='large' sx={{ position: 'absolute', right: '280px', bottom: '60px', backgroundColor: 'primary' }}>Explore</Button>
    </div>
  )
}

export default SmallHomePage