/**
 * Created by lrj on 8/5/2018
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.quote').controller('procurementQuoteUpdatePackageController',
		['$scope', '$http', '$translate',
			function ($scope, $http, $translate) {

				var translatePrefix = 'procurement.quote.wizard.update.package';

				$scope.translateTemplate = {
					updatePrice: $translate.instant(translatePrefix + '.updatePrice'),
					updateQuantitiesAndPrice: $translate.instant(translatePrefix + '.updateQuantitiesAndPrice')
				};

				$scope.options = $scope.$parent.modalOptions;

				angular.extend($scope.options, {
					title: $translate.instant('procurement.common.wizard.updateMaterial.goToMaterial'),
					body: {
						currentPackage: $translate.instant('procurement.common.wizard.updateMaterial.identicalMaterial')
					}
				});

				$scope.options.ok = function () {
					$scope.$close($scope.modalOptions.model.updatePackage);

				};

				$scope.options.cancel = function () {
					$scope.$close();
				};

				/* function setStatus(isInit, isExecuting, isSucceed, isFailed) {
                    $scope.isInit = isInit || false;
                    $scope.isExecuting = isExecuting || false;
                    $scope.isFailed = isFailed || false;
                    $scope.isSucceed = isSucceed || false;
                } */
			}
		]);
})(angular);