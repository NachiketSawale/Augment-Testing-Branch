/*
 * Copyright(c) RIB Software GmbH
 */

import { IPesItemDetailApiEntity } from './pes-item-detail-api-entity.interface';

export interface IPesHeaderDetailApiEntityGenerated {

  /**
   * CarrierCode
   */
  CarrierCode?: string | null;

  /**
   * CarrierName
   */
  CarrierName?: string | null;

  /**
   * CompanyId
   */
  CompanyId: number;

  /**
   * ContractId
   */
  ContractId: number;

  /**
   * ContractPrcHeaderId
   */
  ContractPrcHeaderId: number;

  /**
   * DeliveredDate
   */
  DeliveredDate: string;

  /**
   * PesItems
   */
  PesItems?: IPesItemDetailApiEntity[] | null;

  /**
   * PesStatus
   */
  PesStatus?: {[key: string]: boolean} | null;

  /**
   * PesStatusDescription
   */
  PesStatusDescription?: string | null;

  /**
   * TrackingNumber
   */
  TrackingNumber?: string | null;
}
