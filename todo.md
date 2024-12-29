### TODO
❗: Minimum required functionality  
⚠️: Priority  
👍: Nice to have  
❔: Ideas which I probably will never implement


- Transactions
    - ❗ Add split button to split transaction
    - ⚠️ Edit transaction
    - 👍 Error handling for reading transactions from source to check type of Dates/Numbers/strings/etc


- Sources
    - ⚠️ Make add source look nice
    - 👍 Last time source was updated

- Categories
    - ⚠️ Make look nice
    - 👍 Edit category names

- Rules
    - ❗ Date picker
    - ⚠️ transactions that the rule would affect preview in create rule
    - 👍 Rule grid filters
    - 👍 no duplicate rules
    - 👍 Rules which only execute once sorted/executed first
    - 👍 add scroll bar/ fix many tests/ops out of bounds
    - ❔ binsearch on dates for single execute rules (need to sort by date first)
    - ❔ split rule into percentages
    - ❔ Less/greater than for numbers
    - ❔ Less/greater than for dates
    - ❔ case sensitive equals/substring

- Analytics
    - Single time period analytics by category
        - Types
            - ❗ bar graph split
            - 👍 pie graph
            - 👍 Table
        - ❗ period selector
        - period types
            - ⚠️ custom date range
    - Spending over time
        - ⚠️ Table
        - ⚠️ bar chart stacked
        - ⚠️ bar graph split
    - ⚠️ Color coding for categories
    - ⚠️ Fix yearly displaying month
    - ⚠️ lifetime should not display x axis tick for time
    - ⚠️ Fix error when no categories
    - ⚠️ swap so graph is present first, disable options based on that
    - ❔ Better way to display categories

- Misc
    - ⚠️ Fix memory leak, remove listeners when unused
    - 👍 Clean up unused comments
    - 👍 Fix indent in index.ts
    - 👍 clean up unused imports
    - 👍 exporting rules/categories
    - ❔ Templates for sources