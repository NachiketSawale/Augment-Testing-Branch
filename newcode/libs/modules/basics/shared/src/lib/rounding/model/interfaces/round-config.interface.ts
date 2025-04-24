/*
 * Copyright(c) RIB Software GmbH
 */


import { ColumnDef } from '@libs/ui/common';
import { IEntityBase } from '@libs/platform/common';

export interface IRoundConfigResponse<ConfigDetail extends IConfigDetail> {
	roundingType: Record<string, number>,
	basRoundingType: Record<string, number>,
	configDetail: ConfigDetail[]
}

/**
 * Rounding config detail
 */
export interface IConfigDetail extends IEntityBase {
	ColumnId: number,
	Id: number,
	IsWithoutRounding: boolean,
	RoundTo: number,
	RoundToFk?: number,
	BasRoundToFk?: number,
	RoundingMethodFk?: number,
	BasRoundingMethodFk?: number,
	Sorting: number,
	UiDisplayTo: number,
}

/**
 *
 */
export interface noRoundingType {
	NoType: number
}


export interface IExtraGridRoundConfig<T extends object> {
	columns?: ColumnDef<T>[];
	extraStr?: string,
}