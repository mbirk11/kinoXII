import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage/HomePage'
import SessionsPage from './pages/SessionsPage/SessionsPage'
import MoviePage from './pages/MoviePage/MoviePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/movies/:movieId" element={<MoviePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
