/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyTextModuleDataService } from '../services/basics-company-text-module-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ICompany2TextModuleEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_TEXT_MODULE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompany2TextModuleEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listTextModuleTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailTextModuleTitle' },
			    containerUuid: 'b22a1b0792e44782848001641da08ceb',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyTextModuleDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'Company2TextModuleDto'},
                permissionUuid: 'E94283E1A1764BD1AEF87344095773FA',
	             layoutConfiguration: {
						 groups: [
							 {
								 gid: 'Basic Data',
								 attributes: ['LanguageFk','TextModuleFk', 'TextModuleTypeFk'],
							 }
						 ],
						 overloads: {
							 LanguageFk:BasicsSharedCustomizeLookupOverloadProvider.provideLanguageLookupOverload(true),
							 TextModuleTypeFk:BasicsSharedCustomizeLookupOverloadProvider.provideTextModuleTypeLookupOverload(true),
							 //To do TextModuleFk
						 },
						 labels: {
							 ...prefixAllTranslationKeys('basics.company.', {
								 LanguageFk: {key: 'entityLanguageFk'},
								 TextModuleFk: {key: 'entityTextModuleFk'},
								 TextModuleTypeFk: {key: 'entityTextModuleTypeFk'}
							 }),
						 }
					 }

            });