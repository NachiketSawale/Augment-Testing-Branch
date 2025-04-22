/*
 * Copyright(c) RIB Software GmbH
 */

export interface IInfoGenerated {

  /**
   * BusinessPartner
   */
  BusinessPartner?: string | null;

  /**
   * CompanyAddress
   */
  CompanyAddress?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Incoterm
   */
  Incoterm?: string | null;

  /**
   * PaymentTermFi
   */
  PaymentTermFi?: string | null;

  /**
   * PaymentTermPa
   */
  PaymentTermPa?: string | null;

  /**
   * billingAddress
   */
  billingAddress?: string | null;

  /**
   * buyerEmail
   */
  buyerEmail?: string | null;

  /**
   * purchaseBuyer
   */
  purchaseBuyer?: string | null;

  /**
   * shippingAddress
   */
  shippingAddress?: string | null;
}
