/**
 * Created by ltn on 8/25/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.contract').controller('procurementContractUpdateMaterialController',
		['$scope', '$http', '$translate', 'platformModuleNavigationService','procurementContractUpdateMaterialService',
			function ($scope, $http, $translate, naviService,procurementContractUpdateMaterialService) {

				$scope.options = $scope.$parent.modalOptions;

				angular.extend($scope.options, {
					title: $translate.instant('procurement.common.wizard.updateMaterial.goToMaterial'),
					body: {
						currentPackage: $translate.instant('procurement.common.wizard.updateMaterial.identicalMaterial')
					}
				});

				if($scope.modalOptions.isMultiMaterial) {
					setStatus(true);
					$scope.isOk = true;
				}
				else {
					$scope.options.executingMessage = $translate.instant('procurement.common.wizard.updateMaterial.executingMessage');
					setStatus(false, true, false, false);
					procurementContractUpdateMaterialService.updateMaterial().then(
						function () {
							$scope.options.executeSuccessedMessage = $translate.instant('procurement.common.wizard.updateMaterial.executeSuccessedMessage');
							setStatus(false, false, true, false);
							$scope.isOk = true;
						}
					);
				}

				$scope.navigate = function () {
					$scope.$close(false);
					naviService.navigate({
						moduleName: 'basics.material'
					}, $scope.modalOptions.materialFKs, 'MdcMaterialFk');

				};

				$scope.options.ok = function () {
					if($scope.isSucceed){
						$scope.$close($scope.modalOptions.materialFKs);
					}

					$scope.options.executingMessage = $translate.instant('procurement.common.wizard.updateMaterial.executingMessage');
					setStatus(false, true, false, false);
					$scope.isOk = false;
					procurementContractUpdateMaterialService.updateMaterial().then(
						function () {
							$scope.options.executeSuccessedMessage = $translate.instant('procurement.common.wizard.updateMaterial.executeSuccessedMessage');
							setStatus(false, false, true, false);
							$scope.isOk = true;
						}
					);
				};

				$scope.options.cancel = function () {
					$scope.$close($scope.modalOptions.materialFKs);
				};

				function setStatus(isInit, isExecuting, isSucceed, isFailed) {
					$scope.isInit = isInit || false;
					$scope.isExecuting = isExecuting || false;
					$scope.isFailed = isFailed || false;
					$scope.isSucceed = isSucceed || false;
				}
			}
		]);
})(angular);