/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo } from '@libs/ui/business-base';
import { BASICS_CONTROLLING_COST_CODES_ENTITY_INFO } from './basics-controlling-cost-codes-entity-info.model';
import { BASICS_CONTROLLING_COST_CODES_ACCOUNT_ENTITY_INFO } from './basics-controlling-cost-codes-account-entity-info.model';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';

export class BasicsControllingcostcodesModuleInfo extends BusinessModuleInfoBase {

	private static _instance?: BasicsControllingcostcodesModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): BasicsControllingcostcodesModuleInfo {
		if (!this._instance) {
			this._instance = new BasicsControllingcostcodesModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'basics.controllingcostcodes';
	}

	public override get entities(): EntityInfo[] {
		return [ BASICS_CONTROLLING_COST_CODES_ENTITY_INFO, BASICS_CONTROLLING_COST_CODES_ACCOUNT_ENTITY_INFO, ];
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const languageConatinerConfiguration : IContainerDefinition = {
			uuid : '8aa83e56e8c14c669871667de86c8557',
			title: { key: 'ui.business-base.translationContainerTitle' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageConatinerConfiguration)];
	}
}
