import { IPpsDocumentEntity } from '../../model/document/pps-document-entity.interface';
import { IEntitySelection } from '@libs/platform/data-access';
import { runInInjectionContext } from '@angular/core';
import { IInitializationContext, IEntityIdentification } from '@libs/platform/common';
import { ProductionplanningSharedDocumentDataService } from './pps-document-data.service';
import { IDocumentService } from '@libs/documents/shared';

export class ProductionplanningSharedDocumentDataServiceManager {

	private static _dataServiceCache = new Map<string, IEntitySelection<IPpsDocumentEntity> | IDocumentService<IPpsDocumentEntity>>();

	public static getDataService<PT extends IEntityIdentification/*, PU extends object*/>(
		options: {
			parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>,
			containerUuid: string;
			endPoint?: string,
			foreignKey: string,
			idProperty?: string,
			selectedItemIdProperty?: string,
			provideLoadPayloadFn?: () => object,
			IsParentEntityReadonlyFn?: () =>boolean,
		},
		context: IInitializationContext,
	) {
		const key = options.containerUuid;

		let instance = ProductionplanningSharedDocumentDataServiceManager._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new ProductionplanningSharedDocumentDataService(
				options.parentServiceFn(context), options
			));
			ProductionplanningSharedDocumentDataServiceManager._dataServiceCache.set(key, instance);
		}
		return instance;
	}
}