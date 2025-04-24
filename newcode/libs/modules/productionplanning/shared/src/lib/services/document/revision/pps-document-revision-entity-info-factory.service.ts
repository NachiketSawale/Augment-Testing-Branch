import { EntityInfo } from '@libs/ui/business-base';
import { /*CompleteIdentification,*/ IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IPpsDocumentRevisionEntity } from '../../../model/document/pps-document-revision-entity.interface';
import { ProductionplanningSharedDocumentRevisionLayoutService } from './pps-document-revision-layout.service';
import { ProductionplanningSharedDocumentRevisionDataServiceManager } from './pps-document-revision-data-service-manager.service';
import { PpsDocumentRevisionGridBehavior } from './pps-document-revision-grid-behavior.service';
import { IPpsEntityInfoOptions } from '../../../model/pps-entity-info-options.interface';
import { IDocumentService } from '@libs/documents/shared';

export class ProductionplanningShareDocumentRevisionEntityInfoFactory {
	public static create<PT extends IEntityIdentification>(options: IPpsEntityInfoOptions<PT>): EntityInfo {
		const getDataSrv = (ctx: IInitializationContext) => ProductionplanningSharedDocumentRevisionDataServiceManager.getDataService<PT>({
			parentServiceFn: options.parentServiceFn,
			containerUuid: options.containerUuid,
		}, ctx);
		return EntityInfo.create<IPpsDocumentRevisionEntity>({
			grid: {
				title: options.gridTitle,
				containerUuid: options.containerUuid,
				behavior: (ctx) => new PpsDocumentRevisionGridBehavior(getDataSrv(ctx) as IDocumentService<IPpsDocumentRevisionEntity>, ctx.injector),
			},
			dataService: ctx => getDataSrv(ctx),
			dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'PpsDocumentRevisionDto' },
			layoutConfiguration: ctx => ctx.injector.get(ProductionplanningSharedDocumentRevisionLayoutService).generateLayout(),
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