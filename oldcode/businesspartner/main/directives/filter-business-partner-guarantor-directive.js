/**
 * Created by pel on 24/06/2022.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,Slick */

	var moduleName = 'businesspartner.main';
	angular.module(moduleName).directive('filterBusinessPartnerGuarantor', ['_', 'platformGridDomainService', 'basicsLookupdataLookupControllerFactory', 'platformGridAPI', 'platformTranslateService', 'platformPermissionService', 'basicsCommonDialogGridControllerService', 'filterBusinessPartnerGuarantorService',
		'platformLayoutByDataService', 'businessPartnerGuarantorDataService', 'businessPartnerGuarantorUIStandardService',
		function (_, platformGridDomainService, lookupControllerFactory, platformGridAPI, platformTranslateService, platformPermissionService, basicsCommonDialogGridControllerService, filterBusinessPartnerGuarantorService,
			platformLayoutByDataService, dataService, uiStandardService) {
			return {
				templateUrl: globals.appBaseUrl + 'businesspartner.main/partials/filter-business-partner-guarantor.html',
				restrict: 'A',
				scope: {},
				replace: true,
				controller: ['$scope', function ($scope) {
					var options = filterBusinessPartnerGuarantorService.getCtOptions();
					var gridId = filterBusinessPartnerGuarantorService.getCtGridId();
					$scope.modalOptions = options;
					$scope.gridId = gridId;

					$scope.grid = {
						state: $scope.gridId
					};
					$scope.data = {
						state: $scope.gridId
					};
					var settings = uiStandardService.getStandardConfigForListView();
					var gridColumns = angular.copy(settings.columns);

					var gridConfig = {
						columns: gridColumns,
						data: [],
						id: $scope.gridId,
						gridId: $scope.gridId,
						lazyInit: true,
						options: {
							skipPermissionCheck: true,
							iconClass: 'control-icons',
							idProperty: 'Id',
							collapsed: false,
							indicator: true,
							multiSelect: false,
							enableDraggableGroupBy: true,
							enableModuleConfig: true,
							enableConfigSave: true,
							editorLock: new Slick.EditorLock()
						}
					};

					if (!$scope.tools) {
						lookupControllerFactory.create({
							grid: true,
							dialog: true,
							search: false
						}, $scope, gridConfig);
					}

					$scope.$on('$destroy', function () {
						if (platformGridAPI.grids.exist($scope.gridId)) {
							platformGridAPI.grids.unregister($scope.gridId);
						}
					});
				}]
			};

		}]);
})(angular);