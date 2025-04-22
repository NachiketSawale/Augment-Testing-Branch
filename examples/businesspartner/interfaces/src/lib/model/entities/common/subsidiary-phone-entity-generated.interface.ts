/*
 * Copyright(c) RIB Software GmbH
 */

import { TelephoneEntity } from '@libs/basics/shared';

export interface ISubsidiaryPhoneEntityGenerated {

  /**
   * TeleFaxDescriptor
   */
  TeleFaxDescriptor?: TelephoneEntity | null;

  /**
   * TelephoneNumberDescriptor
   */
  TelephoneNumberDescriptor?: TelephoneEntity | null;
}
