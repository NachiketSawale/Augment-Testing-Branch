/*
 * Copyright(c) RIB Software GmbH
 */

import { IContactEntity } from './contact-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IContactRoleEntityGenerated extends IEntityBase {

  /**
   * ContactEntities
   */
  ContactEntities?: IContactEntity[] | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsClient
   */
  IsClient: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsForCertificate
   */
  IsForCertificate: boolean;

  /**
   * IsProcurement
   */
  IsProcurement: boolean;

  /**
   * IsSales
   */
  IsSales: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
