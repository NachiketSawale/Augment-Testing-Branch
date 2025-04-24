(function () {

	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc controller
	 * @name basicsCustomizeInstanceListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the entity types
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCustomizeInstanceListController',
		['_', '$scope', 'platformGridControllerService', 'basicsCustomizeInstanceDataService', 'basicsCustomizeInstanceConfigurationService',
			'basicsCustomizeTypeDataService', 'platformGridAPI', 'basicsCustomizeInstanceValidationProviderService', 'platformValidationByDataService',
			function (_, $scope, platformGridControllerService, basicsCustomizeInstanceDataService, basicsCustomizeInstanceConfigurationService,
				basicsCustomizeTypeDataService, platformGridAPI, basicsCustomizeInstanceValidationProviderService, platformValidationByDataService) {

				var myGridConfig = {initCalled: false, columns: [], enableConfigSave: false, disableConfig: true};

				var valServ = basicsCustomizeInstanceValidationProviderService.getInstanceValidationService();
				platformGridControllerService.initListController($scope, basicsCustomizeInstanceConfigurationService, basicsCustomizeInstanceDataService, valServ, myGridConfig);

				function onTypeSelectionChanged() {
					if ($scope.gridId) {
						if (platformGridAPI.grids.exist($scope.gridId)) {
							let clientConf = {
								grouping: platformGridAPI.columns.getGrouping($scope.gridId),
								columns: platformGridAPI.columns.getColumns($scope.gridId)
							};
							basicsCustomizeInstanceConfigurationService.storeTableConfigurationForCurrentSelection(clientConf);
							platformGridAPI.columns.setGrouping($scope.gridId, '');
							var gridConf = basicsCustomizeInstanceConfigurationService.onTypeSelectionChanged();

							valServ = basicsCustomizeInstanceValidationProviderService.getInstanceValidationService();
							platformGridControllerService.addValidationAutomatically(gridConf.columns, valServ);
							platformValidationByDataService.registerValidationService(valServ, basicsCustomizeInstanceDataService);

							basicsCustomizeInstanceDataService.prepareNewEntityValidator(valServ);

							let grouping = [];
							let columns = [];
							clientConf = basicsCustomizeInstanceConfigurationService.getTableConfigurationCurrentSelection();
							if(clientConf && clientConf.columns.length > 0) {
								grouping = clientConf.grouping;

								_.forEach(clientConf.columns, function(col) {
									const confCol = _.find(gridConf.columns, function(c) { return c.id === col.id; });
									if(confCol) {
										confCol.width = col.width;
										columns.push(confCol);
									}
								});
							} else {
								columns = gridConf.columns;
							}

							platformGridAPI.columns.configuration($scope.gridId, columns, true);

							if (gridConf.columns.length > 0) {
								platformGridAPI.items.data($scope.gridId, basicsCustomizeInstanceDataService.getList());
							}

							platformGridAPI.columns.setGrouping($scope.gridId, grouping, true);
						}
					}
				}

				basicsCustomizeTypeDataService.registerSelectionChanged(onTypeSelectionChanged);

				$scope.$on('$destroy', function () {
					basicsCustomizeTypeDataService.unregisterSelectionChanged(onTypeSelectionChanged);
				});
			}
		]);
})();
