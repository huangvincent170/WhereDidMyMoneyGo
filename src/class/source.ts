
export class Source {
    path: string;
    name: string;

    // Maps each column name/field in a source to its column index
    fieldIndexMap: Record<string, number>;

    // If true, amounts with a positive value represent debt, and negative represents credit.
    isDebt: boolean;
}