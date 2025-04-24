/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyCategoryDataService } from '../services/basics-company-category-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IRubricCategory2CompanyEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_CATEGORY_ENTITY_INFO: EntityInfo = EntityInfo.create<IRubricCategory2CompanyEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listCategoryTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailCategoryTitle' },
			    containerUuid: 'E8B8B6571FE64C90925A0FC49486AC64',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyCategoryDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'RubricCategory2CompanyDto'},
                permissionUuid: 'D006FFC4E4764CF68E2DF6865DC5F04E',
					 layoutConfiguration: {
						 groups: [
							 {
								 gid: 'Basic Data',
								 attributes: ['RubricFk', 'RubricCategoryFk'],
							 }
						 ],
						 overloads: {
							 RubricFk:BasicsSharedCustomizeLookupOverloadProvider.provideRubricLookupOverload(true),
							 RubricCategoryFk:BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryLookupOverload(true),
						},
						 labels: {
							 ...prefixAllTranslationKeys('basics.company.', {
								 RubricFk: {key: 'entityBasRubricFk'},
								 RubricCategoryFk: {key: 'entityBasRubricCategoryFk'},
							 }),
						 }
					 }

            });