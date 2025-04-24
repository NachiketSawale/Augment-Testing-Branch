/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface ITextModuleEntity extends IEntityBase, IEntityIdentification{
	Id: number;
	TextModuleContextFk: number;
	LanguageFk: number;
	BlobsFk?: number | null;
	ClobsFk?: number | null;
	SearchPattern?: string | null;
	TextModuleTypeFk?: number | null;
	Code?: string | null;
	IsLive: boolean;
	IsLanguageDependent: boolean;
	TextFormatFk?: number | null;
	Client?: string | null;
	RubricFk?: number | null;
	ClerkFk?: number | null;
	AccessRoleFk?: number | null;
	PortalUserGroupFk?: number | null;
	DescriptionInfo: IDescriptionInfo;
}
