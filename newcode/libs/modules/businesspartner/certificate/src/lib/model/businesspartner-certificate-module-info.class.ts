/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BP_CERTIFICATE_ENTITY_INFO } from './entity-info/certificate-entity-info.model';
import { CERTIFICATE_REMINDER_ENTITY } from './entity-info/certificate-reminder-entity-info.model';
import { CERTIFICATE_CHARACTERISTIC_ENTITY_INFO } from './entity-info/certificate-characteristic-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { BusinesspartnerCertificateDocumentProjectDataService } from '../services/certificate-document-project-data.service';
import { Injector } from '@angular/core';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService, BasicsSharedCertificateStatusLookupService, BasicsSharedCertificateTypeLookupService } from '@libs/basics/shared';
import { BPCertificateChangeProjectDocumentRubricCategoryWizardService } from '../services/wizards/change-project-document-rubric-category-wizard.service';
import { BP_CERTIFICATE_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/certificate-pin-board-container-info.model';
import { IInitializationContext, ServiceLocator } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';

export class BusinesspartnerCertificateModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new BusinesspartnerCertificateModuleInfo();

	private constructor() {
		super();
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector, this.internalModuleName, this.featureRegistry, BPCertificateChangeProjectDocumentRubricCategoryWizardService);
	}

	private readonly bpCertificateDocumentProjectEntityInfo = DocumentProjectEntityInfoService.create(this.internalPascalCasedModuleName, BusinesspartnerCertificateDocumentProjectDataService);
	private readonly bpCertificatePDFViewerContainerDef = DrawingContainerDefinition.createPDFViewer({
		uuid: 'dc512f4288b4459ea7a32af09407e8f7',
	});

	public override get internalModuleName(): string {
		return MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificateModuleName;
	}

	public override get entities(): EntityInfo[] {
		return [BP_CERTIFICATE_ENTITY_INFO, CERTIFICATE_REMINDER_ENTITY, CERTIFICATE_CHARACTERISTIC_ENTITY_INFO, ...this.bpCertificateDocumentProjectEntityInfo];
	}

	/**
	 * Loads the translation file used for business partner certificate
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName, 'basics.characteristic', 'model.wdeviewer', MODULE_INFO_BUSINESSPARTNER.documentsSharedModuleName, 'cloud.common']);
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			this.bpCertificatePDFViewerContainerDef,
			BP_CERTIFICATE_PIN_BOARD_CONTAINER_DEFINITION
		]);
	}

	protected override async doPrepareModule(context: IInitializationContext): Promise<void> {
		await Promise.all([
			super.doPrepareModule(context),
			firstValueFrom(ServiceLocator.injector.get(BasicsSharedCertificateTypeLookupService).getList()),
			firstValueFrom(ServiceLocator.injector.get(BasicsSharedCertificateStatusLookupService).getList()),
		]);
	}
}