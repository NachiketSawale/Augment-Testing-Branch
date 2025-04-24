/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { PROJECT_INFO_REQUEST_MAIN_ENTITY_INFO } from './project-info-request-main-entity-info.model';
import { PROJECT_INFO_REQUEST_2_EXTERNAL_ENTITY_INFO } from './project-info-request-2-external-entity-info.model';
import { PROJECT_INFO_REQUEST_REFERENCE_ENTITY_INFO } from './project-info-request-reference-entity-info.model';
import { PROJECT_INFO_REQUEST_RELEVANT_TO_ENTITY_INFO } from './project-info-request-request-relevant-to-entity-info.model';
import { EntityInfo, BusinessModuleInfoBase } from '@libs/ui/business-base';




export class ProjectInfoRequestModuleInfo extends BusinessModuleInfoBase {

	private static _instance?: ProjectInfoRequestModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProjectInfoRequestModuleInfo {
		if (!this._instance) {
			this._instance = new ProjectInfoRequestModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'project.inforequest';
	}
	public override get internalPascalCasedModuleName(): string {
		return 'Project.InfoRequest';
	}

	public override get entities(): EntityInfo[] {
		return [
			PROJECT_INFO_REQUEST_MAIN_ENTITY_INFO,
			PROJECT_INFO_REQUEST_2_EXTERNAL_ENTITY_INFO,
			PROJECT_INFO_REQUEST_REFERENCE_ENTITY_INFO,
			//ToDo:  projectInfoRequestRequest2MdlObjectVModuleInfo,  // View
			PROJECT_INFO_REQUEST_RELEVANT_TO_ENTITY_INFO,
			//ToDo: ModelAnnotationModelAnnotationModuleInfo // ModelAnnotationModuleInfo not yet created in model
			//ToDo: DocumentsProjectDocumentsProjectModuleInfo // DocumentsProject not yet created in documents //Uuid: '39d0d1c6753b49029b3c953165f8ceb7' not found ModuleInfo
			//ToDo: modelAnnotationCameraList // AnnotationCamera not yet created in model //Uuid:1278a2ca11f947bb8e02eab65e815a7d not found ModuleInfo
			//ToDo: AnnotationMarkerList // AnnotationCamera not yet created in model //Uuid: cf264c9dbb51466cb147e1a7f7f5d888 not found ModuleInfo

		];
	}
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common', 'basics.customize', 'sales.contract'];
	}

}