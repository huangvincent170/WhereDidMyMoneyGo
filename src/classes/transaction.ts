export class Transaction {
    sourceName: string;
    date: string;
    description: string;
    category: string;
    amount: number;
    locked: boolean;

    constructor(
        sourceName: string,
        amount: number,
        date: string,
        description: string,
        category?: string,
        locked?: boolean,
    ) {
        this.sourceName = sourceName;
        this.date = date;
        this.description = description;
        this.category = category ?? "UNCATEGORIZED";
        this.amount = amount;
        this.locked = locked ?? false;
    }

    static IsHiddenCategory(categoryId: string): boolean {
        const lowerCat = categoryId.toLocaleLowerCase();
        return lowerCat == "uncategorized" || lowerCat == "deleted" || lowerCat == "split";
    }

    static GetAllParentCategories(categoryId: string): string[] {
        const splitCategoryNames: string[] = categoryId.split('/');
        let parentCategoryNames: string[] = []
        for (let i = 0; i < splitCategoryNames.length; i++) {
            parentCategoryNames.push(splitCategoryNames.slice(0, i+1).join('/'));
        }
        return parentCategoryNames;
    }

    static AddParentCategories(categoryId: string, categoryList: string[]): string[] {
        const parentCategoryNames = Transaction.GetAllParentCategories(categoryId);
        const dedupedParentCategoryNames = Array.from(new Set(categoryList.concat(parentCategoryNames)));
        dedupedParentCategoryNames.sort();
        return dedupedParentCategoryNames;
    }

    static Clone(transaction: Transaction) {
        return new Transaction(
            transaction.sourceName,
            transaction.amount,
            transaction.date,
            transaction.description,
            transaction.category,
        );
    }
}