/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';

import { DataServiceFlatNode, ServiceRole, IDataServiceOptions,IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { EstimateProjectComplete } from '../model/estimate-project-complete.class';
import { ProjectEntity, ProjectMainDataService } from '@libs/project/shared';
import { IPrjEstCreationDataGenerated } from '../model/models';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { EstimateProjectEstTypeDialogService } from './dialog-service/estimate-project-est-type-dialog.service';
import { EstimateMainContextService, IEstimateCompositeEntity } from '@libs/estimate/shared';
import { IEstHeaderEntity } from '@libs/estimate/interfaces';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IPrjEstCreationData } from './dialog-service/estimate-project-create-version-dialog.service';
import { map, of } from 'rxjs';

export const ESTIMATE_PROJECT_DATA_TOKEN = new InjectionToken<EstimateProjectDataService>('estimateProjectDataToken');
@Injectable({
	providedIn: 'root'
})

/**
 * Estimate Project Data Service
 */
export class EstimateProjectDataService extends DataServiceFlatNode<IEstimateCompositeEntity, EstimateProjectComplete, ProjectEntity, ProjectEntity> {
	public isFilterActive = true;
	private readonly http = inject(HttpClient);
	private configurationService = inject(PlatformConfigurationService);
	private estimateProjectEstTypeDialogService = inject(EstimateProjectEstTypeDialogService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private messageBoxService = inject(UiCommonMessageBoxService);
	public constructor(projectMainDataService: ProjectMainDataService) {
		const options: IDataServiceOptions<IEstimateCompositeEntity> = {
			apiUrl: 'estimate/project',
			roleInfo: <IDataServiceRoleOptions<IEstimateCompositeEntity>>{
				role: ServiceRole.Node,
				itemName: 'EstimateComplete',
				parent: projectMainDataService,
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				prepareParam: (ident) => {
					return {
						filter: '',
						projectFk: ident.pKey1!,
						IsFilterActive: this.isFilterActive
					};
				},
				usePost: true
			},
			createInfo: {
				endPoint: 'create',
				usePost: true
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
		};

		super(options);
        this.processor.addProcessor([{
		     process:(item)=>{

				this.processItem(item);
			 },
			 revertProcess(){

			 }
		}]);
		this.selectionChanged$.subscribe((entities) => {
			if (entities.length) {
				this.estimateMainContextService.setSelectedPrjEstHeader(entities[0]);
			}
		});
	}

	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				filter: '',
				projectFk: parentSelection.Id!,
				IsFilterActive: this.isFilterActive
			};
		}
		return {
			MainItemId: -1,
		};
	}

	protected override onLoadSucceeded(loaded: object): IEstimateCompositeEntity[] {
		// Convert the loaded data being provided as object to the typed array of loaded data.
		const loadedEntities = loaded as IEstimateCompositeEntity[];
		let transformedEntityList: IEstimateCompositeEntity[] = [];
		if (loadedEntities) {
			transformedEntityList = loadedEntities.map(function (value, index) {
				const estimateCompositeEntity: IEstimateCompositeEntity = {
					PrjEstimate: value.PrjEstimate,
					EstHeader: value.EstHeader,
					EstHeaderId: value.EstHeaderId,
					Id: value.Id
				};
				return estimateCompositeEntity;
			});
		}
		return transformedEntityList;

		// TODO
		// incorporateDataRead: function (readData, data) {
		// 	let gccOrder = _.find (readData, {'IsGCOrder': true});
		// 	if (gccOrder) {
		// 		platformRuntimeDataService.readonly (gccOrder, true);
		// 	}
		// 	let result = serviceContainer.data.handleReadSucceeded (readData, data);
		// 	selectEstHeader (readData);
		// 	serviceContainer.service.onSelectProjectToolbarStatus.fire();
		// 	return result;
		// }

		
	}
// 
	private processItem(item:IEstimateCompositeEntity):void {
    
		 if(item.IsGCOrder){
               this.setEntityReadOnlyFields(item,[{field:'IsGCOrder',readOnly:true}]);
			
		 }
              
	}

	protected override onCreateSucceeded(created: object): IEstimateCompositeEntity {
		return created as IEstimateCompositeEntity;
	}
	
	//TODO
	// let serviceContainer = platformDataServiceFactory.createNewComplete (estimateMainHeaderServiceOptions);
	// let service = serviceContainer.service ? serviceContainer.service : {};
	// service.provideSpecUpdate = new Platform.Messenger ();
	// service.updateToolItems = new Platform.Messenger ();
	// serviceContainer.data.newEntityValidator = newEntityValidator ();

	// public newEntityValidator() {
	// 	return {
	// 		validate: function validate(newItem) {
	// 			let validationService = $injector.get ('estimateProjectValidationService');
	// 			validationService.validateEstHeader$LgmJobFk (newItem, newItem.EstHeader.LgmJobFk, 'EstHeader.LgmJobFk');
	// 		}
	// 	};
	// }

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			const creationData: IPrjEstCreationDataGenerated = {
				PrjProjectFk: 0,
				Codes: [],
				Code: ''
			};
			return this.getCreationData(creationData);
		}
		throw new Error('please select a project first');
	}

	/** create update entity for project estimate
	 *
	 * @param modified - EstimateCompositeEntity
	 * @returns
	 */
	public override createUpdateEntity(modified: IEstimateCompositeEntity | null): EstimateProjectComplete {
		const complete = new EstimateProjectComplete(modified);
		return complete;
	}

	/** get creation data for project estimate container
	 *
	 * @param creationData - IPrjEstCreationDataGenerated
	 * @returns
	 */
	public getCreationData(creationData: IPrjEstCreationDataGenerated): IPrjEstCreationDataGenerated {
		const selectedItem = this.getSelectedParent();
		if (selectedItem && selectedItem.Id && selectedItem.Id > 0) {
			creationData.PrjProjectFk = selectedItem.Id;

			// Increment the code of the estimate header
			const uiEstHeaders: IEstHeaderEntity[] = _.map(this.getList(), 'EstHeader');
			let allEstHeaderOfPrj: IEstHeaderEntity[] = [];
			const isFilterActive: boolean = true;

			allEstHeaderOfPrj = isFilterActive ? allEstHeaderOfPrj.concat(uiEstHeaders) : allEstHeaderOfPrj;
			allEstHeaderOfPrj = _.uniqBy(allEstHeaderOfPrj, 'Id');

			const estHeaderList: IEstHeaderEntity[] = isFilterActive ? allEstHeaderOfPrj : uiEstHeaders;

			const convertibleCodes: IEstHeaderEntity[] = estHeaderList.filter((item) => typeof item.Code === 'string' && /^\d+$/.test(item.Code));

			creationData.Codes = convertibleCodes.map((item) => item.Code as string);

			const convertedCodes: number[] = convertibleCodes.map((item) => {
				const code = typeof item.Code === 'string' ? parseInt(item.Code, 10) : 0;
				return isNaN(code) ? 0 : code;
			});

			let maxCode: number | null = convertedCodes.length === 0 ? null : Math.max(...convertedCodes);
			if (maxCode !== null) {
				maxCode = maxCode + 1;
			}

			creationData.Code = maxCode ? maxCode.toString() : '1';
		}
		return creationData;
	}

	/** gets isFilterActive for project main
	 *
	 * @returns isFilterActive
	 */
	public getFilterStatus() {
		return this.isFilterActive;
	}

	/** updates isFilterActive for project main
	 *
	 * @param status - sets isFilterActive
	 * @returns - updated isFilterActive
	 */
	public setFilterStatus(status: boolean) {
		this.isFilterActive = status;
		return this.isFilterActive;
	}

	/** toggle isFilterActive
	 *
	 */
	public toggleFilterStatus() {
		this.isFilterActive = !this.isFilterActive;
	}

	/** get project entity from estimate main
	 *
	 * @returns project entity
	 */
	public getProjectEntity() {
		return this.getSelectedParent();
	}

	/** create estimate backup using create version
	 *
	 * @param item - IPrjEstCreationData
	 */
	public createEstimateBackup(item: IPrjEstCreationData) {
		let backupData: IPrjEstCreationDataGenerated = {};
		const data: IPrjEstCreationData={
			JobCode: item.JobCode,
			JobDescription: item.JobDescription,
			VersionNo:item.VersionNo,
			VersionDescription:item.CurrentJobDescription,
			VersionComment:item.VersionComment,
			CurrentJob: item.CurrentJob,
			VersionJob:item.VersionJob,
			VersionJobDescription:item.VersionJobDescription,
			CurrentJobDescription:item.CurrentJobDescription
		};
		const compositePrjEst = this.getSelectedEntity();
		if (compositePrjEst) {
			
			backupData = this.getCreationData(data);
			backupData.VersionDescription = item.VersionDescription;
			backupData.VersionComment = item.VersionComment;
			backupData.JobCode = item.JobCode;
			backupData.JobDescription = item.JobDescription;
			backupData.EstimateComplete = compositePrjEst;
			backupData.Code = compositePrjEst.EstHeader.Code;
			backupData.NewEstType = compositePrjEst.EstHeader.EstTypeFk;
			backupData.IsCopyBudget = true;
			backupData.IsCopyCostTotalToBudget = false;
			backupData.IsCopyBaseCost = false;
			backupData.DoCalculateRuleParam = false;
			backupData.SetFixUnitPrice = false;

			this.http.post(this.configurationService.webApiBaseUrl + 'estimate/project/createbackup', backupData).subscribe((response) => {
				// TODO
				// if (!isFilterActive) {
				// 	serviceContainer.data.handleOnCreateSucceeded (response.data, serviceContainer.data);
				// }
				// // set source estheader version
				// if (response.data.EstHeader && headerSelected.EstHeader) {
				// 	headerSelected.EstHeader.VersionNo = response.data.EstHeader.VersionNo + 1;
				// 	service.markItemAsModified (headerSelected);
				// 	projectMainService.update ();
				// 	refreshJobLookup ();
				// }
			});
		}
	}

	/** restore estimate version
	 *
	 * @param item - IPrjEstCreationData
	 */
	public restoreEstimateByVersion(item: IPrjEstCreationData) {
		let backupData: IPrjEstCreationDataGenerated = {};

		const data: IPrjEstCreationData={
			JobCode: item.JobCode,
			JobDescription: item.JobDescription,
			VersionNo:item.VersionNo,
			VersionDescription:item.CurrentJobDescription,
			VersionComment:item.VersionComment,
			CurrentJob: item.CurrentJob,
			VersionJob:item.VersionJob,
			VersionJobDescription:item.VersionJobDescription,
			CurrentJobDescription:item.CurrentJobDescription
		};
		const headerSelected = this.getSelectedEntity();
		if (headerSelected) {
			backupData = this.getCreationData(data);
			backupData.JobCode = item.CurrentJob;
			backupData.JobDescription = item.CurrentJobDescription;
			backupData.VersionJob = item.VersionJob;
			backupData.VersionJobDescription = item.VersionJobDescription;
			backupData.EstimateComplete = headerSelected;
			backupData.NewEstType = headerSelected.EstHeader.EstTypeFk;
			backupData.IsCopyBudget = true;
			backupData.IsCopyCostTotalToBudget = false;
			backupData.IsCopyBaseCost = false;
			backupData.DoCalculateRuleParam = false;
			backupData.SetFixUnitPrice = false;

			this.http.post(this.configurationService.webApiBaseUrl + 'estimate/project/restoreestimate', backupData).subscribe((response) => {
				// TODO
				// serviceContainer.data.handleOnCreateSucceeded (response.data, serviceContainer.data);
				// refreshJobLookup ();
				// service.load ();
			});
		}
	}

	/** Get All Estimate Header By Project
	 *
	 * @returns Observable<IEstHeaderEntity>
	 */
	public getAllEstHeaderByProject() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			const readData = {
				projectFk: parentSelection.Id!, //projectMainService.getIfSelectedIdElse(null);
				IsFilterActive: false
			};
			return this.http.post<IEstimateCompositeEntity[]>(this.configurationService.webApiBaseUrl + 'estimate/project/list', readData).pipe(
				map((response) => {
					const allEstHeaderOfPrj: IEstHeaderEntity[] = [];
					for (const item of response) {
						allEstHeaderOfPrj.push(item.EstHeader);
					}
					return allEstHeaderOfPrj;
				}),
			);
		}
		return of([]);
	}

	/** create deepcopy for project estimate
	 *
	 */
	public createDeepCopy() {

		const compositePrjEst = this.getSelectedEntity();


		const data: IPrjEstCreationDataGenerated = {
			EstimateComplete: compositePrjEst,      // Flag to indicate if filter is active
			EstHeaderFk : compositePrjEst?.EstHeader.Id
		  };
		data.EstimateComplete = compositePrjEst;
		if (!data.EstimateComplete?.EstHeader) {
			return;
		}
		const copyData = this.getCreationData(data);
		if (this.isFilterActive) {
			this.getAllEstHeaderByProject().subscribe((response) => {
				this.estimateProjectEstTypeDialogService.showEstPrjDeepCopyDialog(copyData);
			});
		} else {
			this.estimateProjectEstTypeDialogService.showEstPrjDeepCopyDialog(copyData);
		}
	}

	// TODO create and update logic will be implemented once project.main service and entities are ready


	
	// service.handleUpdateDone = function (data) {
	// 	if (data && data.EstimateCompleteToSave) {
	// 		let estimateCompletes = _.map (data.EstimateCompleteToSave, 'EstimateComplete');
	// 		let gccOrder = _.find (estimateCompletes, {'IsGCOrder': true});
	// 		if (gccOrder) {
	// 			platformRuntimeDataService.readonly (gccOrder, true);
	// 		}
	// 	}


	 

	// 	if (data && data.EstimateCompleteToDelete && data.EstimateCompleteToDelete.length > 0) {
	// 		let isReLoad = data.EstimateCompleteToDelete[0].IsReLoad;
	// 		if (isReLoad) {
	// 			service.load ();
	// 		}
	// 	}
	// };

	// serviceContainer.data.provideUpdateData = function (updateData) {
	// 	service.provideSpecUpdate.fire ();
	// 	let headerTextToSave = estimateProjectSpecificationService.getModifiedSpecification ();
	// 	if (headerTextToSave && headerTextToSave.length) {
	// 		updateData.EntitiesCount += 1;
	// 		updateData.EstimateCompleteTosave = updateData.EstimateCompleteToSave && updateData.EstimateCompleteToSave.length ? updateData.EstimateCompleteToSave : [];
	// 		angular.forEach (headerTextToSave, function (item) {
	// 			if (item && item.ParentId) {
	// 				let matchedItem = _.find (updateData.EstimateCompleteTosave, {MainItemId: item.CompositeItemId});
	// 				if (matchedItem) {
	// 					angular.merge (matchedItem, {
	// 						EstimateComplete: {
	// 							EstHeaderId: item.ParentId,
	// 							EstHeaderTextToSave: item
	// 						}
	// 					});
	// 				} else {
	// 					let itemToSave = {
	// 						MainItemId: item.CompositeItemId,
	// 						EstimateComplete: {
	// 							Id: item.CompositeItemId,
	// 							EstHeaderId: item.ParentId,
	// 							EstHeaderTextToSave: item
	// 						}
	// 					};
	// 					updateData.EstimateCompleteTosave.push (itemToSave);
	// 				}
	// 			}
	// 		});
	// 	}
	// 	return updateData;
	// };

	// let basCommonLookupService = $injector.get ('basicsCurrencyLookupService');
	// basCommonLookupService.loadLookupData ();// load data for currency a and b

	// let onItemSelectionChanged = function onItemSelectionChanged() {
	// 	let estimateCompositeItem = serviceContainer.service.getSelected ();
	// 	if (serviceContainer.service.isSelection (estimateCompositeItem) && estimateCompositeItem.Id > 0) {
	// 		let estHeader = estimateCompositeItem.EstHeader;
	// 		if (estHeader && estHeader.Id > 0) {
	// 			estimateProjectSpecificationService.loadSpecification (estHeader, estimateCompositeItem.Id);
	// 		}
	// 	}
	// };

	// serviceContainer.service.registerSelectionChanged (onItemSelectionChanged);

	// service.getSelctionItem = function(){
	// 	let estimateCompositeItem = serviceContainer.service.getSelected ();
	// 	if(estimateCompositeItem) {
	// 		let estHeader = estimateCompositeItem.EstHeader;
	// 		return estHeader;
	// 	}
	// };
	// serviceContainer.service.saveParentService = function saveParentService() {
	// 	var deferred = $q.defer();
	// 	if (angular.isObject(serviceContainer.data) && angular.isObject(serviceContainer.data.parentService)) {
	// 		serviceContainer.data.parentService.updateAndExecute(function () {
	// 			deferred.resolve();
	// 		});
	// 	}
	// 	return deferred.promise;
	// };

	// function createEstHeaer() {
	// 	createEstimate ().then (function (data) {
	// 		// This function returns Item with 2nd largest Id from passed array
	// 		function findSecondLargeIdItem(arr) {
	// 			if (arr && arr.length <= 1) {
	// 				return null;
	// 			}
	// 			let fLargeNum = 0;
	// 			let sLargeNum = 0;
	// 			for (let i = 0; i < arr.length; i++) {
	// 				if (fLargeNum < arr[i].Id) {
	// 					sLargeNum = fLargeNum;
	// 					fLargeNum = arr[i].Id;
	// 				} else if (sLargeNum < arr[i].Id) {
	// 					sLargeNum = arr[i].Id;
	// 				}
	// 			}
	// 			return _.find (arr, {Id: sLargeNum});
	// 		}

	// 		if (data && data.DoChangeActiveEstimate) {
	// 			let list = serviceContainer.service.getList ();
	// 			let headerList = _.map (list, 'EstHeader');
	// 			let sLargeItem = findSecondLargeIdItem (headerList);
	// 			if (sLargeItem && sLargeItem.Id) {
	// 				sLargeItem.IsActive = false;
	// 				let itemModified = _.find (list, {EstHeader: sLargeItem});
	// 				serviceContainer.service.markItemAsModified (itemModified);
	// 			}
	// 		}

	// 		// do validation for estheader code
	// 		if (data && data.EstHeader && data.EstHeader.Code === '9999999999999999'){
	// 			$injector.get('estimateProjectValidationService').validateEstHeader$Code(data, data.EstHeader.Code);
	// 		}

	// 		serviceContainer.service.onToggleCreateButton.fire (false);

	// 	});
	// }

	// let createEstimate = serviceContainer.service.createItem;
	// serviceContainer.service.createItem = function () {
	// 	serviceContainer.service.onToggleCreateButton.fire (true);
	// 	if (isFilterActive) {
	// 		service.getAllEstHeaderByProject ().then (function () {
	// 			createEstHeaer ();
	// 		});
	// 	} else {
	// 		createEstHeaer ();
	// 	}
	// };

	// TODO - navigation (other submodules)

	// let estHeaderIdToSelect = null;
	// let estProjectIdToSelect = null;
	// serviceContainer.service.navigateToEstHeader = function navigateToEstHeader(estHeader) {
	// 	let estimateTargetContainer = '29';
	// 	let success = showTargetContainer (estimateTargetContainer);
	// 	if (success) {
	// 		estHeaderIdToSelect = estHeader.Id;
	// 		estProjectIdToSelect = estHeader.ProjectFk;
	// 		serviceContainer.service.setFilter ('projectId=' + estProjectIdToSelect);
	// 		serviceContainer.data.doNotLoadOnSelectionChange = true;
	// 		let execFilter = {
	// 			ProjectContextId: estHeader.ProjectFk
	// 		};
	// 		cloudDesktopSidebarService.onExecuteSearchFilter.fire (null, execFilter);
	// 		projectMainService.registerListLoaded (selectProjectOnListLoaded);
	// 	}
	// };

	// function selectProjectOnListLoaded() {
	// 	projectMainService.setSelected (projectMainService.getItemById (estProjectIdToSelect));
	// 	projectMainService.unregisterListLoaded (selectProjectOnListLoaded);
	// 	estProjectIdToSelect = null;
	// 	$timeout (function () {
	// 		serviceContainer.service.load ();
	// 	}, 260);
	// }

	// service.navigateToAssembly = function navigateToProjectAssembly(entity, triggerFieldOption) {
	// 	let success = showTargetContainer ('project.main.assembly.list', false);
	// 	if (success) {
	// 		let projectAssemblyMainService = $injector.get ('projectAssemblyMainService');
	// 		projectAssemblyMainService.setNavigateId (entity[triggerFieldOption.field]);
	// 		let projectSelected = projectMainService.getSelected ();
	// 		if (!projectSelected || (projectSelected.Id !== triggerFieldOption.ProjectFk)) {
	// 			searchProject (triggerFieldOption.ProjectFk);
	// 		}
	// 	}
	// };

	// service.navigateToAssemblyFromPrj = function navigateToProjectAssembly(entity, triggerFieldOption) {
	// 	let success = showTargetContainer ('project.main.assembly.list', true);
	// 	if (success) {
	// 		let projectAssemblyMainService = $injector.get ('projectAssemblyMainService');
	// 		let assembly = projectAssemblyMainService.getItemById (entity[triggerFieldOption.field]);
	// 		if (assembly) {
	// 			projectAssemblyMainService.setSelected (assembly);
	// 		} else {
	// 			projectAssemblyMainService.setNavigateId (entity[triggerFieldOption.field]);
	// 			projectAssemblyMainService.load ();
	// 		}
	// 	}
	// };

	// service.navigateToAssemblyCategory = function navigateToAssemblyCategory(entity, triggerFieldOption) {
	// 	let success = showTargetContainer ('project.assembly.structure', false);
	// 	if (success) {
	// 		let projectAssemblyStructureService = $injector.get ('projectAssemblyStructureService');
	// 		let assemblyStructure = projectAssemblyStructureService.getItemById (entity[triggerFieldOption.field]);
	// 		if (assemblyStructure) {
	// 			projectAssemblyStructureService.setSelected (assemblyStructure);
	// 		} else {
	// 			projectAssemblyStructureService.setNavigateId (entity[triggerFieldOption.field]);
	// 			let projectSelected = projectMainService.getSelected ();
	// 			if (!projectSelected || (projectSelected.Id !== triggerFieldOption.ProjectFk)) {
	// 				searchProject (triggerFieldOption.ProjectFk);
	// 			}
	// 		}
	// 	}
	// };

	// function showTargetContainer(targetContainer, forceActiveTab) {
	// 	let containerConfig = getTargetContainerConfig (targetContainer);
	// 	if (containerConfig.isMatching) {
	// 		setActiveTab (containerConfig.tabIndex, forceActiveTab);
	// 		setActiveSubviewTab (containerConfig.pane, containerConfig.subTabIndex);
	// 	}
	// 	return containerConfig.isMatching;
	// }

	// function getTargetContainerConfig(targetContainer) {
	// 	let containerConfig = {
	// 		isMatching: false,
	// 		tabIndex: -1,
	// 		pane: null,
	// 		subTabIndex: -1
	// 	};
	// 	_.some (mainViewService.getTabs (), function (tab, tabIndex) {
	// 		if (_.isObject (tab.activeView) && _.isObject (tab.activeView.Config)) {
	// 			let config = tab.activeView.Config;
	// 			if (_.isArray (config.subviews)) {
	// 				return _.some (config.subviews, function (subView) {
	// 					if (_.isObject (subView)) {
	// 						let content = subView.content;
	// 						let subTabIndex = 0;
	// 						if (_.isString (content) && targetContainer === content) {
	// 							containerConfig.isMatching = true;
	// 						} else if (_.isArray (content)) {
	// 							subTabIndex = _.findIndex (content, function (item) {
	// 								return item === targetContainer;
	// 							});
	// 							containerConfig.isMatching = (subTabIndex >= 0);
	// 						}
	// 						if (containerConfig.isMatching) {
	// 							containerConfig.tabIndex = tabIndex;
	// 							containerConfig.pane = subView.pane;
	// 							containerConfig.subTabIndex = subTabIndex;
	// 						}
	// 					}
	// 					return containerConfig.isMatching;
	// 				});
	// 			}
	// 		}
	// 		return false;
	// 	});
	// 	return containerConfig;
	// }

	// function setActiveTab(tabIndex, forceActiveTab) {
	// 	if ((mainViewService.getActiveTab () !== tabIndex) || forceActiveTab) {
	// 		mainViewService.setActiveTab (tabIndex);
	// 	}
	// }

	// function setActiveSubviewTab(pane, subTabIndex) {
	// 	if (pane) {
	// 		mainViewService.updateSubviewTab (pane, subTabIndex);
	// 	}
	// }

	// TODO dependent on other services
	// function searchProject(projectId) {
	// 	projectMainService.setProjectSelectedId (projectId);
	// 	let execFilter = {
	// 		ProjectContextId: projectId
	// 	};
	// 	cloudDesktopSidebarService.onExecuteSearchFilter.fire (null, execFilter);
	// }
	// function selectEstHeader(list) {
	// 	if (estHeaderIdToSelect) {
	// 		let item = _.find (list, function (item) {
	// 			return item.PrjEstimate.EstHeaderFk === estHeaderIdToSelect;
	// 		});
	// 		serviceContainer.service.setSelected (item);
	// 		estHeaderIdToSelect = serviceContainer.data.doNotLoadOnSelectionChange = null;
	// 	}
	// }

	/**
	 * Deletes the specified entities.
	 *
	 * @param entities The entities to delete. This can be a single `EstimateCompositeEntity` or an array of them.
	 */
	public override delete(entities: IEstimateCompositeEntity[] | IEstimateCompositeEntity, skipDialog: boolean = false): void {
		const deleteDialogId = ''; // TODO : platformCreateUuid ()
		if (!skipDialog) {
			this.messageBoxService.deleteSelectionDialog({ dontShowAgain: true, id: deleteDialogId })?.then((result) => {
				if (result.closingButtonId === 'yes' || result.closingButtonId === 'ok') {
					this.removeModified(entities);
				}
			});
		}
	}

	// let filters = [
	// 	{
	// 		key: 'estimate-main-lookup-filter',
	// 		serverKey: 'rubric-category-by-rubric-company-lookup-filter',
	// 		serverSide: true,
	// 		fn: function () {
	// 			return {Rubric : 18}; // Estimate Rubric is 18
	// 		}
	// 	}
	// ];

	// serviceContainer.service.registerFilters = function registerFilters() {
	// 	$injector.get ('basicsLookupdataLookupFilterService').registerFilter (filters);
	// };

	// serviceContainer.service.unregisterFilters = function unregisterFilters() {
	// 	$injector.get ('basicsLookupdataLookupFilterService').unregisterFilter (filters);
	// };
	// serviceContainer.service.showPinningDocuments = {
	// 	active: true,
	// 	moduleName: 'estimate.main',
	// 	id: 'EstHeader.Id',
	// 	projectId: 'PrjEstimate.PrjProjectFk',
	// 	description: 'EstHeader.DescriptionInfo.Translated'
	// };

	// function refreshJobLookup() {
	// 	let jobLookupServ = $injector.get ('estimateMainJobLookupByProjectDataService');
	// 	if (jobLookupServ) {
	// 		jobLookupServ.resetCache ({lookupType: 'estimateMainJobLookupByProjectDataService'});
	// 	}

	// 	jobLookupServ = $injector.get ('logisticJobLookupByProjectDataService');
	// 	if (jobLookupServ) {
	// 		jobLookupServ.resetCache ({lookupType: 'logisticJobLookupByProjectDataService'});
	// 	}
	// }
}
