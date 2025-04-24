/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { IPrcPackageImportEntityGenerated } from './prc-package-import-entity-generated.interface';
import { InjectionToken } from '@angular/core';
export interface IImportPackageResult {
	PrcPackageImportDto?: IPrcPackageImportEntityGenerated;
	PrcPackageDto?: IPrcPackageEntity;
}

export interface IImportPackageResultRow {
	Id: number;
	Status: string;
	Error?: string | null;
	Warning?: string | null;
	PrcPackageDto?: IPrcPackageEntity;
}

/**
 * injection token of Import Package Result component
 */
export const IMPORT_PACKAGE_RESULT_ROW_TOKEN = new InjectionToken<IImportPackageResultRow>('importPackageResultRowToken');
