/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { IMaterialCatalogEntityGenerated } from './material-catalog-entity-generated.interface';

export const MATERIAL_CATALOG_TOKEN = new InjectionToken<IMaterialCatalogEntity>('MATERIAL_CATALOG_TOKEN');

export interface IMaterialCatalogEntity extends IMaterialCatalogEntityGenerated {
	/**
	 * is checked
	 */
	IsChecked?: boolean;
	
	/**
	 * Current entity is just created by deep copy
	 */
	isJustDeepCopied: boolean;
}
