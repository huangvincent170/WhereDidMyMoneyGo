
export class Transaction {
    sourcePath: string;
    amount: number;
    date: Date;
    description: string;

    constructor(
        sourcePath: string,
        amount: number,
        date: Date,
        description: string
    ) {
        this.sourcePath = sourcePath;
        this.amount = amount;
        this.date = date;
        this.description = description;
    }
}