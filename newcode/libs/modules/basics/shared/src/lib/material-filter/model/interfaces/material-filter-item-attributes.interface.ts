/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';

/**
 * Interface of material filter item attributes
 */
export interface IMaterialFilterItemAttributes {
	Property?: string;
	Value?: string;
}

/**
 * Interface of material filter item attributes options
 */
export interface IMaterialFilterItemAttributesOptions {
	Model: 'Attributes' | 'Characteristics';
}

/**
 * injection token of material filter preview attributes options
 */
export const MATERIAL_FILTER_ITEM_ATTRIBUTES_OPTIONS_TOKEN = new InjectionToken<IMaterialFilterItemAttributesOptions>('MATERIAL_FILTER_ITEM_ATTRIBUTES_OPTIONS_TOKEN');