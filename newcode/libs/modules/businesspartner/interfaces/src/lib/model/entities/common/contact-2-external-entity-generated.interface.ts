/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IContactEntity } from '../contact';

export interface IContact2ExternalEntityGenerated extends IEntityBase {

  /**
   * ContactEntity
   */
  ContactEntity?: IContactEntity | null;

  /**
   * ContactFk
   */
  ContactFk: number;

  /**
   * ExternalDescription
   */
  ExternalDescription?: string | null;

  /**
   * ExternalId
   */
  ExternalId?: string | null;

  /**
   * ExternalSourceFk
   */
  ExternalSourceFk: number;

  /**
   * Id
   */
  Id: number;
}
