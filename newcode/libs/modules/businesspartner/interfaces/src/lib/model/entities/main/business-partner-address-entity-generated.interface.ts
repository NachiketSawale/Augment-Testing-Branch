/*
 * Copyright(c) RIB Software GmbH
 */

import { AddressEntity } from '@libs/basics/shared';

export interface IBusinessPartnerAddressEntityGenerated {

  /**
   * Address
   */
  Address?: AddressEntity | null;

  /**
   * BpId
   */
  BpId: number;

  /**
   * BpName
   */
  BpName?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Message
   */
  Message?: string | null;

  /**
   * Status
   */
  Status: number;

  /**
   * SubsidiaryDescription
   */
  SubsidiaryDescription?: string | null;

  /**
   * SubsidiaryId
   */
  SubsidiaryId: number;
}
