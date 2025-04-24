/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, ITranslationContainerInfo } from '@libs/ui/business-base';
import { CHECKLIST_TEMPLATE_HEADER_INFO } from './entity-info/checklist-template-header-entity-info.class';
import { CHECKLIST_GROUP_INFO } from './entity-info/checklist-group-entity-info.class';
import { CHECKLIST_TEMPLATE_FORM_ENTITY_INFO } from './entity-info/checklist-template-form-entity-info.model';

/**
 * The module info object for the `hsqe.checklisttemplate` content module.
 */
export class HsqeChecklisttemplateModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: HsqeChecklisttemplateModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): HsqeChecklisttemplateModuleInfo {
		if (!this._instance) {
			this._instance = new HsqeChecklisttemplateModuleInfo();
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
		return 'hsqe.checklisttemplate';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Hsqe.Checklisttemplate';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [CHECKLIST_TEMPLATE_HEADER_INFO, CHECKLIST_GROUP_INFO, CHECKLIST_TEMPLATE_FORM_ENTITY_INFO];
	}

	/**
	 * Loads the translation file used for module
	 */
	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'basics.procurementstructure'];
	}

	protected override get translationContainer(): string | ITranslationContainerInfo | undefined {
		return '8366ed5d81084a079789a5987c2ce3c4';
	}
}
