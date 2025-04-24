/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IUrbConfigType } from '../model/urb-config-type.interface';
import { find } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class EstSharedConfigDialogConfigTypeService {

	private readonly http = inject(HttpClient);
	private readonly configurationService = inject(PlatformConfigurationService);
	private data: IUrbConfigType[] = [];

	public loadList(filterByMdcContextId: boolean){
		let promise:Promise<boolean> = Promise.resolve(false);
		let url = '';
		if (filterByMdcContextId) {
			url = this.configurationService.webApiBaseUrl + 'estimate/main/upptype/list';
		} else {
			url = this.configurationService.webApiBaseUrl + 'basics/customize/estuppconfigtype/list';
		}

		this.http.post(url, null).subscribe(res => {
			if(res){
				this.data = res as IUrbConfigType[];
			}

			promise = Promise.resolve(true);
		});

		return promise;
	}

	public getItemById(id?: number | null): IUrbConfigType | undefined{
		if(!id) {
			return undefined;
		}
		return find(this.data, {Id: id});
	}

	public getDefault(): IUrbConfigType | undefined{
		let val = find(this.data, {IsDefault: true});

		if(!val){
			val = this.data[0];
		}

		return val;
	}
}