# important!:
# run this command every time you pull changes to sync the sql server schemas:
# npx drizzle-kit migrate

# issues you may have in sql server SSMS:

# If a query shows red squiggles under the new table names but still runs, that's just autocomplete being out of date. Ctrl+Shift+R refreshes it.
# If you still dont see the databases: In Object Explorer, expand Databases → NameOfDb, right-click the Tables folder itself, and choose Refresh.