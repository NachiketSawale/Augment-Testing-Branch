/*
 * Copyright(c) RIB Software GmbH
 */

import { IScriptError } from '@libs/basics/common';

export interface IConstructionSystemCommonScriptErrorEntity extends IScriptError {
	Order?: number;
}
