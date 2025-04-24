/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */



// import { IEstTotalDetail2CostTypeEntity } from './est-total-detail-2cost-type.interface';
// import { IEstResourceEntity } from './est-resource-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';



export interface IEstCostTypeEntity extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

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
