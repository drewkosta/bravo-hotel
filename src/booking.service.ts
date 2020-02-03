import { BookingModel, BookingRequestModel, RoomModel } from "./models";
import { extendMoment } from "moment-range";
import uuidv1 from 'uuid/v1';

const dbMock = require('../dbMock/dbMock.json');
const Moment = require('moment');
const moment = extendMoment(Moment);

class BookingService {

    public getAllBookings() {
        return dbMock.bookings;
    }

    public addBooking(req: BookingRequestModel): BookingModel | Error {
        if (!req.roomNumber) {
            return new Error('Please provide a room number.');
        }
        if (!this.getAvailableRooms(req)
            .map((rm: RoomModel) => rm.roomNumber)
            .includes(req.roomNumber)) {
            return new Error('Room is not available');
        }
        const room = dbMock.rooms.find((rm: RoomModel) => rm.roomNumber === req.roomNumber);
        const dateRange = moment.range(BookingService.asCheckIn(req.checkInDate), BookingService.asCheckOut(req.checkOutDate));
        const booking = {
            id: uuidv1(),
            bedCount: room.bedCount,
            petCount: req.petCount,
            checkInDate: req.checkInDate,
            checkOutDate: req.checkOutDate,
            roomNumber: room.roomNumber,
            totalFee: BookingService.calculateFee(dateRange.diff('days'), room.bedCount, req.petCount),
        };
        dbMock.bookings.push(booking);
        console.log(booking)
        return booking;
    }

    public getBooking(bookingId: string): BookingModel | Error {
        const booking = dbMock.bookings.find((bkng: BookingModel) => bkng.id === bookingId);
        if (!booking) {
            return new Error('Booking does not exist.')
        }
        return booking;
    }

    public deleteBooking(bookingId: string): BookingModel | Error {
        const booking = dbMock.bookings.find((bkng: BookingModel) => bkng.id === bookingId);
        if (!booking) {
            return new Error('Booking does not exist.')
        }
        dbMock.bookings.splice(dbMock.bookings.indexOf(booking), 1);
        return booking;
    }

    private getAvailableRooms(req: BookingRequestModel): RoomModel[] {

        const dateRange = moment.range(BookingService.asCheckIn(req.checkInDate), BookingService.asCheckOut(req.checkOutDate));

        return dbMock.rooms.filter((room: RoomModel) => {
            let available = true;
            dbMock.bookings.forEach((booking: BookingModel) => {
                if (booking.roomNumber === room.roomNumber) {
                    if ((req.petCount > 0 || req.handicapAccessible) && !room.isGroundLevel
                        || req.bedCount > room.bedCount
                        || req.petCount > 2
                        || req.bedCount > 3
                        || dateRange.contains(booking.checkInDate)
                        || dateRange.contains(booking.checkOutDate)) {
                        available = false;
                    }
                }
            });
            return available;
        });
    }

    private static asCheckIn(date: Date): any {
        return Moment(date).hour(14) // check in starts at 2pm
    };

    private static asCheckOut(date: Date): any {
        return Moment(date).hour(10) // check out ends at 10am
    };

    private static calculateFee(nights: number, beds: number, pets: number): number {
        let bedRate: number;
        switch (beds) {
            case 1: bedRate = 50; break;
            case 2: bedRate = 75; break;
            case 3: bedRate = 90; break;
            default: throw new Error('Cannot calculate rate on invalid bed count');
        }
        return nights * (bedRate + pets * 20);
    }
}

export const bookingService = new BookingService();