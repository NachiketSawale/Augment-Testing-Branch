/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { MtwoControlTowerConfigurationItemDataService } from '../services/mtwo-control-tower-configuration-item-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { IMtwoPowerbiItemEntity } from '@libs/mtwo/interfaces';

/**
 * Mtwo Control Tower Configuration Item entity info
 */
export const MTWO_CONTROL_TOWER_CONFIGURATION_ITEM_ENTITY_INFO: EntityInfo = EntityInfo.create<IMtwoPowerbiItemEntity>({
	grid: {
		title: { key: 'mtwo.controltowerconfiguration.PowerBIElements' },
        treeConfiguration: (ctx) => {
			return {
				parent: function (entity: IMtwoPowerbiItemEntity) {
					const service = ctx.injector.get(MtwoControlTowerConfigurationItemDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IMtwoPowerbiItemEntity) {
					const service = ctx.injector.get(MtwoControlTowerConfigurationItemDataService);
					return service.childrenOf(entity);
				}
			} as IGridTreeConfiguration<IMtwoPowerbiItemEntity>;
		}
	},

	dataService: (ctx) => ctx.injector.get(MtwoControlTowerConfigurationItemDataService),
	dtoSchemeId: { moduleSubModule: 'Mtwo.ControlTower', typeName: 'MtoPowerbiitemDto' },
	permissionUuid: 'd716f285c4a449159066f93cf1df1c88',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData', 
                attributes: [ 'IsLive','Name','Embedurl','Itemid'] }
        ],
        labels: {
            ...prefixAllTranslationKeys('mtwo.controltowerconfiguration.', {
                IsLive:{key:'IsLive' , text:'IsLive'},
                Name: { key:'Name', text:'Name'},
                Embedurl: { key:'Embedurl', text:'Embed Url'},
                Itemid: { key: 'ItemId', text: 'ItemId'},
            }),
        },
        overloads: {
            IsLive:{
                readonly:false,
            },
			Name: {
				readonly: false,
			},
            Embedurl: {
				readonly: false,
			},
            Itemid: {
				readonly: false,
			},
		},
    }             
});
