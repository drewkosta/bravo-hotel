export class RoomModel {
    public roomNumber: number;
    public floor: number;
    public bedCount: number;

    public get isGroundLevel(): boolean {
        return this.floor === 1;
    }
}