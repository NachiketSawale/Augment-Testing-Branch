import { IPpsDocumentRevisionEntity } from '../../../model/document/pps-document-revision-entity.interface';
import { IEntitySelection } from '@libs/platform/data-access';
import { runInInjectionContext } from '@angular/core';
import { IInitializationContext, IEntityIdentification } from '@libs/platform/common';
import { ProductionplanningSharedDocumentRevisionDataService } from './pps-document-revision-data.service';
import { IDocumentService } from '@libs/documents/shared';

export class ProductionplanningSharedDocumentRevisionDataServiceManager {

	private static _dataServiceCache = new Map<string, IEntitySelection<IPpsDocumentRevisionEntity> | IDocumentService<IPpsDocumentRevisionEntity>>();

	public static getDataService<PT extends IEntityIdentification/*, PU extends object*/>(
		options: {
			parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>,
			containerUuid: string;
		},
		context: IInitializationContext,
	) {
		const key = options.containerUuid;

		let instance = ProductionplanningSharedDocumentRevisionDataServiceManager._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new ProductionplanningSharedDocumentRevisionDataService(
				options.parentServiceFn(context)/*, options*/
			));
			ProductionplanningSharedDocumentRevisionDataServiceManager._dataServiceCache.set(key, instance);
		}
		return instance;
	}
}