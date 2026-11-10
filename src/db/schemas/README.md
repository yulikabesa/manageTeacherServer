<!-- SQL EXPLAINATION! -->

Constraints

PRIMARY KEY – Uniquely identifies each row. Can consist of multiple columns (composite primary key).
FOREIGN KEY(.references()) – Creates a relationship between tables and ensures referenced records exist.
UNIQUE – Prevents duplicate values in a column or combination of columns.
NOT NULL – Ensures a column must always have a value.
CHECK – Restricts the allowed values according to a condition.

Data Types

IDENTITY – Automatically generates incrementing numeric IDs.
BIT – Stores Boolean-like values: 1 (true) or 0 (false).
BIGINT – Stores large integer values.
VARCHAR(n) – Stores variable-length strings up to n characters.
DATETIME2 – Stores date and time values with configurable fractional-second precision.

Additional Options

precision: 0 – Stores datetime values without fractional seconds.
DEFAULT – Sets a default value when one isn't provided during insertion.
SYSUTCDATETIME() – Returns the current UTC date and time (commonly used for timestamp defaults).
