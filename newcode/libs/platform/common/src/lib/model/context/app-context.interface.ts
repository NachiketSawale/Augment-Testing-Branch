/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { isArray, isString } from 'lodash';
import { IPinningContext } from '../../interfaces/pinning-context.interface';
import { ISidebarUserSettingsVal } from '../sidebar/user-settings/sidebar-user-settings-val.interface';
import { IApplicationContextSettings } from './app-context-settings.interface';


/**
 * All available values in app context.
 */
export type AppContextValue = string | { [x: string]: string } | null | undefined | IPinningContext[] | ISidebarUserSettingsVal;

/**
 * An interface for object that store sidebar user settings object.
 */
export interface IAppContext {
	/**
	 * sidebar user settings.
	 */
	sidebarUserSettings: IApplicationContextSettings<ISidebarUserSettingsVal>;

	/**
	 * Pinning context.
	 */
	pinningContexts: IApplicationContextSettings<IPinningContext[]>;

	/**
	 * Other generic properties that can be added to the app context.
	 */
	[key: string]: IApplicationContextSettings<AppContextValue>;
}

/**
 * Typeguard function to determine if the the passed value is of type sidebar settings.
 * @param value value of a union type of all available properties in app context.
 * @returns a boolean true if the input argument is of type ISidebarUserSettingsVal.
 */
export function isAppContextValISidebarUserSettings(value: AppContextValue): value is ISidebarUserSettingsVal {
	if (isArray(value) || isAppContextValNullOrUndefined(value) || isString(value)) {
		return false;
	}

	return 'sidebarpin' in value || 'quickstart' in value || 'report' in value;
}

/**
 * Typeguard function to determine if the the passed value is of type pinning context.
 * @param value value of a union type of all available properties in app context.
 * @returns a boolean true if the input argument is of type IPinningContext.
 */
export function isAppContextValPinningContext(value: AppContextValue): value is IPinningContext[] {
	return isArray(value);
}

/**
 * Typeguard function to determine if the passed value is of a generic object type.
 * @param value value of a union type of all available properties in app context.
 * @returns a boolean true if the input argument is of type generic object type.
 */
export function isAppContextValObject(value: AppContextValue): value is { [x: string]: string } {
	if (isAppContextValString(value) || isAppContextValNullOrUndefined(value) || isAppContextValISidebarUserSettings(value) || isAppContextValPinningContext(value)) {
		return false;
	}
	return true;
}

/**
 * Typeguard function to determine if the passed value is of a string.
 * @param value value of a union type of all available properties in app context
 * @returns a boolean true if the input argument is of type string.
 */
export function isAppContextValString(value: AppContextValue): value is string {
	return typeof value === 'string';
}

/**
 * Typeguard function to determine if the passed value is of null.
 * @param value value of a union type of all available properties in app context
 * @returns a boolean true if the input argument is of type null.
 */
export function isAppContextValNullOrUndefined(value: AppContextValue): value is null | undefined {
	return value === null || value === undefined;
}