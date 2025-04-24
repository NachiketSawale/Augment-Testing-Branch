/*
 * Copyright(c) RIB Software GmbH
 */


export interface IRfqHeaderDialogEntity {
	ConfigurationFk: number;
	ClerkReqFk?: number;
	PrcStrategyFk: number;
	Code: string;
	Remark?: string;
}