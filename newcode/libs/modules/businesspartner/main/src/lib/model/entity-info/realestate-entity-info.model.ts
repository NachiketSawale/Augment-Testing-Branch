import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { FieldType } from '@libs/ui/common';
import {
	BasicsSharedAddressDialogComponent, BasicsSharedTelephoneDialogComponent, createFormDialogLookupProvider,
	BasicsSharedCustomizeLookupOverloadProvider
} from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BusinessPartnerMainRealestateDataService } from '../../services/realestate-data.service';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, IRealEstateEntity } from '@libs/businesspartner/interfaces';

export const REALESTATE_ENTITY_INFO = EntityInfo.create<IRealEstateEntity>({
	grid: {
		title: {
			text: 'Objects of Customer',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.realEstateGridContainerTitle',
		},
		containerUuid: '72121ad6a4774cbea673753606fb19d2'
	},
	form: {
		title: {
			text: 'Objects of Customer Detail',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.realEstateDetailContainerTitle',
		},
		containerUuid: 'cdc1a6ecee8946079c1cccb1215b931b',
	},
	// eslint-disable-next-line strict
	dataService: (ctx) => ctx.injector.get(BusinessPartnerMainRealestateDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'RealEstateDto' },
	permissionUuid: '72121ad6a4774cbea673753606fb19d2',
	layoutConfiguration: async ctx => {
		const bpRelatedLookupProvider = await (ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN));
		return {
			groups: [
				{ gid: 'basicData', attributes: ['RealestateTypeFk', 'ObjectName', 'Address', 'SubsidiaryFk', 'Remark', 'Potential', 'LastAction', 'TelephoneNumber', 'TelephoneNumberTeleFax'] }
			],
			overloads: {
				RealestateTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideRealestateTypeLookupOverload(false),
				Address: {
					label: { text: 'Street', key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityAddress' }, visible: true, type: FieldType.CustomComponent,
					componentType: BasicsSharedAddressDialogComponent,
					providers: createFormDialogLookupProvider({
						showSearchButton: true,
						showPopupButton: true
					}),
				},
				SubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload(),
				TelephoneNumber: {
					label: { text: 'Telephone', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.telephoneNumber' }, visible: true,
					type: FieldType.CustomComponent,
					componentType: BasicsSharedTelephoneDialogComponent,
					providers: createFormDialogLookupProvider({
						showSearchButton: true,
						showPopupButton: true
					})
				},
				TelephoneNumberTeleFax: {
					label: { text: 'Telefax', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.telephoneFax' }, visible: true,
					type: FieldType.CustomComponent,
					componentType: BasicsSharedTelephoneDialogComponent,
					providers: createFormDialogLookupProvider({
						showSearchButton: true,
						showPopupButton: true
					})
				}
			},
			labels: {
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
					ObjectName: { key: 'objectName' },
					Potential: { key: 'potential' },
					LastAction: { key: 'lastAction' },
					TelephoneNumber: { key: 'telephoneNumber' },
					TelephoneNumberTeleFax: { key: 'telephoneFax' }
				}),
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
					Remark: { key: 'entityRemark' },
					RealestateTypeFk: { key: 'entityType', text: 'Type' },
					Address: { key: 'entityAddress' },
					SubsidiaryFk: { key: 'entitySubsidiary' }
				})
			}
		};
	}
});