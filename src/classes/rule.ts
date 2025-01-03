import { Transaction } from "./transaction";

export enum Field {
    Amount = "Amount",
    Category = "Category",
    Date = "Date",
    Description = "Description",
    Source = "Source",
}

export enum FieldType {
    Date = "Date",
    Number = "Number",
    Source = "Source",
    String = "String",
}

export enum CheckOp {
    Contains = "contains substring",
    DoesNotContain = "does not contain substring",
    Equals = "equals",
    // GreaterThan = "greater than",
    // LessThan = "less than",
    // NotEquals = "does not equal",
    StartsWith = "starts with",
}

export enum RuleOpType {
    Set = "set",
    Split = "split"
}

export const ValidFieldTypeValidOps = {
    [FieldType.Date]: [
        CheckOp.Equals
    ],
    [FieldType.Number]: [
        CheckOp.Equals
    ],
    [FieldType.Source]: [
        CheckOp.Equals
    ],
    [FieldType.String]: [
        CheckOp.Equals,
        CheckOp.Contains,
        CheckOp.DoesNotContain,
    ],
}

export const FieldToFieldType = {
    [Field.Amount]: FieldType.Number,
    [Field.Category]: FieldType.String,
    [Field.Date]: FieldType.Date,
    [Field.Description]: FieldType.String,
    [Field.Source]: FieldType.Source,
}


export class RuleTest {
    field: Field;
    checkOp: CheckOp;
    value: string | number;

    constructor(field: Field, checkOp: CheckOp, value: string | number) {
        this.field = field;
        this.checkOp = checkOp;
        this.value = value;
    }

    static Test(test: RuleTest, transaction: Transaction): boolean {
        if (transaction.locked) {
            return false;
        }

        let fieldValue: string | number;
        if (test.field == Field.Amount) {
            fieldValue = transaction.amount;
        } else if (test.field == Field.Category) {
            fieldValue = transaction.category;
        } else if (test.field == Field.Date) {
            fieldValue = transaction.date;
        } else if (test.field == Field.Description) {
            fieldValue = transaction.description;
        } else if (test.field == Field.Source) {
            fieldValue = transaction.sourceName;
        } else {
            throw Error(`Unexpected fieldValue ${test.field}`);
        }

        if (test.checkOp == CheckOp.Equals) {
            return test.value == fieldValue;
        } else if (test.checkOp == CheckOp.Contains) {
            return (fieldValue as string).toLocaleLowerCase().includes((test.value as string).toLocaleLowerCase());
        } else if (test.checkOp == CheckOp.DoesNotContain) {
            return !(fieldValue as string).toLocaleLowerCase().includes((test.value as string).toLocaleLowerCase());
        } else {
            throw Error(`Unimplemented op ${test.checkOp}`);
        }
    }

    static isValid(test: RuleTest): boolean {
        return test.checkOp != null && test.field != null && test.value != null  && test.value != '';
    }
}

export interface RuleOp {}

export class SetRuleOp implements RuleOp {
    setFieldValues: [Field, string | number][];

    constructor(setFieldValues: [Field, string | number][]) {
        this.setFieldValues = setFieldValues;
    }

    static Execute(ruleOp: SetRuleOp, transaction: Transaction, locksTransaction: boolean): Transaction[] {
        for (let [field, value] of ruleOp.setFieldValues) {
            if (field == Field.Amount) {
                transaction.amount = value as number;
            } else if (field == Field.Category) {
                transaction.category = value as string;
            } else if (field == Field.Description) {
                transaction.description = value as string;
            } else if (field == Field.Source) {
                transaction.sourceName = value as string;
            } else {
                throw Error(`Unexpected setField ${field}`);
            }
        }

        if (locksTransaction) {
            transaction.locked = true;
        }

        return [];
    }
}

export class SplitRuleOp implements RuleOp {
    splits: [string, number][];

    constructor(splits: [string, number][]) {
        this.splits = splits;
    }

    static Execute(ruleOp: SplitRuleOp, transaction: Transaction, locksTransaction: boolean): Transaction[] {
        transaction.category = "SPLIT";
        transaction.locked = true;

        return ruleOp.splits.map((setValue: [string, number]) => new Transaction(
            transaction.sourceName,
            setValue[1],
            transaction.date,
            transaction.description,
            setValue[0],
            locksTransaction,
        ));
    }
}

export class Rule {
    tests: RuleTest[];
    op: RuleOp;
    // restoring data from storage wipes class data, so we need to separately store optype
    opType: RuleOpType;
    executesOnce: boolean;
    locksTransaction: boolean;

    constructor(tests: RuleTest[], op: RuleOp, executesOnce?: boolean, locksTransaction?: boolean) {
        this.tests = tests;
        this.op = op;
        if (op instanceof SplitRuleOp) {
            this.opType = RuleOpType.Split;
        } else if (op instanceof SetRuleOp) {
            this.opType = RuleOpType.Set;
        } else {
            throw new Error(`unexpected rule op ${op}`);
        }
        this.executesOnce = executesOnce ?? false;
        this.locksTransaction = locksTransaction ?? false;
    }

    static Execute(rules: Rule[], transactions: Transaction[]): Transaction[] {
        if (rules == null) {
            return transactions;
        }

        function rulePriority(rule: Rule) {
            let priority = 0;
            if (rule.executesOnce) {
                priority -= 1;
            }
            if (rule.locksTransaction) {
                priority -= 2;
            }
            return priority;
        }

        rules.sort((r1, r2) => rulePriority(r1) - rulePriority(r2));
        const clonedTransactions = transactions.map((transaction) => Transaction.Clone(transaction));
        let addedTransactions: Transaction[] = [];
        for (let rule of rules) {
            for (let transaction of clonedTransactions) {
                const shouldExecute: boolean =
                    !transaction.locked &&
                    rule.tests
                    .map((t: RuleTest) => RuleTest.Test(t, transaction))
                    .reduce((prev: boolean, cur: boolean) => prev && cur, true);

                if (!shouldExecute) {
                    continue;
                }

                if (rule.opType == RuleOpType.Set) {
                    SetRuleOp.Execute(rule.op as SetRuleOp, transaction, rule.locksTransaction);
                } else if (rule.opType == RuleOpType.Split) {
                    addedTransactions = addedTransactions.concat(SplitRuleOp.Execute(rule.op as SplitRuleOp, transaction, rule.locksTransaction));
                } else {
                    throw new Error("unexpected ruleoptype");
                }

                if (rule.executesOnce) {
                    break;
                }
            }
        }

        return clonedTransactions.concat(addedTransactions);
    }
}
