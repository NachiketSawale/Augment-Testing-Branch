/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DOCUMENTS_MAIN_ENTITY_INFO } from './entity-info/documents-main-entity-info.model';

/**
 * The module info object for the `documents.main` content module.
 */
export class DocumentsMainModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: DocumentsMainModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): DocumentsMainModuleInfo {
		if (!this._instance) {
			this._instance = new DocumentsMainModuleInfo();
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
		return 'documents.main';
	}

	/**
	 * Loads the translation file used
	 */
	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations,'documents.shared'];
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			...DOCUMENTS_MAIN_ENTITY_INFO
		];
	}

	/**
	 * Returns the definitions of all containers that are available in the module.
	 */
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([]);
	}
}
