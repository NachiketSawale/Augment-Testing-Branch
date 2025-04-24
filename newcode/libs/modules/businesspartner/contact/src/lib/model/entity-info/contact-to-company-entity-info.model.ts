import {EntityInfo} from '@libs/ui/business-base';
import {
	MODULE_INFO_BUSINESSPARTNER
} from '@libs/businesspartner/common';
import { ILookupContext, ServerSideFilterValueType} from '@libs/ui/common';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {Contact2CompanyDataService} from '../../services/contact-to-company-data.service';
import { BasicsSharedLookupOverloadProvider} from '@libs/basics/shared';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { IContact2BasCompanyEntity } from '@libs/businesspartner/interfaces';

export const CONTACT2COMPANY_ENTITY_INFO = EntityInfo.create<IContact2BasCompanyEntity>({
	grid: {
		title: { text: 'Registered for Company', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.contact2CompanyGridContainerTitle' },
	},
	form: {
		title: { text: 'Registered for Company Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.contact2CompanyFormContainerTitle' },
		containerUuid: 'c122d2c9aef34308889249e7870d5232'
	},
	dataService: (ctx) => ctx.injector.get(Contact2CompanyDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactPascalCasedModuleName, typeName: 'Contact2BasCompanyDto' },
	permissionUuid: 'da4c051edadb4ed9a10c6ace6a114572',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['BasCompanyFk', 'BasCompanyResponsibleFk', 'Remark', 'IsActive', 'BasClerkFk']
			},
			{
				gid: 'userDefined',
				attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3']
			}
		],
		overloads: {
			BasCompanyFk: BasicsSharedLookupOverloadProvider.provideCompanyLookupOverload(false), 
			BasCompanyResponsibleFk: BasicsSharedLookupOverloadProvider.provideCompanyLookupOverload(false, 'businesspartner.contact.companyResponsibleCompanyName', {
				key: 'business-partner-contact-to-company-responsible-company-filter',
				execute(context: ILookupContext<ICompanyEntity, IContact2BasCompanyEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
					if (context.entity) {
						return 'Id=' + context.entity.BasCompanyFk;
					}
					return 'Id=-1';
				}
			}),
			BasClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true, undefined, false, true), 
		},
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
				BasCompanyFk: { key: 'entityCompany'},
				Remark: { key: 'entityRemark' },
				UserDefined1: { key: 'entityUserDefined', params: { p_0: '1' }},
				UserDefined2: { key: 'entityUserDefined', params: { p_0: '2' }},
				UserDefined3: { key: 'entityUserDefined', params: { p_0: '3' }},
				UserDefined4: { key: 'entityUserDefined', params: { p_0: '4' }},
				UserDefined5: { key: 'entityUserDefined', params: { p_0: '5' }},
				BasClerkFk: { key: 'entityResponsible' },
				IsActive: { key: 'entityIsActive' },
			}),
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.', {
				BasCompanyResponsibleFk: {key: 'companyResponsibleCompany'},
			}),
		}
	}
});