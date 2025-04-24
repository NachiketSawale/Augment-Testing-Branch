/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicSharedDynamicColumnManger, BasicSharedDynamicColumnMangerFactory } from '../../dynamic-column-config';
import { IBasicSharedDynamicColumnDecoratedParam } from '../interface/dynamic-column-decorate-param.interface';
import { ServiceLocator } from '@libs/platform/common';
import { forEach } from 'lodash';

export function BasicSharedDynamicColumnViewDecorator(...params: object[]) {
	return function(target: object, propertyKey: string, descriptor: PropertyDescriptor) {

		let dynamicBasicClass: BasicSharedDynamicColumnManger<object> | null = null;

		const originalMethod = descriptor.value;

		descriptor.value = function(...args: object[]) {
			const dParam: IBasicSharedDynamicColumnDecoratedParam<object> | null = params.length > 0 ? params[0] as IBasicSharedDynamicColumnDecoratedParam<object> : null;
			if(!dynamicBasicClass && dParam) {
				dynamicBasicClass = BasicSharedDynamicColumnMangerFactory.Create(dParam.GridGuid);
				forEach(dParam.DynamicServiceTokens, token =>{
					dynamicBasicClass?.appendService(ServiceLocator.injector.get(token));
				});
			}

			if(dynamicBasicClass && dynamicBasicClass.dynamicColumnServices.length > 0 && args.length > 0){
				forEach(dynamicBasicClass.dynamicColumnServices, dynamicColumnService => {
					dynamicColumnService.initialData(args[0]);
				});
				if(dParam && dParam.EntitiesPropertyName in args[0]) {
					const entities = (args[0] as {[key: string]: object})[dParam.EntitiesPropertyName] as object[] || [];
					dynamicBasicClass.handleDynamicColumn(entities);
				}
			}

			return originalMethod.apply(this, args);
		};

		return descriptor;
	};
}

export function BasicSharedDynamicColumnDataDecorator(...params: object[]) {
	return function(target: object, propertyKey: string, descriptor: PropertyDescriptor) {

		let dynamicBasicClass: BasicSharedDynamicColumnManger<object> | null = null;

		const originalMethod = descriptor.value;

		descriptor.value = function(...args: object[]) {
			if(params.length > 0) {
				const dParam = params[0] as IBasicSharedDynamicColumnDecoratedParam<object>;
				dynamicBasicClass = BasicSharedDynamicColumnMangerFactory.Create(dParam.GridGuid);
			}

			if(dynamicBasicClass && dynamicBasicClass.dynamicColumnServices.length > 0 && args.length > 0){
				forEach(dynamicBasicClass.dynamicColumnServices, dynamicColumnService => {
					dynamicColumnService.provideUpdateData(args[0]);
					dynamicColumnService.clearUpdatedData();
				});
			}

			return originalMethod.apply(this, args);
		};

		return descriptor;
	};
}