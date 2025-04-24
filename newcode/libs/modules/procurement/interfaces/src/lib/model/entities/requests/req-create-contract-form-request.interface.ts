/*
 * Copyright(c) RIB Software GmbH
 */

import { IReqVariant4ContractCreation } from './req-variant4-contract-creation.interface';

export interface IReqCreateContractFormReqRequest {

  /**
   * businessPartnerFk
   */
  businessPartnerFk?: number | null;

  /**
   * contactFk
   */
  contactFk?: number | null;

  /**
   * isFromVariants
   */
  isFromVariants: boolean;

  /**
   * reqHeaderFk
   */
  reqHeaderFk: number;

  /**
   * subsidiaryFk
   */
  subsidiaryFk?: number | null;

  /**
   * supplierFk
   */
  supplierFk?: number | null;

  /**
   * variants
   */
  variants?: IReqVariant4ContractCreation[] | null;
}
