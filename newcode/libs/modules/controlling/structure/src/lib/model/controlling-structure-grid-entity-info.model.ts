/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingStructureGridDataService } from '../services/controlling-structure-grid-data.service';
import { IControllingUnitEntity } from './models';
import { BasicsCompanyLookupService, BasicsShareControllingUnitLookupService, BasicsSharedClerkLookupService, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { FieldType, IGridTreeConfiguration, createLookup } from '@libs/ui/common';

export const CONTROLLING_STRUCTURE_GRID_ENTITY_INFO: EntityInfo = EntityInfo.create<IControllingUnitEntity>({
	grid: {
		title: {key: 'controlling.structure.containerTitleControllingUnitsTable'},
		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: IControllingUnitEntity) {
					const service = ctx.injector.get(ControllingStructureGridDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IControllingUnitEntity) {
					const service = ctx.injector.get(ControllingStructureGridDataService);
					return service.childrenOf(entity);
				}
			} as IGridTreeConfiguration<IControllingUnitEntity>;
		}
	},
	form: {
		title: {key: 'controlling.structure.containerTitleControllingUnitsForm'},
		containerUuid: '7D688DE3485B440D92154D7C19F376F7',
	},
	dataService: ctx => ctx.injector.get(ControllingStructureGridDataService),
	dtoSchemeId: {moduleSubModule: 'Controlling.Structure', typeName: 'ControllingUnitDto'},
	permissionUuid: '011CB0B627E448389850CDF372709F67',

	layoutConfiguration: {
		groups: [
			{
				gid: 'Basic Data',
				attributes: ['Structure', 'Code', 'DescriptionInfo', 'ControllingunitstatusFk', 'ProjectFk',
					'ControllingCatFk', 'CompanyFk', 'ClerkFk', 'Duration', 'Quantity', 'Asset managment', 'StockFk', 'Budget', 'IsBillingElement', 'IsAccountingElement', 'IsAssetmanagement',
					'IsDefault', 'IsFixedBudget', 'IsIntercompany', 'IsLive', 'IsPlanningElement',
					'IsPlantmanagement', 'IsStockmanagement', 'IsTimekeepingElement', 'EstimateCost', 'PlannedEnd', 'PlannedStart', 'PlannedDuration'],
			},
			{gid: 'Assignements', attributes: ['Assignment01', 'Assignment02', 'Assignment03', 'Assignment04', 'Assignment05', 'Assignment06', 'Assignment07', 'Assignment08', 'Assignment09', 'Assignment10']},
			{gid: 'User Defined Text', attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']},
		],
		overloads: {
			Code: {label: {text: 'Code', key: 'Code'}, visible: true, readonly: true},
			DescriptionInfo: {label: {text: 'Description', key: 'Description'}, visible: true, readonly: true},
			ControltemplateUnitFk: BasicsSharedLookupOverloadProvider.providePrjControllingUnitTemplateLookupOverload(true),
			ControllingunitFk: {
				label: {text: 'Controlling Unit', key: 'ControllingunitFk'},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsShareControllingUnitLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description'
				})
			},
			ProjectFk: {
				label: {text: 'Project', key: 'Project'},
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: ProjectSharedLookupService,
					showDescription: true,
					descriptionMember: 'ProjectNo',

				})
			},
			ControllingCatFk: BasicsSharedLookupOverloadProvider.provideControllingCatLookupOverload(true),
			StockFk: BasicsSharedLookupOverloadProvider.providePrcStockTransactionTypeLookupOverload(true),
			ControllingunitstatusFk: BasicsSharedLookupOverloadProvider.provideControllingUnitStatusLookupOverload(true),
			UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			EtmPlantFk: BasicsSharedLookupOverloadProvider.provideEstimationTypeLookupOverload(true),
			CompanyFk: {
				label: {text: 'Company', key: 'company'},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description'
				})
			},
			ClerkFk: {
				label: {text: 'Clerk', key: 'clerk'},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description'
				})
			},
			// user defined text
			UserDefined1: {
				label: {
					text: '*User-Defined 1',
					key: 'cloud.common.entityUserDefined1',
				},
				type: FieldType.Description
			},
			UserDefined2: {
				label: {
					text: '*User-Defined 2',
					key: 'cloud.common.entityUserDefined2',
				},
				type: FieldType.Description
			},
			UserDefined3: {
				label: {
					text: '*User-Defined 3',
					key: 'cloud.common.entityUserDefined3',
				},
				type: FieldType.Description
			},
			UserDefined4: {
				label: {
					text: '*User-Defined 4',
					key: 'cloud.common.entityUserDefined4',
				},
				type: FieldType.Description
			},
			UserDefined5: {
				label: {
					text: '*User-Defined 5',
					key: 'cloud.common.entityUserDefined5',
				},
				type: FieldType.Description
			},


		},
		labels: {
			...prefixAllTranslationKeys('controlling.structure.', {
				ProjectFk: {key: 'entityProject'},
				Code: {key: 'entityCode'},
				Description: {key: 'entityDescritption'},
				ControllingunitstatusFk: {key: 'entityControllingUnitStatusFk'},
				ControllingCatFk: {key: 'entityControllingCatFk'},
				StockFk: {key: 'stock'},
				CompanyFk: {key: 'company'},
				ClerkFk: {key: 'clerk'},
				IsBillingElement: {key: 'entityIsBillingElement'},
				IsAccountingElement: {key: 'entityIsAccountingElement'},
				IsPlanningElement: {key: 'entityIsPlanningElement'},
				IsTimekeepingElement: {key: 'entityIsTimekeepingElement'},
				IsStockmanagement: {key: 'entityIsStockmanagement'},
				IsAssetmanagement: {key: 'entityIsAssetmanagement'},
				IsPlantmanagement: {key: 'entityIsPlantmanagement'},
				IsFixedBudget: {key: 'entityIsFixedBudget'},
				IsDefault: {key: 'entityIsDefault'},
				EstimateCost: {key: 'entityEstimateCost'},
				IsIntercompany: {key: 'entityIsIntercompany'},
				PlannedEnd: {key: 'entityPlannedEnd'},
				PlannedStart: {key: 'entityPlannedStart'},
				PlannedDuration: {key: 'entityPlannedDuration'},
			}),
		}
	}

});