import { RESOURCE_EQUIPMENT_PLANT_COMPONENT_MAINT_SCHEMA_ENTITY_INFO } from '../../model/resource-equipment-plant-component-maint-schema-entity-info.model';
import { Injectable } from '@angular/core';
import { IResourceEquipmentPlantComponentMaintSchemaEntity } from '@libs/resource/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantComponentMaintSchemaLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceEquipmentPlantComponentMaintSchemaEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'resource/equipment/plantcomponentmaintschema',
					endPointRead: 'listbyparent',
					usePostForRead: true
				}
			},
			{
				uuid: 'd6f8f8d4fd48462da5b091b643189c85',
				valueMember: 'Id',
				displayMember: 'Description',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IResourceEquipmentPlantComponentMaintSchemaEntity>>{
						columns: await RESOURCE_EQUIPMENT_PLANT_COMPONENT_MAINT_SCHEMA_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}