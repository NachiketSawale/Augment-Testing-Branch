/*
 * Copyright(c) RIB Software GmbH
 */

import { IPesItemApiEntity } from './pes-item-api-entity.interface';

export interface IPesDetailApiEntityGenerated {

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
   * EstimatedDeliveryData
   */
  EstimatedDeliveryData: string;

  /**
   * PackinglistNumber
   */
  PackinglistNumber?: string | null;

  /**
   * PesCode
   */
  PesCode?: string | null;

  /**
   * PesId
   */
  PesId: number;

  /**
   * PesItemlist
   */
  PesItemlist?: IPesItemApiEntity[] | null;

  /**
   * PesStatusId
   */
  PesStatusId: number;

  /**
   * ProjectId
   */
  ProjectId?: number | null;

  /**
   * ProjectName
   */
  ProjectName?: string | null;

  /**
   * ShipmentNumber
   */
  ShipmentNumber?: string | null;

  /**
   * SupplierAddress
   */
  SupplierAddress?: string | null;

  /**
   * SupplierLogoId
   */
  SupplierLogoId?: number | null;

  /**
   * SupplierName
   */
  SupplierName?: string | null;

  /**
   * TrackingNumber
   */
  TrackingNumber?: string | null;
}
