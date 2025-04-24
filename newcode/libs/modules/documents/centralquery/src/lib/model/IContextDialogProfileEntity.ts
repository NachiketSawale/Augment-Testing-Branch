/*
 * Copyright(c) RIB Software GmbH
 */

export interface IContextDialogProfileEntity {
	Id: number;
	FrmUserFk?: number;
	FrmAccessRoleFk?: number;
	IsSystem: boolean;
	IsDefault: boolean;
	Description?: string | null;
	PropertyConfig: string;
	ProfileType: number;
	IsCurrentView?: boolean;
	DisplayText: string;
}

export interface IPropertyConfig {
	radioOption: string;
	uniqueFieldsProfile: string;
	profile: IProfile;
}

export interface IProfile {
	Id: number;
	IdentityName: string;
	ProfileName: string;
	ProfileAccessLevel?: number | null;
	UniqueFields: Array<IUniqueFields>;
}

export interface IUniqueFields {
	model: string;
	fieldName: string;
	isSelect: boolean;
	sId: number;
}
