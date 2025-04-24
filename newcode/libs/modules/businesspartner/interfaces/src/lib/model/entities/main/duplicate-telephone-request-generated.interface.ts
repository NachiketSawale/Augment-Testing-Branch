/*
 * Copyright(c) RIB Software GmbH
 */

import { TelephoneEntity } from '@libs/basics/shared';

export interface IDuplicateTelephoneRequestGenerated {

  /**
   * IsCheckDuplicate
   */
  IsCheckDuplicate: boolean;

  /**
   * MainItemId
   */
  MainItemId: number;

  /**
   * Pattern
   */
  Pattern?: string | null;

  /**
   * TelephoneDto
   */
  TelephoneDto?: TelephoneEntity | null;
}
