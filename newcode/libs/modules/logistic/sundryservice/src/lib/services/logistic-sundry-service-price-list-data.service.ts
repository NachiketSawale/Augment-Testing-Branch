import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions } from '@libs/platform/data-access';
import { IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ILogisticSundryServicePriceListEntity, ILogisticSundryServiceEntity } from '@libs/logistic/interfaces';
import { ServiceRole } from '@libs/platform/data-access';
import { LogisticSundryServiceComplete } from '../model/logistic-sundry-service-complete.class';
import { LogisticSundryServiceDataService } from '@libs/logistic/sundryservice';

@Injectable({
	providedIn: 'root'
})

export class LogisticSundryServicePriceListDataService extends DataServiceFlatLeaf<ILogisticSundryServicePriceListEntity, ILogisticSundryServiceEntity, LogisticSundryServiceComplete> {

	public constructor(logisticSundryServiceDataService : LogisticSundryServiceDataService) {
		const options: IDataServiceOptions<ILogisticSundryServicePriceListEntity> = {
			apiUrl: 'logistic/sundryservice/pricelist',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			createInfo:{},
			roleInfo: <IDataServiceChildRoleOptions<ILogisticSundryServicePriceListEntity, ILogisticSundryServiceEntity, LogisticSundryServiceComplete>> {
				itemName : 'PriceList',
				role: ServiceRole.Leaf,
				parent: logisticSundryServiceDataService
			}
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: LogisticSundryServiceComplete, modified: ILogisticSundryServicePriceListEntity[], deleted: ILogisticSundryServicePriceListEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.PriceListsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.PriceListsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: LogisticSundryServiceComplete): ILogisticSundryServicePriceListEntity[] {
		if (complete && complete.PriceListsToSave) {
			return complete.PriceListsToSave;
		}

		return [];
	}

}
