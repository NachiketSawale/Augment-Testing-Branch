/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsProductStatusEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	BackgroundColor: number;
	FontColor: number;
	IsInProduction: boolean;
	IsDeletable: boolean;
	IsProduced: boolean;
	IsDefault: boolean;
	IsLive: boolean;
	IsShipped: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
	IsScrap: boolean;
	IsReadyForStockYard: boolean;
	IsAccounted: boolean;
	IsDone: boolean;
	IsComponentRemoved: boolean;
}
