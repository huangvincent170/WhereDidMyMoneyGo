### TODO
❗: Minimum required functionality  
⚠️: Priority  
👍: Nice to have  
❔: Ideas which I probably will never implement


- Transactions
    - ❗ split transaction
    - ❗ Edit transaction
    - ❗ disable options in dropdown depending on selection
    - ⚠️ transactions can only be set to split category once
    - 👍 Error handling for reading transactions from source to check type of Dates/Numbers/strings/etc
    - ❔ Option to see deleted/split transactions
    - ❔ Option to hide uncategorized transactions

- Sources
    - ⚠️ Last time source was updated
    - 👍 Editing sources

- Categories
    - ❔ Edit category names

- Rules
    - ❗ transactions that the rule would affect preview in create rule
    - ❗ canBeAffectedByOtherRules
        - set original transaction to deleted? or remove it from list
        - return it in addedTransactions
        - split rules are always !canBeAffectedByOtherRules
        - edit rules from the transaction page should be !canbeaffected by default
        - always executes first
    - ⚠️ Disable setting certain properties
    - ⚠️ warnings for if rule affects removed source/category
    - 👍 Editing Rule
    - 👍 Rule grid filters
    - 👍 transactions after rule has been executed preview window
    - 👍 no duplicate rules
    - 👍 Rules which only execute once executed first (after preprocess)
    - 👍 short text month displayed on charts
    - 👍 add delete op which sets category to deleted
        - preprocess
        - remove user set category to deleted
    - ❔ binsearch on dates for single execute rules (need to sort by date first)
    - ❔ split rule into percentages
    - ❔ Less/greater than for numbers
    - ❔ Less/greater than for dates
    - ❔ case sensitive equals/substring
    - ❔ Automatically set field op if only 1 possible option

- Analytics
    - Single time period analytics by category
        - Types
            - 👍 bar graph split
            - 👍 pie graph
    - ⚠️ Color coding for categories
    - ⚠️ Fix yearly displaying month
    - ⚠️ lifetime should not display x axis tick for time
    - ⚠️ Fix error when no categories
    - ⚠️ Bar chart overflows y axis
    - ⚠️ Table white box in horizontal scroll bar
    - ⚠️ Table totals for each month/category
    - ❔ Better way to display categories
    - ❔ Quarterly period

- Misc
    - ⚠️ Fix memory leak, remove listeners when unused
    - 👍 Clean up unused comments
    - 👍 clean up unused imports
    - 👍 exporting rules/categories
    - ❔ Templates for sources
    - ❔ Settings
        - Export/import in settings
        - word wrap for charts