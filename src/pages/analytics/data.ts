import { Transaction } from "../../classes/transaction";
import { CalendarDate } from 'calendar-date';

export function getDateMapKey(date: CalendarDate, timePeriod: string) {
    if (timePeriod == "MONTH") {
        return date.toFormat('yyyy-MM');
    } else if (timePeriod == "YEAR") {
        return date.toFormat('yyyy');
    } else if (timePeriod == "LIFETIME") {
        return 'LIFETIME_DATEMAPKEY';
    }
    return null;
    // throw new Error(`Unsupported timePeriod ${timePeriod}`);
}

export function calculateData(
    transactionData: Transaction[],
    enabledCategories: string[],
    timePeriod: string,
    startDate: CalendarDate,
    endDate: CalendarDate,
    includeParentData: boolean,
): [Map<string, Map<string, number>>, CalendarDate[]] {
    // enabled category leaf nodes
    const displayedCategories = enabledCategories.filter((ec: string) =>
        enabledCategories.filter((_ec: string) => _ec.startsWith(ec)).length == 1);

    const categoryMap = new Map<string, Map<string, number>>(
        includeParentData ?
        enabledCategories.map((enabledCategories: string) => [enabledCategories, new Map<string, number>()]) :
        displayedCategories.map((displayedCategory: string) => [displayedCategory, new Map<string, number>()])
    );

    function GetCategoryKeys(transaction: Transaction) {
        return Array.from(categoryMap.keys()).filter((dck: string) => transaction.category.startsWith(dck));
    }

    function normalizeDate(date: CalendarDate) {
        if (timePeriod == "YEAR") {
            return new CalendarDate(date.year, 1, 1);
        } else if (timePeriod == "MONTH") {
            return new CalendarDate(date.year, date.month, 1);
        } else if (timePeriod == "LIFETIME") {
            return new CalendarDate(1, 1, 1);
        }
        return null;
    }

    function incrementDate(date: CalendarDate) {
        if (timePeriod == "MONTH") {
            return new CalendarDate(date.year + (date.month == 12 ? 1 : 0), (date.month % 12) + 1, 1);
        } else if (timePeriod == "YEAR") {
            return new CalendarDate(date.year + 1, 1, 1);
        } else if (timePeriod == "LIFETIME") {
            return new CalendarDate(9999, 1, 1);
        }
        return null;
    }

    const firstDate: CalendarDate = startDate ?? new CalendarDate(transactionData[0].date); // assumes transactions are sorted by date
    const lastDate: CalendarDate = endDate ?? new CalendarDate(transactionData[transactionData.length - 1].date);
    for (let transaction of transactionData) {
        if (Transaction.IsHiddenCategory(transaction.category)) {
            continue;
        }

        if (new CalendarDate(transaction.date) < firstDate || new CalendarDate(transaction.date) > lastDate) {
            continue;
        }

        // if transaction's category is not enabled, do not include it in calculations
        if (!displayedCategories.some((displayedCategory: string) => transaction.category.startsWith(displayedCategory))) {
            continue;
        }

        const categoryKeys = GetCategoryKeys(transaction);
        const dateMapKey = getDateMapKey(new CalendarDate(transaction.date), timePeriod);
        for (let categoryKey of categoryKeys) {
            const dateMap = categoryMap.get(categoryKey);
            dateMap.set(dateMapKey, dateMap.has(dateMapKey) ? dateMap.get(dateMapKey) + transaction.amount : transaction.amount);
        }
    }
    
    const dateKeyDates: CalendarDate[] = [];
    for (let curDate = normalizeDate(firstDate); curDate <= normalizeDate(lastDate); curDate = incrementDate(curDate)) {
        dateKeyDates.push(curDate);
    }

    return [categoryMap, dateKeyDates];
}