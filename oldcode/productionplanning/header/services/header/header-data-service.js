/**
 * Created by zwz on 9/29/2019.
 */

(function (angular) {
	'use strict';
	/* global globals, _ */

	let moduleName = 'productionplanning.header';
	let module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningHeaderDataService
	 * @description productionplanningHeaderDataService is the data service for providing methods to access, create, delete and update product description entities
	 */
	module.factory('productionplanningHeaderDataService', MainService);
	MainService.$inject = ['$injector', '$q',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'cloudDesktopPinningContextService',
		'cloudDesktopSidebarService',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningHeaderProcessor',
		'productionplanningDrawingPinnableEntityService',
		'projectMainPinnableEntityService',
		'cloudDesktopInfoService',
		'transportplanningTransportUtilService'];

	function MainService($injector, $q,
		basicsLookupdataLookupDescriptorService,
		basicsCommonMandatoryProcessor,
		cloudDesktopPinningContextService,
		cloudDesktopSidebarService,
		platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		productionplanningHeaderProcessor,
		drawingPinnableEntityService,
		projectPinnableEntityService,
		cloudDesktopInfoService,
		transportplanningTransportUtilService) {

		let serviceOption = {
			flatRootItem: {
				module: module,
				serviceName: 'productionplanningHeaderDataService',
				entityNameTranslationID: 'productionplanning.header.entityHeader',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/header/',
					endRead: 'listbyfiltered',
					usePostForRead: true,
					endDelete: 'multidelete'// remark: if entitySelection.supportsMultiSelection is true, we use 'multidelete' as endDelete, or we use 'delete' as endDelete
				},
				entitySelection: {supportsMultiSelection: true},
				entityRole: {
					root: {
						itemName: 'PPSHeaders',// remark: if entitySelection.supportsMultiSelection is true, we use 'Headers' as itemName, or we use 'PPSHeader' as itemName
						moduleName: 'cloud.desktop.moduleDisplayNamePPSHeader',
						descField: 'Description',
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						useIdentification: true,
						handleUpdateDone: function (updateData, response, data) {
							// when we "override" method handleUpdateDone(), here we should also call method handleOnUpdateSucceeded() to refresh data in the UI according to response data.
							data.handleOnUpdateSucceeded(updateData, response, data, true);

							if (response.ReloadPrcPackageContainer) {
								service.reloadService('ppsProcurementPackageDataService', data.childServices);
							}
							if (response.ReloadPlanQuantityContainer) {
								service.reloadService('productionplanning.header.plannedQuantity', data.childServices, 'productionplanning.header.plannedquantity.list');
								service.reloadService('productionplanning.header.parentPlannedQuantity', data.childServices, 'productionplanning.header.plannedquantity.parentlist');
							}

							if(!!response.PPSHeaders && response.PPSHeaders[0].BoqHeaderIds === null && response.PPSHeaders[0].OrdHeaderFk !== null){
								service.refreshEntities(response.PPSHeaders);
							}

							data.updateDone.fire(updateData);
						}
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{
						typeName: 'HeaderDto',
						moduleSubModule: 'ProductionPlanning.Header'
					}
				), productionplanningHeaderProcessor],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData.Lookups || {});
							let result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};
							return data.handleReadSucceeded(result, data);
						},
						initCreationData: function (creationData) {
							// set creationData by pinning context
							let projectId = projectPinnableEntityService.getPinned();
							if (projectId) {
								creationData.PKey1 = projectId;
							}
						}
					}
				},
				sidebarWatchList: {active: true},// enable watchlist for header module
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: true,
						pinningOptions: {
							isActive: true,
							showPinningContext: [
								{token: cloudDesktopPinningContextService.tokens.projectToken, show: true}
							],
							setContextCallback: function (dataService) {
								let selected = dataService.getSelected();
								if (selected) {
									let projectId = _.get(selected, 'PrjProjectFk');
									if ((projectPinnableEntityService.getPinned() !== projectId)) {
										let ids = {};
										projectPinnableEntityService.appendId(ids, projectId);
										projectPinnableEntityService.pin(ids, dataService);
									}
								}
							}
						}
					}
				},
				translation: {
					uid: 'productionplanningHeaderDataService',
					title: 'productionplanning.header.entityHeader',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'HeaderDto',
						moduleSubModule: 'ProductionPlanning.Header'
					},
				}
			}
		};

		let container = platformDataServiceFactory.createNewComplete(serviceOption);
		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'HeaderDto',
			moduleSubModule: 'ProductionPlanning.Header',
			validationService: 'productionplanningHeaderValidationService',
			mustValidateFields: ['Code', 'PrjProjectFk', 'BasClerkPrpFk', 'BasSiteFk', 'LgmJobFk']
		});

		/* jshint -W003 */
		let service = container.service;

		// navigation
		service.searchByCalId = function (id) {
			let item = service.getItemById(id);
			// if item is null(maybe because the service hasn't load data), then we search by it immediately.
			if (!item) {
				cloudDesktopSidebarService.filterSearchFromPKeys([id]);
			} else {
				service.setSelected(item);
			}
		};

		// field changed
		service.handleFieldChanged = function (entity, field) {
			$injector.get('productionplanningHeaderDataServiceEntityPropertychangedExtension').onPropertyChanged(entity, field, service);
		};

		service.reloadService = function (serviceName, childServices, containerId) {
			_.find(childServices, function (childService) {
				if (_.isFunction(childService.getServiceName)) {
					let srvName = childService.getServiceName();
					if (!_.isNil(srvName) && srvName.endsWith(serviceName)) {
						childService.clearCache();
						const selected = childService.getSelected();
						childService.load().then(function (response){
							if (selected !== null && containerId !== null && transportplanningTransportUtilService.hasShowContainerInFront(containerId))
							{
								childService.setSelected(selected);
							}
						});
						return true;
					}
					return false;
				} else if (_.isFunction(childService.getChildServices)) {
					return service.reloadService(serviceName, childService.getChildServices());
				} else {
					return false;
				}
			});
		};

		service.setShowHeaderAfterSelectionChanged(updateModuleHeaderInfo2);

		function updateModuleHeaderInfo2(ppsHeader) {
			let selectedProject = {};
			if (ppsHeader !== null && !_.isEmpty(ppsHeader)) {
				let projectPromise = $q.when(basicsLookupdataLookupDescriptorService.getLookupItem('Project', ppsHeader.PrjProjectFk)).then(function (project) {
					if (project) {
						selectedProject = {
							ProjectNo: project.ProjectNo,
							ProjectName: project.ProjectName,
							ProjectId: project.Id
						};
					}
				});
				$q.all([projectPromise]).then(function () {
					updateModuleHeaderInfo(ppsHeader, selectedProject);
				});
			} else {
				cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNamePPSHeader', ''); // empty header info
			}
		}

		function updateModuleHeaderInfo(ppsHeader, selectedProject) {
			let entityText = '';
			let entityHeaderObject = {};
			if (!_.isEmpty(selectedProject.ProjectNo)) {
				if (_.isEmpty(selectedProject.ProjectName)) {
					entityText = selectedProject.ProjectNo;
				} else {
					entityText = selectedProject.ProjectNo + ' - ' + selectedProject.ProjectName;
				}

				entityHeaderObject.project = {
					id: selectedProject.ProjectId,
					description: entityText
				}
			}
			if (_.isEmpty(ppsHeader.DescriptionInfo.Translated)) {
				entityText = ppsHeader ? ppsHeader.Code : '';
			} else {
				entityText = ppsHeader ? ppsHeader.Code + ' - ' + ppsHeader.DescriptionInfo.Translated : '';
			}
			entityHeaderObject.module = {
				id: ppsHeader.Id,
				description: entityText,
				moduleName: moduleName
			}
			cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNamePPSHeader', entityHeaderObject);
		}

		return service;
	}
})(angular);


