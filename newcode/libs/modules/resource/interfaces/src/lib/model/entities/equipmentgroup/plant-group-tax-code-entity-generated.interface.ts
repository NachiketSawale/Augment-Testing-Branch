/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IPlantGroupTaxCodeEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantGroupFk: number;
	 LedgerContextFk: number;
	 TaxCodeFk: number;
}