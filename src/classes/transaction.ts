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
        description: string,
        category?: string,
    ) {
        this.sourceName = sourceName;
        this.date = date;
        this.description = description;
        this.category = category ?? "UNCATEGORIZED";
        this.amount = amount;
    }

    static IsHiddenCategory(categoryId: string): boolean {
        const lowerCat = categoryId.toLocaleLowerCase();
        return categoryId == "uncategorized" || categoryId == "deleted" || categoryId == "split";
    }
}