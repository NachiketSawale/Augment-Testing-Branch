/*
 * Copyright(c) RIB Software GmbH
 */

import { IAddressCreateRequest, IPhoneCreateRequest } from '@libs/basics/interfaces';
import { IContactEntity } from '../contact';

export interface ICreateContactWithAddressPhoneGenerated {

  /**
   * AddressDto
   */
  AddressDto?: IAddressCreateRequest | null;

  /**
   * ContactDto
   */
  ContactDto?: IContactEntity | null;

  /**
   * CopyAddress
   */
  CopyAddress: boolean;

  /**
   * FaxDto
   */
  FaxDto?: IPhoneCreateRequest | null;

  /**
   * PhoneDto
   */
  PhoneDto?: IPhoneCreateRequest | null;
  //PhoneDto?: IPhoneCreateRequest;

  /**
   * mainItemId
   */
  mainItemId: number;
}