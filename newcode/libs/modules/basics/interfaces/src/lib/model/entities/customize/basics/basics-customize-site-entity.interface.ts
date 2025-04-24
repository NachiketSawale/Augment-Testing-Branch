/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeSiteEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
   ChildItems:IBasicsCustomizeSiteEntity [];
	Sorting: number;
	IsLive: boolean;
	IsDefault: boolean;
	Icon: number;
   SiteFk: number;
}
