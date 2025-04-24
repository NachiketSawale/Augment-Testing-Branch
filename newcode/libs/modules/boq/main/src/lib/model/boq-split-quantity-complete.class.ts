/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IBoqSplitQuantityEntity } from '@libs/boq/interfaces';

export class BoqSplitQuantityComplete implements CompleteIdentification<IBoqSplitQuantityEntity>{

 /*
  * BoqSplitQuantity
  */
  public BoqSplitQuantity?: IBoqSplitQuantityEntity | null;

 /*
  * CostGroupToDelete
  */
  //public CostGroupToDelete?: IMainItem2CostGroupEntity[] | null = [];

 /*
  * CostGroupToSave
  */
  //public CostGroupToSave?: IMainItem2CostGroupEntity[] | null = [];

 /*
  * EntitiesCount
  */
  public EntitiesCount?: number | null = 10;

 /*
  * MainItemId
  */
  public MainItemId?: number | null = 10;
}
