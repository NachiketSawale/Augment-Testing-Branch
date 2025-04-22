import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider
} from '@libs/basics/shared';
import { IBusinessPartnerBankEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerBankDataService } from '../../services/businesspartner-bank-data.service';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BusinessPartnerBankValidationService } from '../../services/validations/businesspartner-bank-validation.service';
import { BusinesspartnerBankGridBehavior } from '../../behaviors/businesspartner-bank-grid-behavior.service';

export const BUSINESS_PARTNER_BANK_ENTITY_INFO = EntityInfo.create<IBusinessPartnerBankEntity>({
	grid: {
		behavior: (ctx) => ctx.injector.get(BusinesspartnerBankGridBehavior),
		title: { text: 'Banks', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.bankContainerTitle' },
	},
	form: {
		title: { text: 'Bank Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.bankContainerDetailTitle' },
		containerUuid: 'a484373668e242cd8e6f220874c4f533'
	},
	dataService: (ctx) => ctx.injector.get(BusinessPartnerBankDataService),
	validationService: (ctx) => ctx.injector.get(BusinessPartnerBankValidationService),

	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'BankDto' },
	permissionUuid: '44bd90285b354396a90efb0f8466c0c9',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				'attributes': ['BpdBankStatusFk', 'IsLive', 'BankTypeFk', 'BankFk', 'Iban', 'AccountNo', 'CountryFk', 'IsDefault', 'CompanyFk',
					'IsDefaultCustomer']
			},
			{
				gid: 'userDefined',
				attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3']
			},

		],
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
				IsLive: {key: 'isLive'},
				IsDefaultCustomer: {key: 'bankIsDefaultCustomer'},
				IsDefault:{key: 'bankIsDefaultSupplier'}
			}),
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
				BankTypeFk: {key: 'entityType'},
				BankFk: {key: 'entityBankName'},
				Iban: {key: 'entityBankIBan'},
				AccountNo: {key: 'entityBankAccountNo'},
				CountryFk: {key: 'entityCountry'},
				CompanyFk: {key: 'entityCompany'},
				UserDefined1: {key: 'entityUserDefined', params: {p_0: '1'}},
				UserDefined2: {key: 'entityUserDefined', params: {p_0: '2'}},
				UserDefined3: {key: 'entityUserDefined', params: {p_0: '3'}},
				BpdBankStatusFk: {key: 'entityStatus'},
			})
		},
		overloads: {
			//todo
			// iban type
			// bulk support
			BankTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideBankTypeLookupOverload(false),
			BankFk: BasicsSharedLookupOverloadProvider.provideBankLookupOverload(true),
			CountryFk: BasicsSharedLookupOverloadProvider.provideCommonCountryLookupOverload(false),
			CompanyFk: BasicsSharedLookupOverloadProvider.provideCompanyLookupOverload(true, 'CompanyName'),
			//todo 	att2BDisplayed:false
			// showIcon: true
			BpdBankStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideBpBankStatusReadonlyLookupOverload()
		}
	}
});