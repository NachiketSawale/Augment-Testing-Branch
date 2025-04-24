/**
 * Created by anl on 10/18/2017.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningMountingRequisitionDataService', RequisitionDataService);

	RequisitionDataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceProcessDatesBySchemeExtension',
		'cloudDesktopInfoService',
		'PlatformMessenger',
		'$http',
		'$q',
		'cloudDesktopPinningContextService',
		'cloudDesktopSidebarService',
		'basicsLookupdataLookupFilterService',
		'productionplanningMountingContainerInformationService',
		'productionplanningMountingActivityResourceRequisitionLookupDataService',
		'transportplanningRequisitionResourceRequisitionLookupDataService',
		'_',
		'basicsCompanyNumberGenerationInfoService',
		'ppsMountingConstantValues',
		'platformDataValidationService',
		'productionpalnningMountingRequisitionValidationFactory',
		'ppsVirtualDateshiftDataServiceFactory',
		'platformRuntimeDataService'];

	function RequisitionDataService($injector, platformDataServiceFactory, basicsLookupdataLookupDescriptorService,
		basicsCommonMandatoryProcessor,
		platformDataServiceProcessDatesBySchemeExtension,
		cloudDesktopInfoService,
		PlatformMessenger,
		$http,
		$q,
		cloudDesktopPinningContextService,
		cloudDesktopSidebarService,
		basicsLookupdataLookupFilterService,
		mountingContainerInformationService,
		activityResourceRequisitionLookupDataService,
		trsRequisitionResourceRequisitionLookupDataService,
		_,
		basicsCompanyNumberGenerationInfoService,
		ppsMountingConstantValues,
		platformDataValidationService,
		productionpalnningMountingRequisitionValidationFactory,
		ppsVirtualDateshiftDataServiceFactory,
		platformRuntimeDataService) {

		var requisitionId;
		var projectId;
		var serviceContainer;

		var selectedInfo = {};

		var prjPinCtxToken = cloudDesktopPinningContextService.tokens.projectToken;
		var mntReqPinCtxToken = cloudDesktopPinningContextService.tokens.ppsMntToken;

		var report2productGUID = '5dad005fa09b4e2eaf64da8707ec8fe4';
		var report2ProductDataService;

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
			typeName: 'RequisitionDto',
			moduleSubModule: 'ProductionPlanning.Mounting'
		});
		// var updateCommentProcessor = {
		// 	processItem: function doProcessItem(item) {
		// 		item.UpdateComment = '';
		// 		item.UpdateRemark = null;
		// 	}
		// };
		var codeGenerationProcessor = {
			processItem: function doProcessItem(item) {
				if(item.Version === 0 &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsMountingNumberInfoService').hasToGenerateForRubricCategory(ppsMountingConstantValues.requsitionRubricCat) )
				{
					item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsMountingNumberInfoService').provideNumberDefaultText(ppsMountingConstantValues.requsitionRubricCat, item.Code);
					platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: true}]);
				}
			}
		};
		var serviceOption = {
			flatRootItem: {
				module: masterModule,
				serviceName: 'productionplanningMountingRequisitionDataService',
				entityNameTranslationID: 'productionplanning.mounting.entityRequisition',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/mounting/requisition/',
					endRead: 'filtered',
					endDelete: 'multidelete',
					usePostForRead: true,
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						filterRequest.orderBy = [{Field: 'StartDate', Desc: true}];
					}
				},
				entityRole: {
					root: {
						itemName: 'Requisition',
						moduleName: 'cloud.desktop.moduleDisplayNamePpsMounting',
						descField: 'DescriptionInfo.Translated',
						handleUpdateDone: handleUpdateDone,
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						useIdentification: true
					}
				},
				dataProcessor: [dateProcessor, codeGenerationProcessor],// , updateCommentProcessor],
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData);
							// var result = {
							// 	FilterResult: readData.FilterResult,
							// 	dtos: readData.d || []
							// };
							//
							// var dataRead = serviceContainer.data.handleReadSucceeded(result, data);
							var dataRead = serviceContainer.data.handleReadSucceeded(readData, data);
							service.onContextUpdated.fire();
							return dataRead;
						},
						handleCreateSucceeded: function (item) {
							if (projectId !== null && angular.isNumber(projectId)) {
								service.loadHeaderLookup(projectId, item);
							}
						},
						initCreationData: function (creationData) {
							if (projectId !== null && angular.isNumber(projectId)) {
								creationData.PKey1 = projectId;
							}
						}
					}
				},
				translation: {
					uid: 'productionplanning.mounting.requisition',
					title: 'productionplanning.mounting.entityRequisition',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'RequisitionDto',
						moduleSubModule: 'ProductionPlanning.Mounting',
					},
				},
				sidebarWatchList: {active: true},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						// useCurrentClient: false,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: true,
						withExecutionHints: true,
						includeDateSearch: true,
						pinningOptions: {
							isActive: true,
							showPinningContext: [
								{token: prjPinCtxToken, show: true},
								{token: mntReqPinCtxToken, show: true}
							],
							setContextCallback: setCurrentPinningContext
						}
					}
				},
				actions: {
					create: 'flat',
					// canCreateCallBackFunc: canCreateCallBackFunc,
					delete: true
				}
			}
		};

		// function canCreateCallBackFunc() {
		// 	var result = false;
		// 	if (angular.isNumber(projectId)) {
		// 		result = true;
		// 	}
		// 	return result;
		// }

		function setModuleContext() {
			clearLocalContext();
			var context = $injector.get('cloudDesktopPinningContextService').getContext();
			if (context !== undefined && context !== null) {
				for (var i = 0; i < context.length; i++) {
					if (context[i].token === prjPinCtxToken) {
						projectId = context[i].id;
					}
					if (context[i].token === mntReqPinCtxToken) {
						requisitionId = context[i].id;
					}
				}
			}
		}


		function setCurrentPinningContext(dataService) {
			var requisition = dataService.getSelected();
			if (requisition) {
				setPinningContext(requisition.ProjectFk, requisition, dataService);
			}
		}

		function setPinningContext(projectId, requisition, dataService) {
			var projectPromise = $q.when(true);
			var pinningContext = [];
			if (angular.isNumber(projectId)) {
				projectPromise = cloudDesktopPinningContextService.getProjectContextItem(projectId).then(function (pinningItem) {
					pinningContext.push(pinningItem);
				});
			}

			if (requisition) {
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem(mntReqPinCtxToken, requisition.Id,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(requisition.Code, requisition.DescriptionInfo.Translated, ' - '))
				);
			}
			return $q.all([projectPromise]).then(
				function () {
					if (pinningContext.length > 0) {
						cloudDesktopPinningContextService.setContext(pinningContext, dataService);
						setModuleContext();
					}
				});
		}


		function clearLocalContext() {
			projectId = '';
			requisitionId = '';
		}

		/** Update resRequisition container after created automatically */
		function handleUpdateDone(updateData, response, data) {
			// avoiding concurrency problems with trsReq in mounting module
			let specilizedTrsReqToUpdate = [];
			if (response.ActivityToSave) {
				response.ActivityToSave.forEach(activityToSave => {
					if (activityToSave.TrsRequisitionToSave) {
						activityToSave.TrsRequisitionToSave.forEach(trsReqToSave => {
							if (trsReqToSave.TrsRequisitions && trsReqToSave.TrsRequisitions.length > 0) {
								specilizedTrsReqToUpdate.push(...trsReqToSave.TrsRequisitions);
							}
						});
					}
				});
			}

			if (specilizedTrsReqToUpdate.length > 0) {
				virtualDataService.updateSepcializedEvents(specilizedTrsReqToUpdate);
			}

			// invoking handleOnUpdateSucceeded function at first, then do the extra things
			data.handleOnUpdateSucceeded(updateData, response, data, true);
			data.updateDone.fire(updateData);
			// refresh resource requisitions
			var refresh = false;
			var refreshRequisitionResRequisitionDataService = false;
			var ppsEventId = 0;
			if (response.ActivityToSave !== null) {
				_.each(response.ActivityToSave, function (ativityComplete) {
					if (!refresh) {
						if (ativityComplete.Activity !== null) {
							if (ativityComplete.Activity.Version === 1) {
								refresh = true;
								ppsEventId = ativityComplete.Activity.PpsEventFk;
							}
						}
						// used for update filter of resRequisitionList in Reservation
						else if (ativityComplete.ResRequisitionToSave || ativityComplete.ResRequisitionToDelete) {
							refresh = true;
						}
					}
					if (!refreshRequisitionResRequisitionDataService && ativityComplete.TrsRequisitionToSave !== null) {
						_.each(ativityComplete.TrsRequisitionToSave, function (trsRequisitionComplete) {
							// used for update filter of resRequisitionList in Reservation
							if (trsRequisitionComplete.ResRequisitionToSave) {
								var service = $injector.get('productionplanningMountingTrsRequisitionResRequisitionDataService');
								_.each(trsRequisitionComplete.ResRequisitionToSave, function (resRequisitionComplete) {
									var oldItem = service.findItemToMerge(resRequisitionComplete);
									if (!oldItem) {
										refreshRequisitionResRequisitionDataService = true;
									}
								});
							}
						});
					}
				});

			}
			if (refreshRequisitionResRequisitionDataService) {
				$injector.get('productionplanningMountingTrsRequisitionResRequisitionDataService').load();
				trsRequisitionResourceRequisitionLookupDataService.resetCache();
			}
			if (refresh) {
				var reqService = $injector.get('productionplanningMountingResRequisitionDataService');
				ppsEventId = reqService.parentService().getSelected().PpsEventFk;
				reqService.loadResRequisition(ppsEventId);
				activityResourceRequisitionLookupDataService.resetCache();

				var reservationUUID = 'a9e90275f8de429db681448f6caefce3';
				var resService = mountingContainerInformationService.getContainerInfoByGuid(reservationUUID).dataServiceName;
				resService.load();

				refresh = false;
			}

			clearAddedProduct();

			if (response && response.ActivityToSave) {
				var reloadTrsGoodContainer;
				var reloadTrsBundleContainer;
				var reloadMaterialReqContainer;
				var reloadResRequisitionContainer;
				var reloadResReservationContainer;
				_.forEach(response.ActivityToSave, function (activy) {
					if (_.find(activy.TrsRequisitionToSave, {ReloadTrsGoodContainer: true})) {
						reloadTrsGoodContainer = true;
					}
					if (_.find(activy.TrsRequisitionToSave, {ReloadTrsBundleContainer: true})) {
						reloadTrsBundleContainer = true;
					}
					if (_.find(activy.TrsRequisitionToSave, {ReloadMaterialReqContainer: true})) {
						reloadMaterialReqContainer = true;
					}
					if (_.find(activy.TrsRequisitionToSave, {ReloadResRequisitionContainer: true})) {
						reloadResRequisitionContainer = true;
					}
					if (_.find(activy.TrsRequisitionToSave, {ReloadResReservationContainer: true})) {
						reloadResReservationContainer = true;
					}
				});
				if (reloadTrsGoodContainer) {
					reloadService(data.childServices, 'TrsGoodDataService');
				}
				if (reloadTrsBundleContainer) {
					reloadService(data.childServices, 'productionplanningMountingTrsRequisitionBundleDataService');
				}
				if (reloadMaterialReqContainer) {
					reloadService(data.childServices, 'MatRequisitionDataService');
				}
				if (reloadResRequisitionContainer) {
					reloadService(data.childServices, 'productionplanningMountingTrsRequisitionResRequisitionDataService');
				}
				if (reloadResRequisitionContainer) {
					reloadService(data.childServices, 'productionplanningMountingTrsRequisitionDataServiceResReservationDataService');
					$injector.get('transportplanningRequisitionResourceRequisitionLookupDataService').resetCache({lookupType: 'transportplanningRequisitionResourceRequisitionLookupDataService'});// reset to set the lookup correctly
				}
			}

			service.refreshLogs();
		}

		function reloadService(childServices, serviceName) {
			_.find(childServices, function (service) {
				if (service.getServiceName().endsWith(serviceName)) {
					service.clearCache();
					service.load();
					return true;
				} else {
					return reloadService(service.getChildServices(), serviceName);
				}
			});
		}

		function clearAddedProduct() {
			report2ProductDataService = mountingContainerInformationService.getContainerInfoByGuid(report2productGUID).dataServiceName;
			if (report2ProductDataService) {
				report2ProductDataService.clearAddedProduct();
			}
		}

		/* jshint -W003 */
		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'RequisitionDto',
			moduleSubModule: 'ProductionPlanning.Mounting',
			validationService: 'productionpalnningMountingRequisitionValidationService'
		});

		/* jshint -W003 */
		var service = serviceContainer.service;

		// register to virtual dateshift service
		const virtualDataService = ppsVirtualDateshiftDataServiceFactory.createNewVirtualDateshiftDataService(moduleName, service);

		// Refresh mntRequisition-container then will clearAddedProduct() cache
		service.registerListLoaded(function () {
			clearAddedProduct();
		});

		service.getRequisitionById = function (reqId) {
			return $http.get(globals.webApiBaseUrl + 'productionplanning/mounting/requisition/getreqbyid?ReqId=' + reqId).then(function (response) {
				return response.data.Main[0];
			});
		};

		service.setSelectedProjectInfo = function setSelectedProjectInfo(requisition) {

			if (requisition !== null && angular.isDefined(requisition.ProjectFk)) {
				$q.when(basicsLookupdataLookupDescriptorService.getLookupItem('Project', requisition.ProjectFk)).then(function (project) {
					if (project) {
						selectedInfo = {
							ProjectNo: project.ProjectNo,
							ProjectName: project.ProjectName,
							ProjectId: project.Id
						};
					}
					service.updateModuleHeaderInfo(requisition);
				});
			}
			service.updateModuleHeaderInfo(requisition);
		};

		service.onContextUpdated = new PlatformMessenger();
		/** Set Module Header Info */
		service.setShowHeaderAfterSelectionChanged(function (requisition /* , data */) {
			service.setSelectedProjectInfo(requisition);
		});

		service.updateModuleHeaderInfo = function (requisition) {
			let entityText = '';
			let entityHeaderObject = {};
			if (requisition) {
				if (selectedInfo.ProjectNo) {
					entityText = cloudDesktopPinningContextService.concate2StringsWithDelimiter(selectedInfo.ProjectNo, selectedInfo.ProjectName, ' - ');
					entityHeaderObject.project = {
						id: selectedInfo.ProjectId,
						description: entityText
					}
					selectedInfo = {};
				}
				entityText = cloudDesktopPinningContextService.concate2StringsWithDelimiter(requisition.Code, requisition.DescriptionInfo.Translated, ' - ');
				entityHeaderObject.module = {
					id: requisition.Id,
					description: entityText,
					moduleName: moduleName
				}
			}
			cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNamePpsMounting', entityHeaderObject);
		};

		service.onContextUpdated.register(service.updateModuleHeaderInfo);

		service.ensureInitContext = function () {
			setModuleContext();
		};

		service.getCurrentPrjId = function () {
			return projectId;
		};

		service.navigateByProject = function navigateByProject(requisition) {
			if (requisition) {
				$http.get(globals.webApiBaseUrl + 'productionplanning/mounting/requisition/GetReqById?ReqId=' + requisition.Id).then(function (response) {
					var requisition = response.data.Main[0];
					if (requisition) {
						$q.when(setPinningContext(requisition.ProjectFk, requisition)).then(function () {
							serviceContainer.service.load();
						});
					}
				});
			}
		};

		service.navigateByIds = function navigateByIds(requisition) {
			if (typeof requisition.Ids === 'string'){
				const ids = requisition.Ids.split(',').map(e => parseInt(e));
				cloudDesktopSidebarService.filterSearchFromPKeys(ids);
			}
		}
		service.navigateByActivity = function navigateByActivity(activity) {
			if (activity) {
				$q.when(basicsLookupdataLookupDescriptorService.getLookupItem('MntRequisition', activity.MntRequisitionFk)).then(function (requisition) {
					if (requisition) {
						$q.when(setPinningContext(requisition.ProjectFk, requisition)).then(function () {
							$q.when(serviceContainer.service.refresh()).then(function () {
								serviceContainer.service.setSelected(requisition);
							});
						});
					}
				});
			}
		};

		service.searchByCalId = function (id) {
			var item = service.getItemById(id);
			if (!item) {
				cloudDesktopSidebarService.filterSearchFromPKeys([id]);
			} else {
				service.setSelected(item);
			}
		};

		service.getIdList = function getIdList() {
			return _.map(service.getList(), function (resource) {
				return resource.Id;
			});
		};

		var filters = [];

		serviceContainer.service.registerFilter = function () {
			basicsLookupdataLookupFilterService.registerFilter(filters);
		};

		serviceContainer.service.unregisterFilter = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};

		service.refreshLogs = function refreshLogs() {
			var utilSrv = $injector.get('transportplanningTransportUtilService');
			// refresh log-list
			if (utilSrv.hasShowContainerInFront('productionplanning.mounting.log.list')) {
				var logListDataSrv = $injector.get('ppsCommonLogSourceDataServiceFactory').createDataService('productionplanning.mounting', { dto: 'PpsLogReportVDto' }); // before this moment, data service has created, just get it
				logListDataSrv.load();
			}
			// refresh log-pinboard
			if (utilSrv.hasShowContainerInFront('productionplanning.mounting.requisition.log.pinboard')) {
				var logPinboardSrv = $injector.get('basicsCommonCommentDataServiceFactory').get('productionplanning.mounting.requisition.manuallog', service.getServiceName());
				logPinboardSrv.load();
			}
		};

		service.getContainerData = () => serviceContainer.data;

		service.loadHeaderLookup = (projectFk, item) => {
			const filterRequest = {
				FilterKey: 'pps-header-with-job-info-filter',
				AdditionalParameters: {
					ProjectId: projectFk || 0,
					WithJobInfo: true
				}
			};
			platformRuntimeDataService.readonly(item, true);
			$q.when($injector.get('basicsLookupdataLookupDataService').getSearchList('CommonHeaderV3', filterRequest).then((data)=>{
				basicsLookupdataLookupDescriptorService.updateData('CommonHeaderV3', data.items);
				platformRuntimeDataService.readonly(item, false);
			}));
		};

		return service;
	}
})(angular);
