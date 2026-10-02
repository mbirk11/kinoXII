import { useParams } from 'react-router-dom'

function MoviePage() {
  const { movieId } = useParams()

  return (
    <div className="page">
      <h1 className="text-display">Movie {movieId}</h1>
    </div>
  )
}

export default MoviePage
