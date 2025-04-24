/**
 * Created by lcn on 8/10/2023.
 */
(function () {
	'use strict';
	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare,no-unused-vars
	/* global angular,globals,_ */
	angular.module(moduleName).controller('ProcurementCommonRenumberItemController', ['$scope', 'globals', '$injector', '$http', '$q', '$translate',
		function ($scope, globals, $injector, $http, $q, $translate) {

			$scope.options = $scope.$parent.modalOptions;
			$scope.modalOptions = {};
			$scope.entity = {};
			$scope.modalOptions.headerText = $translate.instant('procurement.common.renumberItem.title');
			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};
			$scope.isSuccess = false;
			$scope.isLoading = false;
			$scope.entity.StartValue = $scope.entity.Stepincrement = GetIncrement();
			$scope.canOk = function () {
				return $scope.entity && $scope.entity.StartValue && $scope.entity.Stepincrement;
			};

			$scope.onOk = function () {
				$scope.entity.ModuleName = $scope.$parent.currentModule;
				$scope.entity.MainItemId = $scope.options.currentItem.Id;
				let data = angular.copy($scope.entity);

				$scope.isLoading = true;
				$http.post(globals.webApiBaseUrl + 'procurement/common/wizard/renumberitem', data).then(function (res) {
					$scope.isSuccess = true;
					if (res.data) {
						$scope.options.parentService.refresh();
					}
				}).finally(function () {
					$scope.isLoading = false;
				});
			};

			$scope.success = function () {
				$scope.$close();
			};

			function GetIncrement() {
				const systemOptionDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
				let increment = 10;
				if (systemOptionDataService) {
					let systemOptions = systemOptionDataService.getList();
					if (systemOptions && systemOptions.length > 0) {
						// eslint-disable-next-line no-unused-vars
						_.filter(systemOptions, function (systemOption) {
							if (systemOption.Id === 500) {
								increment = systemOption.ParameterValue;
							}
						});
					}
				}
				return increment;
			}
		}
	]);
})(angular);
