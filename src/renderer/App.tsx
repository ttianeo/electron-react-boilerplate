import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Photo from './pages/photo/Photo';
import Print from './pages/print/Print';
import Preference from './pages/preference/Preference';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/print" element={<Print />} />
        <Route path="/preference" element={<Preference />} />
      </Routes>
    </Router>
  );
}
