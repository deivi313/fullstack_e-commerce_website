import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { backendUrl } from '../App'

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"]

const Edit = ({ token }) => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  // existing image urls from the DB (shown as previews)
  const [currentImages, setCurrentImages] = useState([])
  // new files picked by the admin (only these get uploaded)
  const [newImages, setNewImages] = useState([false, false, false, false])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  // load the product details and fill the form
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post(backendUrl + "/api/product/single", { productId: id })
        if (response.data.success && response.data.product) {
          const p = response.data.product
          setName(p.name)
          setDescription(p.description)
          setPrice(p.price)
          setCategory(p.category)
          setSubCategory(p.subCategory)
          setBestseller(p.bestseller)
          setSizes(Array.isArray(p.sizes) ? p.sizes : [])
          setCurrentImages(Array.isArray(p.image) ? p.image : [])
        } else {
          setLoadError(response.data.message || "Product not found")
        }
      } catch (error) {
        console.log("Edit page load error:", error)
        setLoadError(error.message + " (requested: " + backendUrl + "/api/product/single)")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const setImageAt = (index, file) => {
    setNewImages(prev => prev.map((item, i) => (i === index ? file : item)))
  }

  const previewFor = (index) => {
    if (newImages[index]) return URL.createObjectURL(newImages[index])
    if (currentImages[index]) return currentImages[index]
    return assets.upload_area
  }

  const toggleSize = (size) => {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      formData.append("id", id)
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      newImages.forEach((file, i) => {
        file && formData.append(`image${i + 1}`, file)
      })

      const response = await axios.post(backendUrl + "/api/product/update", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/list')
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  if (loading) return <p>Loading...</p>

  if (loadError) return (
    <div>
      <p className='mb-3 text-red-600'>Could not load this product: {loadError}</p>
      <button type='button' onClick={() => navigate('/list')} className='px-4 py-2 border border-gray-400 cursor-pointer'>Back to list</button>
    </div>
  )

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>

      <div>
        <p className='mb-2'>Images (click one to replace it)</p>
        <div className='flex gap-2'>
          {[0, 1, 2, 3].map(i => (
            <label key={i} htmlFor={`image${i + 1}`}>
              <img className='w-20' src={previewFor(i)} alt="" />
              <input onChange={(e) => setImageAt(i, e.target.files[0])} type="file" id={`image${i + 1}`} hidden />
            </label>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input className='w-full max-w-125 px-3 py-2' type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea className='w-full max-w-125 px-3 py-2'
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

        <div>
          <p className='mb-2'>Product category</p>
          <select className='w-full px-3 py-2' onChange={(e) => setCategory(e.target.value)} value={category}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product subcategory</p>
          <select className='w-full px-3 py-2' onChange={(e) => setSubCategory(e.target.value)} value={subCategory}>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input className='w-full px-3 py-2 sm:w-30' type="number"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            required />
        </div>

      </div>

      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          {ALL_SIZES.map(size => (
            <div key={size} onClick={() => toggleSize(size)}>
              <p className={`${sizes.includes(size) ? "bg-gray-400" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>{size}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input
          onChange={() => setBestseller(prev => !prev)}
          checked={bestseller}
          type="checkbox" id="bestseller" />
        <label className='cursor-pointer' htmlFor="bestseller">Bestseller</label>
      </div>

      <div className='flex gap-3 mt-4'>
        <button type='submit' className='w-28 py-3 text-white bg-black cursor-pointer'>SAVE</button>
        <button type='button' onClick={() => navigate('/list')} className='w-28 py-3 border border-gray-400 cursor-pointer'>CANCEL</button>
      </div>

    </form>
  )
}

export default Edit