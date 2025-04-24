/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { SCHEDULING_TEMPLATE_MAIN_ENTITY_INFO } from './scheduling-template-main-entity-info.model';
import { SCHEDULING_TEMPLATE_ACTIVITY_CRITERIA_ENTITY_INFO } from './scheduling-template-activity-criteria-entity-info.model';
import { SCHEDULING_TEMPLATE_EVENT_TEMPLATE_ENTITY_INFO } from './scheduling-template-event-template-entity-info.model';
import { SCHEDULING_TEMPLATE_ACTIVITY_TMPL2_CUGRP_ENTITY_INFO } from './scheduling-template-activity-tmpl2-cugrp-entity-info.model';
import { SCHEDULING_TEMPLATE_PERFORMANCE_RULE_ENTITY_INFO } from './scheduling-template-performance-rule-entity-info.model';
import { SCHEDULING_ACTIVITY_TEMPLATE_GROUP } from '@libs/scheduling/templategroup';
import { SCHEDULING_TEMPLATE_ACTIVITY_CHARACTERISTIC_ENTITY_INFO } from './scheduling-template-activity-characteristic-entity-info.model';
/**
 * The module info object for the `scheduling.template` content module.
 */
export class SchedulingTemplateModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: SchedulingTemplateModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): SchedulingTemplateModuleInfo {
		if (!this._instance) {
			this._instance = new SchedulingTemplateModuleInfo();
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
		return 'scheduling.template';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [SCHEDULING_ACTIVITY_TEMPLATE_GROUP, SCHEDULING_TEMPLATE_MAIN_ENTITY_INFO, SCHEDULING_TEMPLATE_EVENT_TEMPLATE_ENTITY_INFO, SCHEDULING_TEMPLATE_ACTIVITY_TMPL2_CUGRP_ENTITY_INFO, SCHEDULING_TEMPLATE_PERFORMANCE_RULE_ENTITY_INFO,SCHEDULING_TEMPLATE_ACTIVITY_CRITERIA_ENTITY_INFO,SCHEDULING_TEMPLATE_ACTIVITY_CHARACTERISTIC_ENTITY_INFO ];
	}
	protected override get translationContainer(): string | undefined {
		return '5e5a1cf157e54d799aff00d4d747bbd2';
	}
}
