/*
 * Copyright(c) RIB Software GmbH
 */

import { IEmployeeDefaultEntity } from './employee-default-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class EmployeeDefaultComplete implements CompleteIdentification<IEmployeeDefaultEntity>{

  /**
   * CostGroupToDelete
   */
  //public CostGroupToDelete?: IMainItem2CostGroupEntity[] | null = [];

  /**
   * CostGroupToSave
   */
  //public CostGroupToSave?: IMainItem2CostGroupEntity[] | null = [];

  /**
   * Defaults
   */
  public Defaults?: IEmployeeDefaultEntity | null = null;

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;
}
