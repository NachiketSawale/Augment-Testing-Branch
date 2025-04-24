/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcCheckChangeResult } from '@libs/procurement/common';

export interface ConCheckChangeResult extends IPrcCheckChangeResult {
	FileName: string;
	CoNo?: number;
}
