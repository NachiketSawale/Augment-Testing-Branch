/*
 * Copyright(c) RIB Software GmbH
 */

import {
	EstimateBaseConfigDialogService
} from '@libs/estimate/shared';
import { Injectable } from '@angular/core';

/**
 * EstimateAssembliesConfigService use for config dialog
 */
@Injectable({
	providedIn: 'root'
})
export class EstimateAssembliesConfigService extends EstimateBaseConfigDialogService{
	/**
	 * show config dialog
	 * @param config
	 */
	public async showDialog(config : {headerId: number}){
		await this.getEstHeaderById(config);
		if (this.estHeaderItem) {
			if(!this.estHeaderItem.Id){
				await this.loadHeaderData();
			}
			await this.loadCurrentItem(this.estHeaderItem);
		} else {
			//await this.showConfigDialog(this.modalOptionsSelectRecord);
		}
	}
}