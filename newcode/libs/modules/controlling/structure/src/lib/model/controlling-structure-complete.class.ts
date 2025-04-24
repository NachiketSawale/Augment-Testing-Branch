/*
 * Copyright(c) RIB Software GmbH
 */

import { IBisPrjHistoryEntity } from './entities/bis-prj-history-entity.interface';
import { IControllingUnitEntity } from './entities/controlling-unit-entity.interface';
import { ControllingUnitComplete } from './controlling-unit-complete.class';

import { CompleteIdentification } from '@libs/platform/common';

export class ControllingStructureComplete implements CompleteIdentification<IControllingUnitEntity>{

 /*
  * BisPrjHistoryToDelete
  */
  public BisPrjHistoryToDelete?: IBisPrjHistoryEntity[] | null = [];

 /*
  * ControllingUnitsToDelete
  */
  public ControllingUnitsToDelete?: IControllingUnitEntity[] | null = [];

 /*
  * ControllingUnitsToSave
  */
  public ControllingUnitsToSave?: ControllingUnitComplete[] | null = [];

 /*
  * EntitiesCount
  */
  public EntitiesCount?: number | null = 10;

 /*
  * IsCheckRootLevelRestrictionDisabled
  */
  public IsCheckRootLevelRestrictionDisabled?: boolean | null = true;

 /*
  * MainItemId
  */
  public MainItemId?: number | null = 10;
}
