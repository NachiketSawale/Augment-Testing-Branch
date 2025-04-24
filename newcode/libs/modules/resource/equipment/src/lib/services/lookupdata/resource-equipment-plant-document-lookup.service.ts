import { RESOURCE_EQUIPMENT_PLANT_DOCUMENT_ENTITY_INFO } from '../../model/resource-equipment-plant-document-entity-info.model';
import { Injectable } from '@angular/core';
import { IResourceEquipmentPlantDocumentEntity } from '@libs/resource/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantDocumentLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceEquipmentPlantDocumentEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'resource/equipment/plantdocument',
					endPointRead: 'listbyparent',
					usePostForRead: true
				}
			},
			{
				uuid: '9e6e76d325934b2287ab42d697b70679',
				valueMember: 'Id',
				displayMember: 'Description',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IResourceEquipmentPlantDocumentEntity>>{
						columns: await RESOURCE_EQUIPMENT_PLANT_DOCUMENT_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}