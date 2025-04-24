/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { DEFECT_MAIN_HEADER_ENTITY_INFO } from './entity-info/defect-main-header-entity-info.model';
import { DEFECT_CLERK_ENTITY_INFO } from './entity-info/defect-clerk-entity-info.model';
import { DEFECT_CHECKLIST_FORM_DATA_ENTITY_INFO } from './entity-info/defect-checklist-form-data-entity-info.model';
import { DEFECT_MAIN_DOCUMENT_ENTITY_INFO } from './entity-info/defect-main-document-entity-info.model';
import { DEFECT_FORM_DATA_ENTITY_INFO } from './entity-info/defect-form-data-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DEFECT_MEETING_ENTITY_INFO } from './entity-info/defect-meeting-entity-info.model';
import { DEFECT_MAIN_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/defect-pin-board-container-info.model';
import { DEFECT_MAIN_PHOTO_CONTAINER_DEFINITION } from '../defect-main-photo-container-definition';
import { DEFECT_MAIN_2D_VIEWER_ENTITY_INFO } from './entity-info/defect-main-2d-viewer-entity-info.model';

/**
 * The module info object for the `defect.main` content module.
 */
export class DefectMainModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: DefectMainModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): DefectMainModuleInfo {
		if (!this._instance) {
			this._instance = new DefectMainModuleInfo();
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
		return 'defect.main';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [DEFECT_MAIN_HEADER_ENTITY_INFO, DEFECT_CLERK_ENTITY_INFO, DEFECT_MAIN_DOCUMENT_ENTITY_INFO, DEFECT_FORM_DATA_ENTITY_INFO, DEFECT_MEETING_ENTITY_INFO, DEFECT_CHECKLIST_FORM_DATA_ENTITY_INFO];
	}

	/**
	 * Returns the definitions of all containers that are available in the module.
	 */
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([DEFECT_MAIN_PIN_BOARD_CONTAINER_DEFINITION, DEFECT_MAIN_PHOTO_CONTAINER_DEFINITION,DEFECT_MAIN_2D_VIEWER_ENTITY_INFO]);
	}

	/**
	 * Loads the translation file used for module
	 */
	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'basics.customize', 'basics.clerk', 'documents.shared', 'hsqe.checklist', 'basics.procurementstructure', 'procurement.common', 'procurement.invoice', 'basics.meeting','model.wdeviewer'];
	}
}
