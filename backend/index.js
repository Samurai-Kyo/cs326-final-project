import express from 'express';
import morgan from 'morgan';
import router from './routes/route.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/', express.static('client'));
app.use('/', router);

app.all('*', async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
