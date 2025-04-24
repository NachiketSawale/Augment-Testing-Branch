/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IBasicsBim360SourceProjectEntity {
	id: string;
	account_id?: string;
	name?: string;
	start_date?: string | null;
	end_date?: string | null;
	value?: string | null;
	currency?: string | null;
	status?: string;
	job_number?: string | null;
	address_line_1?: string | null;
	address_line_2?: string | null;
	city?: string | null;
	state_or_province?: string | null;
	postal_code?: string | null;
	country?: string | null;
	business_unit_id?: string | null;
	created_at?: string;
	updated_at?: string;
	project_type?: string;
	timezone?: string | null;
	language?: string;
	construction_type?: string | null;
	contract_type?: { key: string; value: string } | null;
	last_sign_in?: string | null;
	service_types?: string;
}
