/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstTotalDetail2CostTypeEntity } from './est-total-detail-2cost-type-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IEstResourceEntity } from './estimate-resource-base-entity.interface';

export interface IEstCosttypeEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstResourceEntities
 */
  EstResourceEntities?: IEstResourceEntity[] | null;

/*
 * EstTotalDetail2CostTypeEntities
 */
  EstTotalDetail2CostTypeEntities?: IEstTotalDetail2CostTypeEntity[] | null;

/*
 * Id
 */
  Id: number;

/*
 * Isdefault
 */
  Isdefault?: boolean | null;

/*
 * Islive
 */
  Islive?: boolean | null;

/*
 * MdcContextFk
 */
  MdcContextFk?: number | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * Typicalcode
 */
  Typicalcode?: string | null;
}
