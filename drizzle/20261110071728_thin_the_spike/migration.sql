CREATE TABLE [user_roles] (
	[user_id] bigint,
	[role_code] varchar(20),
	[assigned_by] bigint,
	[assigned_at_utc] datetime2(0) NOT NULL CONSTRAINT [user_roles_assigned_at_utc_default] DEFAULT (SYSUTCDATETIME()),
	CONSTRAINT [user_roles_pkey] PRIMARY KEY([user_id],[role_code]),
	CONSTRAINT [user_roles_role_code_check] CHECK ([user_roles].[role_code] IN ('STAFF', 'TEACHER', 'COMMANDER', 'SYSTEM_ADMIN'))
);
--> statement-breakpoint
ALTER TABLE [Users] DROP CONSTRAINT [users_service_type_check];--> statement-breakpoint
ALTER TABLE [user_roles] ADD CONSTRAINT [user_roles_user_id_Users_user_id_fk] FOREIGN KEY ([user_id]) REFERENCES [Users]([user_id]);--> statement-breakpoint
ALTER TABLE [user_roles] ADD CONSTRAINT [user_roles_assigned_by_Users_user_id_fk] FOREIGN KEY ([assigned_by]) REFERENCES [Users]([user_id]);--> statement-breakpoint
ALTER TABLE [Users] ADD CONSTRAINT [users_service_type_check] CHECK ([Users].[service_type] IN ('Mandatory', 'Career'));