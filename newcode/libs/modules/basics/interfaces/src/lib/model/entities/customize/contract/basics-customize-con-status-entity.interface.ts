/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeConStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Icon: number;
	IsReadOnly: boolean;
	Iscanceled: boolean;
	Isreported: boolean;
	Isvirtual: boolean;
	Isdelivered: boolean;
	Ispartdelivered: boolean;
	IsoptionalUpwards: boolean;
	IsoptionalDownwards: boolean;
	Isordered: boolean;
	Isinvoiced: boolean;
	Isaccepted: boolean;
	Ispartaccepted: boolean;
	Isrejected: boolean;
	Ischangsent: boolean;
	Ischangeaccepted: boolean;
	Ischangerejected: boolean;
	IsLive: boolean;
	AccessrightDescriptorFk: number;
	Code: string;
	IsUpdateImport: boolean;
	IsPesCO: boolean;
}
