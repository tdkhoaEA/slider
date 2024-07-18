import Slider from './Slider'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import CameraPage from './pages/CameraPage';

function App() {
  return (
    <Router>
    <Routes>
      <Route exact path="/" element={<CameraPage  />} />
      <Route path="/slider" element={<Slider/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
</Router>
  )
}

export default App;
