export class Player {
    id: number;
    playerId: string;
    points: number;
    isJoined: boolean;


    validate() {
        var errors: any = [];

        if (!this.playerId) {
            errors.push('Player ID field is required');
        }

        if (!this.points) {
            errors.push('Points field is required');
        }


        if (errors.length) {
            return errors;
        }

        return false;
    }

}
