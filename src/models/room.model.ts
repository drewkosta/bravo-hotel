import { BookingRequestModel } from "./bookingRequest.model";

export class RoomModel {
    private roomNumber: number;
    private floor: number;
    private bedCount: number;

    public get isGroundLevel(): boolean {
        return this.floor === 1;
    }

    public get pricePerNight(): number {
        switch (this.bedCount) {
            case 1: return 50;
            case 2: return 75;
            case 3: return 90;
            default: throw new Error(`Cannot get price for invalid bed count ${this.bedCount}.`);
        }
    }
}