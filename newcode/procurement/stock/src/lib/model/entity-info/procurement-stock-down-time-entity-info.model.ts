/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IProjectStockDownTimeEntity } from '@libs/project/interfaces';
import { ProcurementStockDownTimeDataService } from '../../services/procurement-stock-down-time-data.service';

/**
 * Procurement stock stock down time entity info
 */
export const PROCUREMENT_STOCK_DOWN_TIME_ENTITY_INFO: EntityInfo = EntityInfo.create<IProjectStockDownTimeEntity> ({
    grid: {
        title: {key: 'project.stock.downtimeListContainerTitle'},
    },
    form: {
        title: { key: 'project.stock.downtimeDetailContainerTitle' },
        containerUuid: 'd278002b334a48729aab5d7e1cdac64e',
    },
    dataService: ctx => ctx.injector.get(ProcurementStockDownTimeDataService),
    dtoSchemeId: {moduleSubModule: 'Project.Stock', typeName: 'ProjectStockDownTimeDto'},
    permissionUuid: '115362380bc84b4b91f3678efe6866e4',
    layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['StartDate', 'EndDate', 'Description', 'BasClerkFk'],
			}
		],
		overloads: {
			BasClerkFk:BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			StartDate: {readonly: true},
			EndDate: {readonly: true},
			Description: {readonly: true}
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.',{
				BasClerkFk :{ key: 'entityClerk'},
				DescriptionInfo: { key: 'entityDescription'},
			}),
			...prefixAllTranslationKeys('basics.customize.',{
				StartDate :{ key: 'startdate'},
				EndDate: { key: 'enddate'},
			})
		}
	},

});