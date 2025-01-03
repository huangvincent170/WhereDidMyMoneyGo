### TODO
❗: Minimum required functionality  
⚠️: Priority  
👍: Nice to have  
❔: Ideas which I probably will never implement


- Transactions
    - ⚠️ Edit/split forms not cleared on submit/close
    - 👍 Error handling for reading transactions from source to check type of Dates/Numbers/strings/etc
    - ❔ Options to show/hide columns in dropdown
    - ❔ Option to see deleted/split transactions
    - ❔ Option to hide uncategorized transactions
    - ❔ Move displayedtransactions into classes

- Sources
    - ⚠️ Last time source was updated
    - 👍 Editing sources
    - 👍 show user warning when trying to submit form with errors/missing fields

- Categories
    - 👍 Unselecting category needs to unselect children as well
    - ❔ Edit category names

- Rules
    - ⚠️ Rule form should cleare on close (but keep form data on submit)
    - ⚠️ warnings for if rule affects removed source/category, should not crash program
    - ⚠️ setRuleOp fieldValues inputs do not take up whole width
    - ⚠️ Editing Rule
    - 👍 no duplicate rules
    - 👍 Rules which only execute once executed first (after preprocess)
    - 👍 fields on add rule incorrect length
    - 👍 add delete op which sets category to deleted
        - preprocess
        - remove user set category to deleted
    - ❔ Transactions created from split should be able to be affected by other rules (assuming not locked)
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
    - ⚠️ Fix yearly displaying month
    - ⚠️ lifetime should not display x axis tick for time
    - ⚠️ Bar chart overflows y axis
    - ⚠️ Color coding for categories
    - ⚠️ Table totals for each month/category
    - 👍 short text month displayed on charts
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