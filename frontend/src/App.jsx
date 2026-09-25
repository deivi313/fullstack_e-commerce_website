import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { About, Cart, Collection, Contact, Home, Login, Orders, PlaceOrder, Product } from './pages/index'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className='px-4 sm:px-[5vm] md:px-[7vw] lg:px-[9vw]'>

      <Navbar />

      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />

      </Routes>
    </div>
  )
}

export default App