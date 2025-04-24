/*
 * Copyright(c) RIB Software GmbH
 */
import { IFormConfig } from '../../../form';
import { IScopedConfigDialogFormDataSetting } from './scoped-config-dialog-form-settings-data.interface';

/**
 * Data for single fallback level.
 */
export interface IScopedConfigDialogFormData<T extends object> {
	/**
	 * Access scope id.
	 */
	scopeLevel: number | string;

	/**
	 * Is globalfallback or not.
	 */
	isGlobalFallback: boolean;

	/**
	 * Form config for fallback.
	 */
	formConfiguration: IFormConfig<Partial<T>> | null;

	/**
	 * Form data for fallback.
	 */
	settings: IScopedConfigDialogFormDataSetting<T>;
}
