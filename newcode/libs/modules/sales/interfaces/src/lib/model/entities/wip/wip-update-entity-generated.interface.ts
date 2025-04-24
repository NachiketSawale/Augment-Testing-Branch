/*
 * Copyright(c) RIB Software GmbH
 */

export interface IWipUpdateEntityGenerated {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * ConfigurationId
   */
  ConfigurationId?: number | null;

  /**
   * ContractId
   */
  ContractId: number;

  /**
   * ContractIds
   */
  ContractIds?: number[] | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * IncludeMainContract
   */
  IncludeMainContract: boolean;

  /**
   * IsCollectiveWip
   */
  IsCollectiveWip: boolean;

  /**
   * RubricCategoryId
   */
  RubricCategoryId: number;

  /**
   * SideContractIds
   */
  SideContractIds?: number[] | null;

  /**
   * WipHeaderFk
   */
  WipHeaderFk: number;
}
