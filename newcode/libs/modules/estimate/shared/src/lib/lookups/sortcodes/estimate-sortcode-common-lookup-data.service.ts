/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { EstimateMainContextService } from '../../common/services/estimate-main-context.service';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { ISortcodes } from '../../model/estimate-sortcode-lookups.interface';


@Injectable({
	providedIn: 'root',
})

/**
 * @name EstimateSortCodeCommonLookupDataService
 * @description It is the data service for estimate sort code lookup*
 */
export class EstimateSortCodeCommonLookupDataService {
	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);
	protected readonly contextService = inject(EstimateMainContextService);

	/**
	 * Create API call
	 * @param route route string
	 * @returns
	 */
	public createDataService(route: string) {
		return {
			httpRead: { route: 'project/structures/' + route + '/', endPointRead: 'list', usePostForRead: false },
			filterParam: 'projectId',			
			prepareListFilter: () => {
				return this.getProjectId();
			}
		};
	}

	/**
	 * Get project id
	 * @returns project id
	 */
	public getProjectId() {
		const projectId = this.contextService.getSelectedProjectId() > 0 ? this.contextService.getSelectedProjectId() : 0;
		return 'projectId=' + projectId;
	}	

	/**
	 * Get dynamic service
	 * @param sortCodeId Sort code id
	 * @returns
	 */
	public getService(sortCodeId: number) {
		const paddedSortCodeId = sortCodeId < 10 ? '0' + sortCodeId : sortCodeId.toString();
		return `EstimateMainSortCode${paddedSortCodeId}LookupDataService`;
	}

	/**
	 * Get item by value
	 * @param value value that needs to be find in the array
	 * @param list Arry of list
	 * @returns item
	 */
	public async getItemByVal(value: string | number, listObs: Observable<ISortcodes[]>): Promise<ISortcodes> {
		let item: ISortcodes | undefined;

		const itemList = await firstValueFrom(listObs);
        const list = itemList;
	
		if (list.length > 0) {
			if (typeof value === 'string') {
				item = list.find((i) => i.Code === value.trim());
	
				if (!item) {
					item = list.find((j) => j.Id === 0);
					if (item) {
						item.Code = value.trim();
					} else {						
						item = { Id: 0, Code: value.trim(),ProjectFk:this.contextService.getSelectedProjectId() };
						list.push(item);
					}
				}
			} else {
				item = list.find((k) => k.Id === value);
			}
		}
	
		if (!item) {			
			item = { Id: 0, Code: '',ProjectFk:this.contextService.getSelectedProjectId() };
		}
	
		return item;
	}
	
}
