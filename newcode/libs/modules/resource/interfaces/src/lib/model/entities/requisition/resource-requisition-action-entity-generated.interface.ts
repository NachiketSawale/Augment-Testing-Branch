/*
 * Copyright(c) RIB Software GmbH
 */

import { IRequisitionEntity } from './requisition-entity.interface';

export interface IResourceRequisitionActionEntityGenerated {

  /**
   * Action
   */
  Action: number;

  /**
   * ResourceRequisitions
   */
  ResourceRequisitions?: IRequisitionEntity[] | null;
}
