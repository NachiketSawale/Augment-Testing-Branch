/**
 * Created by zos on 3/23/2016.
 */
(function () {

	'use strict';
	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc controller
	 * @name estimateRuleParameterDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of estimate rule parameter entities.
	 **/
	angular.module(moduleName).controller('estimateRuleParameterDetailController',
		['$scope', 'platformDetailControllerService', 'estimateRuleParameterService', 'estimateRuleParameterConfigurationService', 'estimateRuleParamValidationService','estimateRuleTranslationService',

			function ($scope, platformDetailControllerService, dataService, configurationService, validationService, translationService) {

				platformDetailControllerService.initDetailController($scope, dataService, validationService, configurationService, translationService);

				$scope.change = function(entity, field){
					dataService.fieldChanged(field, entity);
					switch (field) {
						case 'ValueType':
							$scope.$root.$broadcast('domainChanged');
							break;
					}
				};
			}
		]);
})();
