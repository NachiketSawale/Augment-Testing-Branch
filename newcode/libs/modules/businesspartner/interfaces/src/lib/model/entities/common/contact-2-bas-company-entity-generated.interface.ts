/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IContactEntity } from '../contact';

export interface IContact2BasCompanyEntityGenerated extends IEntityBase {

  /**
   * BasClerkFk
   */
  BasClerkFk?: number | null;

  /**
   * BasCompanyFk
   */
  BasCompanyFk: number;

  /**
   * BasCompanyResponsibleFk
   */
  BasCompanyResponsibleFk: number;

  /**
   * BpdContactFk
   */
  BpdContactFk: number;

  /**
   * ContactEntity
   */
  ContactEntity?: IContactEntity | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsActive
   */
  IsActive: boolean;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;
}
