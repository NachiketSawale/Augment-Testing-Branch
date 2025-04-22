/*
 * Copyright(c) RIB Software GmbH
 */

export interface IContractItemDetailApiEntityGenerated {

  /**
   * Currency
   */
  Currency?: string | null;

  /**
   * DateRequired
   */
  DateRequired?: string | null;

  /**
   * ItemId
   */
  ItemId: number;

  /**
   * ItemNumber
   */
  ItemNumber: number;

  /**
   * MaterialBlobId
   */
  MaterialBlobId?: number | null;

  /**
   * MaterialCode
   */
  MaterialCode?: string | null;

  /**
   * MaterialDescription
   */
  // MaterialDescription?: IDescriptionTranslateType | null;

  /**
   * MaterialId
   */
  MaterialId: number;

  /**
   * OrderQuantity
   */
  OrderQuantity: number;

  /**
   * Price
   */
  Price: number;

  /**
   * RemainQuantity
   */
  RemainQuantity: number;

  /**
   * Total
   */
  Total: number;

  /**
   * UOM
   */
  UOM?: string | null;
}
