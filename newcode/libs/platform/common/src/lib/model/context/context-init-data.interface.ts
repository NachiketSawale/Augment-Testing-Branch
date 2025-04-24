/*
 * Copyright(c) RIB Software GmbH
 */

import { ICheckCompanyResponse } from '../company-role/check-company-response.interface';

/***
 * Data emitted after successful context switch
 */
export interface IContextData {
	/***
	 * The company validity check response
	 */
	checkCompanyResponse: ICheckCompanyResponse;

	/***
	 * Logged in user id
	 */
	userId: number;

	/***
	 * Current culture
	 */
	culture: string;

	/***
	 * Current ui language
	 */
	language: string;

	/***
	 * Current data language id
	 */
	dataLanguageId: number;
}