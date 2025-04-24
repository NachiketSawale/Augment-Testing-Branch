/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType } from '@libs/ui/common';

import { PpsFabricationunitDataService } from '../services/pps-fabricationunit-data.service';
import { IPpsFabricationUnitEntity } from './entities/pps-fabrication-unit-entity.interface';


export const PPS_FABRICATIONUNIT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsFabricationUnitEntity>({
	grid: {
		title: { key: 'productionplanning.fabricationunit.listTitle' },
		containerUuid: '5dee0cf56ed04413939677ab8e4964fe',
	},
	form: {
		title: { key: 'productionplanning.fabricationunit.detailsTitle' },
		containerUuid: '0547263004624c20b73a8a5922cca1fe',
	},
	dataService: ctx => ctx.injector.get(PpsFabricationunitDataService),
	dtoSchemeId: { moduleSubModule: 'Productionplanning.Fabricationunit', typeName: 'PpsFabricationUnitDto' },
	permissionUuid: 'bca1c47dfd91434b8eaab67d4bb961bd',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['Code', 'ExternalCode', 'Description', 'CommentText', 'IsLive',
					'PpsProductionSetMainFk', 'BasSiteFk', 'EventTypeFk', 'PpsProdPlaceTypeFk', 'PpsProductionPlaceFk', 'PpsStrandPatternFk',
					'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']
			},
			{
				gid: 'planningInfoGroup',
				attributes: ['Quantity', 'ActualQuantity', 'RemainingQuantity', 'PlannedStart',
					'PlannedFinish', 'EarliestStart', 'LatestStart', 'EarliestFinish', 'LatestFinish',
					'DateshiftMode', 'BasUomFk']
			}],
		overloads: {
			EventTypeFk: BasicsSharedLookupOverloadProvider.provideEventTypeLookupOverload(true),
			PpsProdPlaceTypeFk: BasicsSharedLookupOverloadProvider.providePpsProductPlaceTypeLookupOverload(true),
			BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UserDefined1: {
				label: {
					text: '*User-Defined 1',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '1' }
				},
				type: FieldType.Description
			},
			UserDefined2: {
				label: {
					text: '*User-Defined 2',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '2' }
				},
				type: FieldType.Description
			},
			UserDefined3: {
				label: {
					text: '*User-Defined 3',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '3' }
				},
				type: FieldType.Description
			},
			UserDefined4: {
				label: {
					text: '*User-Defined 4',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '4' }
				},
				type: FieldType.Description
			},
			UserDefined5: {
				label: {
					text: '*User-Defined 5',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '5' }
				},
				type: FieldType.Description
			},
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Code: { key: 'entityCode', text: '*Code' },
				Description: { key: 'entityDescription', text: '*Description' },
				Sorting: { key: 'entitySorting', text: '*Sorting' },
				IsLive: { key: 'entityIsLive', text: '*Active' },
				CommentText: { key: 'entityComment', text: '*CommentText' },
				BasUomFk: { key: 'entityUoM', text: '*UoM' },
			}),
			...prefixAllTranslationKeys('productionplanning.common.', {
				ExternalCode: { key: 'product.externalCode', text: '*ExternalCode' },
				PpsProductionSetMainFk: { key: 'product.productionSetFk', text: '*Production Set' },
				PlannedStart: { key: 'event.plannedStart', text: '*Planned StartDate' },
				PlannedFinish: { key: 'event.plannedFinish', text: '*Planned FinishDate' },
				EarliestStart: { key: 'event.earliestStart', text: '*Planned EarliestStart' },
				LatestStart: { key: 'event.latestStart', text: '*Planned LatestStart' },
				EarliestFinish: { key: 'event.earliestFinish', text: '*Planned EarliestFinish' },
				LatestFinish: { key: 'event.latestFinish', text: '*Planned LatestFinish' },
				Quantity: { key: 'entityPlannedQuantity', text: '*Planned Quantity' },
				RemainingQuantity: { key: 'remainingQuantity', text: '*Remaining Quantity' },
				ActualQuantity: { key: 'actualQuantity', text: '*Actual Quantity' },
				DateshiftMode: { key: 'event.dateshiftMode', text: '*DateShift Mode' },
			}),
			...prefixAllTranslationKeys('basics.site.', {
				BasSiteFk: { key: 'entitySite', text: '*Site' },
			}),
			...prefixAllTranslationKeys('productionplanning.fabricationunit.', {
				PpsProdPlaceTypeFk: { key: 'prodPlaceType', text: '*Production Place Type' },
				EventTypeFk: { key: 'entityEventTypeFk', text: '*Fabrication Unit Type' },
				PpsStrandPatternFk: { key: 'entityPpsStrandPatternFk', text: '*Strand Pattern' },
				PpsProductionPlaceFk: { key: 'prodPlace', text: '*Production Place' },
			}),
		}
	}
});