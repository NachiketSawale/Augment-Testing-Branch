/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface IPpsQuantityMappingEntityGenerated extends IEntityBase {
  Id: number;
  PlannedQuantityFk: number;
  ProductDescriptionFk: number;
  Quantity: number;
}
