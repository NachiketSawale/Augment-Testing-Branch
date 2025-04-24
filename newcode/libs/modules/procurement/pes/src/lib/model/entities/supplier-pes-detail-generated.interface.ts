/*
 * Copyright(c) RIB Software GmbH
 */

import { ISupplierPesItem } from './supplier-pes-item.interface';

export interface ISupplierPesDetailGenerated {

  /**
   * CarrierCode
   */
  CarrierCode?: string | null;

  /**
   * CarrierName
   */
  CarrierName?: string | null;

  /**
   * ContractCode
   */
  ContractCode?: string | null;

  /**
   * ContractExternalCode
   */
  ContractExternalCode?: string | null;

  /**
   * CustomerCompanyCode
   */
  CustomerCompanyCode?: string | null;

  /**
   * CustomerCompanyName
   */
  CustomerCompanyName?: string | null;

  /**
   * Items
   */
  Items?: ISupplierPesItem[] | null;

  /**
   * PesCode
   */
  PesCode?: string | null;

  /**
   * TrackingNumber
   */
  TrackingNumber?: string | null;
}
