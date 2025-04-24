/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICostCodeNewEntity } from './cost-code-new-entity.interface';
import { ICostCodeEntity } from '@libs/basics/costcodes';
import { IPpsCostCodeEntity } from './pps-cost-code-entity.interface';

export interface ICostCodeNewEntityGenerated extends ICostCodeEntity {
	/*
	 * CostCodes
	 */
	CostCodes?: ICostCodeNewEntity[] | null;

	/*
	 * PpsCostCode
	 */
	PpsCostCode: IPpsCostCodeEntity;
}
