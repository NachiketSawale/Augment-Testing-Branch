/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsAssetMasterGridDataService } from '../services/basics-asset-master-grid-data.service';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IAssetMasterEntity } from '@libs/basics/interfaces';
import { BasicsSharedPlainTextContainerComponent, IPlainTextAccessor, PLAIN_TEXT_ACCESSOR } from '@libs/basics/shared';

/**
 * Entity info for basics asset master grid
 */
export const BASICS_ASSET_MASTER_GRID_ENTITY_INFO: EntityInfo = EntityInfo.create<IAssetMasterEntity> ({
    grid: {
        title: {key: 'basics.assetmaster.containers.grid'},
        treeConfiguration: ctx => {
			return {
				parent: function (entity: IAssetMasterEntity) {
					const service = ctx.injector.get(BasicsAssetMasterGridDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IAssetMasterEntity) {
					const service = ctx.injector.get(BasicsAssetMasterGridDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<IAssetMasterEntity>;
		},
    },
    form: {
        title: { key: 'basics.assetmaster.containers.detail' },
        containerUuid: '0661BA89AE1B439583511DA867667F95',
    },
    dataService: ctx => ctx.injector.get(BasicsAssetMasterGridDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.AssetMaster', typeName: 'AssetMasterDto'},
    permissionUuid: '3C17E18947514D48AB6417ED2D991F63',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data',
                },
                attributes: ['Code', 'DescriptionInfo', 'AddressEntity', 'IsLive', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'AllowAssignment'],
            },
        ],
        labels: {
            ...prefixAllTranslationKeys('cloud.common.', {
                Code: {
                    key: 'entityCode'
                },
                DescriptionInfo: {key: 'entityDescription'},
                AddressEntity: {key: 'entityDeliveryAddress'},
                IsLive: {key: 'entityIsLive'},
                AllowAssignment: {key: 'allowAssignment'},
                UserDefined1: {
                    key: 'entityUserDefined',
                    text: 'User-Defined 1',
                    params: {'p_0': '1'}
                },
                UserDefined2: {
                    key: 'entityUserDefined',
                    text: 'User-Defined 2',
                    params: {'p_0': '2'}
                },
                UserDefined3: {
                    key: 'entityUserDefined',
                    text: 'User-Defined 3',
                    params: {'p_0': '3'}
                },
                UserDefined4: {
                    key: 'entityUserDefined',
                    text: 'User-Defined 4',
                    params: {'p_0': '4'}
                },
                UserDefined5: {
                    key: 'entityUserDefined',
                    text: 'User-Defined 5',
                    params: {'p_0': '5'}
                },
            }),
        },
        overloads: {
            IsLive: {
                readonly: true
            },
            AddressEntity: {
				// todo: special formatter
			},
            
        },
    },
    additionalEntityContainers: [
		// remark container
		{
			uuid: '677930C52E4C4B0998E67E7DFF33E870',
			permission: '3c17e18947514d48ab6417ed2d991f63',
			title: 'cloud.common.remark',
			containerType: BasicsSharedPlainTextContainerComponent,
			providers: [
				{
					provide: PLAIN_TEXT_ACCESSOR,
					useValue: <IPlainTextAccessor<IAssetMasterEntity>>{
						getText(entity: IAssetMasterEntity): string | undefined {
							return entity.Remark ?? '';
						},
						setText(entity: IAssetMasterEntity, value?: string) {
							if (value) {
								entity.Remark = value;
							}
						},
					},
				},
			],
		},
	],
        
});