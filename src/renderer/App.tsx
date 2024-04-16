import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Photo from './pages/photo/Photo';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photo" element={<Photo />} />
      </Routes>
    </Router>
  );
}
