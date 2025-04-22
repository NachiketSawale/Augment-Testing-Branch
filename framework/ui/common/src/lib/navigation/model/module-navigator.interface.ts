/*
 * Copyright(c) RIB Software GmbH
 */

import { INavigationInfo, Translatable } from '@libs/platform/common';
import { EntityForeignKeysConst } from './entity-foreign-keys.constant';

/**
 * interface for a single navigator
 */
export interface IModuleNavigator extends INavigationInfo {
	fieldId?: string;
	icon?: string;
	displayText?: Translatable;
}

/**
 * Type for identifying navigators
 */
export type ModuleNavigatorIdentification = Pick<IModuleNavigator, 'internalModuleName' | 'fieldId'>

/**
 * NavigationTarget, simple map of internalModuleName to a Translatable
 */
export type NavigationTarget = { internalModuleName: string, translationKey: Translatable, originFkName?: EntityForeignKeys | string }

/**
 * Translatable, simple map of any Fk to a NavigationTarget
 */
export type FkToNavigationTarget = Record<EntityForeignKeys, (NavigationTarget | NavigationTarget[] | EntityForeignKeys)>

/**
 * Entity foreign keys that are available as navigational properties.
 */
export type EntityForeignKeys = typeof EntityForeignKeysConst[number];

/**
 * Typeguard function to check if the passed string is an entity key.
 * @param item string
 * @returns A boolean true if the item is an entity key.
 */
export function isEntityKey(item: string): item is EntityForeignKeys {
	return (EntityForeignKeysConst as readonly string[]).includes(item);
}