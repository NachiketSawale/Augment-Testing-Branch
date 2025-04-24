import { EntityInfo } from '@libs/ui/business-base';
import { IDocumentService } from '@libs/documents/shared';
import { /*CompleteIdentification,*/ IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IPpsDocumentEntity } from '../../model/document/pps-document-entity.interface';
import { ProductionplanningSharedDocumentLayoutService } from './pps-document-layout.service';
import { ProductionplanningSharedDocumentDataServiceManager } from '../../services/document/pps-document-data-service-manager.service';
import { PpsDocumentGridBehavior } from './pps-document-grid-behavior.service';
import { IPpsDocumentEntityInfoOptions } from '../../model/pps-document-entity-info-options.interface';

export class ProductionplanningShareDocumentEntityInfoFactory {
	public static create<PT extends IEntityIdentification>(options: IPpsDocumentEntityInfoOptions<PT>): EntityInfo {
		const getDataSrv = (ctx: IInitializationContext) => ProductionplanningSharedDocumentDataServiceManager.getDataService<PT>({
			parentServiceFn: options.parentServiceFn,
			containerUuid: options.containerUuid,
			endPoint: options.endPoint,
			foreignKey: options.foreignKey,
			idProperty: options.idProperty,
			selectedItemIdProperty: options.selectedItemIdProperty,
			IsParentEntityReadonlyFn: options.IsParentEntityReadonlyFn,
			// provideLoadPayloadFn?: () => object, // todo: for case of trsReqDocumentLookupDataService of old angularjs code
		}, ctx);
		return EntityInfo.create<IPpsDocumentEntity>({
			grid: {
				title: options.gridTitle,
				containerUuid: options.containerUuid,
				behavior: (ctx) => new PpsDocumentGridBehavior(getDataSrv(ctx) as IDocumentService<IPpsDocumentEntity>, ctx.injector, options.canCreate, options.canDelete),
			},
			dataService: ctx => getDataSrv(ctx),
			dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'PpsDocumentDto' },
			layoutConfiguration: ctx => ctx.injector.get(ProductionplanningSharedDocumentLayoutService).generateLayout(),
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