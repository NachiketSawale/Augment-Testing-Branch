/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { IEstModifyFieldsEntity } from '@libs/estimate/interfaces';
import { IEstimateResourceFieldValue } from '../model/estimte-modify-resource-field-value.interface';
import { clone, filter, forEach } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class EstimateModifyResourceDataService {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);

	public getScopeList(isFromAssembly: boolean){
		const list = [
			{
				id: 2,
				displayName: this.translateService.instant('estimate.main.createBoqPackageWizard.selectScopeSource.scope.Highlighted').text
			},
			{
				id: 1,
				displayName: this.translateService.instant('estimate.main.createBoqPackageWizard.selectScopeSource.scope.resultSet').text
			},
			{
				id: 0,
				displayName: this.translateService.instant('estimate.main.createBoqPackageWizard.selectScopeSource.scope.allEstimate').text
			}
		];

		if(!isFromAssembly){
			return list;
		}else{
			const cloneList = clone(list);
			const result = filter(cloneList, d=> {
				return d.id !== 2;
			});

			forEach(cloneList, d => {
				if(d.id === 0){
					d.displayName = this.translateService.instant('estimate.main.createBoqPackageWizard.selectScopeSource.scope.allAssembly').text;
				}
			});

			return result;
		}
	}

	public getResourceFields(){
		return this.http.get(this.configService.webApiBaseUrl + 'estimate/main/modify/getfilterfields');
	}

	private fieldValuesCache: IEstimateResourceFieldValue[] = [];

	public getFiledValues(field: IEstModifyFieldsEntity){

		const existed = filter(this.fieldValuesCache, (item) => item.typeKey === field.Id);
		if(existed && existed.length > 0){
			forEach(existed, d => {
				d.checked = field.Checked;
			});
			return Promise.resolve(existed);
		}

		const filterKey = field.Id === 42 ? 'estimate.lookup.costtype' : field.Id === 43 ? 'estimate.lookup.resourceflag' : '';
		const url = this.configService.webApiBaseUrl + 'basics/lookupData/getData';
		const postData = {
			displayProperty: 'Description',
			lookupModuleQualifier: filterKey,
			valueProperty: 'Id'
		};
		return new Promise((resolve) => {
			this.http.post(url, postData).subscribe((res) => {
				let data:IEstimateResourceFieldValue[] = [];
				if(res && 'items' in res){
					data = res.items as IEstimateResourceFieldValue[];
				}

				forEach(data, d =>{
					d.checked = field.Checked;
					d.Id = d.id;
					d.typeKey = field.Id;
					this.fieldValuesCache.push(d);
				});

				resolve(data);
			});
		});
	}

	public clearFieldValues(){
		this.fieldValuesCache = [];
	}
}