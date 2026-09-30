import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, getCartCount } = useContext(ShopContext)

  const [cartData, setCartData] = useState([])

  useEffect(() => {

    const tempData = []

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          })
        }
      }
    }
    setCartData(tempData)
  }, [cartItems])

  return (
    <div className='pt-14'>

      <div className='text-2xl mb-3 border-b'>
        <Title text1={'YOUR '} text2={'CART'} />
      </div>

      {getCartCount() === 0 ? (

        <div className='flex flex-col items-center justify-center gap-4 py-20 text-gray-600'>
          <p className='text-lg'>Your cart is empty</p>
          <button
            onClick={() => navigate('/collection')}
            className='bg-black text-white text-sm px-8 py-3'>
            GO TO COLLECTION
          </button>
        </div>

      ) : (
        <>
          <div>
            {
              cartData.map((item) => {

                const productData = products.find((product) => product._id === item._id)

                return (
                  <div key={`${item._id}-${item.size}`} className='py-4 border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4' >
                    <div className='flex items-start gap-6'>
                      <img className='w-16 sm:w-20' src={productData.image[0]} alt="image" />
                      <div>
                        <p className='text-sm sm:text-lg font-medium'>{productData.name}</p>
                        <div className='flex items-center gap-5 mt-2'>
                          <p>{currency}{productData.price}</p>
                          <p className='px-2 sm:px-3 sm:py-1 border border-gray-300 bg-slate-50'>{item.size}</p>
                        </div>
                      </div>
                    </div>
                    <input
                      id='quantity'
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        if (e.target.value === '' || !Number.isInteger(value) || value < 1) return
                        updateQuantity(item._id, item.size, value)
                      }}
                      onBlur={(e) => {
                        const value = Number(e.target.value)
                        if (e.target.value === '' || !Number.isInteger(value) || value < 1) {
                          e.target.value = item.quantity
                        }
                      }}
                      type="number"
                      min={1}
                      defaultValue={item.quantity}
                      className='no-spinner border max-w-10 sm:px-2 py-1 text-center' />
                    <img onClick={() => updateQuantity(item._id, item.size, 0)} src={assets.bin_icon} alt="bin_icon"
                      className='w-4 mr-4 sm:w-4 cursor-pointer' />
                  </div>
                )

              })
            }
          </div>

          <div className='flex justify-end my-20'>
            <div className='w-full sm:w-112.5'>
              <CartTotal />
              <div className='w-full text-end'>
                <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  )
}

export default Cart
