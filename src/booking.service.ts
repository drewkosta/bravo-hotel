import { BookingModel, BookingRequestModel, RoomModel } from "./models";
import { extendMoment } from "moment-range";
import uuidv1 from 'uuid/v1';

// tslint:disable-next-line:no-var-requires
const Moment = require('moment');
const moment = extendMoment(Moment);

export class BookingService {
    private dbMock: { rooms: RoomModel[], bookings: BookingModel[] };

    constructor(dbMock: { rooms: RoomModel[], bookings: BookingModel[] }) {
        this.dbMock = dbMock;
    }

    public getAllBookings() {
        return this.dbMock.bookings;
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
        const room = this.dbMock.rooms.find((rm: RoomModel) => rm.roomNumber === req.roomNumber);
        const dateRange = moment.range(Moment(this.asCheckIn(req.checkInDate)), Moment(this.asCheckOut(req.checkOutDate)));
        const booking = {
            id: uuidv1(),
            bedCount: room.bedCount,
            petCount: req.petCount,
            checkInDate: Moment(req.checkInDate).toISOString(),
            checkOutDate: Moment(req.checkOutDate).toISOString(),
            roomNumber: room.roomNumber,
            totalFee: this.calculateFee(dateRange.diff('days'), room.bedCount, req.petCount),
        };
        this.dbMock.bookings.push(booking);
        return booking;
    }

    public getBooking(bookingId: string): BookingModel | Error {
        const booking = this.dbMock.bookings.find((bkng: BookingModel) => bkng.id === bookingId);
        if (!booking) {
            return new Error('Booking does not exist.')
        }
        return booking;
    }

    public deleteBooking(bookingId: string): BookingModel | Error {
        const booking = this.dbMock.bookings.find((bkng: BookingModel) => bkng.id === bookingId);
        if (!booking) {
            return new Error('Booking does not exist.')
        }
        this.dbMock.bookings.splice(this.dbMock.bookings.indexOf(booking), 1);
        return booking;
    }

    public getAvailableRooms(req: BookingRequestModel): RoomModel[] {

        const dateRange = moment.range(Moment(this.asCheckIn(req.checkInDate)), Moment(this.asCheckOut(req.checkOutDate)));

        return this.dbMock.rooms.filter((room: RoomModel) => {
            let available = true;
            if ((req.petCount > 0 || req.handicapAccessible) && !room.isGroundLevel
                || req.bedCount > room.bedCount
                || req.petCount > 2
                || req.bedCount > 3) {
                available = false;
            }
            this.dbMock.bookings.forEach((booking: BookingModel) => {
                if (booking.roomNumber === room.roomNumber
                    && (dateRange.contains(Moment(this.asCheckIn(booking.checkInDate)))
                    || dateRange.contains(Moment(this.asCheckOut(booking.checkOutDate))))) {
                    available = false;
                }
            });
            return available;
        });
    }

    private asCheckIn(date: string): string {
        return Moment(date).hour(14).toISOString() // check in starts at 2pm
    };

    private asCheckOut(date: string): string {
        return Moment(date).hour(10).toISOString() // check out ends at 10am
    };

    private calculateFee(nights: number, beds: number, pets: number): number {
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
