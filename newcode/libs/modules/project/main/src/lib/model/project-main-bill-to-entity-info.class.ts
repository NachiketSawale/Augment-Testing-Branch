/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProjectMainBillToBehavior } from '../behaviors/project-main-bill-to-behavior.service';
import { ProjectMainBillToDataService } from '../services/project-main-bill-to-data.service';
import { IProjectMainBillToEntity } from '@libs/project/interfaces';
import { createLookup, FieldType, ILookupContext } from '@libs/ui/common';
import { BusinessPartnerLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectMainBillToValidationService } from '../services/project-main-bill-to-validation.service';
import { ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';

export const projectMainBillToEntityInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'project.main' + '.billToListTitle'},
		behavior: ctx => ctx.injector.get(ProjectMainBillToBehavior),
	},
	form: {
		title: {key: 'project.main' + '.billToDetailTitle'},
		containerUuid: '0cd910bacc8b4bacac0d4a5bf5cf2319',
	},
	dataService: ctx => ctx.injector.get(ProjectMainBillToDataService),
	validationService: ctx => ctx.injector.get(ProjectMainBillToValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'ProjectBillToDto'},
	permissionUuid: '8f386520b10f4707936d7dbc36c976b8',
	layoutConfiguration: {
		groups: [
			//TODO: customer lookup is not available yet
			{gid: 'baseGroup', attributes: ['BusinessPartnerFk', /*'CustomerFk'*/ 'Code', 'Description', 'SubsidiaryFk', 'Remark', 'Comment', 'QuantityPortion', 'TotalQuantity'] },
		],
		overloads: {
			BusinessPartnerFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup( {
					dataServiceToken: BusinessPartnerLookupService,
					displayMember: 'BusinessPartnerName1',
				})
			},
			SubsidiaryFk: {
				type: FieldType.Lookup,
				readonly: true,
				lookupOptions: createLookup<IProjectMainBillToEntity, ISubsidiaryLookupEntity>({
					dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
					clientSideFilter: {
						execute(item: ISubsidiaryLookupEntity, context: ILookupContext<ISubsidiaryLookupEntity, IProjectMainBillToEntity>): boolean {
							return context.entity?.BusinessPartnerFk === item.BusinessPartnerFk;
						}
					}
				})
			},
		},
		labels: {
			...prefixAllTranslationKeys('project.main.', {
				QuantityPortion: { key: 'quantityPortion' },
				TotalQuantity: { key: 'totalQuantity'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Comment: { key: 'entityCommentText' },
				SubsidiaryFk: { key: 'entitySubsidiary'},
				Remark: { key: 'entityRemark' },
				TelephoneNumberFk: { key: 'TelephoneDialogPhoneNumber' },
				Email: { key: 'email' },
				BusinessPartnerFk: {key: 'businessPartner'},
				CustomerFk: {key: 'entityCustomer'},

			}),
		},
	}

} as IEntityInfo<IProjectMainBillToEntity>);