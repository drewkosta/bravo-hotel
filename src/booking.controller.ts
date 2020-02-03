import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';

const app = express();
app.use(bodyParser.json());
import { bookingService } from "./booking.service";


app.get('/api/v1/bookings/', (req: Request, res: Response): void => {
    const bookings = bookingService.getAllBookings();
    res.status(200).send(bookings);
});

app.get('/api/v1/bookings/:bookingId', (req: Request, res: Response): void => {
    const booking = bookingService.getBooking(req.params.bookingId);
    console.log(booking)
    if (booking instanceof Error) {
        throw booking;
    }
    res.status(200).send(booking);
});

app.delete('/api/v1/bookings/:bookingId', (req: Request, res: Response): void => {
    const booking = bookingService.deleteBooking(req.params.bookingId);
    if (booking instanceof Error) {
        throw booking;
    }
    res.status(200).send(booking);
});

app.post('/api/v1/bookings', (req: Request, res: Response): void => {
    const booking = bookingService.addBooking(req.body);
    if (booking instanceof Error) {
        throw booking;
    }
    res.status(201).send(booking);
});



app.listen(1337, () => {
    // tslint:disable-next-line:no-console
    console.log('Booking service listening on 1337');
});