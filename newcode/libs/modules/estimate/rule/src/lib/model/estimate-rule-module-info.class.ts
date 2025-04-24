/*
 * Copyright(c) RIB Software GmbH
 */

import {BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo} from '@libs/ui/business-base';
import { ESTIMATE_RULE_ENTITY_INFO } from './estimate-rule-entity-info.model';
import { estimateRuleParameterEntityInfo } from './estimate-rule-paramemter-entity-info.model';
import { estimateRuleParameterValueEntityInfo} from './estimate-rule-paramemter-value-entity-info.model';
import {ContainerDefinition, ContainerTypeRef, IContainerDefinition} from '@libs/ui/container-system';
import {ESTIMATE_RULE_SCRIPT_CONTAINER_DEFINITION} from '../script-definition/estimate-rule-script-definition-container.class';

/**
 * The module info object for the `estimate.rule` content module.
 */
export class EstimateRuleModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: EstimateRuleModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): EstimateRuleModuleInfo {
		if (!this._instance) {
			this._instance = new EstimateRuleModuleInfo();
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
		return 'estimate.rule';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ ESTIMATE_RULE_ENTITY_INFO,estimateRuleParameterEntityInfo, estimateRuleParameterValueEntityInfo,];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[]{
		return super.containers.concat([
			new ContainerDefinition({
				uuid: '0a9b433c8fac484eb302c03f6a768c02',
				title: { key: 'ui.business-base.translationContainerTitle' },
				containerType: DataTranslationGridComponent as ContainerTypeRef
			}),
			ESTIMATE_RULE_SCRIPT_CONTAINER_DEFINITION
		]);
	}

	/**
	 * Returns the translation container UUID for the estimate rule module.
	 */
	protected override get translationContainer(): string | undefined {
		return '0a9b433c8fac484eb302c03f6a768c02';
	}
}
