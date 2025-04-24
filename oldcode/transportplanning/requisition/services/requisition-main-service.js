(function (angular) {
	'use strict';
	/* global globals, angular, moment */
	/**
	 * @ngdoc service
	 * @name RequisitionMainService
	 * @description
	 * RequisitionMainService is the data service for requisition module
	 * */

	var moduleName = 'transportplanning.requisition';
	var module = angular.module(moduleName);

	module.factory('transportplanningRequisitionMainService', RequisitionMainService);
	RequisitionMainService.$inject = ['transportplanningRequisitionDataServiceBuilder',
		'cloudDesktopSidebarService',
		'$http',
		'$injector',
		'$q',
		'moment',
		'_',
		'cloudDesktopPinningContextService',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningMountingRequisitionDataService',
		'platformRuntimeDataService',
		'platformDataServiceModificationTrackingExtension',
		'productionplanningCommonStructureFilterService',
		'transportplanningRequisitionSiteFilterDataService',
		'cloudDesktopInfoService',
		'platformDataValidationService',
		'transportplanningRequisitionDataProcessorService',
		'transportplanningRequisitionPinningContextExtension',
		'transportplanningRequisitionNavigationExtension',
		'transportplanningRequisitionMainServiceEntityPropertychangedExtension',
		'transportplanningRequisitionMainServiceUnassignedBundleExtension',
		'transportplanningTransportUtilService',
		'ppsVirtualDateshiftDataServiceFactory',
		'ppsCommonDataserviceWorkflowCallbackExtension'];

	function RequisitionMainService(
		DataServiceBuilder,
		cloudDesktopSidebarService,
		$http,
		$injector,
		$q,
		moment,
		_,
		cloudDesktopPinningContextService,
		basicsLookupdataLookupDescriptorService,
		reqDataService,
		platformRuntimeDataService,
		platformDataServiceModificationTrackingExtension,
		ppsCommonStructureFilterService,
		siteFilterDataService,
		cloudDesktopInfoService,
		platformDataValidationService,
		dataProcessorService,
		pinningContextExtension,
		navigationExtension,
		entityPropertychangedExtension,
		unassignedBundleExtension,
		transportplanningTransportUtilService,
		ppsVirtualDateshiftDataServiceFactory,
		workflowCallbackExtension) {

		function clearCacheofBundleAndGoods() {
			// clear cache of trsRequisition assigned bundles
			$injector.get('basicsCommonBaseDataServiceReferenceActionExtension').clearAssignedItemsRecord('transportplanningBundleToRequisition');

			// clear cache of trsGoods that are created by assigned bundles
			var childServices = service.getChildServices();
			var trsGoodsService = _.find(childServices, function (childServ) {
				return childServ.getServiceName() === service.getServiceName() + 'TrsGoodDataService';
			});
			if(!_.isNil(trsGoodsService)){
				trsGoodsService.clearGoodsOfAssignedBundlesRecord();
			}
		}

		var lastFilter = null,
			serviceContainer;
		let characteristicColumn = '';

		var serviceInfo = {
			module: module,
			serviceName: 'transportplanningRequisitionMainService',
			entitySelection: {supportsMultiSelection: true},
			useItemFilter: true,
			sidebarWatchList: {active: true}
		};
		var validationService = 'transportplanningRequisitionValidationService';
		var httpResource = {
			endRead: 'customfiltered',
			endDelete: 'multidelete',
			usePostForRead: true,
			extendSearchFilter: function extendSearchFilter(readData) {
				ppsCommonStructureFilterService.extendSearchFilterAssign('transportplanningRequisitionMainService', readData);
				ppsCommonStructureFilterService.setFilterRequest('transportplanningRequisitionMainService', readData);
				lastFilter = readData;
			}
		};
		var entityRole = {
			root: {
				itemName: 'TrsRequisitions',
				moduleName: 'cloud.desktop.moduleDisplayNameTransportRequisition',
				descField: 'DescriptionInfo.Translated',
				addToLastObject: true,
				lastObjectModuleName: moduleName,
				useIdentification: true,
				handleUpdateDone: function (updateData, response, data) {
					clearCacheofBundleAndGoods();

					serviceContainer.data.handleOnUpdateSucceeded(updateData, response, data, true);
					if (response.ReloadTrsGoodContainer) {
						service.reloadService('TrsGoodDataService', null, 'transportplanning.requisition.trsgoods.list');
					}
					if (response.ReloadTrsBundleContainer) {
						service.reloadService('transportplanningRequisitionBundleDataService', null, 'transportplanning.requisition.bundle.grid');
					}
					if (response.ReloadMaterialReqContainer) {
						service.reloadService('MatRequisitionDataService', null, 'transportplanning.requisition.matrequisitionList');
					}
					if (response.ReloadResRequisitionContainer) {
						service.reloadService('transportplanningRequisitionResRequisitionDataService', null, 'transportplanning.requisition.resoureceRequisitionList');
					}
					if (response.ReloadResReservationContainer) {
						service.reloadService('ResReservationDataService', null, 'b03a0abb4c284179924e5fc6d7d26bfa');
						$injector.get('transportplanningRequisitionResourceRequisitionLookupDataService').resetCache({lookupType: 'transportplanningRequisitionResourceRequisitionLookupDataService'});// reset to set the lookup correctly
					}
					service.reloadService('NotificationDataService', null, 'transportplanning.requistion.notification.list');

					service.refreshLogs();

					var utilSrv = $injector.get('transportplanningTransportUtilService');
					// refresh log-list
					if (utilSrv.hasShowContainerInFront('transportplanning.requisition.toBeAssigned.grid')) {
						$injector.get('transportplanningRequisitionToBeAssignedDataService').getService(true).setRequisitionFkAfterAssignDone(response);
					}

					if (utilSrv.hasShowContainerInFront('transportplanning.requisition.toBeAssigned.list.grid')) {
						$injector.get('transportplanningRequisitionToBeAssignedDataService').getService(false).setRequisitionFkAfterAssignDone(response);
					}
				}
			}
		};

		var sidebarSearch = {
			options: {
				moduleName: moduleName,
				enhancedSearchEnabled: true,
				enhancedSearchVersion: '2.0',
				pattern: '',
				pageSize: 100,
				// useCurrentClient: true,
				includeNonActiveItems: false,
				showOptions: true,
				showProjectContext: true,
				withExecutionHints: false,
				includeDateSearch: true,
				pinningOptions: pinningContextExtension.createPinningOptions()
			},
			selectAfterSearchSucceeded: false
		};
		var presenter = {
			list: {
				handleCreateSucceeded: handleCreateSucceeded,
				initCreationData: function (creationData) {
					var siteItem = siteFilterDataService.getSelectedItem();
					if (siteItem) {
						creationData.PKey1 = siteItem.Id;
					}
				},
				incorporateDataRead: function (readData, data) {
					const dataRead = serviceContainer.data.handleReadSucceeded(readData, data);
					handleCharacteristic(readData.dtos);
					return dataRead;
				}
			}
		};
		var actions = {
			create: 'flat',
			delete: {}
		};

		var builder = new DataServiceBuilder('flatRootItem');
		serviceContainer = builder
			.setServiceInfo(serviceInfo)
			.setValidationService(validationService)
			.setHttpResource(httpResource)
			.setEntityRole(entityRole)
			.setSidebarSearch(sidebarSearch)
			.setPresenter(presenter)
			.setActions(actions)
			.setDataProcessor(dataProcessorService.getDataProcessors())
			.build();

		workflowCallbackExtension.addWorkflowCallbackExtension(serviceContainer);

		// add dataCache
		var dataCache = {};
		var orgClearCache = serviceContainer.service.clearCache;
		serviceContainer.service.clearCache = function () {
			if (_.isFunction(orgClearCache)) {
				orgClearCache.apply(this, arguments);
			}
			dataCache = {};
		};

		// add flags for avoiding clearing values of fields Job, Partner and Contact by asnyValidation on creation
		serviceContainer.service.stopAsyncValidatePartnerOnCreation = false;
		serviceContainer.service.stopAsyncValidateContactOnCreation = false;

		function handleCreateSucceeded(item) {
			if (item.ProjectFk === 0) {
				var temp = cloudDesktopSidebarService.filterRequest.projectContextId;
				if (temp !== null && temp !== 0) {
					item.ProjectFk = temp;
				}
			}
			if (_.isNull(item.MntActivityFk) || _.isUndefined(item.MntActivityFk)) {
				// set MntActivityFk by pinning context
				var pinnedItemFound = pinningContextExtension.getMntActivityPinnedItem();
				if (pinnedItemFound) {
					item.MntActivityFk = pinnedItemFound.id;
				}
				if (item.MntActivityFk) {
					serviceContainer.service.stopAsyncValidatePartnerOnCreation = true;
					serviceContainer.service.stopAsyncValidateContactOnCreation = true;

					// $http.get(globals.webApiBaseUrl + 'productionplanning/activity/activity/getById?activityId=' + item.MntActivityFk).then(function (response) {
					var activity = basicsLookupdataLookupDescriptorService.getLookupItem('MntActivity', item.MntActivityFk);

					const processAssignedActivity = (activity) => {
						virtualDateshiftService.changeSpecialzedEvents([item], null, activity);
						setRequisitionDateAndJob(item, activity);
					};

					if (activity) {
						processAssignedActivity(activity);
					} else {
						// initialise promises
						serviceContainer.service.asyncCreationPromises = serviceContainer.service.asyncCreationPromises ?
							serviceContainer.service.asyncCreationPromises : {};

						var lookupPromise = $http.get(globals.webApiBaseUrl + 'productionplanning/activity/activity/getById?activityId=' + item.MntActivityFk).then(function (response) {
							if (response.data) {
								processAssignedActivity(response.data);
							}
							_.unset(serviceContainer.service.asyncCreationPromises, item.Id);
						});
						serviceContainer.service.asyncCreationPromises[item.Id] = lookupPromise;
					}

				}
			}
			if(!_.isNil(item.PlannedStart)){
				item.PlannedTime = item.PlannedStart;
			}
			handleCharacteristic(item, true);
		}

		function setRequisitionDateAndJob(reqItem, activity) {
			reqItem.DateOnly = moment(reqItem.Date).hours(0).minutes(0).seconds(0).milliseconds(0);

			// init Job
			// reqItem.LgmJobFk = activity.LgmJobFk;
			// platformDataValidationService.removeFromErrorList(reqItem, 'LgmJobFk', validationService, serviceContainer.service);
			// platformRuntimeDataService.applyValidationResult(true, reqItem, 'LgmJobFk');

			// init fields Job, BusinessPartner and Contact
			setJobByActivity (reqItem, activity);

			serviceContainer.service.gridRefresh();
		}


		function setJobByActivity (item, activity) {
	        item.LgmJobFk = activity.LgmJobFk;
	        // update validation for field LgmJobFk
	        platformDataValidationService.removeFromErrorList(item, 'LgmJobFk', validationService, serviceContainer.service);
	        platformRuntimeDataService.applyValidationResult(true, item, 'LgmJobFk');
			$http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobId=' + activity.LgmJobFk).then(function (respond) {
				if(respond && respond.data){
					item.ContactFk = respond.data.DeliveryAddressContactFk;
					item.BusinessPartnerFk = respond.data.BusinessPartnerFk;
					// process fields BusinessPartnerFk and ContactFk
					var fields = [
						{field: 'BusinessPartnerFk', readonly: item && !item.LgmJobFk},
						{field: 'ContactFk', readonly: item && !item.BusinessPartnerFk}
					];
					platformRuntimeDataService.readonly(item, fields);
					serviceContainer.service.gridRefresh();
				}
			});
		}
		// remark: codes about Job(and so on) in requisition-main-service.js is redundancy, will do refactor in the future.

		// function getRequisitionById(reqId) {
		// 	var key = 'MntRequisition' + reqId;
		// 	var value = dataCache[key];
		// 	var reqPromise = $q.when(value);
		// 	if (_.isUndefined(value)) {
		// 		reqPromise = reqDataService.getRequisitionById(reqId).then(function (requisition) {
		// 			value = requisition;
		// 			dataCache[key] = value;
		// 			return requisition;
		// 		});
		// 	}
		// 	return reqPromise;
		// }

		var service = serviceContainer.service;
		// add navigational function
		navigationExtension.addNavigation(service);
		entityPropertychangedExtension.addMethods(service);
		unassignedBundleExtension.addMethods(service);

		serviceContainer.data.provideUpdateData = function (updateData) {
			if (updateData.TrsGoodsToSave && updateData.TrsGoodsToSave.length > 0) {
				_.forEach(updateData.TrsGoodsToSave, function (item) {
					delete item.CorrespondingTobeAssigned;
				});
			}
			if(updateData.TrsGoodsToDelete && updateData.TrsGoodsToDelete.length > 0){
				_.forEach(updateData.TrsGoodsToDelete, function (item) {
					delete item.CorrespondingTobeAssigned;
				});
			}
		};

		serviceContainer.service.takeOver = function takeOver(entity, jobId) {
			var data = serviceContainer.data;
			var dataEntity = data.getItemById(entity.Id, data);

			data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
			data.markItemAsModified(dataEntity, data);

			var fields = [
				{field: 'BusinessPartnerFk', readonly: dataEntity && !jobId},
				{field: 'ContactFk', readonly: dataEntity && !dataEntity.BusinessPartnerFk}
			];

			platformRuntimeDataService.readonly(dataEntity, fields);
		};

		// connect to filter service
		// ppsCommonStructureFilterService.setServiceToBeFiltered(service);
		ppsCommonStructureFilterService.setFilterFunction('transportplanningRequisitionMainService', ppsCommonStructureFilterService.getCombinedFilterFunction); // default filter


		service.getLastFilter = function () {
			return lastFilter;
		};

		service.updateActivityForFilterDragDrop = function (itemOnDragEnd) {
			service.markItemAsModified(itemOnDragEnd);
			service.update();
		};

		service.updateLgmJobFkForNewItem = function (item, validationService) {
			if (item.Version === 0 && item.MntActivityFk !== null && item.MntActivityFk !== 0 && item.LgmJobFk === 0) {
				var activity = basicsLookupdataLookupDescriptorService.getLookupItem('MntActivity', item.MntActivityFk);
				if (activity) {
					$http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobId=' + activity.LgmJobFk).then(function (respond) {
						item.LgmJobFk = activity.LgmJobFk;
						// service.updateJobOfResRequisition(item, 'LgmJobFk'); // todo zwz
						validationService.validateLgmJobFk(item, item.LgmJobFk, 'LgmJobFk');
						platformDataServiceModificationTrackingExtension.markAsModified(service, item, serviceContainer.data);
						service.handleJobChanged(item, respond.data);
					});
				}
			}
		};

		service.handleJobChanged = function (requisition, job) {
			// set businessPartner,contact according to job
			if(_.isNil(job)){
				// requisition.LgmJobFk = null;
				requisition.ContactFk = null;
				requisition.BusinessPartnerFk = null;
			}
			else{
				// requisition.LgmJobFk = job.Id;
				requisition.ContactFk = job.DeliveryAddressContactFk;
				requisition.BusinessPartnerFk = job.BusinessPartnerFk;
			}

			var jobId = job? job.Id : null;
			service.takeOver(requisition, jobId);
		};

		// todo zwz
		// service.updateJobOfResRequisition = function (entity, field) {
		// 	if (entity.LgmJobFk !== 0&& !_.isNull(entity.LgmJobFk))
		// 	{
		// 		_.each(service.getChildServices(), function (childService) {
		// 			//change job of resRequisition according to activity's job
		// 			if (childService.getServiceName() === 'transportplanningRequisitionResRequisitionDataService') {
		// 				_.each(childService.getList(),function (item) {
		// 					if(_.isNull(item.JobFk) || item.JobFk === 0){
		// 						item.JobFk = entity.LgmJobFk;
		// 						var validationServ = $injector.get('productionplanningResourceRequisitionValidationServiceBase').getRequisitionValidationService(childService);
		// 						validationServ.baseValidateJobFk(item,item.JobFk,'JobFk');
		// 						childService.markItemAsModified(item);
		// 					}
		// 				});
		// 			}
		// 		});
		// 	}
		// };

		service.setShowHeaderAfterSelectionChanged(function (requisition) {
			if (requisition) {
				let moduleInfoName = 'cloud.desktop.moduleDisplayNameTransportRequisition';
				let text = '';
				//let text = cloudDesktopPinningContextService.concate2StringsWithDelimiter(requisition.Code, requisition.DescriptionInfo.Translated, ' - ');
				let entityHeaderObject = {};
				if (requisition.ProjectFk) {
					$q.when(basicsLookupdataLookupDescriptorService.getLookupItem('Project', requisition.ProjectFk)).then(function (project) {
						if (project) {
							entityHeaderObject.project = {
								id: project.Id,
								description: cloudDesktopPinningContextService.concate2StringsWithDelimiter(project.ProjectNo, project.ProjectName, ' - ')
							}
						}
						cloudDesktopInfoService.updateModuleInfo(moduleInfoName, entityHeaderObject);
					});
				}
				if (requisition.LgmJobFk) {
					$q.when(basicsLookupdataLookupDescriptorService.getLookupItem('logisticJobEx', requisition.LgmJobFk)).then(function (job) {
						if (job) {
							entityHeaderObject.module = {
								id: job.Id,
								description: cloudDesktopPinningContextService.concate2StringsWithDelimiter(job.Code, job.Description, ' - '),
								moduleName: ''
							}
						}
						entityHeaderObject.lineItem = {
							description: cloudDesktopPinningContextService.concate2StringsWithDelimiter(requisition.Code, requisition.DescriptionInfo.Translated, ' - ')
						}
						cloudDesktopInfoService.updateModuleInfo(moduleInfoName, entityHeaderObject);
					});
				}
				cloudDesktopInfoService.updateModuleInfo(moduleInfoName, entityHeaderObject);
			}
		});


		service.registerRefreshRequested(clearCacheofBundleAndGoods);

		service.awaitCreationSucceeded = function (id) {
			if (!service.asyncCreationPromises || !service.asyncCreationPromises[id]) {
				return $q.when(true);
			}
			return service.asyncCreationPromises[id];
		};

		service.reloadService = function (serviceName, childServices, id) {
			childServices = childServices || serviceContainer.data.childServices;
			_.find(childServices, function (childService) {
				let srvName = childService.getServiceName(); // getServiceName() from characteristic data service return undefined
				if (srvName && srvName.endsWith(serviceName)) {
					childService.clearCache();
					childService.unloadSubEntities();
					if (id && transportplanningTransportUtilService.hasShowContainerInFront(id)) {
						childService.load();
					}
					return true;
				} else {
					return service.reloadService(serviceName, childService.getChildServices(), id);
				}
			});
		};

		service.getContainerData = () => serviceContainer.data;

		// extend methods for createNewTrsReq feature of unassign-bundles containers
		service.isTrsReqDataService = function () {
			return true;
		};
		service.hasShowContainer = function () {
			return transportplanningTransportUtilService.hasShowContainer('transportplanning.requisition.list')
				|| transportplanningTransportUtilService.hasShowContainer('transportplanning.requisition.details');
		};

		// sync all planned times
		service.syncPlannedTimes = (entity, field) => {
			entity.PlannedStart = moment(entity[field]);
			entity.PlannedTime = moment(entity[field]);
			entity.PlannedTimeDay = moment(entity[field]);
		};

		// register to virtual dateshift service
		let virtualDateshiftService = ppsVirtualDateshiftDataServiceFactory.createNewVirtualDateshiftDataService(moduleName, service);
		virtualDateshiftService.registerActualService('Event', serviceContainer, { match: 'PpsEventFk'});

		// init characteristic data service
		const basicsCharacteristicDataServiceFactory = $injector.get('basicsCharacteristicDataServiceFactory');
		basicsCharacteristicDataServiceFactory.getService(service, 74);
		basicsCharacteristicDataServiceFactory.getService(service, 75);

		service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
			characteristicColumn = colName;
		};
		service.getCharacteristicColumn = function getCharacteristicColumn() {
			return characteristicColumn;
		};

		service.refreshLogs = function refreshLogs() {
			var utilSrv = $injector.get('transportplanningTransportUtilService');
			// refresh log-list
			if (utilSrv.hasShowContainerInFront('transportplanning.requisition.Log.list')) {
				var logListDataSrv = $injector.get('ppsCommonLogSourceDataServiceFactory').createDataService('transportplanning.requisition', { dto: 'PpsLogReportVDto' }); // before this moment, data service has created, just get it
				logListDataSrv.load();
			}
			// refresh log-pinboard
			if (utilSrv.hasShowContainerInFront('transportplanning.requisition.log.pinboard')) {
				var logPinboardSrv = $injector.get('basicsCommonCommentDataServiceFactory').get('transportplanning.requisition.manuallog', service.getServiceName());
				logPinboardSrv.load();
			}
		};

		let originalRSE = service.refreshSelectedEntities;
		service.refreshSelectedEntities = function () {
			const utilSrv = $injector.get('transportplanningTransportUtilService');
			if (utilSrv.hasShowContainerInFront('transportplanning.requisition.toBeAssigned.list.grid')) {
				$injector.get('transportplanningRequisitionToBeAssignedDataService').getService(false).clearGridByUnSavedDeletedGoods();
			}
			if (utilSrv.hasShowContainerInFront('transportplanning.requisition.toBeAssigned.grid')) {
				$injector.get('transportplanningRequisitionToBeAssignedDataService').getService(true).clearGridByUnSavedDeletedGoods();
			}
			return originalRSE();
		};

		return service;

		function handleCharacteristic(item, isAfterCreated = false) {
			const gridContainerGuid = '67f457b1928342c4a65cee89c48693d0';
			const characteristic2SectionId = 75;

			const containerInfoService = $injector.get('transportplanningRequisitionContainerInformationService');
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
