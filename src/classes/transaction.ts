export class Transaction {
    sourceName: string;
    date: Date;
    description: string;
    category: string;
    amount: number;

    constructor(
        sourceName: string,
        amount: number,
        date: Date,
        description: string
    ) {
        this.sourceName = sourceName;
        this.date = date;
        this.description = description;
        this.category = "UNCATEGORIZED";
        this.amount = amount;
    }
}