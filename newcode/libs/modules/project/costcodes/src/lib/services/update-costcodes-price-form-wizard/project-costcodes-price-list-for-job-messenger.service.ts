/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { PrjCostCodesEntity } from '@libs/project/interfaces';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})

export class ProjectCostcodesPriceListForJobMessengerService {  // TODO : PlatformMessenger is not ready
	 //  let service = {};
	// 		service.JobPriceVersionSelectedChanged = new PlatformMessenger();
	// 		service.PrjCostCodesPriceVersionSelectedChanged = new PlatformMessenger();
	// 		service.PriceListRecordSelectedChanged = new PlatformMessenger();
	// 		service.PriceListRecordWeightingChanged = new PlatformMessenger();
	// 		return service;
	// }

	private priceListRecordSelectedChanged = new Subject<PrjCostCodesEntity[]>();
	public data$ = this.priceListRecordSelectedChanged.asObservable();

	public sendData(data: PrjCostCodesEntity[]) {
		this.priceListRecordSelectedChanged.next(data);
	}
  
}
