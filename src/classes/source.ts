
export class Source {
    path: string;
    name: string;

    amountIdx: number;
    descriptionIdx: number;
    dateIdx: number;

    // If true, amounts with a positive value represent debt, and negative represents credit.
    isDebt: boolean;

    hasHeader: boolean;

    constructor(
        path: string,
        name: string,
        amountIdx: number,
        descriptionIdx: number,
        dateIdx: number,
        isDebt: boolean,
        hasHeader: boolean,
    ) {
        this.path = path;
        this.name = name;
        this.amountIdx = amountIdx;
        this.descriptionIdx = descriptionIdx;
        this.dateIdx = dateIdx;
        this.isDebt = isDebt;
        this.hasHeader = hasHeader;
    }
}