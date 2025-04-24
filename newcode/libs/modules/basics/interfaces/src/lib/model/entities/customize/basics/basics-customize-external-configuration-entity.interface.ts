/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeExternalConfigurationEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Url: string;
	Username: string;
	Password: number;
	AuthtypeFk: number;
	Usessl: boolean;
	Requiretimestamp: boolean;
	Enableencryption: boolean;
	Enablesignatures: boolean;
	Encryptresponse: boolean;
	FilearchivedocFk: number;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	EncryptiontypeFk: number;
}
