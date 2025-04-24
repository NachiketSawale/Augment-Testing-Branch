/*
 * Copyright(c) RIB Software GmbH
 */

import { IRequisitionEntity } from './requisition-entity.interface';

export interface IRequisitionMaterialReservationEntityGenerated {

  /**
   * ProjectStockId
   */
  ProjectStockId: number;

  /**
   * Requisitions
   */
  Requisitions?: IRequisitionEntity[] | null;
}
