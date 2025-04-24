import { IPpsGenericDocumentEntity } from '../../model/generic-document/pps-generic-document-entity.interface';
import { IEntitySelection } from '@libs/platform/data-access';
import { runInInjectionContext } from '@angular/core';
import { IInitializationContext, IEntityIdentification } from '@libs/platform/common';
import { ProductionplanningSharedGenericDocumentDataService } from './pps-generic-document-data.service';
import { IDocumentService } from '@libs/documents/shared';

export class ProductionplanningSharedGenericDocumentDataServiceManager {

	private static _dataServiceCache = new Map<string, IEntitySelection<IPpsGenericDocumentEntity> | IDocumentService<IPpsGenericDocumentEntity>>();

	public static getDataService<PT extends IEntityIdentification/*, PU extends object*/>(
		options: {
			containerUuid: string;
			apiUrl: string,
			endPoint?: string,
			uploadServiceKey?: string, // e.g. 'pps-header', 'eng-task'
			dataProcessor?: string,
			parentFilter: string,
			parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>,
			IsParentEntityReadonlyFn?: () => boolean,
		},
		context: IInitializationContext,
	) {
		const key = options.containerUuid;

		let instance = ProductionplanningSharedGenericDocumentDataServiceManager._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new ProductionplanningSharedGenericDocumentDataService(
				{
					parentService: options.parentServiceFn(context),
					...options
				}));
			ProductionplanningSharedGenericDocumentDataServiceManager._dataServiceCache.set(key, instance);
		}
		return instance;
	}
}