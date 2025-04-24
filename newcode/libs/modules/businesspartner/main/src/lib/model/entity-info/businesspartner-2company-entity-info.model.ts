import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILookupContext, } from '@libs/ui/common';
import {
	BasicsSharedLookupOverloadProvider
} from '@libs/basics/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { BusinessPartner2CompanyDataService } from '../../services/businesspartner-2company-data.service';
import { IBusinessPartner2CompanyEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartner2CompanyValidationService } from '../../services/validations/businesspartner-2company-validation.service';

export const BUSINESSPARTNER_2COMPANY_ENTITY = EntityInfo.create<IBusinessPartner2CompanyEntity>({
	grid: {
		title: { text: 'Registered for Company', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.businessPartner2CompanyContainerTitle' },
	},
	form: {
		title: { text: 'Registered for Company Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.businessPartner2CompanyFormContainerTitle' },
		containerUuid: 'f7a6a2b30bc776ea84b4964dfbe65cda'
	},
	validationService: (ctx) => ctx.injector.get(BusinessPartner2CompanyValidationService),
	dataService: (ctx) => ctx.injector.get(BusinessPartner2CompanyDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'BusinessPartner2CompanyDto' },
	permissionUuid: '1e2ac147d54f452abc4fb6ad6bc62bed',
	layoutConfiguration: {
		groups: [
			{
				'gid': 'basicData',
				'attributes': ['CompanyFk', 'CompanyResponsibleFk', 'Remark', 'BasClerkFk', 'IsActive']
			},
			{
				'gid': 'userDefined',
				'attributes': ['UserDefined1', 'UserDefined2', 'UserDefined3']
			}
		],
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
				CompanyResponsibleFk: {key: 'companyResponsibleCompany'}
			}),
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
				CompanyFk: {key: 'entityCompany'},
				Remark: {key: 'entityRemark'},
				UserDefined1: {key: 'entityUserDefined', params: {p_0: '1'}},
				UserDefined2: {key: 'entityUserDefined', params: {p_0: '2'}},
				UserDefined3: {key: 'entityUserDefined', params: {p_0: '3'}},
				BasClerkFk: {key: 'entityResponsible'},
				IsActive: {key: 'entityIsActive'},
			}),
		},
		overloads: {
			CompanyFk: BasicsSharedLookupOverloadProvider.provideCompanyLookupOverload(false),
			CompanyResponsibleFk: BasicsSharedLookupOverloadProvider.provideCompanyLookupOverload(
				false, 'businesspartner.main.companyResponsibleCompanyName', {
				key: 'business-partner-to-company-responsible-company-filter',
				execute(context: ILookupContext<ICompanyEntity, IBusinessPartner2CompanyEntity>) {
					if (context?.entity?.Id) {
						return 'Id=' + context.entity.CompanyFk;
					}
					return 'Id=-1';
				},
			}),
			BasClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
		}
	}
});