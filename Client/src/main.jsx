import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import store from './features/Store.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, 
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
<ErrorBoundary>
  <BrowserRouter>
   <Provider store={store}>
    <QueryClientProvider client={queryClient}>
     <App/>
    </QueryClientProvider>
   </Provider>
  </BrowserRouter>
</ErrorBoundary>
)

