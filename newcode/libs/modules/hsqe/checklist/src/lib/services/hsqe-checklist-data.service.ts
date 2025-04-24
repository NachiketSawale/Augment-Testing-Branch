/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, IEntityProcessor, IReadOnlyField, ServiceRole } from '@libs/platform/data-access';
import { IFilterResult, ISearchPayload, ISearchResult, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedHsqeChecklistStatusLookupService, BasicsSharedHsqeChecklistTypeLookupService, BasicsSharedNumberGenerationService, BasicsSharedTreeDataHelperService, IFilterResponse, MainDataDto } from '@libs/basics/shared';
import { HsqeChecklistDataReadonlyProcessor } from '../model/processor/hsqe-checklist-data-readonly-processor.service';
import { CheckListComplete, IHsqCheckListEntity } from '@libs/hsqe/interfaces';
import { ReplaySubject } from 'rxjs';
import { ProcurementCommonCascadeDeleteConfirmService, ProcurementOverviewSearchlevel } from '@libs/procurement/common';
import { StandardDialogButtonId } from '@libs/ui/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';
import { HsqeChecklistValidationService } from './validations/hsqe-checklist-validation.service';
import { firstValueFrom } from 'rxjs';
import { IChecklistCreationParams } from '../model/entities/hsqe-checklist-creation-params.interface';
import { HsqeChecklistCreationType } from '../model/enums/hsqe-checklist-creation-type';
import { HsqeChecklistCreationMode } from '../model/enums/hsqe-checklist-creation-mode';
export const HSQE_CHECKLIST_DATA_TOKEN = new InjectionToken<HsqeChecklistDataService>('hsqeChecklistDataToken');

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistDataService extends DataServiceHierarchicalRoot<IHsqCheckListEntity, CheckListComplete> {
	private readonly httpService = ServiceLocator.injector.get(PlatformHttpService);
	private readonly checklistStatusLookupSvc = inject(BasicsSharedHsqeChecklistStatusLookupService);
	private readonly checklistTypeLookupSvc = inject(BasicsSharedHsqeChecklistTypeLookupService);
	private readonly translateService = inject(PlatformTranslateService);
	public readonly rootDataCreated$ = new ReplaySubject<IHsqCheckListEntity>(1);
	private readonly cascadeDeleteHelperService = inject(ProcurementCommonCascadeDeleteConfirmService);
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);
	protected treeHelper = inject(BasicsSharedTreeDataHelperService);
	public modelObjects: [] = [];

	public constructor() {
		const options: IDataServiceOptions<IHsqCheckListEntity> = {
			apiUrl: 'hsqe/checklist/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyfilter',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createdto',
				usePost: true,
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'updatedto',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletedto',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IHsqCheckListEntity>>{
				role: ServiceRole.Root,
				itemName: 'CheckListHeaders',
			},
			entityActions: { createSupported: true, deleteSupported: true },
		};
		super(options);

		this.processor.addProcessor([
			/// todo modelProcessor documentsProjectFileActionProcessor
			///todo modelProcessor waiting for modelViewerMarkerUiService is ready
			new HsqeChecklistDataReadonlyProcessor(this),
		]);
		this.init();
	}

	protected override provideAllProcessor(options: IDataServiceOptions<IHsqCheckListEntity>): IEntityProcessor<IHsqCheckListEntity>[] {
		const allProcessor = super.provideAllProcessor(options);
		//allProcessor.push(this.provideDateProcessor());/// todo seems dateProcessor does not work
		return allProcessor;
	}

	// private provideDateProcessor(): IEntityProcessor<IHsqCheckListEntity> {
	// 	const dateProcessorFactory = ServiceLocator.injector.get(EntityDateProcessorFactory);
	// 	return dateProcessorFactory.createProcessorFromSchemaInfo<IHsqCheckListEntity>({ moduleSubModule: MODULE_INFO_CHECKLIST.ChecklistMainModuleName, typeName: 'HsqCheckListDto' });
	// }

	private init() {
		this.selectionChanged$.subscribe(() => {
			this.onSelectionChanged();
		});
	}

	private onSelectionChanged() {
		const currentItem = this.getSelectedEntity();
		if (!currentItem?.PrjProjectFk) {
			this.updateModuleHeaderInfo();
			return;
		}
		const projectId: number = currentItem?.PrjProjectFk as number;
		ServiceLocator.injector
			.get(ProjectSharedLookupService)
			.getItemByKey({ id: projectId })
			.subscribe((projectItem) => {
				//if (projectItem) {
				/// I think this is insance？？？
				// var basicsLookupdataLookupDataService = $injector.get('basicsLookupdataLookupDataService');
				// basicsLookupdataLookupDataService.getItemByKey('Project', entity.PrjProjectFk).then(function (response) {
				// 	if(response) {
				// 		project = response;
				// 		lookupDescriptorService.updateData('Project', [project]);
				// 	}
				// 	service.updateModuleHeaderInfo(project, entity);
				// });
				//}
				this.updateModuleHeaderInfo(projectItem, currentItem);
			});
		//
	}

	private updateModuleHeaderInfo(project?: IProjectEntity, entity?: IHsqCheckListEntity | null) {
		/// todo waiting for cloudDesktopPinningContextService and cloudDesktopInfoService.updateModuleInfo
		// let entityText = '';
		// if(entity) {
		// 	if(project) {
		// 		entityText += cloudDesktopPinningContextService.concate2StringsWithDelimiter(project.ProjectNo, project.ProjectName, ' - ');
		// 		entityText += ' / ';
		// 	}
		// 	//entityText += cloudDesktopPinningContextService.concate2StringsWithDelimiter(entity.Code, entity.DescriptionInfo.Translated, ' - ');
		// }
		// cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameCheckList', entityText);
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IHsqCheckListEntity> {
		// lookupDescriptorService.attachData(readData);
		// var groupTemplateService = $injector.get('hsqeCheckListGroupTemplateDataService'); ///todo
		// if(groupTemplateService){
		// 	groupTemplateService.load();
		// }

		// var modelObjectService = $injector.get('hsqeCheckListModelObjectDataService'); ///todo
		// if(modelObjectService && service.ModelObjects.length < 1){
		// 	service.getModelObjects();
		// }
		const mainDataDto = new MainDataDto<IHsqCheckListEntity>(loaded);
		const dtos = this.treeHelper.flatTreeArray(mainDataDto.Main, (e) => e.HsqCheckListChildren);
		const fr = mainDataDto.getValueAs<IFilterResponse>('FilterResult')!;
		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds,
			},
			dtos: dtos,
		};
	}

	public override createUpdateEntity(modified: IHsqCheckListEntity | null): CheckListComplete {
		const complete = new CheckListComplete();
		if (modified !== null) {
			//complete.CheckListHeader!.Id = modified.Id; seems useless???
			complete.CheckListHeaders = [modified];
			complete.MainItemId = modified.Id;
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: CheckListComplete): IHsqCheckListEntity[] {
		if (complete.CheckListHeaders) {
			return complete.CheckListHeaders;
		}
		if (complete.CheckListHeader) {
			return [complete.CheckListHeader];
		}
		return [];
	}

	public getModelObjects(modelId?: undefined | null | number) {
		if (!modelId) {
			//todo: wait modelViewerModelSelectionService
			//modelId = modelViewerModelSelectionService.getSelectedModelId();
			// TODO: wait cloudDesktopPinningContextService
			// var modelEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'model.main'});
			// if(modelEntity) {
			// 	modelId = modelEntity.id;
			// }
		}
		if (modelId) {
			this.httpService
				.get<[]>('model/main/object/list', {
					params: {
						mainItemId: modelId,
					},
				})
				.then((data) => {
					/// todo:shoud specify the response array type
					this.modelObjects = data;
				});
		}
	}

	/**
	 * Todo waiting for sideBarSearch function completed
	 * @param payload
	 */
	public override executeSidebarSearch(payload: ISearchPayload): Promise<IFilterResult> {
		// var sidebarSearchOptions = {
		// 	moduleName: moduleName,  // required for filter initialization
		// 	enhancedSearchEnabled: true,
		// 	enhancedSearchVersion: '2.0',
		// 	pattern: '',
		// 	pageSize: 100,
		// 	useCurrentClient: true,
		// 	includeNonActiveItems: null,
		// 	showOptions: true,
		// 	showProjectContext: false,
		// 	pinningOptions: {
		// 		isActive: true, showPinningContext: [{token: 'project.main', show: true}, {token: 'model.main', show: true}],
		// 		setContextCallback: function (prjService) {
		// 			cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'PrjProjectFk');
		// 		}
		// 	},
		// 	withExecutionHints: false,
		// 	includeDateSearch:true
		// };
		return super.executeSidebarSearch(payload);
	}

	public override canDelete(): boolean {
		if (this.hasSelection()) {
			const selectedItem = this.getSelection()[0];
			return !this.isStatusReadonly(selectedItem);
		}
		return false;
	}

	/**
	 * check item status is readonly or not
	 * @param item
	 */
	public isStatusReadonly(item: IHsqCheckListEntity) {
		const checklistStatus = this.checklistStatusLookupSvc.cache.getItem({ id: item.HsqChlStatusFk });
		if (checklistStatus) {
			return checklistStatus.IsReadOnly;
		}
		return false;
	}

	/**
	 * check item is readOnly or not
	 */
	public isItemReadOnly(item?: IHsqCheckListEntity | null) {
		if (!item) {
			item = this.getSelectedEntity();
		}
		if (item) {
			return this.isStatusReadonly(item) || item.IsSameContextProjectsByCompany;
		}
		return false;
	}

	public isReadonlyStatus() {
		const selected = this.getSelectedEntity();
		if (selected) {
			return this.isEntityReadOnly(selected);
		}
		return false;
	}

	public isSameContext() {
		const selected = this.getSelectedEntity();
		return selected?.IsSameContextProjectsByCompany;
	}

	protected override provideCreatePayload(): object {
		return {};
		// 	// todo waiting for cloudDesktopPinningContextService
		// prepareParam: () => {
		// 	// var pinProjectEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
		// 	// if (pinProjectEntity) {
		// 	//     creationData.PrjProjectFk = pinProjectEntity.id;
		// 	// }
		// 	return {
		// 		// PrjProjectFk:null
		// 	};
		// },
	}

	/**
	 * get checklist type
	 * @param checkListEntity
	 */
	public getChecklistTypeEntity(checkListEntity: IHsqCheckListEntity) {
		return this.checklistTypeLookupSvc.cache.getItem({ id: checkListEntity.HsqChkListTypeFk });
	}

	private shouldGenerateNumber(checkListEntity: IHsqCheckListEntity): boolean {
		const checklistTypeEntity = this.getChecklistTypeEntity(checkListEntity);
		if (checklistTypeEntity) {
			return this.genNumberSvc.hasNumberGenerateConfig(checklistTypeEntity.RubricCategoryFk);
		}
		return false;
	}

	public override onCreateSucceeded(created: IHsqCheckListEntity) {
		const validationService = ServiceLocator.injector.get(HsqeChecklistValidationService);
		const checklistTypeEntity = this.getChecklistTypeEntity(created);
		const defaultCode = this.translateService.instant('cloud.common.isGenerated').text;
		if (checklistTypeEntity && (created.Code === null || created.Code === defaultCode)) {
			const basRubricCategoryFk = checklistTypeEntity.RubricCategoryFk;
			const readonlyFields: IReadOnlyField<IHsqCheckListEntity>[] = [
				{
					field: 'Code',
					readOnly: this.genNumberSvc.hasNumberGenerateConfig(basRubricCategoryFk),
				},
			];
			this.setEntityReadOnlyFields(created, readonlyFields);
			if (this.shouldGenerateNumber(created)) {
				created.Code = this.genNumberSvc.provideNumberDefaultText(basRubricCategoryFk);
			}
			validationService.validateGenaratedCode(created.Code);
			validationService.validateHsqCheckListTemplateFk(created, created.HsqCheckListTemplateFk);
			if (this.genNumberSvc.hasNumberGenerateConfig(basRubricCategoryFk)) {
				// service.gridRefresh(); todo
			}
		}
		this.rootDataCreated$.next(created);
		return created;
	}

	public override async delete(entities: IHsqCheckListEntity[] | IHsqCheckListEntity) {
		const selectedItem = this.getSelectedEntity();
		if (selectedItem) {
			await this.cascadeDeleteHelperService ///todo Ul is different.check package module lager
				.openDialog({
					filter: '',
					mainItemId: selectedItem.Id,
					moduleIdentifier: 'hsqe.checklist',
					searchLevel: ProcurementOverviewSearchlevel.RootContainer,
				})
				.then((res) => {
					if (res) {
						if (res.closingButtonId === StandardDialogButtonId.Yes) {
							super.delete(entities);
						}
					}
				});
		}
	}

	public getProjectId() {
		const checklist = this.getSelectedEntity();
		//var project = cloudDesktopPinningContextService.getPinningItem('project.main');//todo waiting for pinning context service
		//const projectId = project ? project.Id : (checklist ? checklist?.PrjProjectFk:null):null;
		return checklist ? checklist?.PrjProjectFk : null;
	}
	/**
	 * Create checklist by groupTemplate
	 * todo parameter should be groupTemplate entity, since it is not ready , i use id temporary
	 * @param templateId
	 */
	public async createItemByTemplate(templateId: number) {
		//todo below code is executed once templateEntity.IsGroup !== true{//}
		const params: IChecklistCreationParams = {
			projectId: this.getProjectId(),
			checkListTemplateId: templateId,
			fromCheckListTemplate: HsqeChecklistCreationType.FromTemplate,
			createCheckListFlg: HsqeChecklistCreationMode.Default,
		};
		const items = await firstValueFrom<IHsqCheckListEntity[]>(this.httpService.post$<IHsqCheckListEntity[]>('hsqe/checklist/wizard/createChecklist', params));
		if (items.length > 0) {
			const checklistTreeList = this.getList();
			items.forEach((item) => {
				const _findItem = checklistTreeList.find((treeItem) => treeItem.Code === item.Code);
				if (!_findItem) {
					checklistTreeList.push(item);
				}
				this.onCreateSucceeded(item);
			});
		}
	}

	public override getList() {
		const itemList = super.getList().filter((e) => e.IsSearchItem);
		this.setList(itemList);
		return itemList;
		/// what is the scenario, and seems nowhere to set this itemFilterEnabled
		// if (serviceContainer.data.itemFilterEnabled) {
		// 	var platformDataServiceItemFilterExtension = $injector.get('platformDataServiceItemFilterExtension');
		// 	return platformDataServiceItemFilterExtension.filterList(serviceContainer.data);
		// }
	}

	public canCopy() {
		const itemSelected = this.getSelectedEntity();
		return itemSelected && !itemSelected.HsqCheckListFk;
	}

	public createDeepCopy() {
		const itemSelected = this.getSelectedEntity();
		if (itemSelected) {
			this.httpService.post<CheckListComplete>('hsqe/checklist/header/deepcopy', itemSelected).then((response) => {
				if (response && response.CheckListHeader && response.CheckListHeader.HsqCheckListFk === null) {
					this.copySuccess(response.CheckListHeader);
				}
			});
		}
	}

	private copySuccess(checklist: IHsqCheckListEntity) {
		this.append(checklist);
		this.refreshAll().then();
		//serviceContainer.data.handleOnCreateSucceeded(checklist, serviceContainer.data);
	}

	public async createSubDeepCopy() {
		const itemSelected = this.getSelectedEntity();
		const response = await firstValueFrom<CheckListComplete>(this.httpService.post$('hsqe/checklist/header/subdeepcopy', itemSelected));
		if (response) {
			const checklistHeader = response.CheckListHeader;
			if (checklistHeader) {
				const checklistList = this.getList();
				const parentItem = checklistList?.find((e) => e.Id === checklistHeader.HsqCheckListFk);
				if (parentItem) {
					parentItem.HasChildren = true;
					parentItem.HsqCheckListChildren = parentItem.HsqCheckListChildren ?? [];
					parentItem.HsqCheckListChildren.push(checklistHeader);
				}
				this.copySuccess(checklistHeader);
			}
		}
	}

	public override childrenOf(element: IHsqCheckListEntity): IHsqCheckListEntity[] {
		return element.HsqCheckListChildren ?? [];
	}

	public override parentOf(element: IHsqCheckListEntity): IHsqCheckListEntity | null {
		if (element.HsqCheckListFk == null) {
			return null;
		}

		const parentId = element.HsqCheckListFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	//TODO Navigation
	// service.navigateTo = function navigateTo(item, triggerfield) {
	// 	var checklistId = null;
	// 	var platformObjectHelper=$injector.get('platformObjectHelper');
	// 	if (item && (platformObjectHelper.getValue(item, triggerfield) || item.HsqChecklistFk)) {
	// 		checklistId = platformObjectHelper.getValue(item, triggerfield) || item.HsqChecklistFk;
	// 	}
	// 	cloudDesktopSidebarService.filterSearchFromPKeys([checklistId]);
	// };
}

// todo specialTreatmentService.adjustCreateConfiguration（CreationInitialDialogService） not support yet
// todo： show project header: showProjectHeader -> {getProject: getProject}
// todo: handle update done: handleUpdateDone,
// todo:model related function
//  -- createObjectSet modelViewerDragdropService
//  --pickPosition  related  modelViewerMarkerService,modelViewerModelSelectionService
//  --refreshAction
//  --loadSelectedModel related modelViewerModelSelectionService
//  --setMarkerListLoaded related markerService
