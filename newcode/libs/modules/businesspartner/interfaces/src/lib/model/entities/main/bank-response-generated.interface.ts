/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasBankEntity } from './bas-bank-entity.interface';
import { IBankStatusEntity } from './bank-status-entity.interface';
import { IBankEntity } from './bank-entity.interface';

export interface IBankResponseGenerated {

  /**
   * Bank
   */
  Bank?: IBasBankEntity[] | null;

  /**
   * BpdBankStatus
   */
  BpdBankStatus?: IBankStatusEntity[] | null;

  /**
   * Main
   */
  Main?: IBankEntity[] | null;
}
