/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { DocumentsCentralQueryHeaderService } from '../document-header/documents-centralquery-header.service';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { Injector } from '@angular/core';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService } from '@libs/basics/shared';
import { ChangeProjectDocumentRubricCategoryWizardService } from '../service/wizards/change-project-document-rubric-category-wizard.service';
import { DocumentsCentralqueryHeaderBehaviorService } from '../behaviors/documents-centralquery-header-behavior.service';

export class DocumentsCentralQueryModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: DocumentsCentralQueryModuleInfo;

	public static get instance(): DocumentsCentralQueryModuleInfo {
		if (!this._instance) {
			this._instance = new DocumentsCentralQueryModuleInfo();
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

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector, this.internalModuleName, this.featureRegistry, ChangeProjectDocumentRubricCategoryWizardService);
	}

	public override get internalModuleName(): string {
		return 'documents.centralquery';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'Documents.CentralQuery';
	}

	private readonly documentEntityInfo: EntityInfo[] = DocumentProjectEntityInfoService.create(this.internalPascalCasedModuleName, DocumentsCentralQueryHeaderService, DocumentsCentralqueryHeaderBehaviorService);

	public override get entities(): EntityInfo[] {
		return this.documentEntityInfo;
	}

	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'documents.shared', 'model.wdeviewer', 'cloud.common'];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: '5e0c9dc352734a45b4db317cf3cdaa36',
			}),
		]);
	}
}
