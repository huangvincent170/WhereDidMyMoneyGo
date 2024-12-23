import { Transaction } from "./transaction";


export class Category {
    id: string;
    amount: number;

    constructor(id: string) {
        this.id = id;
        this.amount = 0;
    }

    static getParentCategories(category: Category): string[] {
        return category.id.split('/');
    }

    static getDisplayName(category: Category): string {
        const categories = Category.getParentCategories(category);
        return categories[categories.length - 1];
    }

    static setCategoryAmounts(categories: Category[], transactions: Transaction[]) {
        if (categories == null || transactions == null) {
            return;
        }

        for (let transaction of transactions) {
            for (let category of categories) {
                if (transaction.category == category.id) {
                    category.amount += transaction.amount;
                    continue;
                }
            }
        }
    }
}

// export class DisplayedCategory {
//     name: string;
//     children: Category[];
//     private amount: number;

//     constructor(
//         name: string,
//         children?: Category[],
//         amount?: number
//     ) {
//         this.name = name;
//         this.children = children;
//         this.amount = amount;
//     }

//     getAmount(): number {
//         if (this.children == null || this.children.length == 0) {
//             return this.amount;
//         }
//         return this.children.reduce((sum, child) => sum + child.getAmount(), 0);
//     }

//     setAmount(val: number) {
//         if (this.children != null && this.children.length > 0) {
//             console.log('not a leaf node!');
//             return;
//         }
//         this.amount = val;
//     }
// }