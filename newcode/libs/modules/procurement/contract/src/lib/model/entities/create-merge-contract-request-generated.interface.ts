/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICreateMergeContractRequestGenerated {

  /**
   * HasChangeOrder
   */
  HasChangeOrder: boolean;

  /**
   * QtnHeaderIds
   */
  QtnHeaderIds?: number[] | null;

  /**
   * ReqHeaderIds
   */
  ReqHeaderIds?: number[] | null;

  /**
   * Wizards
   */
  Wizards: 'CopyRequisition' | 'CreateRequestForQuote' | 'CreateQuote' | 'IncreaseVersion' | 'CreateContract' | 'PriceComparsion_Save' | 'CopyForPes' | 'CreatePesForQto' | 'CreateRequisition' | 'CreateContractFromItem' | 'CreateContractFromBoq' | 'CopyBoq' | 'ResetBoqQuantity' | 'ResetBoqUnitRate' | 'ResetBoqQuantityUnitRate' | 'CopyItemFromPackageToQuote' | 'CreateContractOnPackage' | 'CreateItemWithResetPrices' | 'CreateItemWithoutResetPrices' | 'IncreaseVersionWithoutQuoteData' | 'CreateChangeOrderRequisition' | 'CreateChangeOrderContractOnPackage' | 'CreateContractFromQuote' | 'CreateContractFromPriceComparison';
}
