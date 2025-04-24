/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqCatAssignConfTypeEntity } from './boq-cat-assign-conf-type-entity.interface';
import { IBoqCatAssignDetailEntity } from './boq-cat-assign-detail-entity.interface';
import { IBoqStructureEntity } from './boq-structure-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IBoqCatAssignConfEntityGenerated extends IEntityBase {

/*
 * BoqCatAssignConftypeEntities
 */
  BoqCatAssignConftypeEntities?: IBoqCatAssignConfTypeEntity[] | null;

/*
 * BoqCatAssignDetailEntities
 */
  BoqCatAssignDetailEntities?: IBoqCatAssignDetailEntity[] | null;

/*
 * BoqStructureEntities
 */
  BoqStructureEntities?: IBoqStructureEntity[] | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;
}
