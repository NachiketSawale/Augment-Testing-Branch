/*
 * Copyright(c) RIB Software GmbH
 */

import { UpdateCode } from '../enums/update-code.enum';

export interface IUpdateResult {
	ResultCode?: UpdateCode ;
	Message?: string ;
	OutputPath?: string ;
}
