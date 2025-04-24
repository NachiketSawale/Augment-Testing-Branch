/*
 * Copyright(c) RIB Software GmbH
 */

import { GridApiService, IGridApi } from '@libs/ui/common';
import { IBasicsSharedDynamicColumnService } from '../interface/dynamic-column.interface';
import { extend, forEach, merge, filter, find } from 'lodash';
import { ServiceLocator } from '@libs/platform/common';

export class BasicSharedDynamicColumnManger<T extends object>{

	private readonly gridGuid;
	private gridApi?: IGridApi<T> | null;

	private _dynamicColumnServices: IBasicsSharedDynamicColumnService<T>[] = [];

	public constructor(gridGuid: string) {
		this.gridGuid = gridGuid;
		this._dynamicColumnServices = [];
	}

	public appendService(item:IBasicsSharedDynamicColumnService<T>){
		if(find(this._dynamicColumnServices, d=> d && item && Object.getPrototypeOf(d) === Object.getPrototypeOf(item))){
			return;
		}

		this._dynamicColumnServices.push(item);
	}

	public handleDynamicColumn(entities: T[]){
		this.gridApi =  ServiceLocator.injector.get(GridApiService).get(this.gridGuid);

		if(!this.gridApi){
			console.log('cannot find target Grid');
			return;
		}

		this.gridApi.columns = forEach(this.gridApi.columns, d=> {
			if('isDynamicColumn' in d && (d.isDynamicColumn as boolean)) {
				extend(d, {useless: true});
			}
		});

		const columns = this.gridApi.columns;
		forEach(this._dynamicColumnServices, d=>{
			const newColumns = d.generateColumns();
			if(newColumns && newColumns.length>0){
				newColumns.forEach(newColumn=> {
					extend(newColumn, {isDynamicColumn:true, useless: false});
					const oldCol = columns.find(c=>  c.id === newColumn.id);
					if(!oldCol) {
						columns.push(newColumn);
						//this.gridApi.columns.unshift(newColumn as ColumnDef<object>);
					}else{
						merge(oldCol, newColumn);
					}
				});
			}
			d.appendValue2Entity(entities);
		});

		this.gridApi.columns = filter(this.gridApi.columns, d=>
			!('isDynamicColumn' in d && (d.isDynamicColumn as boolean) && 'useless' in d && (d.useless as boolean))
		);

		const config = this.gridApi.configuration;
		config.columns = [...columns];
		this.gridApi.configuration = config;
	}

	public get dynamicColumnServices(): IBasicsSharedDynamicColumnService<T>[]{
		return this._dynamicColumnServices;
	}
}