/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable, InjectionToken } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, IReadOnlyField } from '@libs/platform/data-access';
import { DocumentProjectDataRootService, IDocumentProjectEntity } from '@libs/documents/shared';

import { BasicsSharedNumberGenerationService, IFilterResponse } from '@libs/basics/shared';
import { get, isEmpty } from 'lodash';
import { ISearchResult } from '@libs/platform/common';
import { StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { DocumentsCentralqueryContextConfigOptionComponent } from '../components/context-config/documents-centralquery-context-config-option.component';

export const DOCUMENT_CENTRAL_QUERY_HEADER_DATA_TOKEN = new InjectionToken<DocumentsCentralQueryHeaderService>('documentsCentralQueryDataToken');

@Injectable({
	providedIn: 'root',
})
export class DocumentsCentralQueryHeaderService extends DocumentProjectDataRootService<object> {
	// todo
	private uploadCreateItem: IDocumentProjectEntity[] = [];
	//private readonly drawPreviewService = inject(null);//-todo --basicsCommonDrawingPreviewDataService
	// private readonly checkSameContextDialogService = inject(null);//todo-documentProjectDocumentUploadCheckSameContextDialogService
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);
	private readonly dialogService = inject(UiCommonDialogService);

	public constructor() {
		const options: IDataServiceOptions<IDocumentProjectEntity> = {
			apiUrl: 'documents/centralquery',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listDocuments',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deleteComplete',
			},
			roleInfo: <IDataServiceRoleOptions<IDocumentProjectEntity>>{
				role: ServiceRole.Root,
				itemName: 'Document',
			},
		};
		super(undefined, options);
	}

	protected override onCreateSucceeded(created: object): IDocumentProjectEntity {
		//todo: enable code when the checkSameContextDialogService is available
		// const data = created as unknown as IDocumentProjectEntity;
		// let newData;
		// checkSameContextDialogService.getDuplicateContext(data).then(function (res) {
		//     const resData = (res && res.data) ? res.data : res;
		//     if (resData && resData.Id > -1) {
		//         newData = this.createFn(data);
		//     } else {
		//         newData = data;
		//     }
		// });
		// return newData;
		return created as unknown as IDocumentProjectEntity;
	}

	//todo
	// private createFn(newItem)
	// if (checkSameContextDialogService.hasGroupingFilterFieldKey) {
	//     checkSameContextDialogService.hasGroupingFilterFieldKey = false;
	// } else {
	//     checkSameContextDialogService.getGroupingFilterFieldKey(DocumentsCentralQueryHeaderService);
	// }
	// if (this.handleCreateSucceeded) {
	//     newItem = handleCreateSucceeded(data);// In case more data is send back from server it can be stripped down to the new item here.
	//     if (!newItem) {// Fall back, if no value is returned by handleCreateSucceeded
	//         newItem = newData;
	//     }
	// } else {
	//     newItem = newData;
	// }
	// if (data.addEntityToCache) {
	//     data.addEntityToCache( data);
	// }
	// if (service.isConfigurationDialog === true) {
	//     service.isConfigurationDialog = false;
	// } else {
	//     return handleOnCreateSucceeded(newItem, data);
	// }
	//     return {};
	// }

	private handleCreateSucceeded(newData: IDocumentProjectEntity[]) {
		if (isEmpty(this.uploadCreateItem)) {
			//todo
			// newData.DocumentDate = moment.utc(Date.now());
			// if (platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data)) {
			//     newData.IsFromDialog = true;
			// }
			// projectDocumentNumberGenerationSettingsService.assertLoaded().then(function () {
			//     platformRuntimeDataService.readonly(newData, [{
			//         field: 'Code',
			//         readonly: projectDocumentNumberGenerationSettingsService.hasToGenerateForRubricCategory(newData.RubricCategoryFk)
			//     }]);
			//     newData.Code = projectDocumentNumberGenerationSettingsService.provideNumberDefaultText(newData.RubricCategoryFk, newData.Code);
			//     var currentItem = service.getSelected();
			//     service.fireItemModified(currentItem);
			// });
			// if (_.isNil(newData.PrjProjectFk)) {
			//     var pinProjectId = getPinningProjectId();
			//     if (pinProjectId !== -1) {
			//         newData.PrjProjectFk = pinProjectId;
			//     }
			// }
			return newData;
		} else {
			//todo if config data,and upload multiple documents at the same time, framework should support return multiple record or using the below functions
			// serviceContainer.data.itemList = this.uploadCreateItem;
			// service.markEntitiesAsModified(serviceContainer.data.itemList);
			// serviceContainer.data.doUpdate(serviceContainer.data).then((res) => {
			//     if (res && res.Document) {
			//         let readData = {
			//             dtos: res.Document,
			//             FilterResult: null
			//         };
			//         serviceContainer.data.onReadSucceeded(readData, serviceContainer.data);
			//     }
			// }).finally(() => {
			//     var parentState = platformModuleStateService.state(service.getModule());
			//     if (parentState && parentState.modifications) {
			//         parentState.modifications.EntitiesCount = 0;
			//     }
			//     service.isConfigurationDialog = true;
			//     service.uploadCreateItem = {};
			// });
			return [];
		}
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IDocumentProjectEntity> {
		const fr = get(loaded, 'FilterResult')! as IFilterResponse;
		//todo: enable code when the drawPreviewService is available
		//drawPreviewService.getRibArchiveDocuments(DocumentsCentralQueryHeaderService, data);
		return {
			FilterResult: fr,
			dtos: get(loaded, 'dtos')! as IDocumentProjectEntity[],
		};
	}

	private readonlyField(item: IDocumentProjectEntity, _field: string): void {
		const readFields = Object.keys(item).map((k) => {
			return { field: k, readOnly: k === _field };
		}) as IReadOnlyField<IDocumentProjectEntity>[];
		this.setEntityReadOnlyFields(item, readFields);
	}

	private isReadOnly() {
		const currentItem = this.getSelectedEntity();
		return !currentItem || currentItem.IsReadonly;
	}

	private getCellEditable(item: IDocumentProjectEntity, model: string) {
		if (model === 'DocumentTypeFk') {
			return !item.FileArchiveDocFk;
		}
		return true;
	}

	private getSelectedProjectId() {
		//todo
		// let prjId=-1;
		// const documentProject=this.getSelectedEntity();
		// let project = cloudDesktopPinningContextService.getPinningItem('project.main');
		// if(project){
		//     prjId = project.id;
		// }else if (documentProject && !_.isNull(documentProject.PrjProjectFk)) {
		//     prjId = documentProject.PrjProjectFk;
		// }
		// return prjId;
	}

	//todo
	// private setCurrentPinningContext() {
	//     function setCurrentProjectToPinnningContext() {
	//         const currentItem = this.getSelectedEntity();
	//         if (currentItem) {
	// let projectPromise = Promise.resolve(true);
	// let pinningContext = [];
	// if (_.isNumber(currentItem.Id)) {
	//     if (_.isNumber(currentItem.PrjProjectFk)) {
	//         projectPromise = cloudDesktopPinningContextService.getProjectContextItem(currentItem.PrjProjectFk).then(function (pinningItem) {
	//             pinningContext.push(pinningItem);
	//         });
	//     }
	// }
	// return Promise.all([projectPromise]).then(
	//     function () {
	//         if (pinningContext.length > 0) {
	//             cloudDesktopPinningContextService.setContext(pinningContext);
	//         }
	//     });
	//         }
	//     }
	//
	//     setCurrentProjectToPinnningContext();
	// }

	// private processDocument(item:IDocumentProjectEntity) {
	//     if (item.Version === 0 && this.genNumberSvc.hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
	//         this.readonlyField(item, 'Code');
	//     }
	//     // readOnly when the ribArchive file send/callback to itwoSite
	//     this.readonlyField(item, 'PrjDocumentCategoryFk');
	//     this.readonlyField(item, 'PrjDocumentTypeFk');
	// }

	private getPinningProjectId() {
		//todo
		// const context = cloudDesktopPinningContextService.getContext();
		// if (context) {
		//     for (let i = 0; i < context.length; i++) {
		//         if (context[i].token === 'project.main') {
		//             return context[i].id;
		//         }
		//     }
		// }
		// return -1;
	}

	public contextConfig() {
		return this.dialogService.show({
			width: '360px',
			height: 'auto',
			headerText: 'documents.centralquery.contextTitle',
			resizeable: true,
			id: '20E3EE2645A14E7E813DD787E9A17A4F',
			showCloseButton: true,
			bodyComponent: DocumentsCentralqueryContextConfigOptionComponent,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'ui.common.dialog.okBtn' },
					fn(_evt, info) {
						info.dialog.body.onOKBntClicked().then(() => {
							info.dialog.close();
						});
					},
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
		});
	}
}
