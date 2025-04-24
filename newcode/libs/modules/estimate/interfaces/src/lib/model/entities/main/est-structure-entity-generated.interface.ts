/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstStructureDetailEntity } from './est-structure-detail-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstStructureEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstStructureDetailEntities
 */
  EstStructureDetailEntities?: IEstStructureDetailEntity[] | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
