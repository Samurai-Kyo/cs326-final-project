import express from 'express';
import morgan from 'morgan';
import router from './routes/route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
