
import { Injectable } from '@angular/core';

import { PpsCommonDispatchGroupDataService } from './pps-common-dispatch-group-data.service';


@Injectable({
	providedIn: 'root'
})
export class PpsCommonDispatchGroupDataFactory {

	private static cacheMap: Map<string, PpsCommonDispatchGroupDataService> = new Map();

	public static getInstance(moduleName: string) : PpsCommonDispatchGroupDataService{
		let instance = this.cacheMap.get(moduleName);
		if(!instance){
			instance = new PpsCommonDispatchGroupDataService(moduleName);
			this.cacheMap.set(moduleName, instance);
		}
		return instance;
	}
}
