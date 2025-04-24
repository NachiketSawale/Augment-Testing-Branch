/*
 * Copyright(c) RIB Software GmbH
 */

import { IRequisitionEntity } from './requisition-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IRequisition2RequisitionEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * IsReference
   */
  IsReference: boolean;

  /**
   * IsTimeEnhancement
   */
  IsTimeEnhancement: boolean;

  /**
   * RequisitionEntity_ResRequisitionFk
   */
  RequisitionEntity_ResRequisitionFk?: IRequisitionEntity | null;

  /**
   * RequisitionEntity_ResRequisitionlinkedFk
   */
  RequisitionEntity_ResRequisitionlinkedFk?: IRequisitionEntity | null;

  /**
   * RequisitionFk
   */
  RequisitionFk: number;

  /**
   * RequisitionLinkedFk
   */
  RequisitionLinkedFk: number;
}
