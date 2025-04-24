/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityContainerBehavior, IEntityInfo, IGridContainerLink } from '@libs/ui/business-base';
import {ProviderToken, runInInjectionContext} from '@angular/core';
import {
	BasicsSharedNumberGenerationService
} from '@libs/basics/shared';
import {
	DocumentProjectDataRootService,
	DocumentProjectRevisionDataService,
	DocumentProjectSharedHeaderLayoutService,
	DocumentProjectShareRevisionLayoutService,
	DocumentsSharedBehaviorService,
	IDocumentProjectEntity,
	IDocumentRevisionEntity
} from '@libs/documents/shared';
import { DocumentsMainRevisionDataService } from '../../services/documents-main-revision-data.service';

/**
 * create all the document main entity infos.
 */
export class DocumentMainProviderEntityInfoService {

	/**
	 * Create the entity info related to container "document project".
	 */
	private static createHeaderEntityInfo<T extends object>(documentDataServiceToken: ProviderToken<DocumentProjectDataRootService<T>>, 
			behaviorGrid?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<IDocumentProjectEntity>, IDocumentProjectEntity>>,): EntityInfo {
		const entityInfo: IEntityInfo<IDocumentProjectEntity> = {
			grid: {
				title: {text: 'Documents Project', key: 'cloud.common.documentsProject'},
				behavior: (ctx) => (behaviorGrid ? ctx.injector.get(behaviorGrid) : new DocumentsSharedBehaviorService<IDocumentProjectEntity>(ctx.injector.get(documentDataServiceToken), ctx.injector)),
			},
			form: {
				containerUuid: '8bb802cb31b84625a8848d370142b95c',
				title: { text: 'Document Project Details', key: 'cloud.common.documentsProjectForm' },
			},
			dataService: ctx => ctx.injector.get(documentDataServiceToken),
			dtoSchemeId: { moduleSubModule: 'Documents.Project', typeName: 'DocumentDto' },
			permissionUuid: '4eaa47c530984b87853c6f2e4e4fc67e',
			layoutConfiguration: context => {
				return context.injector.get(DocumentProjectSharedHeaderLayoutService).generateLayout();
			},
			prepareEntityContainer: async ctx => {
				const prcNumGenSrv = ctx.injector.get(BasicsSharedNumberGenerationService);
				await prcNumGenSrv.getNumberGenerateConfig('documents/numbergeneration/list');
			},
		};

		return EntityInfo.create(entityInfo);
	}

	/**
	 * Create the entity info related to container "document project revision container".
	 */
	private static createRevisionEntityInfo<T extends object>(moduleName: string, documentDataServiceToken: ProviderToken<DocumentProjectDataRootService<T>> ): EntityInfo {

		const entityInfo: IEntityInfo<IDocumentRevisionEntity> = {
			grid: {
				title: { text: 'Documents Project Revision', key: 'cloud.common.documentsRevision' },
				behavior: (ctx) =>
					runInInjectionContext(ctx.injector, () => {
						return new DocumentsSharedBehaviorService<IDocumentRevisionEntity>(DocumentProjectRevisionDataService.getInstance(moduleName, ctx.injector.get<DocumentProjectDataRootService<T>>(documentDataServiceToken)), ctx.injector);
					}),
			},
			form: {
				containerUuid: 'd8be3b30fed64aab809b5dc7170e6219',
				title: { text: 'Document Revision Details', key: 'cloud.common.documentsRevisionDetail' },
			},
			dataService: ctx =>   runInInjectionContext(ctx.injector, () => {
				const instance = new DocumentsMainRevisionDataService(ctx.injector.get(documentDataServiceToken));
				return instance;
			}),
			dtoSchemeId: { moduleSubModule: 'Documents.Project', typeName: 'DocumentRevisionDto' },
			permissionUuid: '684f4cdc782b495e9e4be8e4a303d693',
			layoutConfiguration: async context => {
				return context.injector.get(DocumentProjectShareRevisionLayoutService).generateLayout();
			}
		};
		return EntityInfo.create(entityInfo);
	}
	/**
	 * Create all entity information related to the module.
	 * @param moduleInfo
	 */
	public static create<T extends object>(moduleName: string, documentDataServiceToken: ProviderToken<DocumentProjectDataRootService<T>>): EntityInfo[] {
		return [
			this.createHeaderEntityInfo(documentDataServiceToken),
			this.createRevisionEntityInfo(moduleName,documentDataServiceToken)
		];
	}
}