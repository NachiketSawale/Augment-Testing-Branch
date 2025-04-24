/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringDrawingStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	IsDefault: boolean;
	IsDeletable: boolean;
	UserFlag1: boolean;
	IsAccountingFailed: boolean;
	IsLive: boolean;
	IsAccounted: boolean;
	Code: string;
	UserFlag2: boolean;
	IsImportLock: boolean;
	IsFullyImported: boolean;
	BackgroundColor: number;
	FontColor: number;
}
