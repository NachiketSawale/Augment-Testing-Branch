/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILogisticCardEntity } from './logistic-card-entity.interface';

export interface ILogisticCardMaterialReservationEntityGenerated {

/*
 * Cards
 */
  Cards?: ILogisticCardEntity[] | null;

/*
 * Job
 */
  Job?: /*IIJobEntity*/ null;

/*
 * ProjectStockId
 */
  ProjectStockId?: number | null;
}
