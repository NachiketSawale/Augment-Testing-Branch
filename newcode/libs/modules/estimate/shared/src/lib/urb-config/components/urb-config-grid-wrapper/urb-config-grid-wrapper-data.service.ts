/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDescriptionInfo, PlatformConfigurationService } from '@libs/platform/common';
import { IUrb2CostCode, IUrbConfigEntity } from '../../model/urb-config-entity.interface';
import { EstSharedConfigDialogConfigTypeService } from '../../services/urb-config-dialog-config-type.service';
import { map, Observable, of } from 'rxjs';
import { EstShareUrbConfigGridDataService } from '../urb-config-grid/urb-config-grid-data.service';


@Injectable({
	providedIn: 'root'
})
export class EstShareUrbConfigGridWrapperDataService{

	private readonly http = inject(HttpClient);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly urbConfigTypeService = inject(EstSharedConfigDialogConfigTypeService);
	private readonly urbConfigGridDataService = inject(EstShareUrbConfigGridDataService);
	private _entity?:IUrbConfigEntity;

	public setCurrentEntity(entity: IUrbConfigEntity){
		this._entity = entity;
	}

	public loadByUrbConfigType(typeId: number): Observable<IUrb2CostCode[]>{

		const configType = this.urbConfigTypeService.getItemById(typeId);
		if(configType){
			return this.loadByUrbConfig(configType.EstUppConfigFk);
		}
		return of([]);
	}

	public loadByUrbConfig(configId: number): Observable<IUrb2CostCode[]>{

		return this.http.get(this.configurationService.webApiBaseUrl + 'estimate/main/uppconfig/complete?uppConfigFk=' + configId).pipe(map(res => {
			if(res && 'EstUppConfig' in res){
				const uppConfig = res.EstUppConfig as {DescriptionInfo: IDescriptionInfo};
				if(uppConfig && uppConfig.DescriptionInfo && this._entity){
					this._entity.UppConfigDesc = uppConfig.DescriptionInfo.Translated;
					this._entity.EstUppConfig = res.EstUppConfig as object;
				}
			}

			if(res && 'EstUpp2CostCodeDetails' in res){
				return res.EstUpp2CostCodeDetails as IUrb2CostCode[];
			}

			return [];
		}));
	}

	public loadByDefault(): Observable<IUrb2CostCode[]>{
		const configType = this.urbConfigTypeService.getDefault();
		if(configType){
			 if(this._entity) {
				 this._entity.EstUppConfigTypeFk = configType.Id;
				 this._entity.EstUppConfigFk = configType.EstUppConfigFk;
			 }
			return this.loadByUrbConfig(configType.EstUppConfigFk);
		}
		return of([]);
	}

	public getUpdatedList(){
		return this.urbConfigGridDataService.getUpdatedList();
	}
}