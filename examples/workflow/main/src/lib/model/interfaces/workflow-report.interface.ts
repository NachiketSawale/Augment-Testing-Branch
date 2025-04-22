/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Properties of reports
 */
export interface IReport {
	Nameing: string;
	Id: number;
	Name: IDescriptionInfo;
	Description: IDescriptionInfo;
	FileName: string;
	FilePath: string;
	InsertedAt: Date;
	InsertedBy: number;
	UpdatedAt: Date;
	UpdatedBy: number;
	Version: number;
	StoreInDocuments: boolean;
	DocumentCategoryFk: number | null;
	RubricCategoryFk: number | null;
	DocumentTypeFk: number | null;
	ReportParameterEntities: [];
}