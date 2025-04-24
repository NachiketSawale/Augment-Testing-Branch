/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { EstimateSortCodeCommonLookupDataService } from './estimate-sortcode-common-lookup-data.service';
import { Observable} from 'rxjs';
import { ISortCodeEntity, ISortcodes } from '../../model/estimate-sortcode-lookups.interface';

@Injectable({
	providedIn: 'root',
})

/**
 * @name EstimateSortCode10LookupDataService
 * @description It is the data service for estimate sort code lookup*
 */
export class EstimateSortCode10LookupDataService<IEntity extends object> extends UiCommonLookupEndpointDataService<ISortcodes, IEntity> {
	public constructor(public sortcodeCommonService: EstimateSortCodeCommonLookupDataService) {
		super(sortcodeCommonService.createDataService('sortcode10'), {
			uuid: '2c72281aadd64d08af9463f3345a2bfc',
			idProperty: 'Id',
			valueMember: '',
			displayMember: '',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						visible: true,
						readonly: true,
						sortable: true,
						width: 100,
					},
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						visible: true,
						readonly: true,
						sortable: true,
						width: 150,
					},
				],
			},
		});
	}

	/**
	 * Process sort codes
	 * @param itemList List of sort codes
	 * @param data Sort codes
	 */
	public override processItems(itemList: ISortcodes[]) {
		const existingData = this.cache.getList();
		existingData.forEach((existingItem) => {
			const item = itemList.find((i) => i.Code === existingItem.Code);
			if (!item) {
				itemList.push(existingItem);
			}
		});
	}
	
	private getItemByVal(value: string | number, list: Observable<ISortcodes[]>) {
		return this.sortcodeCommonService.getItemByVal(value, list);
	}
	
	private getItemByIdAsync(value: string | number, opt: ISortCodeEntity) {
		return this.sortcodeCommonService.getItemByVal(value, this.getList(opt));
	}	

	private getItemById(value: string) {
		return this.getItemByVal(value, this.getList());
	}

	private async setItem(item:ISortcodes) {
		const scList = typeof this.syncService !== 'undefined' ? this.syncService.getListSync():[];			
		scList.push(item);
		this.cache.setItems(scList);
	}

	private async removeItemByCode(code: string): Promise<void> {
		const scList = typeof this.syncService !== 'undefined' ? this.syncService.getListSync():[];		
		const filteredList = scList.filter((item) => item.Code !== code);
		this.cache.setItems(filteredList);
	}

	private async updateItemByCode(code:string, Id:number) {
		const scList = typeof this.syncService !== 'undefined' ? this.syncService.getListSync():[];		
		const filteredList = scList.filter((item) => item.Code !== code);
		if (filteredList.length) {
			filteredList[0].Id = Id;
			scList.push(filteredList[0]);
		} else {
			const scObject = {
				Id: Id,
				Code: code,
				DescriptionInfo: {
					Description: code,
					DescriptionTr: 0,
					DescriptionModified: false,
					VersionTr: 0,
					Translated: code,
					Modified: false,
					OtherLanguages: null,
				},
			};
			scList.push(scObject);
		}
		this.cache.setItems(scList);
	}

	private async getMaxId(): Promise<number> {
		let maxId = 0;
		const scList = typeof this.syncService !== 'undefined' ? this.syncService.getListSync():[];	
		if (scList.length) {
			maxId = scList.reduce((max, item) => (item.Id > max ? item.Id : max), 0);
		}
		return maxId;
	}

	private clear() {
		this.cache.clear();
	}

	private reload(route: string) {
		return this.sortcodeCommonService.createDataService(route);
	}
}
