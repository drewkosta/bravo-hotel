export class RoomModel {
    roomNumber: number;
    private floor: number;
    bedCount: number;

    public get isGroundLevel(): boolean {
        return this.floor === 1;
    }
}