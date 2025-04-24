/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEngType2PpsEventTypeEntity } from './eng-type-2pps-event-type-entity.interface';
import { IEventTypeEntity } from './event-type-entity.interface';
import { IEventTypeSlotEntity } from './event-type-slot-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IEventTypeEntityGenerated extends IEntityBase {

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * DateshiftMode
	 */
	DateshiftMode?: number | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * EarliestFinish
	 */
	EarliestFinish?: number | null;

	/*
	 * EarliestStart
	 */
	EarliestStart?: number | null;

	/*
	 * EngType2ppsEventtypeEntities
	 */
	EngType2ppsEventtypeEntities?: IEngType2PpsEventTypeEntity[] | null;

	/*
	 * EventTypeEntities_PpsEventtypeFk
	 */
	EventTypeEntities_PpsEventtypeFk?: IEventTypeEntity[] | null;

	/*
	 * EventTypeEntity_PpsEventtypeFk
	 */
	EventTypeEntity_PpsEventtypeFk?: IEventTypeEntity | null;

	/*
	 * HasStartDate
	 */
	HasStartDate?: boolean | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsActivity
	 */
	IsActivity?: boolean | null;

	/*
	 * IsDefault
	 */
	IsDefault?: boolean | null;

	/*
	 * IsForSequence
	 */
	IsForSequence?: boolean | null;

	/*
	 * IsHide
	 */
	IsHide?: boolean | null;

	/*
	 * IsLive
	 */
	IsLive?: boolean | null;

	/*
	 * IsProductionDate
	 */
	IsProductionDate?: boolean | null;

	/*
	 * IsSystemEvent
	 */
	IsSystemEvent?: boolean | null;

	/*
	 * IsSystemType
	 */
	IsSystemType?: boolean | null;

	/*
	 * LatestFinish
	 */
	LatestFinish?: number | null;

	/*
	 * LatestStart
	 */
	LatestStart?: number | null;

	/*
	 * PlannedDuration
	 */
	PlannedDuration?: number | null;

	/*
	 * PlannedStart
	 */
	PlannedStart?: string | null;

	/*
	 * PpsEntityFk
	 */
	PpsEntityFk?: number | null;

	/*
	 * PpsEventTypeSlotEntities
	 */
	PpsEventTypeSlotEntities?: IEventTypeSlotEntity[] | null;

	/*
	 * PpsEventtypeFk
	 */
	PpsEventtypeFk?: number | null;

	/*
	 * RubricCategoryFk
	 */
	RubricCategoryFk?: number | null;

	/*
	 * RubricFk
	 */
	RubricFk?: number | null;

	/*
	 * Sorting
	 */
	Sorting?: number | null;

	/*
	 * Userdefined1
	 */
	Userdefined1?: string | null;

	/*
	 * Userdefined2
	 */
	Userdefined2?: string | null;

	/*
	 * Userdefined3
	 */
	Userdefined3?: string | null;

	/*
	 * Userdefined4
	 */
	Userdefined4?: string | null;

	/*
	 * Userdefined5
	 */
	Userdefined5?: string | null;
}
