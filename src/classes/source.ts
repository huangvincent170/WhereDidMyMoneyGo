
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
        path?: string,
        name?: string,
        amountIdx?: number,
        descriptionIdx?: number,
        dateIdx?: number,
        isDebt?: boolean,
        hasHeader?: boolean,
    ) {
        this.path = path;
        this.name = name;
        this.amountIdx = amountIdx;
        this.descriptionIdx = descriptionIdx;
        this.dateIdx = dateIdx;
        this.isDebt = isDebt ?? false;
        this.hasHeader = hasHeader ?? false;
    }

    static fromFormData(formData: FormData): Source {
        const formDataMap = new Map(formData.entries());
        return new Source(
            formDataMap.get('path') as string,
            formDataMap.get('name') as string,
            Number(formDataMap.get('amountIdx') as string),
            Number(formDataMap.get('descriptionIdx') as string),
            Number(formDataMap.get('dateIdx') as string),
            Boolean(formDataMap.get('isDebt') as string),
            Boolean(formDataMap.get('hasHeader') as string),
        );
    }
}