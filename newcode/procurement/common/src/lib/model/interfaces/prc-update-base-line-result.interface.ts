/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementBaseLineUpdateCode } from '../enums/procurement-base-line-update-code.enum';

export interface IPrcUpdateBaseLineResult {
	ResultCode: ProcurementBaseLineUpdateCode;
	Message: string;
	OutputPath: string;
}