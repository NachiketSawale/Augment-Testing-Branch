/**
 * Copyright (c) RIB Software SE
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IEstAssemblyTypeEntity } from '@libs/estimate/interfaces';

/**
 * AssemblyTypeDataService
 * mapping to estimateAssembliesAssemblyTypeDataService
 */
@Injectable({ providedIn: 'root' })
export class AssemblyTypeDataService{

	private http = inject(HttpClient);
	private platformConfigurationService = inject(PlatformConfigurationService);

	private assemblyTypes : IEstAssemblyTypeEntity[] = [];

	public getAssemblyTypeByKey(value: number){
		return this.assemblyTypes.find(e => e.Id === value);
	}

	public getAssemblyTypes(reload: boolean = false): Promise<IEstAssemblyTypeEntity[]>{
		if(this.assemblyTypes && this.assemblyTypes.length && !reload){
			return Promise.resolve(this.assemblyTypes);
		}else{
			return new Promise(resolve => {
				this.http.get<IEstAssemblyTypeEntity[]>(this.platformConfigurationService.webApiBaseUrl + 'estimate/assemblies/assemblytype/list').subscribe((response) => {
					this.assemblyTypes = response;
					resolve(this.assemblyTypes);
				});
			});
		}
	}

	public isPaAssembly(value: number){
		const assemblyType = this.getAssemblyTypeByKey(value);
		return assemblyType && assemblyType.EstAssemblyTypeLogicFk === 8;
	}

	public clear(){
		this.assemblyTypes = [];
	}
}