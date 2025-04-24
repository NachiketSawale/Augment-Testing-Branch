/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IResourceWorkOperationTypeEntityGenerated extends IEntityBase, IEntityIdentification {
	EquipmentContextFk: number;
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	IsHire: boolean;
	IsLive: boolean;
	Sorting: number;
	IsDefault: boolean;
	UomFk: number;
	ReservationstatusStartFk: number;
	IsMinorEquipment: boolean;
	HasLoadingCosts: boolean;
	IsEstimate: boolean;
}