/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TransportplanningTransportDataService } from '../services/transportplanning-transport-data.service';
import { ITrsRouteEntity } from './entities/trs-route-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';


 export const TRANSPORTPLANNING_TRANSPORT_ENTITY_INFO: EntityInfo = EntityInfo.create<ITrsRouteEntity> ({
	grid: {
		title: {key: 'routeListTitle'}
	},
	form: {
		title: { key: 'transportplanning.transport' + '.routeDetailTitle' },
		containerUuid: 'a967cd748f8f4f93a4651e791a4984cf',
	},
	dataService: ctx => ctx.injector.get(TransportplanningTransportDataService),
	dtoSchemeId: {moduleSubModule: 'TransportPlanning.Transport', typeName: 'TrsRouteDto'},
	permissionUuid: '1293102b4ee84cb5bd1b538fdf2ae90a',
	layoutConfiguration: {

		labels: {

			...prefixAllTranslationKeys('cloud.common.', {
				Code: { key: 'entityCode', text: '*Code' },
				Description: { key: 'entityDescription', text: '*Description' },
				TrsRteStatusFk: { key: 'entityStatus', text: '*Status' },
				CurrencyFk: { key: 'entityCurrency', text: '*Currency' },
				CommentText: { key: 'entityComment', text: '*CommentText' },
				BasUomFk: { key: 'entityUoM', text: '*UoM' },
				ProjectFk: {key: 'entityProject', text: '*Project'},
				basicData: { key: 'entityProperties', text: '*Basic Data' },
				BusinessPartnerFk: { key: 'businessPartner', text: '*Business Partner' },
				Userdefined1: {key: 'entityUserDefText', 'text': 'Text 1'},
				Userdefined2: {key: 'entityUserDefText', 'text': 'Text 2'},
				Userdefined3: {'key': 'entityUserDefText', 'text': 'Text 3'},
				Userdefined4: {'key': 'entityUserDefText', 'text': 'Text 4'},
				Userdefined5: {'key': 'entityUserDefText', 'text': 'Text 5'}
			}),

			...prefixAllTranslationKeys('transportplanning.transport.', {
				ProjectDefFk: { key: 'entityProjectDefFk', text: '*Default Client Project' },
				JobDefFk: { key: 'entityJobDefFk', text: '*Default Client Job' },
				BasUomWeightFk: { key: 'entityUoMWeightFk', text: '*Weight UoM' },
				EventTypeFk: { key: 'entityEventTypeFk', text: '*Route Typeb' },
				Distance: { key: 'entityDistance', text: '*Distance' },
				ActualDistance: { key: 'entityActualDistance', text: '*Actual Distance' },
				Expenses: { key: 'entityExpenses', text: '*Expenses' },
				IsDefaultSrc: { key: 'entityIsDefaultSrc', text: '*Is Default Source' },
				IsDefaultDst: { key: 'entityIsDefaultDst', text: '*Is Default Destination' },
				routeInfo: { key: 'routeInfoGroup', text: '*Route Info' },
				SumDistance: { key: 'sumDistance', text: '*Sum Distance' },
				SumActualDistance: { key: 'sumActualDistance', text: '*Sum Actual Distance' },
				SumExpenses: { key: 'sumExpenses', text: '*Sum Expenses' },
				SumPackagesWeight: { key: 'sumPackagesWeight', text: '*Total Packages Weight' },
				SumProductsActualWeight: { key: 'sumProductsActualWeight', text: '*Total Products Actual Weight' },
				goodsInfo: { key: 'goodsInfoGroup', text: '*Goods Info' },
				SumBundlesInfo: { key: 'sumBundlesInfo', text: '*Packages\' Bundles Info' },
				DefSrcWaypointJobFk: { key: 'defSrcWaypointJobFk', text: '*Default Source Waypoint Job' },
				PlannedDelivery: { key: 'plannedDelivery', text: '*Planned Delivery Time' },
				ActualDelivery: { key: 'actualDelivery', text: '*Actual Delivery Time' },
				ProjectName: { key: 'projectName', text: '*Project-Name' },
				ProjectNo: { key: 'projectNo', text: '*Project-No' },
				DefProjectName: { key: 'defProjectName', text: '*Default-Project-Name' },
				TruckTypeFk: { key: 'truckTypeFk', text: '*Truck Type' },
				TruckFk: { key: 'truckFk', text: '*Truck' },
				ActualTruckTypeFk: { key: 'actualTruckTypeFk', text: '*Actual Truck Type' },
				DriverFk: { key: 'driverFk', text: '*Driver' },
				resources: { key: 'resources', text: '*Resources' },
				timeInfo: { key: 'timeInfo', text: '*Time Information' }



			})
		}
	}

});