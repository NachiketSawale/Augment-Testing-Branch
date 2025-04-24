/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { HSQE_CHECKLIST_ENTITY_INFO } from './entity-info/hsqe-checklist-entity-info.model';
import { HSQE_CHECKLIST_ACTIVITY_ENTITY_INFO } from './entity-info/hsqe-checklist-activity-entity-info.model';
import { HSQE_CHECKLIST_DOCUMENT_ENTITY_INFO } from './entity-info/hsqe-checklist-document-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { CHECKLIST_MEETING_ENTITY_INFO } from './entity-info/hsqe-checklist-meeting-entity-info.model';
import { HSQE_CHECKLIST_LOCATION_ENTITY_INFO } from './entity-info/hsqe-checklist-location-entity-info.model';
import { CHECKLIST_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/hsqe-checklist-pin-board-container-info.model';
import { HSQE_CHECKLIST_FORM_ENTITY_INFO } from './entity-info/hsqe-checklist-form-entity-info.model';
import { HSQE_CHECKLIST_GROUP_TEMPLATE_ENTITY_INFO } from './entity-info/hsqe-checklist-group-template-entity-info.model';
import { HSQE_CHECKLIST_2D_VIEWER_ENTITY_INFO } from './entity-info/hsqe-checklist-2d-viewer-entity-info.model';

/**
 * The module info object for the `hsqe.checklist` content module.
 */
export class HsqeChecklistModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: HsqeChecklistModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): HsqeChecklistModuleInfo {
		if (!this._instance) {
			this._instance = new HsqeChecklistModuleInfo();
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
		return 'hsqe.checklist';
	}

	/**
	 * Loads the translation file used
	 */
	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'defect.main', 'documents.shared', 'basics.meeting', 'hsqe.checklisttemplate', 'model.wdeviewer'];
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			HSQE_CHECKLIST_ENTITY_INFO,
			HSQE_CHECKLIST_ACTIVITY_ENTITY_INFO,
			HSQE_CHECKLIST_DOCUMENT_ENTITY_INFO,
			CHECKLIST_MEETING_ENTITY_INFO,
			HSQE_CHECKLIST_LOCATION_ENTITY_INFO,
			HSQE_CHECKLIST_FORM_ENTITY_INFO,
			HSQE_CHECKLIST_GROUP_TEMPLATE_ENTITY_INFO
		];
	}

	/**
	 * Returns the definitions of all containers that are available in the module.
	 */
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([CHECKLIST_PIN_BOARD_CONTAINER_DEFINITION, HSQE_CHECKLIST_2D_VIEWER_ENTITY_INFO]);
	}
}
