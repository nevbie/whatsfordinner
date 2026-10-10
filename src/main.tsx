import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { LangProvider } from './i18n'
import { StoreProvider } from './store/StoreContext'
import { UIProvider } from './ui'
import './styles.css'
import { initDensity } from './display'

initDensity()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <StoreProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </StoreProvider>
    </LangProvider>
  </StrictMode>,
)
