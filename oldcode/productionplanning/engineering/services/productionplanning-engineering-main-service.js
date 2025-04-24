/**
 * Created by las on 1/25/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.engineering';
	var engtaskModule = angular.module(moduleName);
	/*global angular, _, globals*/
	engtaskModule.factory('productionplanningEngineeringMainService', MainService);
	MainService.$inject = ['platformDataServiceFactory',
		'basicsCommonMandatoryProcessor', 'productionplanningCommonStructureFilterService',
		'cloudDesktopSidebarService',
		'$injector',
		'productionplanningEngineeringTaskStatusLookupService',
		'productionplanningCommonControllingUnitFilterDataServiceFactory',
		'productionplanningCommonPsdActivityFilterDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningEngineeringTaskProcessor',
		'ppsCommonDataServiceSideloadExtension',
		'productionplanningEngineeringPinningContextExtension',
		'productionplanningEngineeringNavigationExtension',
		'basicsLookupdataLookupDescriptorService',
		'$q',
		'cloudDesktopInfoService'];

	function MainService(
		platformDataServiceFactory,
		basicsCommonMandatoryProcessor, ppsCommonStructureFilterService,
		cloudDesktopSidebarService,
		$injector,
		engTaskStatusServ,
		commonControllingUnitFilterDataServiceFactory,
		commonPsdActivityFilterDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		engTaskProcessor,
		ppsCommonDataServiceSideloadExtension,
		pinningContextExtension,
		navigationExtension,
		basicsLookupdataLookupDescriptorService,
		$q,
		cloudDesktopInfoService) {

		let characteristicColumn = '';
		var serviceContainer;

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
			{
				typeName: 'EngTaskDto',
				moduleSubModule: 'ProductionPlanning.Engineering'
			}
		);

		var serviceOption = {
			flatRootItem: {
				module: engtaskModule,
				serviceName: 'productionplanningEngineeringMainService',
				entityNameTranslationID: 'productionplanning.engineering.entityEngTask',
				httpCRUD: {
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						// HACK: to fix issue about searching nothing when click (Engineering Header)item on "Sidebars>Favorites>Engineering Planning".
						// As for the feature about "Favorites>Engineerng Planning", we search engineering tasks by favorite engineering headers. (by zwz 2019/04/15)
						if(filterRequest.PKeys && filterRequest.PKeys.length === 1 && filterRequest.furtherFilters){
							var furtherfilter = _.find(filterRequest.furtherFilters, {Token:'productionplanning.engineering'});
							if(furtherfilter && furtherfilter.Value === filterRequest.PKeys[0].Id ){
								filterRequest.PKeys = null;
							}
						}

						filterRequest.orderBy = [{Field: 'Code'}];
						ppsCommonStructureFilterService.extendSearchFilterAssign('productionplanningEngineeringMainService', filterRequest);
						ppsCommonStructureFilterService.setFilterRequest('productionplanningEngineeringMainService', filterRequest);
					},
					route: globals.webApiBaseUrl + 'productionplanning/engineering/task/',
					endRead: 'customfiltered',
					usePostForRead: true,
					endDelete: 'multidelete'// remark: if entitySelection.supportsMultiSelection is true, we use 'multidelete' as endDelete, or we use 'delete' as endDelete
				},
				entitySelection: {supportsMultiSelection: true},
				entityRole: {
					root: {
						itemName: 'EngTasks',// remark: since entitySelection.supportsMultiSelection is true, we use 'EngTasks' as itemName. 'EngTasks' maps collection-property EngTasks of EngTaskCompelteDto
						moduleName: 'cloud.desktop.moduleDisplayNameEngineering',
						descField: 'Description',
						handleUpdateDone: handleUpdateDone,
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						useIdentification: true
					}
				},
				dataProcessor: [dateProcessor, engTaskProcessor],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData.Lookups);

							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};
							const dataRead = serviceContainer.data.handleReadSucceeded(result, data);

							handleCharacteristic(result.dtos);

							return dataRead;
						},
						initCreationData: function (creationData) {
							//set mainItemId for creationData by pinning context
							var pinnedItemFound = getEngineeringPinnedItem();
							if (pinnedItemFound) {
								creationData.Pkey1 = pinnedItemFound.id;
							}
						},
						handleCreateSucceeded: function (newItem) {
							//set ClerkFk field by current logged user
							var clerkServ = $injector.get('basicsClerkUtilitiesService');
							clerkServ.getClientByUser().then(function (data) {
								if (data && data.Id !== 0 && data.Id !== null && data.Id !== undefined) {
									newItem.ClerkFk = data.Id;
								}
							});

							if (newItem.Version === 0 && newItem.EventTypeFk === 0) {
								newItem.PlannedStart = null;
								newItem.PlannedFinish = null;
								newItem.EarliestStart = null;
								newItem.EarliestFinish = null;
								newItem.LatestStart = null;
								newItem.LatestFinish = null;
							}
							// set ProjectId if has pinned Project but EngHeader.The newItem's ProjectId is used for default filter param for EngHeader dialog lookup.
							if (newItem.Version === 0 && newItem.EngHeaderFk === 0 && (newItem.ProjectId === 0 || newItem.ProjectId === null)){
								var temp = cloudDesktopSidebarService.filterRequest.projectContextId;
								if (temp !== null && temp !== 0) {
									newItem.ProjectId = temp;
								}
							}

							handleCharacteristic(newItem, true);
						}
					}
				},
				actions: {
					delete: {},
					create: 'flat',
					canDeleteCallBackFunc: function (selectedItem) {
						//First, exclude situtation of "selected item is new unsaved"
						if (selectedItem.Version <= 0) {
							return true;
						}
						//Then, exclude situtation of "the status of selected item is invalid"
						if (!selectedItem.EngTaskStatusFk) {
							return false;
						}
						//At last, return result(true or false) according to the valid status of selected item
						var statusList = engTaskStatusServ.getList();
						var status = _.find(statusList, {Id: selectedItem.EngTaskStatusFk});
						return status && status.Isdeletable;
					}
				},
				useItemFilter: true,
				//entitySelection: {supportsMultiSelection: true},
				sidebarWatchList: {active: true},// enable watchlist for engineering module
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true,
						includeDateSearch: true,
						pinningOptions: pinningContextExtension.createPinningOptions()
					}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		/* jshint -W003 */
		var service = serviceContainer.service;

		service.changedSequenceEvents = [];

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'EngTaskDto',
			moduleSubModule: 'ProductionPlanning.Engineering',
			mustValidateFields: ['EngHeaderFk', 'Code', 'EventTypeFk', 'PlannedStart', 'PlannedFinish', 'EarliestStart', 'EarliestFinish', 'LatestStart', 'LatestFinish'],
			validationService: 'productionplanningEngineeringTaskValidationService'
		});

		service.getSelectedProjectId = function () {
			//project id is now set according to current selection
			var selectedItem = service.getSelected();
			return selectedItem !== null && selectedItem.ProjectId > 0? service.getSelected().ProjectId : -1;

			//prior implementation:
			// var projectId = cloudDesktopSidebarService.filterRequest.projectContextId;
			// if (projectId === null) {
			// 	return -1;
			// }
			// else {
			// 	return projectId;
			// }
		};

		pinningContextExtension.addPinningContextChanged(service);

		// angular.extend(service, {
		// 	extendSearchFilterAssign: extendSearchFilterAssign
		// });

		var lastFilter = null;
		service.getLastFilter = function () {
			return lastFilter;
		};
		// connect to filter service
		//ppsCommonStructureFilterService.setServiceToBeFiltered(service);
		ppsCommonStructureFilterService.setFilterFunction('productionplanningEngineeringMainService', ppsCommonStructureFilterService.getCombinedFilterFunction); // default filter

		//for navigational function
		navigationExtension.addNavigation(service);

		service.getCtrlUnitList = function getCtrlUnitList() {
			var serviceName = service.getServiceName();
			return commonControllingUnitFilterDataServiceFactory.getCtrlUnitList(serviceName);
		};

		service.getPsdActivityList = function getPsdActivityList() {
			var serviceName = service.getServiceName();
			return commonPsdActivityFilterDataServiceFactory.getPsdActivityList(serviceName);
		};

		service.onEntityPropertyChanged = function (entity, field) {
			$injector.get('productionplanningEngineeringMainServiceEntityPropertychangedExtension').onPropertyChanged(entity,field,service);
		};

		service.ProcessEntityEngDrawingFk = function (productDescriptions) {
			var engtask = service.getSelected();
			var flag = productDescriptions.length > 0;
			engTaskProcessor.setColumnsReadOnly(engtask, ['EngDrawingFk'], flag);
			// remark:if an engineering task has productDescriptions but without a valid EngDrawingFk value, it's EngDrawingFk also should be readonly until all of its productDescriptions have been removed.
		};

		service.getProjectID = function getProjectID () {
			var prjId = service.getSelected() !== null ? service.getSelected().ProjectFk : -1;
			if (prjId === -1) {
				//get project id from pinned context
				var context = $injector.get('cloudDesktopPinningContextService').getContext();
				if (context !== undefined && context !== null) {
					for (var i = 0; i < context.length; i++) {
						if (context[i].token === 'project.main') {
							prjId = context[i].id;
							break;
						}
					}
				}
			}
			return prjId;
		};

		//add sideloading for task by project container
		ppsCommonDataServiceSideloadExtension.addSideloadFunctionality(serviceContainer);

		service.doPrepareUpdateCall = function (updateData, modifiedData) {
			if (service.changedSequenceEvents && service.changedSequenceEvents.length > 0) {
				updateData.SequenceEventsToSave = service.changedSequenceEvents;
				service.changedSequenceEvents = [];
			}
		};


		/* Show Module Header */
		var selectedProject = {};
		var selectedHeader = {};

		service.updateModuleHeaderInfo = function(engTask){
			if (engTask !== null && !_.isEmpty(engTask)) {
				selectedProject = {};
				selectedHeader = {};
				var project = basicsLookupdataLookupDescriptorService.getLookupItem('Project', engTask.ProjectId);
				if (project) {
					selectedProject = {
						ProjectNo: project.ProjectNo,
						ProjectName: project.ProjectName,
						ProjectId: project.Id
					};
				}
				var header = basicsLookupdataLookupDescriptorService.getLookupItem('EngHeader', engTask.EngHeaderFk);
				if (header) {
					selectedHeader = {
						Code: header.Code,
						Description: header.Description,
						Id: header.Id
					};
				}
				setHeaderInfo(engTask);
			}
		};

		function setHeaderInfo (engTask) {
			let entityText = '';
			let description = '';
			let entityHeaderObject = {};
			if (engTask && angular.isDefined(engTask)) {
				if (selectedProject && selectedProject.ProjectNo) {
					description = isEmptyString(selectedProject.ProjectName) ? '' : (' - ' + selectedProject.ProjectName);
					entityText = selectedProject.ProjectNo + description;

					entityHeaderObject.project = {
						id: selectedProject.ProjectId,
						description: entityText
					}
				}
				if (selectedHeader && selectedHeader.Code) {
					description = isEmptyString(selectedHeader.Description) ? '' : (' - ' + selectedHeader.Description);
					entityText = selectedHeader.Code + description;
					entityHeaderObject.module = {
						id: selectedHeader.Id,
						description: entityText,
						moduleName: moduleName
					}
				}
				if (engTask && engTask.Code) {
					description = isEmptyString(engTask.Description) ? '' : (' - ' + engTask.Description);
					entityText = engTask.Code + description;
					entityHeaderObject.lineItem = {
						description: entityText
					}
				}
			}
			cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameEngineering', entityHeaderObject);
		}

		function isEmptyString(text) {
			return _.isNil(text) || text.trim() === '';
		}
		service.setShowHeaderAfterSelectionChanged(service.updateModuleHeaderInfo);

		service.getContainerData = () => serviceContainer.data;

		serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
			characteristicColumn = colName;
		};
		serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
			return characteristicColumn;
		};

		service.refreshLogs = function refreshLogs() {
			var utilSrv = $injector.get('transportplanningTransportUtilService');
			// refresh log-list
			if (utilSrv.hasShowContainerInFront('productionplanning.engineering.log.list')) {
				var logListDataSrv = $injector.get('ppsCommonLogSourceDataServiceFactory').createDataService('productionplanning.engineering', { dto: 'PpsLogReportVDto' }); // before this moment, data service has created, just get it
				logListDataSrv.load();
			}
			// refresh log-pinboard
			if (utilSrv.hasShowContainerInFront('productionplanning.engineering.log.pinboard')) {
				var logPinboardSrv = $injector.get('basicsCommonCommentDataServiceFactory').get('productionplanning.engineering.manuallog', service.getServiceName());
				logPinboardSrv.load();
			}
		};

		return service;

		function getEngineeringPinnedItem() {
			var pinningContextServ = $injector.get('cloudDesktopPinningContextService');
			var currentPinningContext = pinningContextServ.getContext();
			return _.find(currentPinningContext, {token: 'productionplanning.engineering'});
		}

		function handleUpdateDone(updateData, response, data) {
			//invoking handleOnUpdateSucceeded function at first, then do the extra things
			data.handleOnUpdateSucceeded(updateData, response, data, true);
			data.updateDone.fire(updateData);
			//refresh resource requistions
			if (response.ResRequisitionToSave || response.ResRequisitionToDelete) {
				//reload data of Resource Requisition container
				var servFactory = $injector.get('productionplanningCommonResRequisitionDataServiceFactory');
				var serv = servFactory.getServiceByName('ProductionplanningEngineeringResRequisitionDataService');
				if (serv) {
					serv.loadResRequisition();
				}
				//reset res requisition lookup in Resource Reservation container
				var lookupServ = $injector.get('productionplanningCommonResourceRequisitionLookupDataService');
				lookupServ.resetCache();
			}
			// process item after updating
			var engtask = service.getSelected();
			engTaskProcessor.processItemAfterUpdating(engtask);
			refreshSubServiceIfNeed();

			if(angular.isDefined(updateData.EngTasks) && updateData.EngTasks[0]) {
				service.updateModuleHeaderInfo(updateData.EngTasks[0]);
			}

			service.refreshLogs();
		}

		function refreshSubServiceIfNeed() {
			var subServiceNames = ['ppsEngTask2ClerkDataService'];
			_.forEach(serviceContainer.data.childServices, function (subService) {
				if (subService && _.isFunction(subService.getServiceName)
					&& subServiceNames.some(function(name){return name === subService.getServiceName();})) {
					subService.loadSubItemList();
				}
			});
		}

		function handleCharacteristic(item, isAfterCreated = false) {
			const gridContainerGuid = 'a9d9591baf2d4e58b5d21cd8a6048dd1';
			const characteristic2SectionId = 71;

			const containerInfoService = $injector.get('productionplanningEngineeringContainerInformationService');
			const characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory')
				.getService(serviceContainer.service, characteristic2SectionId, gridContainerGuid, containerInfoService);

			if (isAfterCreated) {
				characterColumnService.appendDefaultCharacteristicCols(item);
			} else {
				characterColumnService.appendCharacteristicCols(item);
			}
		}
	}
})(angular);


