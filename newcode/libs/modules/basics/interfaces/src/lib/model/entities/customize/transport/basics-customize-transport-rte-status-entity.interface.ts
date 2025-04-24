/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTransportRteStatusEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	BackgroundColor: number;
	FontColor: number;
	IsInTransport: boolean;
	IsDeletable: boolean;
	IsDefault: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
	IsLive: boolean;
	IsInPlanning: boolean;
	IsDone: boolean;
	IsTransportDone: boolean;
}
