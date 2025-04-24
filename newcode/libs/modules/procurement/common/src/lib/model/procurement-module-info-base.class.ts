/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase } from '@libs/ui/business-base';
import { IInitializationContext, prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import {
	BasicsSharedProcurementPaymentScheduleStatusLookupService,
	BasicsSharedProcurementConfigurationLookupService,
	BasicsSharedRoundingFactoryService,
	BasicsSharedRoundingModule as roundingModule,
	BasicsSharedCalculateOverGrossService, BasicsSharedProcurementConfigurationHeaderLookupService, BasicsSharedCompanyContextService
} from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { ProcurementCommonCompanyContextService, ProcurementCommonVatPercentageService } from '../services';
import { PrcSharedTotalTypeLookupService } from '@libs/procurement/shared';

/**
 * Procurement module info base, placing common settings for all procurement modules
 */
export abstract class PrcModuleInfoBase extends BusinessModuleInfoBase {
	/**
	 * Loads the translation file used for procurement modules
	 */
	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'procurement.common',
			'procurement.stock',
			'basics.common',
			'basics.customize',
			'basics.company',
			'cloud.desktop',
			'cloud.common',
			'documents.shared',
			'boq.main',
			'basics.shared',
			'businesspartner.contact',
			'boq.main',
			'basics.material',
			'procurement.rfq',
			'businesspartner.main',
			'controlling.structure',
			'basics.characteristic',
			'businesspartner.certificate',
			'model.wdeviewer',
			'basics.currency',
			'procurement.package',
			'basics.materialcatalog',
			'procurement.quote'
		];
	}

	/**
	 * get customize prc document layout configuration
	 * @protected
	 */
	protected getCustomizePrcDocumentLayoutConfig():object{
		return {
			groups:[{
				'gid': 'basicData',
				'title': {
					'key': 'cloud.common.entityProperties',
					'text': 'Basic Data'
				},
				'attributes': [
					'PrcDocumentTypeFk',
					'Url',
					'PrcDocumentStatusFk'
				]
			}
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					PrcDocumentTypeFk: {
						key: 'document.prcDocumentType',
						text: 'Document Type',
					},
					Url: {
						key: 'entityUrl',
						text: 'Url',
					},
					PrcDocumentStatusFk: {
						key: 'entityPrcDocumentStatusFk',
						text: 'Status',
					},
				}),
			},
		};
	}

	protected override async doPrepareModule(context: IInitializationContext): Promise<void> {
		await Promise.all([
			super.doPrepareModule(context),
			ServiceLocator.injector.get(BasicsSharedCompanyContextService).prepareLoginCompany(),
			// todo - ProcurementCommonCompanyContextService should be removed
			ServiceLocator.injector.get(ProcurementCommonCompanyContextService).prepareLoginCompany(),
			BasicsSharedRoundingFactoryService.getService(roundingModule.basicsMaterial).loadRounding(),
			ServiceLocator.injector.get(BasicsSharedCalculateOverGrossService).loadIsCalculateOverGross(),
			ServiceLocator.injector.get(ProcurementCommonVatPercentageService).getTaxCodeNMatrixData(),
			firstValueFrom(ServiceLocator.injector.get(BasicsSharedProcurementConfigurationHeaderLookupService).getList()),
			firstValueFrom(ServiceLocator.injector.get(BasicsSharedProcurementConfigurationLookupService).getList()),
			firstValueFrom(ServiceLocator.injector.get(BasicsSharedProcurementPaymentScheduleStatusLookupService).getList()),
			firstValueFrom(ServiceLocator.injector.get(PrcSharedTotalTypeLookupService).getList()),
		]);
	}
}
