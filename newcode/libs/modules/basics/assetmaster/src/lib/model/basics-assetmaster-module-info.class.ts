/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_ASSET_MASTER_GRID_ENTITY_INFO } from './basics-asset-master-grid-entity-info.model';

/**
 * The module info object for the `basics.assetmaster` content module.
 */
export class BasicsAssetmasterModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: BasicsAssetmasterModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): BasicsAssetmasterModuleInfo {
		if (!this._instance) {
			this._instance = new BasicsAssetmasterModuleInfo();
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
		return 'basics.assetmaster';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Basics.Assetmaster';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ BASICS_ASSET_MASTER_GRID_ENTITY_INFO, ];
	}

	/**
	 * Returns the translation container UUID for the Asset master module.
	 */
	protected override get translationContainer(): string | undefined {
		return '5285c5679e7a4301a9448058897beafb';
	}
}
