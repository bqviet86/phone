import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import PhoneDetail from './PhoneDetail'
import PhoneForm from './PhoneForm'

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<PhoneForm />} />
                <Route path='/display' element={<PhoneDetail />} />
            </Routes>
        </Router>
    )
}

export default App
