import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="page">
      <h1 className="text-display">Page not found</h1>
      <Link to="/">Back to home</Link>
    </div>
  )
}

export default NotFoundPage
