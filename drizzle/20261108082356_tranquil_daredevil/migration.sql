CREATE TABLE [Users] (
	[user_id] bigint IDENTITY(1, 1),
	[username] nvarchar(80) NOT NULL,
	[password_hash] varchar(255) NOT NULL,
	[full_name] nvarchar(150) NOT NULL,
	[personal_number] varchar(7) NOT NULL,
	[email] varchar(254) NOT NULL,
	[phone] varchar(25) NOT NULL,
	[position_title] nvarchar(120) NOT NULL,
	[rank] nvarchar(50) NOT NULL,
	[service_type] varchar(20) NOT NULL,
	[is_active] bit NOT NULL,
	[created_at_utc] datetime2(0) NOT NULL,
	[updated_at_utc] datetime2(0) NOT NULL,
	CONSTRAINT [Users_pkey] PRIMARY KEY([user_id]),
	CONSTRAINT [Users_username_key] UNIQUE([username]),
	CONSTRAINT [Users_personal_number_key] UNIQUE([personal_number]),
	CONSTRAINT [users_service_type_check] CHECK ([Users].[service_type] IN ('MANDATORY', 'Career')),
	CONSTRAINT [users_phone_check] CHECK ([Users].[phone] NOT LIKE '%[^0-9]%'
          AND LEN([Users].[phone]) = 10),
	CONSTRAINT [users_email_check] CHECK ([Users].[email] LIKE '%_@_%._%')
);
