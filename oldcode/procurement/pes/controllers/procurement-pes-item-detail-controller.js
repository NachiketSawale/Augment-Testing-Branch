(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.pes';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPesItemDetailController', ['$scope', 'platformDetailControllerService', 'procurementPesItemService', 'procurementPesItemValidationService', 'procurementPesItemUIStandardService', 'platformTranslateService',
		'modelViewerStandardFilterService', '$injector', '$http',
		function ($scope, platformDetailControllerService, procurementPesItemService, procurementPesItemValidationService, procurementPesItemUIStandardService, platformTranslateService,
			modelViewerStandardFilterService, $injector, $http) {
			platformDetailControllerService.initDetailController($scope, procurementPesItemService, procurementPesItemValidationService(procurementPesItemService),
				procurementPesItemUIStandardService, platformTranslateService);

			function costGroupLoaded(costGroupCatalogs) {
				$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
					scope: $scope,
					dataService: procurementPesItemService,
					validationService: procurementPesItemValidationService,
					formConfiguration: procurementPesItemUIStandardService,
					costGroupName: 'baseGroup'
				});
			}

			procurementPesItemService.onCostGroupCatalogsLoaded.register(costGroupLoaded);
			/* refresh the columns configuration when controller is created */
			if (procurementPesItemService.costGroupCatalogs) {
				costGroupLoaded(procurementPesItemService.costGroupCatalogs);
			}

			function headerSelectionChanged() {
				if (procurementPesItemService.hasSelection()) {
					var currentItem = procurementPesItemService.getSelected();
					$http.get(globals.webApiBaseUrl + 'procurement/pes/item/getcostgroupcats' + '?id=' + currentItem.Id).then(function (response) {
						$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
							if (!_.isNil(response) && response.data !== '') {
								var responseData = response.data;
								responseData.dtos = [];
								responseData.dtos.push(currentItem);
								responseData.CostGroupCats.isForDetail = true;
								basicsCostGroupAssignmentService.process(responseData, procurementPesItemService, {
									mainDataName: 'dtos',
									attachDataName: 'PesItem2CostGroups', // name of MainItem2CostGroup
									dataLookupType: 'PesItem2CostGroups',// name of MainItem2CostGroup
									identityGetter: function identityGetter(entity) {
										return {
											Id: entity.MainItemId
										};
									}
								});
							}

						}]);
					});

				}
			}

			procurementPesItemService.registerSelectionChanged(headerSelectionChanged);

			modelViewerStandardFilterService.attachMainEntityFilter($scope, procurementPesItemService.getServiceName());
			$scope.$on('$destroy', function () {
				procurementPesItemService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
				procurementPesItemService.unregisterSelectionChanged(headerSelectionChanged);
			});
		}
	]);
})(angular);