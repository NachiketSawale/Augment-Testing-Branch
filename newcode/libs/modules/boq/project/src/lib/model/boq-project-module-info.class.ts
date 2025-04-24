/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';

/**
 * The module info object for the `boq.project` content module.
 */
export class BoqProjectModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: BoqProjectModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): BoqProjectModuleInfo {
		if (!this._instance) {
			this._instance = new BoqProjectModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'boq.project';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Boq.Project';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [];
	}

	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'cloud.common', 'boq.main', 'basics.company'];
	}

}
