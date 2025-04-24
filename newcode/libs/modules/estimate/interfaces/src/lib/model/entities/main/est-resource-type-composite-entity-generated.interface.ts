/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IEstResourceEntity } from './estimate-resource-base-entity.interface';

export interface IEstResourceTypeCompositeEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstAssemblyTypeFk
 */
  EstAssemblyTypeFk?: number | null;

/*
 * EstAssemblyTypeLogicFk
 */
  EstAssemblyTypeLogicFk?: number | null;

/*
 * EstResourceEntities
 */
  EstResourceEntities?: IEstResourceEntity[] | null;

/*
 * EstResourceTypeFk
 */
  EstResourceTypeFk?: number | null;

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
 * ShortKeyInfo
 */
  ShortKeyInfo?: IDescriptionInfo | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
