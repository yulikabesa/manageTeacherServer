CREATE TABLE [teacher_applications] (
	[application_id] bigint IDENTITY(1, 1),
	[user_id] bigint NOT NULL,
	[status] varchar(20) NOT NULL CONSTRAINT [teacher_applications_status_default] DEFAULT ('PENDING'),
	[requested_at_utc] datetime2(0) NOT NULL CONSTRAINT [teacher_applications_requested_at_utc_default] DEFAULT (SYSUTCDATETIME()),
	[reviewed_by] bigint,
	[reviewed_at_utc] datetime2(0),
	[review_notes] nvarchar(1000),
	CONSTRAINT [teacher_applications_pkey] PRIMARY KEY([application_id]),
	CONSTRAINT [teacher_applications_user_id_key] UNIQUE([user_id]),
	CONSTRAINT [teacher_applications_status_check] CHECK ([teacher_applications].[status] IN ('PENDING', 'APPROVED', 'REJECTED')),
	CONSTRAINT [teacher_applications_review_check] CHECK (
        (
          [teacher_applications].[status] = 'PENDING'
          AND [teacher_applications].[reviewed_by] IS NULL
          AND [teacher_applications].[reviewed_at_utc] IS NULL
        )
        OR
        (
          [teacher_applications].[status] IN ('APPROVED', 'REJECTED')
          AND [teacher_applications].[reviewed_by] IS NOT NULL
          AND [teacher_applications].[reviewed_at_utc] IS NOT NULL
        )
      )
);
--> statement-breakpoint
ALTER TABLE [teacher_applications] ADD CONSTRAINT [teacher_applications_user_id_Users_user_id_fk] FOREIGN KEY ([user_id]) REFERENCES [Users]([user_id]);--> statement-breakpoint
ALTER TABLE [teacher_applications] ADD CONSTRAINT [teacher_applications_reviewed_by_Users_user_id_fk] FOREIGN KEY ([reviewed_by]) REFERENCES [Users]([user_id]);