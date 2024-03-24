import React from 'react'
import Header from './Header'
import { Container } from '@mui/material'
import ListItemComp from './ListItemComp.js'
function CategoryPage() {
  return (
    <div>
        <Header />
        <Container>
            <ListItemComp />
        </Container>
    </div>
  )
}

export default CategoryPage