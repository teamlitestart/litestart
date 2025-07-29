import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('🚀 React app starting...');
console.log('Root element:', document.getElementById('root'));

try {
  const root = createRoot(document.getElementById('root')!);
  console.log('✅ React root created successfully');
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ React app rendered');
} catch (error) {
  console.error('❌ Error mounting React app:', error);
}
