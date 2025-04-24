/*
 * Copyright(c) RIB Software GmbH
 */

import { IPlannedAbsenceEntity } from './planned-absence-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class PlannedAbsenceComplete implements CompleteIdentification<IPlannedAbsenceEntity>{

  /**
   * CostGroupToDelete
   */
  //public CostGroupToDelete?: IMainItem2CostGroupEntity[] | null = [];

  /**
   * CostGroupToSave
   */
  //public CostGroupToSave?: IMainItem2CostGroupEntity[] | null = [];

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * PlannedAbsences
   */
  public PlannedAbsences?: IPlannedAbsenceEntity | null = null;
}
