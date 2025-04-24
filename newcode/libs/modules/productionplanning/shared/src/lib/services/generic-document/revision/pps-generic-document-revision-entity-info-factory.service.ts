import { EntityInfo } from '@libs/ui/business-base';
import { /*CompleteIdentification,*/ IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IPpsGenericDocumentRevisionEntity } from '../../../model/generic-document/pps-generic-document-revision-entity.interface';
import { IPpsGenericDocumentBaseEntityInfoOptions } from '../../../model/generic-document/pps-generic-document-base-entity-info-options.interface';
import { PpsGenericDocumentRevisionGridBehavior } from './pps-generic-document-revision-grid-behavior.service';
import { ProductionplanningSharedGenericDocumentRevisionLayoutService } from './pps-generic-document-revision-layout.service';
import { ProductionplanningSharedGenericDocumentRevisionDataServiceManager } from './pps-generic-document-revision-data-service-manager.service';
import { IDocumentService } from '@libs/documents/shared';

export class ProductionplanningSharedGenericDocumentRevisionEntityInfoFactory {
	public static create<PT extends IEntityIdentification>(options: IPpsGenericDocumentBaseEntityInfoOptions<PT>): EntityInfo {
		const getDataSrv = (ctx: IInitializationContext) => ProductionplanningSharedGenericDocumentRevisionDataServiceManager.getDataService<PT>({
			parentServiceFn: options.parentServiceFn,
			containerUuid: options.containerUuid,
			apiUrl: options.apiUrl,
			uploadServiceKey: options.uploadServiceKey,  // e.g. 'pps-product-revision'
		}, ctx);
		return EntityInfo.create<IPpsGenericDocumentRevisionEntity>({
			grid: {
				title: options.gridTitle,
				containerUuid: options.containerUuid,
				behavior: ctx => new PpsGenericDocumentRevisionGridBehavior(getDataSrv(ctx) as IDocumentService<IPpsGenericDocumentRevisionEntity>, ctx.injector),
			},
			dataService: ctx => getDataSrv(ctx),
			dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'GenericDocumentRevisionDto' },
			layoutConfiguration: ctx => ctx.injector.get(ProductionplanningSharedGenericDocumentRevisionLayoutService).generateLayout(),
			permissionUuid: options.permissionUuid,
			prepareEntityContainer: async (ctx) => {
				await Promise.all([
					ctx.translateService.load(['productionplanning.common']),
					// other promises...
				]);
			},

		});
	}

}