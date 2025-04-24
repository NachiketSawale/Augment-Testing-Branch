/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstConfigEntity } from './est-config-entity.interface';
import { IEstColumnConfigDetailEntity } from './est-column-config-detail-entity.interface';

export interface ICreateNewColumnConfigsRequestGenerated {

/*
 * estConfig
 */
  estConfig?: IEstConfigEntity | null;

/*
 * estNewColumnDetails
 */
  estNewColumnDetails?: IEstColumnConfigDetailEntity[] | null;
}
