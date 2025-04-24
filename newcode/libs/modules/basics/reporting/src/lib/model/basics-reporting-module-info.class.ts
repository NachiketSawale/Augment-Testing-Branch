/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_REPORTING_REPORT_ENTITY_INFO } from './entity-info/basics-reporting-report-entity-info.model';
import { BASICS_REPORTING_REPORT_PARAMETER_ENTITY_INFO } from './entity-info/basics-reporting-report-parameter-entity-info.model';
import { BASICS_REPORTING_REPORT_PARAMETER_VALUES_ENTITY_INFO } from './entity-info/basics-reporting-report-parameter-values-entity-info.model';

/**
 * The module info object for the `basics.reporting` content module.
 */
export class BasicsReportingModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: BasicsReportingModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): BasicsReportingModuleInfo {
		if (!this._instance) {
			this._instance = new BasicsReportingModuleInfo();
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
		return 'basics.reporting';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Basics.Reporting';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ BASICS_REPORTING_REPORT_ENTITY_INFO, 
			BASICS_REPORTING_REPORT_PARAMETER_ENTITY_INFO, 
			BASICS_REPORTING_REPORT_PARAMETER_VALUES_ENTITY_INFO ];
	}
}
	