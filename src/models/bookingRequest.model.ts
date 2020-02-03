export class BookingRequestModel {
    public bedCount: number;
    public petCount: number;
    public checkInDate: Date;
    public checkOutDate: Date;
    public handicapAccessible: boolean;
    public roomNumber?: number;
}