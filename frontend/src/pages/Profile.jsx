import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import Login from './Login'

const emptyAddress = {
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  zipcode: '',
  country: '',
  phone: ''
}

const inputClass = 'border border-gray-300 rounded py-1.5 px-3.5 w-full'

const Profile = () => {

  const { token, setToken, setCartItems, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState(emptyAddress)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const onAddressChange = (event) => {
    const field = event.target.name
    const value = event.target.value
    setAddress(data => ({ ...data, [field]: value }))
  }

  const loadProfile = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/profile', {}, { headers: { token } })
      if (response.data.success) {
        const { user } = response.data
        setName(user.name)
        setEmail(user.email)
        setAddress({ ...emptyAddress, ...user.address })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      loadProfile()
    }
  }, [token])

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await axios.post(backendUrl + '/api/user/profile/update', { name, address }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    navigate('/login')
  }

  // logged out: show the login / sign up form right here
  if (!token) {
    // on a page refresh the token is restored from localStorage just after the first render
    if (localStorage.getItem('token')) return null
    return <Login />
  }

  if (loading) {
    return <div className='border-t pt-14 text-gray-500'>Loading...</div>
  }

  return (
    <div className='border-t pt-14 min-h-[80vh]'>

      <div className='text-2xl mb-2'>
        <Title text1={'MY '} text2={'PROFILE'} />
      </div>

      <div className='flex flex-col lg:flex-row gap-10 lg:gap-20'>

        {/* left side: details */}
        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 w-full lg:max-w-120'>

          <div className='text-xl sm:text-2xl my-3'>
            <Title text1={'ACCOUNT '} text2={'DETAILS'} />
          </div>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className={inputClass}
            type="text"
            placeholder='Full name'
            required
          />
          <input
            value={email}
            className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`}
            type="email"
            disabled
          />

          <div className='text-xl sm:text-2xl my-3'>
            <Title text1={'DELIVERY '} text2={'DETAILS'} />
          </div>
          <p className='text-sm text-gray-500 -mt-3'>Saved here and filled in automatically when you check out.</p>

          <div className='flex gap-3'>
            <input onChange={onAddressChange} name='firstName' value={address.firstName} className={inputClass} type="text" placeholder='First name' />
            <input onChange={onAddressChange} name='lastName' value={address.lastName} className={inputClass} type="text" placeholder='Last name' />
          </div>
          <input onChange={onAddressChange} name='street' value={address.street} className={inputClass} type="text" placeholder='Street' />
          <div className='flex gap-3'>
            <input onChange={onAddressChange} name='city' value={address.city} className={inputClass} type="text" placeholder='City' />
            <input onChange={onAddressChange} name='state' value={address.state} className={inputClass} type="text" placeholder='State' />
          </div>
          <div className='flex gap-3'>
            <input onChange={onAddressChange} name='zipcode' value={address.zipcode} className={inputClass} type="number" placeholder='Zipcode' />
            <input onChange={onAddressChange} name='country' value={address.country} className={inputClass} type="text" placeholder='Country' />
          </div>
          <input onChange={onAddressChange} name='phone' value={address.phone} className={inputClass} type="number" placeholder='Phone' />

          <button
            type='submit'
            disabled={saving}
            className='bg-black text-white px-10 py-3 text-sm cursor-pointer self-start mt-2 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>

        </form>

        {/* right side: orders and logout */}
        <div className='flex flex-col gap-4 w-full lg:max-w-xs lg:mt-16'>
          <button
            type='button'
            onClick={() => navigate('/orders')}
            className='border border-black px-8 py-3 text-sm cursor-pointer hover:bg-black hover:text-white transition-colors'
          >
            MY ORDERS
          </button>
          <button
            type='button'
            onClick={logout}
            className='border border-gray-300 text-gray-600 px-8 py-3 text-sm cursor-pointer hover:border-black hover:text-black transition-colors'
          >
            LOGOUT
          </button>
        </div>

      </div>

    </div>
  )
}

export default Profile