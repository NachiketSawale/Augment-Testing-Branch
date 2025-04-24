/*
 * Copyright(c) RIB Software GmbH
 */

export interface ISettingRules {
	DisableDataFormatExport: IRules,
	DisableZipping: IRules,
	LinkAndAttachment: IRules,
	GenerateSafeLink: IRules,
	UseAccessTokenForSafeLink: IRules
}

export interface IRules {
	ToDisable?: string[],
	ToEnable?: string[],
	SetReadonlyWhenFalse?: string[]
}