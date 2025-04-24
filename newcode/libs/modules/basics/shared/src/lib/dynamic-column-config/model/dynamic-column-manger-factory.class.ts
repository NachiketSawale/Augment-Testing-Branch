/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicSharedDynamicColumnManger } from './dynamic-column-manger.class';

export class BasicSharedDynamicColumnMangerFactory{
	private static _dynamicBasicClasses: {guid: string, instance: BasicSharedDynamicColumnManger<object> }[] = [];

	public static Create(guid: string){
		const exist = this.getDynamicBasicClass(guid);
		if (exist) {
			return exist;
		}

		const newOne = new BasicSharedDynamicColumnManger(guid);
		this._dynamicBasicClasses.push({guid: guid, instance: newOne});
		return newOne;
	}

	public static getDynamicBasicClass(guid: string) : BasicSharedDynamicColumnManger<object> | null{
		const result = this._dynamicBasicClasses.find(x=> x.guid === guid);
		if(!result){
			return null;
		}

		return result.instance;
	}
}