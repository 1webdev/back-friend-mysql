export class Tournament {
    id: number;
    tournamentId: string;
    deposit: number;
    status: string;
    tournament: any[] = [];


    validate() {
        var errors: any = [];

        if (!this.tournamentId) {
            errors.push('Tournament ID field is required');
        }

        if (!this.deposit) {
            errors.push('Deposit field is required');
        }

        if (errors.length) {
            return errors;
        }

        return false;
    }

}
