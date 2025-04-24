/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEMailServerEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Remark: string;
	ServerUrl: string;
	UseAuthentication: boolean;
	Username: string;
	Password: number;
	EncryptionTypeFk: number;
	SecurityType: number;
	Port: number;
	SenderEmail: string;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
}
