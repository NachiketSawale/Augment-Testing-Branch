/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { DataServiceFlatNode, DataServiceFlatRoot, DataServiceHierarchicalNode, DataServiceHierarchicalRoot, IParentRole } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { BasicsSharedCommentDataService, BasicsSharedCommentDataServiceBase, IPinBoardContainerCreationOptions } from '../index';

@Injectable({ providedIn: 'root' })
export class BasicsSharedCommentDataServiceFactory<T extends IEntityBase & IEntityIdentification, PT extends IEntityIdentification & IEntityBase, PU extends CompleteIdentification<PT> = CompleteIdentification<PT>> {
	private serviceCache: { [key: string]: BasicsSharedCommentDataServiceBase<T, PT> } = {};

	public createService(injector: Injector, options: IPinBoardContainerCreationOptions<T, PT>) {
		const parentDataServiceName = this.getParentServiceName(options, injector);
		const cacheName = options.commentQualifier + parentDataServiceName;
		if (!this.serviceCache[cacheName]) {
			if (options.dataService) {
				if (typeof options.dataService === 'function') {
					this.serviceCache[cacheName] = new options.dataService(options);
				} else {
					options.dataService.onInit(options);
					this.serviceCache[cacheName] = options.dataService;
				}
			} else {
				this.serviceCache[cacheName] = runInInjectionContext(injector, () => new BasicsSharedCommentDataService<T, PT>(options));
			}
		}
		return this.serviceCache[cacheName];
	}

	public getCommentService(qualifier: string, parentDataServiceName: string) {
		const cacheName = qualifier + parentDataServiceName;
		return this.serviceCache[cacheName];
	}

	private getParentServiceName(options: IPinBoardContainerCreationOptions<T, PT>, injector: Injector) {
		const parentService: IParentRole<PT, PU> = runInInjectionContext(injector, () => {
			return injector.get(options.parentServiceToken) as unknown as IParentRole<PT, PU>;
		});
		if (parentService.isRoot()) {
			return (parentService as unknown as DataServiceFlatRoot<PT, PU> | DataServiceHierarchicalRoot<PT, PU>).getServiceName();
		} else {
			return (parentService as unknown as DataServiceFlatNode<object, object, PT, PU> | DataServiceHierarchicalNode<object, object, PT, PU>).getServiceName();
		}
	}
}
