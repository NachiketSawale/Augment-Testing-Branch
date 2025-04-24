/*
 * Copyright(c) RIB Software GmbH
 */

import { IPesStatus2externalEntity } from './pes-status-2-external-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPesStatusEntityGenerated extends IEntityBase {

  /**
   * AccessRightDescriptorFk
   */
  AccessRightDescriptorFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Icon
   */
  Icon: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsAccepted
   */
  IsAccepted: boolean;

  /**
   * IsAdvised
   */
  IsAdvised: boolean;

  /**
   * IsCanceled
   */
  IsCanceled: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsDelivered
   */
  IsDelivered: boolean;

  /**
   * IsInvoiced
   */
  IsInvoiced: boolean;

  /**
   * IsPosted
   */
  IsPosted: boolean;

  /**
   * IsProtected
   */
  IsProtected: boolean;

  /**
   * IsReadonly
   */
  IsReadonly: boolean;

  /**
   * IsRevenueRecognition
   */
  IsRevenueRecognition: boolean;

  /**
   * IsVirtual
   */
  IsVirtual: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * Isstock
   */
  Isstock: boolean;

  /**
   * PesStatus2externalEntities
   */
  PesStatus2externalEntities?: IPesStatus2externalEntity[] | null;

  /**
   * Sorting
   */
  Sorting: number;
}
