import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BusinessPartnerMainGuaranteeUsedDataService } from '../../services/guarantee-used-data.service';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IGuaranteeUsedEntity } from '@libs/businesspartner/interfaces';


export const GUARANTEE_USED_INFO_ENTITY = EntityInfo.create<IGuaranteeUsedEntity>({
	grid: {
		title: {
			text: 'Guarantee Used',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.entityGuaranteeUsed',
		},
		containerUuid: '9ec56ec643d64e4782021a0204e92dd6'
	},
	// eslint-disable-next-line strict
	dataService: (ctx) => ctx.injector.get(BusinessPartnerMainGuaranteeUsedDataService),
	dtoSchemeId: { moduleSubModule: 'BusinessPartner.Certificate', typeName: 'CertificateDto' },
	permissionUuid: 'ddf49471e5944a5f8b8de31c9715375e',
	layoutConfiguration:{
		groups:[
			{gid: 'basicData', attributes:['CertificateTypeFk', 'OrdHeaderFk', 'Amount', 'CertificateDate', 'ValidFrom', 'ValidTo', 'DischargedDate']},
		],
		overloads: {
			OrdHeaderFk: ProcurementSharedLookupOverloadProvider.provideContractReadonlyLookupOverload(),
			CertificateTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCertificateTypeReadonlyLookupOverload(),
		},
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
				DischargedDate: { key: 'entityDischargedDate'},
				Validfrom: { text: 'Valid From'},
				Validto: { text: 'Valid To'},
				CertificateDate: { text: 'Date'},
				Amount: { text: 'Amount'},
				OrdHeaderFk: { text: 'Sales Contract'},
				CertificateTypeFk: { text: 'Guarantee Type'}
			})
		}
	}
});