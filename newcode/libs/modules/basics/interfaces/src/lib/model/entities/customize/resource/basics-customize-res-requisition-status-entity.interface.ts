/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeResRequisitionStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	BackgroundColor: number;
	FontColor: number;
	IsFullyCovered: boolean;
	IsConfirmed: boolean;
	IsCanceled: boolean;
	Icon: number;
	IsFullyReserved: boolean;
	Code: string;
	IsReopened: boolean;
	IsReadOnly: boolean;
}
