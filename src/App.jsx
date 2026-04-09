import { CalendarProvider } from './context/CalendarContext';
import Calendar from './components/Calendar';
import './index.css';

function App() {
  return (
    <CalendarProvider>
      <Calendar />
    </CalendarProvider>
  );
}

export default App;
