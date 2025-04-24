/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqCatAssignDetailEntity } from './boq-cat-assign-detail-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IBoqCatalogEntityGenerated extends IEntityBase {

/*
 * AssignedCol
 */
  AssignedCol?: string | null;

/*
 * BoqCatAssignDetailEntities
 */
  BoqCatAssignDetailEntities?: IBoqCatAssignDetailEntity[] | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * HasProjectRef
 */
  HasProjectRef: boolean;

/*
 * Id
 */
  Id: number;

/*
 * Islive
 */
  Islive: boolean;

/*
 * Sorting
 */
  Sorting: number;
}
