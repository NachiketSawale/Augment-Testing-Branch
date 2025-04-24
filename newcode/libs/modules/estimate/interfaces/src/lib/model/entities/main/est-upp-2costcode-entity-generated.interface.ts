/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstUppConfigEntity } from './est-upp-config-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstUpp2CostcodeEntityGenerated extends IEntityBase {

/*
 * EstUppConfigEntity
 */
  EstUppConfigEntity?: IEstUppConfigEntity | null;

/*
 * EstUppConfigFk
 */
  EstUppConfigFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * LineType
 */
  LineType?: number | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;

/*
 * Project2MdcCstCdeFk
 */
  Project2MdcCstCdeFk?: number | null;

/*
 * UppId
 */
  UppId?: number | null;
}
