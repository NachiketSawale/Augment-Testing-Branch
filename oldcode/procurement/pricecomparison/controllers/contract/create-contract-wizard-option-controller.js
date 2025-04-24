/**
 * Created by miu on 10/28/2021.
 */
(function (angular) {
	'use strict';
	let moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).controller('procurementPriceComparisonCreateContractWizardOptionController',
		['$scope', 'globals', '$translate','procurementPriceComparisonCommonService',
			function ($scope, globals, $translate,procurementPriceComparisonCommonService) {
				let createContractTypeValue =
					{
						createContracts: 'createContracts',
						createOneContract: 'createOneContract'
					};
				$scope.createContractType = createContractTypeValue.createContracts;
				var translatePrefix = 'procurement.quote.wizard.create.contract';
				$scope.translateTemplate = {
					createContractsTemplate: $translate.instant(translatePrefix + '.createContracts'),
					createOneContractTemplate: $translate.instant(translatePrefix + '.createOneContract')
				};
				$scope.modalOptions.headerText = $translate.instant(translatePrefix + '.title');
				$scope.showCreateType = true;
				$scope.okBtnDisabled = false;
				$scope.creating = false;
				$scope.created = false;
				$scope.createdText = null;
				$scope.modalOptions.ok = function () {
					procurementPriceComparisonCommonService.setWizardContractType($scope.createContractType);
					okFun();
				};
				$scope.modalOptions.close = function () {
					onCancelFun();
					$scope.$close(false);
				};
				$scope.cancel = function () {
					onCancelFun();
					$scope.$close(false);
				};
				function okFun(){
					var okCallback=$scope.modalOptions.okCallback;
					if (typeof okCallback ==='function'){
						okCallback();
					}
					$scope.$close();
				}

				function onCancelFun(){
					var cancelFun=$scope.modalOptions.onCancelFun;
					if (typeof cancelFun ==='function'){
						cancelFun();
					}
				}

				$scope.changeCreateType = function (type) {
					$scope.createContractType = type === 'merge' ? createContractTypeValue.createOneContract : createContractTypeValue.createContracts;
				};
			}]);
})(angular);