import express from 'express';
import bodyParser from 'body-parser';
import router from './router';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => { console.log(`Pet Shelter API is running on port ${PORT}`); });

export default app;