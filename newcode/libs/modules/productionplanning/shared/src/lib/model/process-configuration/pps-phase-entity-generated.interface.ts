/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsPhaseEntityGenerated extends IEntityBase {

	Id: number;
	PpsPhaseTypeFk: number | null;
	PlannedStart?: Date | null;
	PlannedFinish?: Date | null;
	EarliestStart?: Date | null;
	LatestStart?: Date | null;
	EarliestFinish?: Date | null;
	LatestFinish?: Date | null;
	ActualStart?: Date | null;
	ActualFinish?: Date | null;
	DateshiftMode: number;
	BasSiteFk?: number | null;
	PpsProductionPlaceFk?: number | null;
	PpsProcessFk: number;
	IsLockedStart?: boolean | null;
	IsLockedFinish?: boolean | null;

}