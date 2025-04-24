/*
 * Copyright(c) RIB Software GmbH
 */

export interface IContractTerminationParameterGenerated {

  /**
   * businessPartnerFk
   */
  businessPartnerFk?: number | null;

  /**
   * conHeaderFk
   */
  conHeaderFk: number;

  /**
   * contactFk
   */
  contactFk?: number | null;

  /**
   * projectChangeFk
   */
  projectChangeFk?: number | null;

  /**
   * subsidiaryFk
   */
  subsidiaryFk?: number | null;

  /**
   * supplierFk
   */
  supplierFk?: number | null;

  /**
   * terminateContractAs
   */
  terminateContractAs: number;
}
