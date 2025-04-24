/**
 * Created by bh on 13.03.2015.
 */
(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.project';
	var boqProjectModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name boqProjectService
	 * @function
	 *
	 * @description
	 * boqProjectService is a data service for managing boqs in the project main module.
	 */
	boqProjectModule.factory('boqProjectService', ['projectMainService', 'platformDataServiceFactory', 'platformRuntimeDataService', 'boqMainService', '$q', 'boqProjectReadonlyProcessor', '$injector', '$translate', '$http', 'platformContextService',
		function (projectMainService, platformDataServiceFactory, platformRuntimeDataService, boqMainService, $q, boqProjectReadonlyProcessor, $injector, $translate, $http, platformContextService) {
			var serviceContainer = {};
			var service = {};
			var filterBackups = false;

			var boqProjectServiceOption = {
				flatNodeItem: {
					module: boqProjectModule,
					serviceName: 'boqProjectService',
					entityRole: {node: {itemName: 'BoqComposite', parentService: projectMainService}},
					httpCreate: {route: globals.webApiBaseUrl + 'boq/project/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'boq/project/',
						initReadData: function(readData) {
							readData.filter = '?projectId='+ projectMainService.getIfSelectedIdElse(0) + '&filterBackups='+filterBackups;
						}
					},
					actions: {
						delete: true,
						create: 'flat',
						canDeleteCallBackFunc: function () {
							var prjBoq = service.getSelected();
							return !prjBoq.BoqHeader.IsReadOnly || prjBoq.BoqHeader.IsBackup;
						}
					},
					dataProcessor: [
						boqProjectReadonlyProcessor,
						{
							processItem: function(projectBoq) {
								if (filterBackups) {
									platformRuntimeDataService.readonly(projectBoq, true);
								}
							}
						}
					],
					entitySelection: {},
					setCellFocus: true,
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selectedProject = projectMainService.getSelected();
								if (projectMainService.isSelection(selectedProject)) {
									creationData.projectId = selectedProject.Id;

									// Increment the reference number of the boq root item
									var convertibleReferences = _.map(service.getList(), 'BoqRootItem').filter(function (item) {
										return /^\d+$/.test(item.Reference); // Make sure we only take the references that can be converted to integers
									});

									var convertedReferences = _.map(convertibleReferences, function (item) {
										return parseInt(item.Reference, 10); // Convert the strings to integers
									});

									var maxReference = (convertedReferences.length === 0) ? null : _.max(convertedReferences);
									if (maxReference) {
										maxReference = (maxReference + 1).toString();
									}

									creationData.Reference = maxReference || '1';
								}
							},
							isInitialSorted: true, sortOptions: {initialSortColumn: {field: 'BoqRootItem.Reference', id: 'boqRootItem.reference'}, isAsc: true, doNumericComparison: true},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								serviceContainer.data.sortByColumn(readItems);
								var result = serviceContainer.data.handleReadSucceeded(readItems, data);
								serviceContainer.service.goToFirst();
								boqMainService.setReadOnly(false); // Currently there is no readonly set to the called boqMainService
								return result;
							}
						}
					},
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(boqProjectServiceOption);
			service = serviceContainer.service;

			service.registerSelectionChanged(function(boqCompositeItem){
				if (!boqCompositeItem) {
					boqCompositeItem = service.getSelected();
					// set or reset current PermissionObjectInfo
					if(boqCompositeItem && (_.has(boqCompositeItem, 'PermissionObjectInfo'))) {
						platformContextService.setPermissionObjectInfo(boqCompositeItem.PermissionObjectInfo || null);
					}
				}
			});

			service.prepareGoTo = function prepareGoTo(boqCompositeItem) {
				var selectedProject = projectMainService.getSelected();
				var deferredGoto = $q.defer();

				if (!boqCompositeItem) {
					boqCompositeItem = service.getSelected();
				}

				service.saveParentService().then(function() { // First save all changes by saving the parent service...
					var boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
					boqRuleComplexLookupService.setNavFromBoqProject();
					boqRuleComplexLookupService.setProjectId(selectedProject.Id);
					boqRuleComplexLookupService.loadLookupData().then(function() {
						boqMainService.setSelectedHeaderFk(boqCompositeItem.BoqRootItem.BoqHeaderFk);
						boqMainService.setSelectedProjectId(selectedProject.Id);
						boqMainService.setCallingContext(boqCompositeItem);

						boqMainService.setCurrentExchangeRate(1);
						$http.get(globals.webApiBaseUrl + 'boq/main/header/context?boqHeaderId=' + boqCompositeItem.BoqHeader.Id).then(function(result) {
							if (result.data && result.data.ContextExchangeRate) {
								boqMainService.setCurrentExchangeRate(result.data.ContextExchangeRate);
							}
							deferredGoto.resolve();
						});

					});
				});
				return deferredGoto.promise;
			};

			service.saveParentService = function saveParentService() {
				var deferred = $q.defer();
				if (angular.isObject(serviceContainer.data) && angular.isObject(serviceContainer.data.parentService)) {
					serviceContainer.data.parentService.updateAndExecute(function () {
						deferred.resolve();
					});

					return deferred.promise;
				}
			};

			var originalCreateItem = service.createItem;

			// Now intercept create Item call by first calling the original version and then doing special stuff
			service.createItem = function createProjectBoq() {

				var deferred = $q.defer(); // should return a promise

				// First save all changes by saving the parent service and make sure the project is saved...
				var saveParentPromise = service.saveParentService();

				saveParentPromise.then(function () {
					// ...then call the original createItem version
					return originalCreateItem().then(function reactOnSuccessfulProjectBoqCreate(newItem) {
						if (angular.isDefined(newItem) && (newItem !== null)) {
							// ...finally get all items and resort them
							serviceContainer.data.sortByColumn(service.getList());
							serviceContainer.data.listLoaded.fire(); // Reload list to establish new sorting order
							service.setSelected(newItem);

							// Set the focus to the first cell of the new created item.
							var options = {
								item: newItem,
								cell: 1,
								forceEdit: true
							};
							service.setCellFocus(options);

							// return newItem;
							deferred.resolve(newItem);
						}
					});
				},
				function () {
					// Save of project failed -> no creation of project boq
					console.log('Save of project failed -> no creation of project boq');
					return null;
				});

				return deferred.promise;

			};

			service.deleteEntities = function(prjBoqs) {
				var platformDialogService = $injector.get('platformDialogService');

				const boqHeaderIds = _.map(prjBoqs, 'BoqHeader.Id');
				$http.get(globals.webApiBaseUrl + 'boq/main/header/anybackupsource?boqHeaderIds=' + JSON.stringify(boqHeaderIds)).then(function(response) {
					if (response.data) {
						platformDialogService.showInfoBox('boq.main.Backup.DeletionFailed');
					}
					else {
						platformDialogService.showYesNoDialog(moduleName+'.confirmDeleteBoqHeader', moduleName+'.confirmDeleteTitle').then(function(result) {
							if (result.yes) {
								serviceContainer.data.deleteEntities(prjBoqs, serviceContainer.data);
							}
						});
					}
				});
			};

			/**
			 * @ngdoc function
			 * @name getCellEditable
			 * @function
			 * @methodOf procurement.common.procurementCommonPrcBoqService
			 * @description get editable of model
			 * @returns bool
			 */
			/* jshint -W074 */ // The complexly warning is not need, logic in method is simple and readable
			service.getCellEditable = function (/* item, model */) {
				var editable = true;

				// Readonly state is derived from related state of boq header coming from currently set boq status
				var boqCompositeItem = service.getSelected();
				if (boqCompositeItem && boqCompositeItem.BoqHeader && boqCompositeItem.BoqHeader.IsReadOnly) {
					return false;
				}

				return editable;
			};

			serviceContainer.service.showPinningDocuments = {
				tileId: 'project.main',
				active: true,
				moduleName: 'boq.main',
				id: 'Boq.BoqHeaderFk',
				projectId: 'Boq.PrjProjectFk',
				description: 'BoqRootItem.BriefInfo.Translated'
			};

			service.createDeepCopy = function() {
				var projectBoq = service.getSelected().Boq;
				$http.post(globals.webApiBaseUrl + 'boq/project/createdeepcopy' + '?projectId='+projectBoq.PrjProjectFk + '&boqHeaderId='+projectBoq.BoqHeaderFk).then(function() {
					service.load();
				});
			};

			service.setBackupFilter = function(value) {
				filterBackups = value;
			};

			return service;
		}
	]);
})();
