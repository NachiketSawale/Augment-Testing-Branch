(function () {
	'use strict';
	let moduleName = 'controlling.common';
	let controllingCommonModule = angular.module(moduleName);

	controllingCommonModule.factory('controllingVersionsListDataServiceFactory', ['_', 'globals', '$http', '$injector', '$translate', 'platformDataServiceFactory', 'platformGridAPI', 'platformModalService',
		function (_, globals, $http, $injector, $translate, platformDataServiceFactory, platformGridAPI, platformModalService) {

			let factory = {};

			factory.createControllingVersionsListDataService = function createControllingVersionsListDataService(modName, parentService){
				let serviceContainer = {};
				let factoryOptions = {
					flatLeafItem: {
						module: modName,
						serviceName: 'controllingVersionsListDataService',
						entitySelection: {supportsMultiSelection: false},
						httpCRUD: {
							route: globals.webApiBaseUrl + 'controlling/BisPrjHistory/',
							endRead: 'list',
							usePostForRead: false,
							initReadData: function initReadData(readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									readData = _.orderBy(readData, ['RibHistoryId']);
									return serviceContainer.data.handleReadSucceeded(readData, data);
								}
							}
						},
						entityRole: {
							leaf: {itemName: 'BisPrjHistory', parentService: parentService}
						}
					}
				};
				let gridId = '';

				serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
				let service = serviceContainer.service;
				service.createItem = null;

				service.showControllingVersionLog = function showVersionLog(controllingVersion) {
					var dataItems = controllingVersion !== null && _.isString(controllingVersion.ReportLog) ? JSON.parse(controllingVersion.ReportLog) : null;

					var modalOptions = {
						headerTextKey: 'controlling.structure.transferdatatobisExecutionReport.title',
						templateUrl: globals.appBaseUrl + moduleName + '/templates/transfer-data-to-bis-data-result-report.html',
						iconClass: 'ico-info',
						width: '1000px',
						dataItems: dataItems,
						resizeable: true
					};

					platformModalService.showDialog(modalOptions);
				};

				service.existGrid = function existGrid() {
					if (!gridId) {
						return false;
					}

					return platformGridAPI.grids.exist(gridId);
				};

				service.setGridId = function setGridId(value) {
					gridId = value;
				};

				service.deleteItem = function (entity) {
					platformModalService.showYesNoDialog('controlling.structure.confirmDelete', 'controlling.structure.confirmDeleteTitle').then(function (response) {
						if (response.yes) {
							let selectedProject = parentService.getSelected();
							if(selectedProject && selectedProject.Id > 0 && entity && entity.Id > 0){
								$http.get(globals.webApiBaseUrl + 'controlling/BisPrjHistory/DeleteControllingVersionAssociation' + '?projectId=' + selectedProject.Id + '&&bisPrjHistoryId=' + entity.Id).then(function (response) {
									let modalOptions = {
										headerTextKey: $translate.instant('cloud.common.informationDialogHeader'),
										bodyTextKey: $translate.instant('controlling.structure.deletedsuccessfully'),
										showOkButton: true,
										iconClass: 'ico-info'
									};
									if (response.data < 0) {
										modalOptions.bodyTextKey = $translate.instant('controlling.structure.deletedfailed');
									}
									platformModalService.showDialog(modalOptions);
									let controllingVersionsList = service.getList();
									let maxId = _.max(_.map(controllingVersionsList, 'Id'));
									let isLastVersion = entity.Id === maxId;

									let dashboardDataService = $injector.get('controllingProjectcontrolsDashboardService');
									dashboardDataService.afterVersionDeleted(entity, isLastVersion);
									$injector.get('controllingProjectcontrolsVersionComparisonService').afterVersionDeleted(entity, isLastVersion);

									if (isLastVersion) {
										service.load();
									}

								}, function (error) {
									let modalOptions = {
										headerTextKey: $translate.instant('cloud.common.informationDialogHeader'),
										bodyTextKey: error,
										showOkButton: true,
										iconClass: 'ico-info'
									};
									platformModalService.showDialog(modalOptions);
								});
							}
						}
					});
				};

				return service;
			};

			return factory;
		}]);
})();
