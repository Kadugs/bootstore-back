import '../setup.js';
import app from './app.js';

const port = process.env.NODE_ENV === 'test' ? 4000 : process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
