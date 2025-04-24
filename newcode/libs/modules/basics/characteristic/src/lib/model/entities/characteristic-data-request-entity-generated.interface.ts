/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';

export interface ICharacteristicDataRequestEntityGenerated {

  /**
   * Ident
   */
  Ident?: IIdentificationData | null;

  /**
   * SectionId
   */
  SectionId: number;
}
