/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IBasicsBim360SourceUserEntity {
	id: string;
	email?: string;
	name?: string;
	nickname?: string;
	first_name?: string;
	last_name?: string;
	uid?: string;
	image_url?: string;
	address_line_1?: string;
	address_line_2?: string;
	city?: string;
	postal_code?: string;
	state_or_province?: string;
	country?: string;
	phone?: string | null;
	company?: string | null;
	job_title?: string | null;
	industry?: string | null;
	about_me?: string | null;
	created_at?: string;
	updated_at?: string;
	account_id?: string;
	role?: string;
	status?: string;
	company_id?: string;
	company_name?: string;
	last_sign_in?: string;
	default_role?: string;
	default_role_id?: string;
	access_level?: string;
}
