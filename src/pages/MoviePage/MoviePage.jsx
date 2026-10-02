import { useParams } from 'react-router-dom'

function MoviePage() {
  const { movieId } = useParams()

  return <h1 className="text-display">Movie {movieId}</h1>
}

export default MoviePage
