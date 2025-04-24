/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_PROCUREMENT_CONFIGURATION_HEADER_ENTITY_INFO } from './entity-info/basics-procurement-configuration-header-entity-info.model';
import { BASICS_PROCUREMENT_CONFIGURATION_2BSCHEMA_ENTITY_INFO } from './entity-info/basics-procurement-configuration-2bschema-entity-info.model';
import { BASICS_PROCUREMENT_CONFIGURATION_2STRATEGY_ENTITY_INFO } from './entity-info/basics-procurement-configuration-2strategy-entity-info.model';
import { BASICS_PROCUREMENT_CONFIGURATION_PRCTOTALTYPE_ENTITY_INFO } from './entity-info/basics-procurement-configuration-prctotaltype-entity-info.model';
import { BASICS_PROCUREMENT_CONFIGURATION_CONFIGURATION_ENTITY_INFO } from './entity-info/basics-procurement-configuration-configuration-entity-info.model';
import { BASICS_PROCUREMENT_CONFIGURATION_RFQDATAFORMAT_ENTITY_INFO } from './entity-info/basics-procurement-configuration-rfqdataformat-entity-info.model';
import { BASICS_PROCUREMENT_CONFIGURATION_RFQDOCUMENTS_ENTITY_INFO } from './entity-info/basics-procurement-configuration-rfqdocuments-entity-info.model';
import { BASICS_PROCUREMENT_CONFIGURATION_RFQREPORTS_ENTITY_INFO } from './entity-info/basics-procurement-configuration-rfqreports-entity-info.model';
import { BASICS_PROCUREMENT_CONFIGURATION_RFQCOVERLETTEROREMAILBODY_ENTITY_INFO } from './entity-info/basics-procurement-configuration-rfqcoverletteroremailbody-entity-info.model';
import { BASICS_PROCUREMENT_CONFIG_CONFIGURATION_2CONAPPROVAL_ENTITY_INFO } from './entity-info/basics-procurement-config-configuration-2conapproval-entity-info.model';
import { BASICS_PROCUREMENT_CONFIGURATION_2TAB_ENTITY_INFO } from './entity-info/basics-procurement-configuration-2tab-entity-info.model';
import { PROCUREMENT_CONFIGURATION_CHARACTERISTIC2_ENTITY_INFO } from './entity-info/basics-procurement-configuration-characteristic2-entity-info.model';
import { BASICS_PROCUREMENT_CONFIGURATION_CHARACTERISTICS_ENTITY_INFO } from './entity-info/basics-procurement-configuration-characteristics-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { BASICS_PROCUREMENT_CONFIGURATION_NARRATIVE_SCRIPT_CONTAINER_DEFINITION } from './container/narrative-script-definition-container.class';

export class BasicsProcurementconfigurationModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: BasicsProcurementconfigurationModuleInfo;

	public static get instance(): BasicsProcurementconfigurationModuleInfo {
		if (!this._instance) {
			this._instance = new BasicsProcurementconfigurationModuleInfo();
		}

		return this._instance;
	}

	/**
	 * Make module info class singleton
	 * @private
	 */
	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'basics.procurementconfiguration';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'Basics.ProcurementConfiguration';
	}

	public override get entities(): EntityInfo[] {
		return [
			BASICS_PROCUREMENT_CONFIGURATION_HEADER_ENTITY_INFO,
			BASICS_PROCUREMENT_CONFIGURATION_2BSCHEMA_ENTITY_INFO,
			BASICS_PROCUREMENT_CONFIGURATION_2STRATEGY_ENTITY_INFO,
			BASICS_PROCUREMENT_CONFIGURATION_PRCTOTALTYPE_ENTITY_INFO,
			BASICS_PROCUREMENT_CONFIGURATION_CONFIGURATION_ENTITY_INFO,
			BASICS_PROCUREMENT_CONFIGURATION_RFQDATAFORMAT_ENTITY_INFO,
			BASICS_PROCUREMENT_CONFIGURATION_RFQDOCUMENTS_ENTITY_INFO,
			BASICS_PROCUREMENT_CONFIGURATION_RFQREPORTS_ENTITY_INFO,
			BASICS_PROCUREMENT_CONFIGURATION_RFQCOVERLETTEROREMAILBODY_ENTITY_INFO,
			BASICS_PROCUREMENT_CONFIG_CONFIGURATION_2CONAPPROVAL_ENTITY_INFO,
			BASICS_PROCUREMENT_CONFIGURATION_2TAB_ENTITY_INFO,
			PROCUREMENT_CONFIGURATION_CHARACTERISTIC2_ENTITY_INFO,
			BASICS_PROCUREMENT_CONFIGURATION_CHARACTERISTICS_ENTITY_INFO,
		];
	}

	/**
	 * @brief Gets the container definitions, including the language container configuration.
	 * This method overrides the base class implementation to include a new container definition
	 * @return An array of ContainerDefinition objects including the language container configuration.
	 */
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([BASICS_PROCUREMENT_CONFIGURATION_NARRATIVE_SCRIPT_CONTAINER_DEFINITION]);
	}

	/**
	 * Returns the translation container uuid for the basics procurementconfiguration module.
	 */
	protected override get translationContainer(): string | undefined {
		return '4fa5088900d944a5a8ec9b9b95da3682';
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'cloud.common', 'documents.shared', 'basics.characteristic'];
	}
}
