/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IBasicsBim360CreateProjectEntity {
	name: string | null;
	service_types: string | null;
	start_date?: string | null;
	end_date?: string | null;
	project_type: string | null;
	value: string | null;
	currency?: string | null;

	job_number: string | null;

	address_line_1?: string | null;
	city?: string | null;
	state_or_province?: string | null;
	postal_code?: string | null;

	country?: string | null;
	language: string | null;
	contract_type?: { key: string; value: string } | null;

	template_project_id?: string | null;
}

export interface IBasicsBim360CreateProjectUserEntity {
	company_id?: string;
	email?: string;
	role?: string;
	uid?: string;
	service_type: string | null;
}
