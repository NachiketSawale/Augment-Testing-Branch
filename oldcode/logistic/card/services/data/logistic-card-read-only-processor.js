/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	'use strict';
	var cardModule = angular.module('logistic.card');

	cardModule.service('logisticCardReadOnlyProcessor', LogisticCardReadOnlyProcessor);

	LogisticCardReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function LogisticCardReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processCardEntity(card) {
			platformRuntimeDataService.readonly(card, [
				{field: 'JobCardTemplateFk', readonly: !!card.JobCardTemplateFk},
				{field: 'PlantFk', readonly: !!card.PlantFk},
				{field: 'ResourceFk', readonly: !!card.ResourceFk},
				{field: 'RubricCategoryFk', readonly: card.RubricCategoryFk && card.Version >= 1},
				{field: 'Code', readonly: card.Code && card.Version >= 1}
			]);
			if(card.IsReadonlyStatus){
				platformRuntimeDataService.readonly(card, true);
			}
		};
	}
})(angular);

