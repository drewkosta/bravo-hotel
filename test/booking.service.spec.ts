import {BookingRequestModel} from '../src/models';

const expect = require('chai').expect;

import { BookingService } from '../src/booking.service';
const dbMock = require('../dbMock/dbMock.json');
const bookingService = new BookingService(dbMock);

describe('Booking Service:', function() {

    it('Retrieves all bookings', () => {
        expect(bookingService.getAllBookings()).to.equal(dbMock.bookings);
    });

    it('Creates a booking', () => {
        expect(dbMock.bookings.length).to.equal(1);
        bookingService.addBooking({
            bedCount: 3,
            petCount: 2,
            checkInDate: '11/02/2021',
            checkOutDate: '11/04/2021',
            roomNumber: 106,
            handicapAccessible: false
        } as BookingRequestModel);
        expect(dbMock.bookings.length).to.equal(2);
    });

    it('Deletes a booking', () => {
        bookingService.deleteBooking('3174aaa0-4632-11ea-9f8a-5d18506a49ab');
        expect(dbMock.bookings.length).to.equal(1);
    })
    
    it('Throws on invalid booking request', () => {
        const booking = bookingService.addBooking({
            bedCount: 3,
            petCount: 42,
            checkInDate: '11/06/2021',
            checkOutDate: '11/09/2021',
            roomNumber: 106,
            handicapAccessible: false
        } as BookingRequestModel);
        expect(booking instanceof Error).to.be.true;
    })

    it('Returns accessible rooms only', () => {
        const bookings = bookingService.getAvailableRooms({
            bedCount: 1,
            petCount: 0,
            checkInDate: '11/09/2021',
            checkOutDate: '11/11/2021',
            handicapAccessible: true
        } as BookingRequestModel);
        expect(bookings.length).to.equal(6);
    })
});