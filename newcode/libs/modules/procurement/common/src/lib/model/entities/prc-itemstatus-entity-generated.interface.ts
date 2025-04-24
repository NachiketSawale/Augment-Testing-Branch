/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcItemEntity } from './prc-item-entity.interface';
import { IPrcItemstatus2externalEntity } from './prc-itemstatus-2-external-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPrcItemstatusEntityGenerated extends IEntityBase {

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
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsPartAccepted
   */
  IsPartAccepted: boolean;

  /**
   * IsPartDelivered
   */
  IsPartDelivered: boolean;

  /**
   * IsRejected
   */
  IsRejected: boolean;

  /**
   * PrcItemEntities
   */
  PrcItemEntities?: IPrcItemEntity[] | null;

  /**
   * PrcItemstatus2externalEntities
   */
  PrcItemstatus2externalEntities?: IPrcItemstatus2externalEntity[] | null;

  /**
   * Sorting
   */
  Sorting: number;
}
