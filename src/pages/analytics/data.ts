import { Transaction } from "../../classes/transaction";
import { CalendarDate } from 'calendar-date';

export function getDateMapKey(date: CalendarDate, timePeriod: string) {
    if (timePeriod == "MONTH") {
        return date.toFormat('yyyy-MM');
    } else if (timePeriod == "YEAR") {
        return date.toFormat('yyyy');
    }
    return null;
    // throw new Error(`Unsupported timePeriod ${timePeriod}`);
}

export function calculateOvertimeData(
    transactionData: Transaction[],
    enabledCategories: string[],
    timePeriod: string
): [Map<string, Map<string, number>>, CalendarDate[]] {
    const displayedCategories = enabledCategories.filter((ec: string) =>
        enabledCategories.filter((_ec: string) => _ec.startsWith(ec)).length == 1);

    const displayedCategoriesMap = new Map<string, Map<string, number>>(
        displayedCategories.map((displayedCategory: string) => [displayedCategory, new Map<string, number>()])
    );

    function GetDisplayedCategoryKey(transaction: Transaction) {
        const categoryKeys = displayedCategories.filter((dck: string) => transaction.category.startsWith(dck));
        if (categoryKeys.length != 1) {
            throw new Error(`transaction ${transaction} unexpected number of cat keys ${categoryKeys.length}: ${categoryKeys}`);
        }
        return categoryKeys[0];
    }


    function normalizeDate(date: CalendarDate) {
        return new CalendarDate(
            timePeriod == "YEAR" || timePeriod == "MONTH" ? date.year : 1,
            timePeriod == "MONTH" ? date.month : 1,
            1
        );
    }

    function incrementDate(date: CalendarDate) {
        if (timePeriod == "MONTH") {
            return new CalendarDate(date.year + (date.month == 12 ? 1 : 0), (date.month % 12) + 1, 1);
        } else if (timePeriod == "YEAR") {
            return new CalendarDate(date.year + 1, 1, 1);
        }
        return null;
        // throw new Error(`Unsupported timePeriod ${timePeriod}`);
    }

    for (let transaction of transactionData) {
        if (Transaction.IsHiddenCategory(transaction.category)) {
            continue;
        }

        if (!displayedCategories.some((displayedCategory: string) => transaction.category.startsWith(displayedCategory))) {
            continue;
        }

        const categoryKey = GetDisplayedCategoryKey(transaction);
        const dateMap = displayedCategoriesMap.get(categoryKey);
        const dateMapKey = getDateMapKey(new CalendarDate(transaction.date), timePeriod);
        dateMap.set(dateMapKey, dateMap.has(dateMapKey) ? dateMap.get(dateMapKey) + transaction.amount : transaction.amount);
    }

    const firstDate: CalendarDate = new CalendarDate(transactionData[0].date); // assumes transactions are sorted by date
    const lastDate: CalendarDate = new CalendarDate(transactionData[transactionData.length - 1].date);
    const dateKeyDates: CalendarDate[] = [];
    for (let curDate = normalizeDate(firstDate); curDate <= normalizeDate(lastDate); curDate = incrementDate(curDate)) {
        dateKeyDates.push(curDate);
    }

    return [displayedCategoriesMap, dateKeyDates];
}

export function calculateSingleData(
    transactionData: Transaction[],
    enabledCategories: string[]
): Map<string, number> {
    const categoryAmountMap: Map<string, number> = new Map<string, number>(
        enabledCategories.map((enabledCategory: string) => [enabledCategory, 0])
    );
    for (let transaction of transactionData) {
        for (let enabledCategory of enabledCategories) {
            if (transaction.category.startsWith(enabledCategory)) {
                categoryAmountMap.set(enabledCategory, categoryAmountMap.get(enabledCategory) + transaction.amount);
            }
        }
    }
    return categoryAmountMap;
}