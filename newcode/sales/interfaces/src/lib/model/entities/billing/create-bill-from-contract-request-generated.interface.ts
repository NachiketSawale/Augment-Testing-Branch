/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICreateBillFromContractRequestGenerated {

  /**
   * billNo
   */
  billNo?: string | null;

  /**
   * configurationId
   */
  configurationId?: number | null;

  /**
   * contractId
   */
  contractId: number;

  /**
   * description
   */
  description?: string | null;

  /**
   * previousBillId
   */
  previousBillId: number;

  /**
   * typeId
   */
  typeId: number;

  /**
   * useTransferContractQuantityOpt
   */
  useTransferContractQuantityOpt: boolean;
}
