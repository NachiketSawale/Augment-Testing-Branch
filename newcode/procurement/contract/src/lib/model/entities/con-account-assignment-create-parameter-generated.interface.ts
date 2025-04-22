/*
 * Copyright(c) RIB Software GmbH
 */

import { IConAccountAssignmentEntity } from './con-account-assignment-entity.interface';

export interface IConAccountAssignmentCreateParameterGenerated {

  /**
   * ConHeaderFk
   */
  ConHeaderFk: number;

  /**
   * CurrentDtos
   */
  CurrentDtos?: IConAccountAssignmentEntity[] | null;

  /**
   * ItemNO
   */
  ItemNO: number;
}
