/**
 * Created by lav on 7/22/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingRuleResultChildController',
		[
			'$scope',
			'$controller',
			'ppsDrawingPreviewUIService',
			'productionplanningAccountingResultDataService',
			'productionplanningAccountingResultUIStandardService',
			'$translate',
			'productionpalnningAccountingResultValidationService',
			function ($scope,
					  $controller,
					  ppsDrawingPreviewUIService,
					  accountingResultDataService,
					  accountingResultUIStandardService,
					  $translate,
					  accountingResultValidationService) {

				var dataService = accountingResultDataService.getService({
					serviceKey: 'preview',
					parentService: $scope.$parent.ruleSetService
				});

				dataService.registerFilters();

				var ruleResultConfig = {
					title: $translate.instant('productionplanning.accounting.result.listTitle'),
					gridId: '9f452834f2e840d2a40cff7y9kd4185k',
					dataService: dataService,
					UIStandardService: accountingResultUIStandardService.getService(dataService),
					validationService: accountingResultValidationService.getService(dataService),
					additionalColumns: ppsDrawingPreviewUIService.generateAdditionalColumns('ResultIds'),
					permission: '464c261c2b7d4111b6717aa2c13b2e82'
				};

				angular.extend(this, $controller('productionplanningAccountingRuleCommonChildController', {
					$scope: $scope,
					$options: ruleResultConfig
				}));

				$scope.$parent.gridIds.push(ruleResultConfig.gridId);

				$scope.$on('$destroy', function () {
					dataService.unregisterFilters();
				});
			}
		]);
})(angular);