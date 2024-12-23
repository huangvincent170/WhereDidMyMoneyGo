import { Transaction } from "./transaction";

export enum Field {
    Amount = "Amount",
    Category = "Category",
    Description = "Description",
    Source = "Source",
}

export enum FieldType {
    String = "String",
    Number = "Number",
    Date = "Date",
}

export enum CheckOp {
    Equals = "equals",
    Contains = "contains substring",
    NotEquals = "does not equal",
    StartsWith = "starts with",
}

export enum RuleOpType {
    Set = "set",
    Split = "split"
}

export const ValidFieldTypeValidOps = {
    [FieldType.String]: [
        CheckOp.Equals,
        CheckOp.Contains
    ],
    [FieldType.Number]: [
        CheckOp.Equals
    ],
    [FieldType.Date]: [
        CheckOp.Equals
    ]
}

export const FieldToFieldType = {
    [Field.Amount]: FieldType.Number,
    [Field.Category]: FieldType.String,
    [Field.Description]: FieldType.String,
    [Field.Source]: FieldType.String,
}



export class RuleTest {
    field: Field;
    checkOp: CheckOp;
    value: string | number | Date;

    constructor(field: Field, checkOp: CheckOp, value: string | number | Date) {
        this.field = field;
        this.checkOp = checkOp;
        this.value = value;
    }

    static Test(test: RuleTest, transaction: Transaction): boolean {
        let fieldValue: string | number | Date;
        if (test.field == Field.Amount) {
            fieldValue = transaction.amount;
        } else if (test.field == Field.Category) {
            fieldValue = transaction.category;
        } else if (test.field == Field.Description) {
            fieldValue = transaction.description;
        } else if (test.field == Field.Source) {
            fieldValue == transaction.sourceName;
        } else {
            throw Error(`Unexpected fieldValue ${test.field}`);
        }

        if (test.checkOp == CheckOp.Equals) {
            return test.value == fieldValue;
        } else if (test.checkOp == CheckOp.Contains) {
            return (fieldValue as string).toLocaleLowerCase().includes((test.value as string).toLocaleLowerCase());
        } else {
            throw Error(`Unimplemented op ${test.checkOp}`);
        }
    }
}

export interface RuleOp {
    setField: string;
    setValue: any;
}

export class SetRuleOp implements RuleOp {
    setField: Field;
    setValue: string | number | Date;

    constructor(setField: Field, setValue: string | number | Date) {
        this.setField = setField;
        this.setValue = setValue;
    }

    static Execute(ruleOp: SetRuleOp, transaction: Transaction): Transaction[] {
        if (ruleOp.setField == Field.Amount) {
            transaction.amount = ruleOp.setValue as number;
        } else if (ruleOp.setField == Field.Category) {
            transaction.category = ruleOp.setValue as string;
        } else if (ruleOp.setField == Field.Description) {
            transaction.description = ruleOp.setValue as string;
        } else if (ruleOp.setField == Field.Source) {
            transaction.sourceName = ruleOp.setValue as string;
        } else {
            throw Error(`Unexpected setField ${ruleOp.setField}`);
        }

        return [];
    }
}

export class SplitRuleOp implements RuleOp {
    setField: string = "Category and Amount";
    setValue: [string, number][];

    constructor(setValue: [string, number][]) {
        this.setValue = setValue;
    }

    static Execute (ruleOp: SplitRuleOp, transaction: Transaction): Transaction[] {
        transaction.category = "SPLIT";

        // todo dont split if already split

        return ruleOp.setValue.map((setValue: [string, number]) => new Transaction(
            transaction.sourceName,
            setValue[1],
            transaction.date,
            transaction.description,
            setValue[0]
        ));
    }
}

export class Rule {
    tests: RuleTest[];
    op: RuleOp;
    // restoring data from storage wipes class data, so we need to separately store optype
    opType: RuleOpType;
    

    constructor(tests: RuleTest[], op: RuleOp) {
        this.tests = tests;
        this.op = op;
        if (op instanceof SplitRuleOp) {
            this.opType = RuleOpType.Split;
        } else if (op instanceof SetRuleOp) {
            this.opType = RuleOpType.Set;
        } else {
            throw new Error(`unexpected rule op ${op}`);
        }
    }

    static Execute(rules: Rule[], transactions: Transaction[]): Transaction[] {
        if (rules == null) {
            return transactions;
        }
        let addedTransactions: Transaction[] = [];
        for (let rule of rules) {
            for (let transaction of transactions) {
                const shouldExecute: boolean = rule.tests
                    .map((t: RuleTest) => RuleTest.Test(t, transaction))
                    .reduce((prev: boolean, cur: boolean) => prev && cur, true);
                
                if (!shouldExecute) {
                    continue;
                }

                if (rule.opType == RuleOpType.Set) {
                    SetRuleOp.Execute(rule.op as SetRuleOp, transaction);
                } else if (rule.opType == RuleOpType.Split) {
                    addedTransactions.concat(SplitRuleOp.Execute(rule.op as SplitRuleOp, transaction));
                } else {
                    throw new Error("unexpected ruleoptype");
                }
            }
        }

        return transactions.concat(addedTransactions);
    }
}



