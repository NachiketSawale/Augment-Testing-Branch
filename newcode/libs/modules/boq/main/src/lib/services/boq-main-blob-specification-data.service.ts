import { Injectable } from '@angular/core';
import { IBlobStringEntity } from '@libs/basics/shared';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { BoqItemDataService } from '../services/boq-main-boq-item-data.service';
import { IBoqItemEntity } from '@libs/boq/interfaces';

@Injectable({providedIn: 'root'})
export class BoqBlobSpecificationDataService extends DataServiceFlatLeaf<IBlobStringEntity,IBlobStringEntity,IBlobStringEntity> {
	public constructor(private boqItemDataService: BoqItemDataService) {
		const options: IDataServiceOptions<IBlobStringEntity> = {
			apiUrl: 'cloud/common/blob',
			roleInfo: <IDataServiceChildRoleOptions<IBlobStringEntity,IBoqItemEntity,IBoqItemEntity>> {
				itemName: 'Blob',
				role: ServiceRole.Leaf,
				parent: boqItemDataService
			},
			readInfo: {
				endPoint: 'getblobstring',
				prepareParam: () => {
					return { id: this.boqItemDataService.getSelectedEntity()?.BasBlobsSpecificationFk ?? -1 };
				}
			},
		};
		super(options);
	}
}

