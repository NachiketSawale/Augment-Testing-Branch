/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcPackageImportEntityGenerated } from '../entities/prc-package-import-entity-generated.interface';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { IPrcItemEntity } from '@libs/procurement/common';

export interface ProcurementMaterialXmlData {
	FileName: string;
	BasCompany: string;
	PrjProject: string;
	Code: string;
	Description: string;
	BasCurrency: string;
	BasUom: string;
	PrcItemData: IPrcItemEntity[];
	ResponseData?: ResponseData;
	PackageImportEntity?: IPrcPackageImportEntityGenerated;
	PrcPackageEntity?: IPrcPackageEntity;
	TaxRate: string;
}

export interface ResponseData {
	PrjProjectFk: number;
	PrjectNo: string;
	PrjectName: string;
	BasCompanyFk: number;
	BasCompanyCurrencyFk: number;
	ComCurrencyDes: string;
	ComCurrencyCode: string;
	TaxCodeFk: number | null;
	StructureFk: number;
	ConfigurationFk: number;
	MaterialCurrencyFK: number;
}
