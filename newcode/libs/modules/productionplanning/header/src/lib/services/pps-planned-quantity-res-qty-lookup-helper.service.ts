// /*
//  * $Id$
//  * Copyright(c) RIB Software GmbH
//  */

// import { inject, Injectable } from '@angular/core';
// import { PlatformConfigurationService } from '@libs/platform/common';
// import { HttpClient } from '@angular/common/http';
// import { ISelectItem } from '@libs/ui/common';

// export interface IPpsPlannedQuantityResourceTypeObj {
// 	Id: number;
// 	Code: string;
// }

// export interface IPpsPlannedQuantityResourceTypesObj {
// 	ResourceTypes: IPpsPlannedQuantityResourceTypeObj[];
// }

// @Injectable({
// 	providedIn: 'root'
// })
// export class PpsPlannedQuantityResourceQuantityTypeLookupHelperService {

// 	private http = inject(HttpClient);
// 	private configurationService = inject(PlatformConfigurationService);

// 	private _resourceTypes: ISelectItem<number>[] = [];
// 	public get resourceTypes(): ISelectItem<number>[] {
// 		return this._resourceTypes;
// 	}

// 	public loadResourceTypes() {
// 		return this.http.get(this.configurationService.webApiBaseUrl + 'productionplanning/formulaconfiguration/plannedquantity/types').subscribe(
// 			(res) => {
// 				const obj = res as IPpsPlannedQuantityResourceTypesObj;
// 				obj.ResourceTypes.forEach(t => {
// 					this._resourceTypes.push({id: t.Id, displayName: t.Code});
// 				})

// 			});
// 	}
// }

