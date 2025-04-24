import { Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IIdentificationData } from '@libs/platform/common';
import { IOenLbMetadataEntity } from '../../model/entities/oen-lb-metadata-entity.interface';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { BoqItemDataService } from '../boq-main-boq-item-data.service';

@Injectable({providedIn: 'root'})
export class BoqMainOenLbmetadataDataService extends DataServiceFlatNode<IOenLbMetadataEntity, IBoqItemEntity, IBoqItemEntity, IBoqItemEntity> {  //DataServiceFlatNode<IOenLbMetadataEntity, any, IBoqItemEntity, IBoqItemEntity>

	public constructor(private boqItemDataService: BoqItemDataService) {
		const options: IDataServiceOptions<IOenLbMetadataEntity> = {
			apiUrl: 'boq/main/oen/lbmetadata',
			roleInfo:<IDataServiceChildRoleOptions<IOenLbMetadataEntity, IBoqItemEntity, IBoqItemEntity>>{
				role: ServiceRole.Node,
				itemName: 'OenLbMetadata',
				parent: boqItemDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident: IIdentificationData )=> {
					//TODO-BOQ : After onLoadSucceeded gets proper response but due to deselect child service data not shown in the form.

					const currentBoqItem = boqItemDataService.getSelectedEntity();
					return { boqHeaderId:currentBoqItem?.BoqHeaderFk, boqItemId:currentBoqItem?.Id };
				}
			}
		};
		super(options);
	}
}
