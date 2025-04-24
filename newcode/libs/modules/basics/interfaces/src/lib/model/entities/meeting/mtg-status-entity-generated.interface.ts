/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMtgHeaderEntity } from './mtg-header-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IMtgStatusEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Icon
 */
  Icon?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsCanceled
 */
  IsCanceled?: boolean | null;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * IsPublished
 */
  IsPublished?: boolean | null;

/*
 * IsReadonly
 */
  IsReadonly?: boolean | null;

/*
 * MtgHeaderEntities
 */
  MtgHeaderEntities?: IMtgHeaderEntity[] | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
