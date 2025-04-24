/*
 * Copyright(c) RIB Software GmbH
 */

import { IShiftEntity } from './shift-entity.interface';

export interface IShiftActionEntityGenerated {

  /**
   * Action
   */
  Action: number;

  /**
   * Shifts
   */
  Shifts?: IShiftEntity[] | null;
}
