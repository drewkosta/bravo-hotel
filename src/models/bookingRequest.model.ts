export class BookingRequestModel {
    public bedCount: number;
    public petCount: number;
    public checkInDate: string;
    public checkOutDate: string;
    public handicapAccessible: boolean;
    public roomNumber?: number;
}