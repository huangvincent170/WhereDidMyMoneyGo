export class Category {
    id: string;
    amount: number;

    constructor(id: string, amount: number) {
        this.id = id;
        this.amount = amount;
    }

    getParentCategories(): string[] {
        return this.id.split('/');
    }
    getDisplayName(): string {
        const categories = this.getParentCategories();
        return categories[categories.length - 1];
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