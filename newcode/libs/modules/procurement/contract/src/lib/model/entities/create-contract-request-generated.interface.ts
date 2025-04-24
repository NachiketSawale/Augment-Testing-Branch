/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICreateContractRequestGenerated {

  /**
   * IsFilterEvaluated
   */
  IsFilterEvaluated: 'FilterEvaluated' | 'FilterEvaluatedWithoutPriceOrRate' | 'FilterEvaluatedWithPriceOrRate';

  /**
   * QtnHeaderId
   */
  QtnHeaderId: number;

  /**
   * ReqHeaderIds
   */
  ReqHeaderIds?: number[] | null;

  /**
   * Wizards
   */
  Wizards: 'CopyRequisition' | 'CreateRequestForQuote' | 'CreateQuote' | 'IncreaseVersion' | 'CreateContract' | 'PriceComparsion_Save' | 'CopyForPes' | 'CreatePesForQto' | 'CreateRequisition' | 'CreateContractFromItem' | 'CreateContractFromBoq' | 'CopyBoq' | 'ResetBoqQuantity' | 'ResetBoqUnitRate' | 'ResetBoqQuantityUnitRate' | 'CopyItemFromPackageToQuote' | 'CreateContractOnPackage' | 'CreateItemWithResetPrices' | 'CreateItemWithoutResetPrices' | 'IncreaseVersionWithoutQuoteData' | 'CreateChangeOrderRequisition' | 'CreateChangeOrderContractOnPackage' | 'CreateContractFromQuote' | 'CreateContractFromPriceComparison';
}
