import * as express from 'express';
const app = express();

app.get('/', (req, res) => res.status(200).send('<h1>Responded</h1>'));

app.listen(1337, () => {
    // tslint:disable-next-line:no-console
    console.log('Booking service listening on 1337');
});