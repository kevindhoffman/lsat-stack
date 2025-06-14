import { useState } from 'react'
import axios from 'axios'

const API_URL = 'https://lsat-api.onrender.com/upload' // Replace with deployed backend URL

export default function FileUpload() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return setMessage('No file selected')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post(API_URL, formData)
      setMessage(`Uploaded: ${res.data.filename}`)
    } catch (err) {
      setMessage('Upload failed')
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Upload
      </button>
      {message && <p>{message}</p>}
    </form>
  )
}
