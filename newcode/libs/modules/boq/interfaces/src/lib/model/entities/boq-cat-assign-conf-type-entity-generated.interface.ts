/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqStructureEntity } from './boq-structure-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IBoqCatAssignConfEntity } from './boq-cat-assign-conf-entity.interface';

export interface IBoqCatAssignConfTypeEntityGenerated extends IEntityBase {

/*
 * BoqCatAssignEntity
 */
  BoqCatAssignEntity?: IBoqCatAssignConfEntity | null;

/*
 * BoqCatAssignFk
 */
  BoqCatAssignFk: number;

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

/*
 * IsDefault
 */
  IsDefault: boolean;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * LineitemcontextFk
 */
  LineitemcontextFk: number;
}
