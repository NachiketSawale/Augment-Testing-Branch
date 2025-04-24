import { Injectable } from '@angular/core';
import {IPlannedQuantityDataServiceInitializeOptions} from '../model/planned-quantity-data-service-initialize-options.interface';
import {PpsHeaderPlannedQuantityBaseDataService} from './pps-header-planned-quantity-base-data-service';

@Injectable({
	providedIn: 'root'
})
export class PpsHeaderParentPlannedQuantityDataService extends PpsHeaderPlannedQuantityBaseDataService {
	public constructor() {
		const options: IPlannedQuantityDataServiceInitializeOptions = { endPoint: 'customfiltered' };
		super(options);
	}

}