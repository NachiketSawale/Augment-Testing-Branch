/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IEventEntity } from './event-entity.interface';

export interface IItem2EventEntityGenerated extends IEntityBase {

/*
 * EventEntity
 */
  EventEntity?: IEventEntity | null;

/*
 * EventFk
 */
  EventFk: number;

/*
 * Id
 */
  Id: number;

/*
 * ItemFk
 */
  ItemFk?: number | null;

/*
 * MinTime
 */
  MinTime: number;

/*
 * PpsProductFk
 */
  PpsProductFk?: number | null;

/*
 * RelationKindFk
 */
  RelationKindFk: number;

/*
 * SequenceOrder
 */
  SequenceOrder: number;
}
