/*
 * Copyright(c) RIB Software GmbH
 */

export interface IProductionplanningStrandpatternMaterial {
    Id: number,
	Code: string,
	Description: string,
	DescriptionTr: number | null,
	IsDefault: boolean,
	Sorting: number,
	InsertedAt: Date,
	InsertedBy: number,
	UpdatedAt: Date | null,
	UpdatedBy: number | null,
	Version: number,
}