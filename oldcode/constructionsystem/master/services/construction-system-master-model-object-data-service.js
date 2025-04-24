(function (angular) {
	'use strict';
	/* global globals,_ */
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterModelObjectDataService', [
		'$http',
		'platformDataServiceFactory',
		'constructionSystemMasterTestDataService',
		'platformModalService',
		'constructionsystemCommonFilterDataService',
		'$injector',
		'PlatformMessenger',
		function (
			$http,
			dataServiceFactory,
			constructionSystemMasterTestDataService,
			platformModalService,
			filterDataService,
			$injector,
			PlatformMessenger
		) {
			var service;
			var serviceOptions = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMasterModelObjectDataService',
					entityNameTranslationID: 'model.main.entityObject',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'model/main/object/',
						endRead: 'containerfilter',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var item = constructionSystemMasterTestDataService.getCurrentEntity();
							readData.ModelId = item ? item.ModelFk ? item.ModelFk : -1 : -1;
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readData, data) {
								var dtos = readData.dtos;
								$injector.invoke(['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
									basicsCostGroupAssignmentService.process(readData, service, {
										mainDataName: 'dtos',
										attachDataName: 'ModelObject2CostGroups',
										dataLookupType: 'ModelObject2CostGroups',
										identityGetter: function identityGetter(entity){
											return {
												ModelFk: entity.RootItemId,
												Id: entity.MainItemId
											};
										}
									});

								}]);
								return data.handleReadSucceeded(dtos, data);
							}
						}
					},
					modification: {simple: false},
					entityRole: {
						root: {
							itemName: 'Object',
							doesRequireLoadAlways: true
						}
					},
					actions: {delete: false, create: false}
				}
			};

			var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
			service = serviceContainer.service;
			service.setShowHeaderAfterSelectionChanged(null);
			serviceContainer.data.updateOnSelectionChanging = null;
			constructionSystemMasterTestDataService.registerListLoaded(service.load);
			constructionSystemMasterTestDataService.CosInsHeaderFkSelectionChanged.register(service.load);
			constructionSystemMasterTestDataService.getSelectedModelObjects.register(getSelectedModelObjects);

			service.checkAllItems = function checkAllItems(checked) {
				angular.forEach(service.getList(), function (item) {
					item.IsChecked = checked;
				});
				service.gridRefresh();
			};

			service.isCheckedValueChange = function (entity, newValue) {
				var currentItem = service.getSelected();
				currentItem.IsChecked = newValue;
				return true;
			};

			/**
			 * filter model objects by master's selection statement.
			 */
			service.filterObjects = function filterObjects() {
				var context = constructionSystemMasterTestDataService.getCurrentEntity();

				if (context && context.Id > 0 && context.ModelFk > 0) {
					var parameters = 'cosHeaderId=' + context.Id + '&modelId=' + context.ModelFk;
					$http.get(globals.webApiBaseUrl + 'constructionsystem/master/selectionstatement/objectfilter?' + parameters).then(function (response) {
						var success = 1;// , failed = 0;

						var result = response.data;
						if (result.status === success) {
							var objects = result.objects;
							if (objects && objects[0]) {
								service.setList(objects);
								service.setSelected(objects[0]);
							} else {
								service.deselect();
								service.setList([]);
							}
							var data = serviceContainer.data;
							data.doClearModifications(null, data);
						} else {
							platformModalService.showDialog({
								headerTextKey: 'cloud.common.informationDialogHeader',
								bodyTextKey: 'constructionsystem.master.filterError',
								iconClass: 'ico-error'
							});
						}
					});
				} else {
					platformModalService.showDialog({
						headerTextKey: 'cloud.common.informationDialogHeader',
						bodyTextKey: 'constructionsystem.master.filterObjectsTestInfo',
						iconClass: 'ico-info'
					});
				}
			};

			/**
			 * filter model objects by master's selection statement.
			 */
			service.filterObjectsByClient = function filterObjects() {

				var context = constructionSystemMasterTestDataService.getCurrentEntity();

				if (context && context.ModelFk > 0) {

					var modelId = context.ModelFk;
					var selectionStatement = filterDataService.getSelectedFilter('constructionSystemMasterHeaderService');
					if (!selectionStatement) {
						service.filterObjects();
						return;
					}
					var url = globals.webApiBaseUrl + 'constructionsystem/master/selectionstatement/objectfilter';

					$http.post(url, {
						ModelId: modelId,
						SelectionStatement: JSON.stringify(selectionStatement)
					}).then(function (response) {
						var success = 1;// , failed = 0;

						var result = response.data;
						if (result.status === success) {
							var objects = result.objects;

							if (objects && objects[0]) {
								service.setList(objects);
								service.setSelected(objects[0]);
							} else {
								service.deselect();
								service.setList([]);
							}
							var data = serviceContainer.data;
							data.doClearModifications(null, data);
						} else {
							platformModalService.showDialog({
								headerTextKey: 'cloud.common.informationDialogHeader',
								bodyTextKey: 'constructionsystem.master.filterError',
								iconClass: 'ico-error'
							});
						}
					});
				} else {
					platformModalService.showDialog({
						headerTextKey: 'cloud.common.informationDialogHeader',
						bodyTextKey: 'constructionsystem.master.filterObjectsTestInfo',
						iconClass: 'ico-info'
					});
				}
			};

			delete service.markItemAsModified;
			delete service.markEntitiesAsModified;
			delete service.markCurrentItemAsModified;

			function getSelectedModelObjects() {
				return service.getList().filter(function (item) {
					return item.IsChecked;
				});
			}

			service.registerListLoaded(setObjectsCheck);
			service._selectedObjectIds = [];

			function setObjectsCheck() {
				if (service._selectedObjectIds && service._selectedObjectIds.length > 0) {
					var list = service.getList();
					angular.forEach(service._selectedObjectIds, function (item) {
						var findItem = _.find(list, {ModelFk: item.ModelFk, Id: item.Id});
						if (findItem) {
							findItem.IsChecked = true;
						}
					});
					service._selectedObjectIds = [];
				}
			}

			service.setSelectedObjects = function (selectedObjectIds) {
				service._selectedObjectIds = selectedObjectIds;
			};

			// add the onCostGroupCatalogsLoaded messenger
			service.onCostGroupCatalogsLoaded = new PlatformMessenger();
			return service;
		}
	]);
})(angular);