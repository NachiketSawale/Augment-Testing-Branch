/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '../../model';

/**
 * The basic interface for all module info objects.
 *
 * @group Module Management
 */
export interface IApplicationModuleInfo {

	/**
	 * Returns the internal name of the module.
	 */
	readonly internalModuleName: string;

	/**
	 * Returns translations ids (normally module.submodule like example.topic-one) that are
	 * required by the module.
	 */
	readonly preloadedTranslations?: string[];

	/**
	 * Returns permission UUIDs that should be loaded during module navigation.
	 */
	readonly preloadedPermissions?: string[];

	/**
	 * Executes preparatory steps for the module.
	 * This method is invoked *after* all other prerequisites for the module have been loaded.
	 *
	 * @param context An object that provides some context information for the module preparation.
	 *
	 * @returns A promise that is resolved when the preparation is done.
	 */
	prepareModule?(context: IInitializationContext): Promise<void>;
}
