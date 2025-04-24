/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyControllingGroupDetailDataService } from '../services/basics-company-controlling-group-detail-data.service';
import { ICompanyControllingGroupEntity } from '@libs/basics/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';


 export const BASICS_COMPANY_CONTROLLING_GROUP_DETAIL_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyControllingGroupEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.containerTitleControllingGroupAssignments'}
                },
                form: {
			    title: { key: 'basics.company' + '.containerTitleControllingGroupAssignmentsForm' },
			    containerUuid: 'bed9a6d24ff846feb25ff940c56f5778',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyControllingGroupDetailDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyControllingGroupDto'},
                permissionUuid: '05639a870ca24107b71b7b7501851c93',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['ControllingGroupFk', 'ControllingGrpDetailFk'],
						 }
					 ],
					 overloads: {
						 ControllingGroupFk:BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupLookupOverload(true),
						 ControllingGrpDetailFk:BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),
					},
					 labels: {
						 ...prefixAllTranslationKeys('basics.company.', {
							 ControllingGroupFk: {key: 'entityControllinggroupFk'},
							 ControllingGrpDetailFk: {key: 'entityControllinggroupdetailFk'},
						 }),
					 }
				 }

            });