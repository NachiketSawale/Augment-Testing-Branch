/*
 * Copyright(c) RIB Software GmbH
 */

import { IUpdatePrcItemDetailApiEntity } from './update-prc-item-detail-api-entity.interface';

export interface IContractUpdateDetailApiEntityGenerated {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * CompanyId
   */
  CompanyId: number;

  /**
   * ConfirmDate
   */
  ConfirmDate?: string | null;

  /**
   * HeaderText
   */
  HeaderText?: string | null;

  /**
   * Items
   */
  Items?: IUpdatePrcItemDetailApiEntity[] | null;

  /**
   * Status
   */
  Status?: string | null;
}
