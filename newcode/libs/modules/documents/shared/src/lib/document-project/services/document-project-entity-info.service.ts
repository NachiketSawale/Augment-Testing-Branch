/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityContainerBehavior, IEntityInfo, IGridContainerLink } from '@libs/ui/business-base';
import { IDocumentProjectEntity } from '../../model/entities/document-project-entity.interface';
import { DocumentsSharedBehaviorService } from '../../base-document/behavios/documents-shared-behavior.service';
import { DocumentProjectSharedHeaderLayoutService } from './document-project-shared-header-layout.service';
import { ProviderToken, runInInjectionContext } from '@angular/core';
import { IDocumentRevisionEntity } from '../../model/entities/document-revision-entity.interface';
import { DocumentProjectRevisionDataService } from './document-project-revision-data.service';
import { DocumentProjectShareRevisionLayoutService } from './document-project-share-revision-layout.service';
import { DocumentProjectDataRootService } from './document-project-data-root.service';
import { BasicsSharedClerkLayoutService, BasicsSharedNumberGenerationService, IBasicsClerkEntity } from '@libs/basics/shared';
import { DocumentProjectClerkDataService } from './document-project-clerk-data.service';
import { DocumentProjectHistoryDataService } from './document-project-history-data.service';
import { DocumentProjectHistoryLayoutService } from './document-project-history-layout.service';
import { IDocumentProjectHistoryEntity } from '../../model/entities/document-project-history-entity.interface';
import { DocumentHistoryBehaviorService } from '../behavior/document-history-behavior.service';

/**
 * create all the document project entity infos.
 */
export class DocumentProjectEntityInfoService {
	/**
	 * Create the entity info related to container "document project".
	 */
	private static createHeaderEntityInfo<T extends object>(
		documentDataServiceToken: ProviderToken<DocumentProjectDataRootService<T>>,
		behaviorGrid?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<IDocumentProjectEntity>, IDocumentProjectEntity>>,
	): EntityInfo {
		const entityInfo: IEntityInfo<IDocumentProjectEntity> = {
			grid: {
				title: { text: 'Documents Project', key: 'cloud.common.documentsProject' },
				behavior: (ctx) => (behaviorGrid ? ctx.injector.get(behaviorGrid) : new DocumentsSharedBehaviorService<IDocumentProjectEntity>(ctx.injector.get(documentDataServiceToken), ctx.injector)),
			},
			form: {
				containerUuid: '8bb802cb31b84625a8848d370142b95c',
				title: { text: 'Document Project Details', key: 'cloud.common.documentsProjectForm' },
			},
			dataService: (ctx) => ctx.injector.get(documentDataServiceToken),
			dtoSchemeId: { moduleSubModule: 'Documents.Project', typeName: 'DocumentDto' },
			permissionUuid: '4eaa47c530984b87853c6f2e4e4fc67e',
			layoutConfiguration: (context) => {
				return context.injector.get(DocumentProjectSharedHeaderLayoutService).generateLayout();
			},
			prepareEntityContainer: async (ctx) => {
				const prcNumGenSrv = ctx.injector.get(BasicsSharedNumberGenerationService);
				await prcNumGenSrv.getNumberGenerateConfig('documents/numbergeneration/list');
			},
		};

		return EntityInfo.create(entityInfo);
	}

	/**
	 * Create the entity info related to container "document project revision container".
	 */
	private static createRevisionEntityInfo<T extends object>(moduleName: string, documentDataServiceToken: ProviderToken<DocumentProjectDataRootService<T>>): EntityInfo {
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
			dataService: (ctx) =>
				runInInjectionContext(ctx.injector, () => {
					return DocumentProjectRevisionDataService.getInstance(moduleName, ctx.injector.get(documentDataServiceToken));
				}),
			dtoSchemeId: { moduleSubModule: 'Documents.Project', typeName: 'DocumentRevisionDto' },
			permissionUuid: '684f4cdc782b495e9e4be8e4a303d693',
			layoutConfiguration: async (context) => {
				return context.injector.get(DocumentProjectShareRevisionLayoutService).generateLayout();
			},
		};
		return EntityInfo.create(entityInfo);
	}

	private static createClerkEntityInfo<T extends object>(moduleName: string, documentDataServiceToken: ProviderToken<DocumentProjectDataRootService<T>>): EntityInfo {
		const entityInfo: IEntityInfo<IBasicsClerkEntity> = {
			grid: {
				title: { text: 'Project Document Clerk (Authorizations)', key: 'documents.project.listPrjDocumentClerkAuthTitle' },
			},
			form: {
				containerUuid: '7806e7a22b2142f8865ab189efe23c5a',
				title: { text: 'Project Document Clerk (Authorization) Details', key: 'documents.project.detailPrjDocumentClerkAuthTitle' },
			},
			dataService: (ctx) =>
				runInInjectionContext(ctx.injector, () => {
					return DocumentProjectClerkDataService.getInstance(moduleName, ctx.injector.get(documentDataServiceToken));
				}),
			dtoSchemeId: { moduleSubModule: 'Basics.Common', typeName: 'ClerkDataDto' },
			permissionUuid: '47620dd38c874f97b75ee3b6ce342666',
			layoutConfiguration: async (context) => {
				return context.injector.get(BasicsSharedClerkLayoutService).generateConfig();
			},
		};
		return EntityInfo.create(entityInfo);
	}

	private static createHistoryEntityInfo<T extends object>(moduleName: string, documentDataServiceToken: ProviderToken<DocumentProjectDataRootService<T>>): EntityInfo {
		const entityInfo: IEntityInfo<IDocumentProjectHistoryEntity> = {
			grid: {
				title: { text: 'Document Project History', key: 'cloud.common.documentsProjectHistory' },
				behavior: (ctx) =>
					runInInjectionContext(ctx.injector, () => {
						return new DocumentHistoryBehaviorService<IDocumentProjectHistoryEntity>(DocumentProjectHistoryDataService.getInstance(moduleName, ctx.injector.get(documentDataServiceToken)));
					}),
			},
			dataService: (ctx) =>
				runInInjectionContext(ctx.injector, () => {
					return DocumentProjectHistoryDataService.getInstance(moduleName, ctx.injector.get(documentDataServiceToken));
				}),
			dtoSchemeId: { moduleSubModule: 'Documents.Project', typeName: 'DocumentHistoryDto' },
			permissionUuid: '39d0d1c6753b49029b3c953165f8ceb7',
			layoutConfiguration: async (context) => {
				return context.injector.get(DocumentProjectHistoryLayoutService).generateConfig();
			},
		};
		return EntityInfo.create(entityInfo);
	}

	/**
	 * Create all entity information related to the module.
	 * @param moduleName
	 * @param documentDataServiceToken
	 * @param behaviorGrid
	 */
	public static create<T extends object>(
		moduleName: string,
		documentDataServiceToken: ProviderToken<DocumentProjectDataRootService<T>>,
		behaviorGrid?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<IDocumentProjectEntity>, IDocumentProjectEntity>>,
	): EntityInfo[] {
		return [
			this.createHeaderEntityInfo(documentDataServiceToken, behaviorGrid),
			this.createRevisionEntityInfo(moduleName, documentDataServiceToken),
			this.createClerkEntityInfo(moduleName, documentDataServiceToken),
			this.createHistoryEntityInfo(moduleName, documentDataServiceToken),
		];
	}
}
