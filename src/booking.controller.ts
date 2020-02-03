import bodyParser from 'body-parser';
import { BookingService } from "./booking.service";

import express, { Request, Response } from 'express';
const app = express();
// tslint:disable-next-line:no-var-requires
const dbMock = require('../dbMock/dbMock.json');
const bookingService = new BookingService(dbMock);
const port = 1337;

app.use(bodyParser.json());

app.get('/api/v1/bookings/', (req: Request, res: Response): void => {
    const bookings = bookingService.getAllBookings();
    res.status(200).send(bookings);
});

app.get('/api/v1/filtered-bookings', (req: Request, res: Response): void => {
    const bookings = bookingService.getAvailableRooms(req.query);
    if (bookings instanceof Error) {
        throw bookings;
    }
    res.status(200).send(bookings);
});

app.get('/api/v1/bookings/:bookingId', (req: Request, res: Response): void => {
    const booking = bookingService.getBooking(req.params.bookingId);
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

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Booking service listening on ${port}`);
});