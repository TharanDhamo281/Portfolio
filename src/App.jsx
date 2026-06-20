import { useState, Suspense, lazy } from 'react'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor  from './components/CustomCursor'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import About         from './components/About'
import Skills        from './components/Skills'
import Projects      from './components/Projects'
import Experience    from './components/Experience'
import Contact       from './components/Contact'
import Footer        from './components/Footer'
import ChatBot       from './components/ChatBot'

const StarField = lazy(() => import('./components/three/StarField'))

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {loaded && (
        <>
          <CustomCursor />

          {/* Global starfield behind everything */}
          <Suspense fallback={null}>
            <StarField />
          </Suspense>

          {/* Main content */}
          <div className="relative z-10">
            <Navbar />
            <main>
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Experience />
              <Contact />
            </main>
            <Footer />
          </div>
          <ChatBot />
        </>
      )}
    </>
  )
}
