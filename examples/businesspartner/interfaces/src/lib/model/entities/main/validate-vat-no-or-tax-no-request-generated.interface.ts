/*
 * Copyright(c) RIB Software GmbH
 */

export interface IValidateVatNoOrTaxNoRequestGenerated {

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * CountryFk
   */
  CountryFk?: number | null;

  /**
   * IsEu
   */
  //IsEu: boolean; //TODO - genearted using DTO generator
  IsEu?: boolean;

  /**
   * IsFromBp
   */
  IsFromBp: boolean;

  /**
   * IsVatNoField
   */
  IsVatNoField: boolean;

  /**
   * MainItemId
   */
  MainItemId: number;

  /**
   * Value
   */
  Value?: string | null;
}
