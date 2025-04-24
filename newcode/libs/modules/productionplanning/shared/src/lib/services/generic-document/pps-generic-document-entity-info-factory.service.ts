import { EntityInfo } from '@libs/ui/business-base';
import { IDocumentService } from '@libs/documents/shared';
import { /*CompleteIdentification,*/ IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IPpsGenericDocumentEntity } from '../../model/generic-document/pps-generic-document-entity.interface';
import { ProductionplanningSharedGenericDocumentLayoutService } from './pps-generic-document-layout.service';
import { ProductionplanningSharedGenericDocumentDataServiceManager } from '../generic-document/pps-generic-document-data-service-manager.service';
import { PpsGenericDocumentGridBehavior } from './pps-generic-document-grid-behavior.service';
import { IPpsGenericDocumentEntityInfoOptions } from '../../model/generic-document/pps-generic-document-entity-info-options.interface';

export class ProductionplanningShareGenericDocumentEntityInfoFactory {
	public static create<PT extends IEntityIdentification>(options: IPpsGenericDocumentEntityInfoOptions<PT>): EntityInfo {
		const getDataSrv = (ctx: IInitializationContext) => ProductionplanningSharedGenericDocumentDataServiceManager.getDataService<PT>({
			containerUuid: options.containerUuid,
			apiUrl: options.apiUrl,
			endPoint: options.endPoint,
			parentFilter: options.parentFilter,
			uploadServiceKey: options.uploadServiceKey,
			parentServiceFn: options.parentServiceFn,
			IsParentEntityReadonlyFn: options.IsParentEntityReadonlyFn,

		}, ctx);
		return EntityInfo.create<IPpsGenericDocumentEntity>({
			grid: {
				title: options.gridTitle,
				containerUuid: options.containerUuid,
				behavior: (ctx) => new PpsGenericDocumentGridBehavior(getDataSrv(ctx) as IDocumentService<IPpsGenericDocumentEntity>, ctx.injector, options.canCreate, options.canDelete),
			},
			dataService: ctx => getDataSrv(ctx),
			dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'GenericDocumentDto' },
			layoutConfiguration: ctx => ctx.injector.get(ProductionplanningSharedGenericDocumentLayoutService).generateLayout(),
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