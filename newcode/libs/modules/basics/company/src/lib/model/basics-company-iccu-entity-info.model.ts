	/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyICCuDataService } from '../services/basics-company-iccu-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICompanyICCuEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_ICCU_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyICCuEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.ICControllingUnitListTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.ICControllingUnitDetailTitle' },
			    containerUuid: '3bff3962163b4ab49afda5a5e9199e0c',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyICCuDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyICCuDto'},
                permissionUuid: 'a4bfa1b188fa4732a7dea63c536a9959',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['CompanyReceivingFk','ControllingUnitFk','CommentText'],
						 },
						 {
							 gid:'User-Defined Texts',attributes:['UserDefined1'],
						 }],
					 overloads: {
						 // TO DO CompanyReceivingFk, ControllingUnitFk
					 },
					 labels: {
						 ...prefixAllTranslationKeys('cloud.common.', {
							 CommentText: {key: 'entityComment'},
						 }),
						 ...prefixAllTranslationKeys('basics.company.', {
							 /*CompanyReceivingFk: {key: 'entityReceivingCompany'},
							 ControllingUnitFk: {key: 'entityControllingUnit'},*/

						}),
					 }
				 }
	         });