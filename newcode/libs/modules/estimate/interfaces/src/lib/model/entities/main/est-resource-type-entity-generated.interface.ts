/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IEstResourceEntity } from './estimate-resource-base-entity.interface';

export interface IEstResourceTypeEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstResourceEntities
 */
  EstResourceEntities?: IEstResourceEntity[] | null;

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
