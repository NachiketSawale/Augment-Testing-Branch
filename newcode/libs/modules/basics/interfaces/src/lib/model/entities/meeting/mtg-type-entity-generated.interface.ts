/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMtgHeaderEntity } from './mtg-header-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IMtgTypeEntityGenerated extends IEntityBase {

/*
 * BasRubricCategoryFk
 */
  BasRubricCategoryFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * MtgHeaderEntities
 */
  MtgHeaderEntities?: IMtgHeaderEntity[] | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
