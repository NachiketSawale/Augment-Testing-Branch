/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';

import { BASICS_CONFIG_WIZARD_XGROUP_PVALUE_ENTITY_INFO } from '../wizard-parameter/model/basics-config-wizard-xgroup-pvalue-entity-info.model';
import { BASICS_CONFIG_REPORT_XGROUP_ENTITY_INFO } from '../reports-in-group/model/basics-config-report-xgroup-entity-info.model';
import { BASICS_CONFIG_REPORT_GROUP_ENTITY_INFO } from '../report-groups/model/basics-config-report-group-entity-info.model';
import { BASICS_CONFIG_WIZARD_GROUP_ENTITY_INFO } from '../wizard-group/model/basics-config-wizard-group-entity-info.model';

import { BASICS_CONFIG_GENERIC_WIZARD_CONTAINER_ENTITY_INFO } from '../generic-wizard-container/model/basics-config-generic-wizard-container-entity-info.model';
import { BASICS_CONFIG_WIZARD_XGROUP_ENTITY_INFO } from '../wizard-to-group/model/basics-config-wizard-xgroup-entity-info.model';
import { BASICS_CONFIG_TAB_ENTITY_INFO } from '../tabs/model/basics-config-tab-entity-info.model';
import { BASICS_CONFIG_ENTITY_INFO } from '../modules/model/basics-config-entity-info.model';
import { BASICS_CONFIG_AUDIT_CONTAINER_ENTITY_INFO } from '../aud-container/model/basics-config-audit-container-entity-info.model';
import { BASICS_CONFIG_AUDIT_COLUMN_ENTITY_INFO } from '../audit-trail-container-column/model/basics-config-audit-column-entity-info.model';
import { BASICS_CONFIG_GENERIC_WIZARD_STEP_SCRIPT_ENTITY_INFO } from '../generic-wizard-script/model/basics-config-generic-wizard-step-script-entity-info.model';
import { BASICS_CONFIG_GENERIC_WIZARD_INSTANCE_ENTITY_INFO } from '../generic-wizard/model/basics-config-generic-wizard-instance-entity-info.model';
import { BASICS_CONFIG_NAVBAR_SYSTEM_ENTITY_INFO } from '../navbarsystem/model/basics-config-navbar-system-entity-info.model';
import { BASICS_CONFIG_MC_TWO_QN_A_ENTITY_INFO } from '../mc-two-qna/model/basics-config-mc-two-qn-a-entity-info.model';
import { BASICS_CONFIG_GENERIC_WIZARD_STEP_ENTITY_INFO } from '../generic-wizard-step/model/basics-config-generic-wizard-step-entity-info.model';

/**
 * The module info object for the `basics.config` content module.
 */
export class BasicsConfigModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: BasicsConfigModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): BasicsConfigModuleInfo {
		if (!this._instance) {
			this._instance = new BasicsConfigModuleInfo();
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
		return 'basics.config';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			BASICS_CONFIG_ENTITY_INFO,
			BASICS_CONFIG_TAB_ENTITY_INFO,
			BASICS_CONFIG_REPORT_GROUP_ENTITY_INFO,
			BASICS_CONFIG_REPORT_XGROUP_ENTITY_INFO,
			BASICS_CONFIG_WIZARD_GROUP_ENTITY_INFO,
			BASICS_CONFIG_WIZARD_XGROUP_ENTITY_INFO,
			BASICS_CONFIG_WIZARD_XGROUP_PVALUE_ENTITY_INFO,
			BASICS_CONFIG_AUDIT_CONTAINER_ENTITY_INFO,
			BASICS_CONFIG_AUDIT_COLUMN_ENTITY_INFO,
			BASICS_CONFIG_GENERIC_WIZARD_INSTANCE_ENTITY_INFO,
			BASICS_CONFIG_GENERIC_WIZARD_STEP_ENTITY_INFO,
			BASICS_CONFIG_GENERIC_WIZARD_CONTAINER_ENTITY_INFO,
			BASICS_CONFIG_MC_TWO_QN_A_ENTITY_INFO,
			BASICS_CONFIG_GENERIC_WIZARD_STEP_SCRIPT_ENTITY_INFO,
			BASICS_CONFIG_NAVBAR_SYSTEM_ENTITY_INFO
		];

	}
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}

	/**
	 * Returns the translation container UUID for the basics config module.
	 */
	protected override get translationContainer(): string | undefined {
		return '4fa5088900d944a5a8ec9b9b95da3682';
	}
}
