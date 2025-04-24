/*
 * Copyright(c) RIB Software GmbH
 */

import { IConStatus2externalEntity } from './con-status-2-external-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IConStatusEntityGenerated extends IEntityBase {

  /**
   * AccessRightDescriptorFk
   */
  AccessRightDescriptorFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * ConStatus2externalEntities
   */
  ConStatus2externalEntities?: IConStatus2externalEntity[] | null;

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
   * IsChangSent
   */
  IsChangSent: boolean;

  /**
   * IsChangeAccepted
   */
  IsChangeAccepted: boolean;

  /**
   * IsChangeRejected
   */
  IsChangeRejected: boolean;

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
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsOptionalDownwards
   */
  IsOptionalDownwards: boolean;

  /**
   * IsOptionalUpwards
   */
  IsOptionalUpwards: boolean;

  /**
   * IsOrdered
   */
  IsOrdered: boolean;

  /**
   * IsPartAccepted
   */
  IsPartAccepted: boolean;

  /**
   * IsPartDelivered
   */
  IsPartDelivered: boolean;

  /**
   * IsPesCo
   */
  IsPesCo: boolean;

  /**
   * IsReadonly
   */
  IsReadonly: boolean;

  /**
   * IsRejected
   */
  IsRejected: boolean;

  /**
   * IsReported
   */
  IsReported: boolean;

  /**
   * IsUpdateImport
   */
  IsUpdateImport: boolean;

  /**
   * IsVirtual
   */
  IsVirtual: boolean;

  /**
   * Iscanceled
   */
  Iscanceled: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
