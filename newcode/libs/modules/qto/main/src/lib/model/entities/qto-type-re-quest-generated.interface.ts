/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IQtoMainDetailGridEntity } from '../qto-main-detail-grid-entity.class';

export interface IQtoTypeReQuestGenerated {

/*
 * BoqItemIds
 */
  BoqItemIds?: number[] | null;

/*
 * QtoBoqType
 */
  QtoBoqType?: number | null;

/*
 * SelectQtoDetail
 */
  SelectQtoDetail?: IQtoMainDetailGridEntity | null;

/*
 * SelectQtoHeaderId
 */
  SelectQtoHeaderId?: number | null;

/*
 * Value
 */
  Value?: string | null;
}
