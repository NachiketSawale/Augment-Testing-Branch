/**
 * Created by xia on 4/21/2017.
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';
	angular.module(moduleName).factory('estimateRuleComplexLookupProcessService',
		['_', '$injector', 'estimateRuleSequenceLookupService', 'platformRuntimeDataService', function (_, $injector, estimateRuleSequenceLookupService, platformRuntimeDataService) {

			let service = {};

			service.proressItems = function (gridData, isSequenceReadonly){

				_.forEach(gridData, function(item){
					if(isSequenceReadonly){// item.EstRuleExecutionTypeFk === 3 ||
						platformRuntimeDataService.readonly(item, [{field : 'EstEvaluationSequenceFk', readonly : true }]);
					} else {
						if ($injector.get('estimateMainService').getHeaderStatus() || !$injector.get('estimateMainService').hasCreateUpdatePermission()) {
							platformRuntimeDataService.readonly(item, [{ field: 'EstEvaluationSequenceFk', readonly: true }]);
						} else {
							platformRuntimeDataService.readonly(item, [{ field: 'EstEvaluationSequenceFk', readonly: false }]);
						}
					}
				});

				_.forEach(gridData, function(item){
					if(item && item.EstEvaluationSequenceFk){
						estimateRuleSequenceLookupService.getItemByIdAsync(item.EstEvaluationSequenceFk).then(function(sequenceEntity){
							if(sequenceEntity){
								/* if(!sequenceEntity.Ischangeable){
									platformRuntimeDataService.readonly(item, [{field : 'EstEvaluationSequenceFk', readonly : true }]);
								} */
								item.Ischangeable = sequenceEntity.Ischangeable;
							}
						});
					}
				});
			};

			service.select = function (lookupItem, entity) {
				if (!lookupItem || !entity) {
					return '';
				}

				let iconName = '';

				if (angular.isDefined(entity.Ischangeable)) {
					if (entity.Ischangeable) {
						iconName = 'editable';
					} else {
						iconName = 'not-editable';
					}
				} else {
					let sequence = estimateRuleSequenceLookupService.getItemById(entity.EstEvaluationSequenceFk);
					if (sequence && sequence.Ischangeable) {
						iconName = 'editable';
					} else {
						iconName = 'not-editable';
					}
				}

				return 'cloud.style/content/images/control-icons.svg#ico-'+ iconName;
			};

			return service;
		}]);
})(angular);
