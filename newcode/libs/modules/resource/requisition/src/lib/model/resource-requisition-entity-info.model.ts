/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ResourceRequisitionDataService } from '../services/resource-requisition-data.service';
import { IRequisitionEntity } from '@libs/resource/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { ResourceRequisitionValidationService } from '../services/resource-requisition-validation.service';

export const RESOURCE_REQUISITION_ENTITY_INFO: EntityInfo = EntityInfo.create<IRequisitionEntity>({
	grid: {
		title: {key: 'resource.requisition' + '.requisitionListTitle'},
	},
	form: {
		title: {key: 'resource.requisition' + '.requisitionDetailTitle'},
		containerUuid: '44398421b57043bc906469bf7b9991eb',
	},
	dataService: ctx => ctx.injector.get(ResourceRequisitionDataService),
	validationService: (ctx) => ctx.injector.get(ResourceRequisitionValidationService),
	dtoSchemeId: {moduleSubModule: 'Resource.Requisition', typeName: 'RequisitionDto'},
	permissionUuid: '291a21ca7ab94d549d2d0c541ec09f5d',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['RubricCategoryFk', 'ResourceContextFk', 'ClerkResponsibleFk', 'StockFk', 'ProjectFk', 'TypeFk', 'UomFk', 'MaterialFk', 'Description', 'Quantity', 'RequestedFrom', 'RequestedTo', 'ReservedFrom', 'ReservedTo'
					, 'CommentText', 'IsLinkedFixToReservation', 'ReservationId', 'UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05',
					'Remark', 'SearchPattern', 'Code'],
			}
		],
		// TODO:Lookups:JobFk,ActivityFk,TrsRequisitionFk,PpsEventFk,ClerkOwnerFk,RequisitionGroupFk,RequisitionPriorityFk,RequisitionTypeFk,RequisitionFk,JobPreferredFk,ProjectChangeFk,EstHeaderFk,EstLineItemFk,EstResourceFk,ResourceFk',RequisitionStatusFk,
		overloads: {
			ResourceContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideResourceContextLookupOverload(true),
			ProjectFk: ProjectSharedLookupOverloadProvider.provideProjectLookupOverload(true),
			TypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideBillTypeLookupOverload(false),
			UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			MaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),
			ClerkResponsibleFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			StockFk: BasicsSharedLookupOverloadProvider.providePrcStockTransactionTypeLookupOverload(true),
			RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Description: {key: 'entityDescription'},
				ProjectFk: {key: 'entityProject'},
				Quantity: {key: 'entityQuantity'},
				UomFk: {key: 'entityUoM'},
				Remark: {key: 'DocumentBackup_Remark'},
				SearchPattern: {key: 'entitySearchPattern'},
				CommentText: {key: 'entityComment'},
				SiteFk: {key: 'entitySite'},
				UserDefinedText01: {
					key: 'entityUserDefText',
					params: {p_0: '1'},
				},
				UserDefinedText02: {
					key: 'entityUserDefText',
					params: {p_0: '2'},
				},
				UserDefinedText03: {
					key: 'entityUserDefText',
					params: {p_0: '3'},
				},
				UserDefinedText04: {
					key: 'entityUserDefText',
					params: {p_0: '4'},
				},
				UserDefinedText05: {
					key: 'entityUserDefText',
					params: {p_0: '5'},
				},

			}), ...prefixAllTranslationKeys('controlling.structure.', {
				StockFk: {key: 'stock'},

			}), ...prefixAllTranslationKeys('basics.company.', {
				ResourceContextFk: {key: 'entityResourceContextFk'},
				RubricCategoryFk: {key: 'entityBasRubricCategoryFk'},

			}), ...prefixAllTranslationKeys('basics.material.', {
				MaterialFk: {key: 'record.materialGroup'},
			}), ...prefixAllTranslationKeys('basics.requisition.', {
				RequestedFrom: {key: 'entityRequestedFrom'},
				RequestedTo: {key: 'entityRequestedTo'},
				ReservedFrom: {key: 'entityReservedFrom'},
				ReservedTo: {key: 'entityReservedTo'},
				IsLinkedFixToReservation: {key: 'entityIsLinkedFixToReservation'},
				ReservationId: {key: 'ReservationId'},
				Code: {key: 'entityCode'},

			})

		}
	},
});