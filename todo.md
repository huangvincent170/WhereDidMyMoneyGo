### TODO
❗: Minimum required functionality  
⚠️: Priority  
👍: Nice to have  
❔: Ideas which I probably will never implement


- Transactions
    - ❗ Add split button to split transaction
    - 👍 Error handling for reading transactions from source to check type of Dates/Numbers/strings/etc
    - 👍 Edit transaction

- Sources
    - 👍 Last time source was updated

- Categories
    - ❗ Edit category
    - ❗ add deleted/split category
        - ❗ deleted/split transactions hidden from transactions view
        - ❗ deleted/split transactions hidden from analytics view
    - ❗ disable delete button for non leaf cats
    - 👍 Change category add to be grid based

- Rules
    - ❗ Date picker
    - ⚠️ transactions that the rule would affect preview in create rule
    - 👍 no duplicate rules
    - 👍 Rules which only execute once sorted first
    - 👍 binsearch on dates for single execute rules (need to sort by date first)
    - 👍 add scroll bar/ fix many tests/ops out of bounds
    - ❔ split rule into percentages
    - ❔ Less/greater than for numbers
    - ❔ Less/greater than for dates
    - ❔ case sensitive equals/substring


- ❗ analytics
    - ❗ graph for spending by category
        - ⚠️ monthly/yearly/total
        - 👍 custom date range

- Misc
    - ⚠️ Fix memory leak, remove listeners when unused
    - 👍 Clean up unused comments
    - 👍 Fix indent in index.ts
    - 👍 clean up unused imports
    - 👍 exporting rules/categories
    - ❔ Templates for sources