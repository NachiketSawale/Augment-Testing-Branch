/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBasicsEfbsheetsEntity } from './basics-efbsheets-entity.interface';

export interface IPrjCrewMix2CostCodeEntityGenerated extends IEntityBase {

/*
 * EstCrewMixEntity
 */
  EstCrewMixEntity?: IBasicsEfbsheetsEntity | null;

/*
 * EstCrewMixFk
 */
  EstCrewMixFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;
}
