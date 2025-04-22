/*
 * Copyright(c) RIB Software GmbH
 */

export interface IContractDetailApiEntityGenerated {

  /**
   * BillToAddress
   */
  BillToAddress?: string | null;

  /**
   * BusinessPartnerName
   */
  BusinessPartnerName?: string | null;

  /**
   * Buyer
   */
  Buyer?: string | null;

  /**
   * BuyerContractInfo
   */
  BuyerContractInfo?: string | null;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * CompanyAddress
   */
  CompanyAddress?: string | null;

  /**
   * FiPaymentTerms
   */
  // FiPaymentTerms?: IDescriptionTranslateType | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Incoterms
   */
  // Incoterms?: IDescriptionTranslateType | null;

  /**
   * OrderedDate
   */
  OrderedDate: string;

  /**
   * PaPaymentTerms
   */
  // PaPaymentTerms?: IDescriptionTranslateType | null;

  /**
   * ShipToAddress
   */
  ShipToAddress?: string | null;
}
