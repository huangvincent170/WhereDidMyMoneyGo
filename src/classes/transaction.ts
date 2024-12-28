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
}