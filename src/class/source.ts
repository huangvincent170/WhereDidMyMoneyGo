
export class Source {
    path: string;
    name: string;

    // Maps each column name/field in a source to its column index
    fieldIndexMap: Record<string, number>;

    // If true, amounts with a positive value represent debt, and negative represents credit.
    isDebt: boolean;

    constructor(
        path: string,
        name: string,
        fieldIndexMap: Record<string, number>,
        isDebt: boolean
    ) {
        this.path = path;
        this.name = name;
        this.fieldIndexMap = fieldIndexMap;
        this.isDebt = isDebt;
    }
}