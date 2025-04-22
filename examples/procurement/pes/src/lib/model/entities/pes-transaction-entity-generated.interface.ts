/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPesTransactionEntityGenerated extends IEntityBase {

  /**
   * AddressEntity
   */
  // AddressEntity?: IAddressEntity | null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * Amount
   */
  Amount: number;

  /**
   * AmountOc
   */
  AmountOc: number;

  /**
   * Code
   */
  Code: string;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyInvoiceFk
   */
  CompanyInvoiceFk: number;

  /**
   * ConHeaderFk
   */
  ConHeaderFk: number;

  /**
   * ControllingUnitAssign01
   */
  ControllingUnitAssign01?: string | null;

  /**
   * ControllingUnitAssign02
   */
  ControllingUnitAssign02?: string | null;

  /**
   * ControllingUnitAssign03
   */
  ControllingUnitAssign03?: string | null;

  /**
   * ControllingUnitAssign04
   */
  ControllingUnitAssign04?: string | null;

  /**
   * ControllingUnitAssign05
   */
  ControllingUnitAssign05?: string | null;

  /**
   * ControllingUnitAssign06
   */
  ControllingUnitAssign06?: string | null;

  /**
   * ControllingUnitAssign07
   */
  ControllingUnitAssign07?: string | null;

  /**
   * ControllingUnitAssign08
   */
  ControllingUnitAssign08?: string | null;

  /**
   * ControllingUnitAssign09
   */
  ControllingUnitAssign09?: string | null;

  /**
   * ControllingUnitAssign10
   */
  ControllingUnitAssign10?: string | null;

  /**
   * ControllingUnitCode
   */
  ControllingUnitCode: string;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk: number;

  /**
   * ControllingunitAssign01Comment
   */
  ControllingunitAssign01Comment?: string | null;

  /**
   * ControllingunitAssign01desc
   */
  ControllingunitAssign01desc?: string | null;

  /**
   * ControllingunitAssign02Comment
   */
  ControllingunitAssign02Comment?: string | null;

  /**
   * ControllingunitAssign02desc
   */
  ControllingunitAssign02desc?: string | null;

  /**
   * ControllingunitAssign03Comment
   */
  ControllingunitAssign03Comment?: string | null;

  /**
   * ControllingunitAssign03desc
   */
  ControllingunitAssign03desc?: string | null;

  /**
   * ControllingunitAssign04Comment
   */
  ControllingunitAssign04Comment?: string | null;

  /**
   * ControllingunitAssign04desc
   */
  ControllingunitAssign04desc?: string | null;

  /**
   * ControllingunitAssign05Comment
   */
  ControllingunitAssign05Comment?: string | null;

  /**
   * ControllingunitAssign05desc
   */
  ControllingunitAssign05desc?: string | null;

  /**
   * ControllingunitAssign06Comment
   */
  ControllingunitAssign06Comment?: string | null;

  /**
   * ControllingunitAssign06desc
   */
  ControllingunitAssign06desc?: string | null;

  /**
   * ControllingunitAssign07Comment
   */
  ControllingunitAssign07Comment?: string | null;

  /**
   * ControllingunitAssign07desc
   */
  ControllingunitAssign07desc?: string | null;

  /**
   * ControllingunitAssign08Comment
   */
  ControllingunitAssign08Comment?: string | null;

  /**
   * ControllingunitAssign08desc
   */
  ControllingunitAssign08desc?: string | null;

  /**
   * ControllingunitAssign09Comment
   */
  ControllingunitAssign09Comment?: string | null;

  /**
   * ControllingunitAssign09desc
   */
  ControllingunitAssign09desc?: string | null;

  /**
   * ControllingunitAssign10Comment
   */
  ControllingunitAssign10Comment?: string | null;

  /**
   * ControllingunitAssign10desc
   */
  ControllingunitAssign10desc?: string | null;

  /**
   * Currency
   */
  Currency: string;

  /**
   * DateDelivered
   */
  DateDelivered?: string | null;

  /**
   * DateDeliveredfrom
   */
  DateDeliveredfrom?: string | null;

  /**
   * DateDocument
   */
  DateDocument?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * HandoverId
   */
  HandoverId?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IncAmount
   */
  IncAmount: number;

  /**
   * IncAmountOc
   */
  IncAmountOc: number;

  /**
   * IncQuantity
   */
  IncQuantity: number;

  /**
   * IncVatAmount
   */
  IncVatAmount: number;

  /**
   * IncVatAmountOc
   */
  IncVatAmountOc: number;

  /**
   * Incoterm
   */
  Incoterm?: string | null;

  /**
   * IncotermCode
   */
  IncotermCode?: string | null;

  /**
   * IsSuccess
   */
  IsSuccess: boolean;

  /**
   * Ischange
   */
  Ischange: boolean;

  /**
   * Isconsolidated
   */
  Isconsolidated: boolean;

  /**
   * ItemDescription1
   */
  ItemDescription1?: string | null;

  /**
   * ItemDescription2
   */
  ItemDescription2?: string | null;

  /**
   * ItemReference
   */
  ItemReference: number;

  /**
   * ItemSpecification
   */
  ItemSpecification?: string | null;

  /**
   * ItemUomQuantity
   */
  ItemUomQuantity?: string | null;

  /**
   * MaterialFk
   */
  MaterialFk?: number | null;

  /**
   * NominalAccount
   */
  NominalAccount?: string | null;

  /**
   * NominalDimension1
   */
  NominalDimension1?: string | null;

  /**
   * NominalDimension2
   */
  NominalDimension2?: string | null;

  /**
   * NominalDimension3
   */
  NominalDimension3?: string | null;

  /**
   * PesHeaderCode
   */
  PesHeaderCode?: string | null;

  /**
   * PesHeaderDesc
   */
  PesHeaderDesc?: string | null;

  /**
   * PesHeaderFk
   */
  PesHeaderFk: number;

  /**
   * PesItemDesc
   */
  PesItemDesc?: string | null;

  /**
   * PesItemFk
   */
  PesItemFk?: number | null;

  /**
   * PesNo
   */
  PesNo?: string | null;

  /**
   * PesStatusFk
   */
  PesStatusFk: number;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk: number;

  /**
   * PrcItemFk
   */
  PrcItemFk?: number | null;

  /**
   * Price
   */
  Price: number;

  /**
   * PriceOc
   */
  PriceOc: number;

  /**
   * PrjStockFk
   */
  PrjStockFk?: number | null;

  /**
   * PrjStockLocationFk
   */
  PrjStockLocationFk?: number | null;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * ReturnValue
   */
  ReturnValue?: string | null;

  /**
   * TaxCodeFk
   */
  TaxCodeFk: number;

  /**
   * TaxCodeMatrixCode
   */
  TaxCodeMatrixCode?: string | null;

  /**
   * TaxCodeMatrixFk
   */
  TaxCodeMatrixFk?: number | null;

  /**
   * TransactionId
   */
  TransactionId: number;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * VatAmount
   */
  VatAmount: number;

  /**
   * VatAmountOc
   */
  VatAmountOc: number;

  /**
   * VatCode
   */
  VatCode?: string | null;

  /**
   * VatGroupFk
   */
  VatGroupFk: number;

  /**
   * VatPercent
   */
  VatPercent: number;

  /**
   * VatPrice
   */
  VatPrice: number;

  /**
   * VatPriceOc
   */
  VatPriceOc: number;
}
