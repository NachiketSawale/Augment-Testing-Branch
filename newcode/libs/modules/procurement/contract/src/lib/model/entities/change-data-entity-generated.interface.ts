/*
 * Copyright(c) RIB Software GmbH
 */

import { IChangeItemsEntity } from './change-items-entity.interface';

export interface IChangeDataEntityGenerated {

  /**
   * ChangeItemsDtos
   */
  ChangeItemsDtos?: IChangeItemsEntity[] | null;

  /**
   * ContractId
   */
  ContractId: number;
}
