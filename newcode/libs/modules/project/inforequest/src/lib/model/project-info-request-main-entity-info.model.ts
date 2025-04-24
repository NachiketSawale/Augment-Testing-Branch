/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectInfoRequestDataService } from '../services/project-info-request-data.service';
import { ProjectInfoRequestValidationService } from '../services/project-info-request-data-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IProjectInfoRequestEntity } from '@libs/project/interfaces';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';
import { createLookup, FieldType } from '@libs/ui/common';
import { BusinessPartnerLookupService, BusinesspartnerSharedContactLookupService } from '@libs/businesspartner/shared';
import { BasicsCompanyLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProcurementShareContractLookupService } from '@libs/procurement/shared';
import { BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';

export const PROJECT_INFO_REQUEST_MAIN_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: '',
			key: 'project.inforequest.projectInfoRequestListTitle'
		},
	},
	form: {
		title: {
			text: '',
			key: 'project.inforequest.projectInfoRequestDetailTitle'
		},
		containerUuid: '8b9c47c94f0b4077beaaab998c399048'
	},
	dataService: (ctx) => ctx.injector.get(ProjectInfoRequestDataService),
	validationService: (ctx) => ctx.injector.get(ProjectInfoRequestValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Project.InfoRequest',
		typeName: 'InfoRequestDto'
	},
	permissionUuid: '281de48b068c443c9b7c62a7f51ac45f',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'Code',
					'Description',
					'ProjectFk',
					'ModelFk',
					// 'MarkerFk',  ToDo: not visible in the old version
					// 'ObjectSetFk', ToDo: not visible in the old version
					'RequestStatusFk',
					'RequestGroupFk',
					'RequestTypeFk',
					'Specification',
					'ClerkRaisedByFk',
					'ClerkResponsibleFk',
					'ClerkCurrentFk',
					'BusinesspartnerFk',
					'ContactFk',
					'DateRaised',
					'DateDue',
					'SearchPattern',
					'CompanyFk',
					'Rfi2DefectTypeFk',
					'Rfi2ChangeTypeFk',
					'RubricCategoryFk',
					'HeaderFk',
					'Remark',
					'PriorityFk',
					'SubsidiaryFk',
					'UserDefined1',
					'UserDefined2',
					'UserDefined3',
					'UserDefined4',
					'UserDefined5',
				]
			},
		],
		overloads: {
			ProjectFk: ProjectSharedLookupOverloadProvider.provideProjectLookupOverload(false),
			// ToDo:	ModelFk:, //:DEV-6085: model lookup
			//	MarkerFk:, ToDo: not visible in the old version
			// ObjectSetFk, ToDo: not visible in the old version
			RequestStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideRfIStatusLookupOverload(true),
			GroupEurolistFk: ResourceSharedLookupOverloadProvider.provideEquipmentGroupEurolistLookupOverload(true),
			RequestGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideRfIGroupLookupOverload(true),
			RequestTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideRfITypeLookupOverload(true),
			ClerkRaisedByFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			ClerkResponsibleFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			ClerkCurrentFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			BusinesspartnerFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService
				})
			},
			ContactFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedContactLookupService,
					showClearButton: true
				})
			},
			CompanyFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyLookupService,
					showDescription: true,
					descriptionMember: 'CompanyName'
				})
			},
			Rfi2DefectTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideRequestForInfo2DefectTypeLookupOverload(true),
			Rfi2ChangeTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideRequestForInfo2ProjectChangeTypeLookupOverload(true),
			RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryLookupOverload(true),
			HeaderFk: {
				type: FieldType.Lookup,
				readonly: true,
				lookupOptions: createLookup({dataServiceToken: ProcurementShareContractLookupService})
			},
			PriorityFk: BasicsSharedCustomizeLookupOverloadProvider.providePriorityLookupOverload(true),
			SubsidiaryFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService
				})
			},
		},
		labels: {
			...prefixAllTranslationKeys('project.inforequest.', {
				ModelFk: {key: 'entityModelFk'},
				MarkerFk: {key: 'entityMarkerFk'},
				ObjectSetFk: {key: 'entityObjectSetFk'},
				RequestStatusFk: {key: 'entityRequestStatusFk'},
				RequestGroupFk: {key: 'entityRequestGroupFk'},
				RequestTypeFk: {key: 'entityRequestTypeFk'},
				ClerkRaisedByFk: {key: 'entityClerkRaisedByFk'},
				ClerkResponsibleFk: {key: 'entityClerkResponsibleFk'},
				ClerkCurrentFk: {key: 'entityClerkCurrentFk'},
				DateRaised: {key: 'entityDateRaised'},
				DateDue: {key: 'entityDateDue'},
				Rfi2DefectTypeFk: {key: 'entityRfi2DefectTypeFk'},
				Rfi2ChangeTypeFk: {key: 'entityRfi2ChangeTypeFk'},
				HeaderFk: {key: 'entityHeaderFk'},
				PriorityFk: {key: 'entityPriorityFk'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Code: {key: 'entityCode'},
				Description: {key: 'entityDescription'},
				ProjectFk: {key: 'entityProjectName'},
				Specification: {key: 'EntitySpec'},
				SearchPattern: {key: 'entitySearchPattern'},
				CompanyFk: {key: 'entityCompany'},
				Remark: {key: 'entityRemark'},
				UserDefined1: {key: 'entityUserDefined', params: {p_0: '1'}},
				UserDefined2: {key: 'entityUserDefined', params: {p_0: '2'}},
				UserDefined3: {key: 'entityUserDefined', params: {p_0: '3'}},
				UserDefined4: {key: 'entityUserDefined', params: {p_0: '4'}},
				UserDefined5: {key: 'entityUserDefined', params: {p_0: '5'}},
				SubsidiaryFk: {key: 'entitySubsidiary'}
			}),
			...prefixAllTranslationKeys('sales.contract.', {
				BusinesspartnerFk: {key: 'entityBusinesspartnerFk'},
				ContactFk: {key: 'entityContactFk'}
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				RubricCategoryFk: {key: 'rubriccategoryfk'}
			})
		}
	}
} as IEntityInfo<IProjectInfoRequestEntity>);