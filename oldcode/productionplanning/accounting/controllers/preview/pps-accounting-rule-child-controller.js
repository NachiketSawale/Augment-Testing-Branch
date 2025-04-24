/**
 * Created by lav on 7/22/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingRuleChildController',
		[
			'$scope',
			'$controller',
			'ppsDrawingPreviewUIService',
			'productionplanningAccountingRuleDataService',
			'basicsLookupdataLookupFilterService',
			'$translate',
			'productionplanningAccountingRuleUIStandardService',
			'productionpalnningAccountingRuleValidationService',
			function ($scope,
					  $controller,
					  ppsDrawingPreviewUIService,
					  accountingRuleDataService,
					  basicsLookupdataLookupFilterService,
					  $translate,
					  accountingRuleUIStandardService,
					  accountingRuleValidationService) {

				var dataService = accountingRuleDataService.getService({
					serviceKey: 'preview',
					parentService: $scope.$parent.ruleSetService
				});

				var filters = [{
					key: 'productionplanning-accounting-rule-matchfield-filter',

					fn: function (item) {
						var rule = dataService.getSelected();
						if (rule) {
							var fields = dataService.GetMatchFields(rule.ImportFormatFk);
							return _.find(fields, {Id: item.Id});
						}

					}
				}];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				var ruleConfig = {
					title: $translate.instant('productionplanning.accounting.rule.listTitle'),
					gridId: 'ef452834f2e84002a40cfb7y9kd4185f',
					dataService: dataService,
					UIStandardService: accountingRuleUIStandardService.getService(dataService),
					validationService: accountingRuleValidationService.getService(dataService),
					additionalColumns: ppsDrawingPreviewUIService.generateAdditionalColumns('RuleIds'),
					permission: 'ad340a997e8b4ad2876dfdd9d2670656'
				};

				angular.extend(this, $controller('productionplanningAccountingRuleCommonChildController', {
					$scope: $scope,
					$options: ruleConfig
				}));

				$scope.$parent.gridIds.push(ruleConfig.gridId);
			}
		]);
})(angular);