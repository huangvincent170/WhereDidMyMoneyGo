### TODO
❗: Minimum required functionality  
⚠️: Priority  
👍: Nice to have  
❔: Ideas which I probably will never implement


- Transactions
    - ❗ add "delete" button to transaction to create rule
    - 👍 Error handling for reading transactions from source to check type of Dates/Numbers/strings/etc


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
    - ❗ Data mod rules, split rules, categorization rules
    - ❗ Split category works
    - ⚠️ Category selector
    - ⚠️ create rule popup looks nice
    - 👍 no duplicate rules
    - 👍 Rules which only execute once
    - 👍 binsearch on dates for single execute rules (need to sort by date first)
    - 👍 transactions that the rule would affect preview in create rule
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