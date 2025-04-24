import { RESOURCE_EQUIPMENT_PLANT_FIXED_ASSET_ENTITY_INFO } from '../../model/resource-equipment-plant-fixed-asset-entity-info.model';
import { Injectable } from '@angular/core';
import { IResourceEquipmentPlantFixedAssetEntity } from '@libs/resource/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantFixedAssetLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceEquipmentPlantFixedAssetEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'resource/equipment/plantfixedasset',
					endPointRead: 'listbyparent',
					usePostForRead: true
				}
			},
			{
				uuid: '99a92b5411ff4689896d9cfc5e9db1a0',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IResourceEquipmentPlantFixedAssetEntity>>{
						columns: await RESOURCE_EQUIPMENT_PLANT_FIXED_ASSET_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}