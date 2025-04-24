/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTransportRequisitionStatusEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	BackgroundColor: number;
	FontColor: number;
	IsAccepted: boolean;
	IsDeletable: boolean;
	IsDefault: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
	IsLive: boolean;
	IsDone: boolean;
	IsPlanningAllowed: boolean;
}
