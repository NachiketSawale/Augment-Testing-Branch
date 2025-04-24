/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_BI_PLUS_DESIGNER_DASHBOARD_ENTITY_INFO } from '../biplusdesignerdashboard/model/basics-bi-plus-designer-dashboard-entity-info.model';
import { BASICS_BI_PLUS_DESIGNER_DASHBOARD_PARAMETER_ENTITY_INFO } from '../dashboardparameter/model/basics-bi-plus-designer-dashboard-parameter-entity-info.model';
import { BASICS_BI_PLUS_DESIGNER_DASHBOARD2_GROUP_ENTITY_INFO } from '../biplusdesignerdashboard2group/model/basics-bi-plus-designer-dashboard2-group-entity-info.model';

/**
 * The module info object for the `basics.biplusdesigner` content module.
 */
export class BasicsBiplusdesignerModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: BasicsBiplusdesignerModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): BasicsBiplusdesignerModuleInfo {
		if (!this._instance) {
			this._instance = new BasicsBiplusdesignerModuleInfo();
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
		return 'basics.biplusdesigner';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Basics.Biplusdesigner';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [BASICS_BI_PLUS_DESIGNER_DASHBOARD_ENTITY_INFO, BASICS_BI_PLUS_DESIGNER_DASHBOARD2_GROUP_ENTITY_INFO, BASICS_BI_PLUS_DESIGNER_DASHBOARD_PARAMETER_ENTITY_INFO];
	}

	/**
	 * Loads the translation file used for Basics Biplus Designer module
	 */
	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'basics.config'];
	}
}
