import { IPpsGenericDocumentRevisionEntity } from '../../../model/generic-document/pps-generic-document-revision-entity.interface';
import { IEntitySelection } from '@libs/platform/data-access';
import { runInInjectionContext } from '@angular/core';
import { IInitializationContext, IEntityIdentification } from '@libs/platform/common';
import { ProductionplanningSharedGenericDocumentRevisionDataService } from './pps-generic-document-revision-data.service';
import { IDocumentService } from '@libs/documents/shared';

export class ProductionplanningSharedGenericDocumentRevisionDataServiceManager {

	private static _dataServiceCache = new Map<string, IEntitySelection<IPpsGenericDocumentRevisionEntity> | IDocumentService<IPpsGenericDocumentRevisionEntity>>();

	public static getDataService<PT extends IEntityIdentification/*, PU extends object*/>(
		options: {
			containerUuid: string;
			parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>,
			apiUrl: string,
			uploadServiceKey?: string,  // e.g. 'pps-product-revision'
		},
		context: IInitializationContext,
	) {
		const key = options.containerUuid;

		let instance = ProductionplanningSharedGenericDocumentRevisionDataServiceManager._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new ProductionplanningSharedGenericDocumentRevisionDataService(
				{
					parentService: options.parentServiceFn(context),
					...options
				}
			));
			ProductionplanningSharedGenericDocumentRevisionDataServiceManager._dataServiceCache.set(key, instance);
		}
		return instance;
	}
}