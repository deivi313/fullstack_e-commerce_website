import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets'

const BackButton = ({ fallback = '/collection', label = 'Back' }) => {

  const navigate = useNavigate()
  const location = useLocation()

  const goBack = () => {
    // "default" means the page was opened directly (new tab or link), so there is no previous page to go back to
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(fallback)
    }
  }

  return (
    <button
      type='button'
      onClick={goBack}
      className='flex items-center gap-2 py-3 pr-6 mb-3 text-sm text-gray-500 hover:text-black active:text-black transition-colors cursor-pointer'
    >
      <img className='h-3 rotate-180' src={assets.dropdown_icon} alt="" />
      <span>{label}</span>
    </button>
  )
}

export default BackButton