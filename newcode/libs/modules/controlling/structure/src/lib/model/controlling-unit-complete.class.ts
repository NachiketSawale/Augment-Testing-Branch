/*
 * Copyright(c) RIB Software GmbH
 */

import { IControllingUnitGroupEntity } from './entities/controlling-unit-group-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';
import { IControllingUnitEntity } from './models';

export class ControllingUnitComplete implements CompleteIdentification<IControllingUnitEntity>{

 /*
  * ControllingUnitGroupsToDelete
  */
  public ControllingUnitGroupsToDelete?: IControllingUnitGroupEntity[] | null = [];

 /*
  * ControllingUnitGroupsToSave
  */
  public ControllingUnitGroupsToSave?: IControllingUnitGroupEntity[] | null = [];

 /*
  * ControllingUnits
  */
  public ControllingUnits?: IControllingUnitEntity[] | null = [];
 /*
  * EntitiesCount
  */
  public EntitiesCount?: number | null = 10;

 /*
  * MainItemId
  */
  public MainItemId?: number | null = 10;
}
