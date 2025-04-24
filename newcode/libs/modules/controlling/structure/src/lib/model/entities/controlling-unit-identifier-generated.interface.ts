/*
 * Copyright(c) RIB Software GmbH
 */

import { IControllingUnitEntity } from './controlling-unit-entity.interface';

export interface IControllingUnitIdentifierGenerated {

/*
 * ControllingUnitParent
 */
  ControllingUnitParent?: IControllingUnitEntity | null;

/*
 * ControllingUnitParentId
 */
  ControllingUnitParentId?: number | null;

/*
 * ProjectId
 */
  ProjectId?: number | null;
}
