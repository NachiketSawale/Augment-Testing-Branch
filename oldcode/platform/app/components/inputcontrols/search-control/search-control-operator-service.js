(function (angular) {
	'use strict';

	angular.module('platform').factory('searchControlOperatorService', searchControlOperatorService);

	searchControlOperatorService.$inject = ['$translate', 'basicsCommonDataDictionaryOperatorService'];

	function searchControlOperatorService($translate, basicsCommonDataDictionaryOperatorService) {
		var operatorDesc;
		return {
			getOperators: getOperators,
			getOperatorsByIds: getOperatorsByIds
		};

		// Are defined values. These operators are currently allowed.
		function getOperators() {
			return [
				{
					id: 'contains',
					value: 0,
					description: $translate.instant('platform.searchcontrol.includes'),
					cssClass: 'item flex-box flex-align-center'
				},
				{
					id: 'starts',
					value: 1,
					description: $translate.instant('platform.searchcontrol.startsWith'),
					cssClass: 'item flex-box flex-align-center'
				},
				{
					id: 'ends',
					value: 2,
					description: $translate.instant('platform.searchcontrol.endsWith'),
					cssClass: 'item flex-box flex-align-center'
				},
				{
					id: '!contains',
					value: 3,
					description: $translate.instant('cloud.common.FilterUi_NotContains'),
					cssClass: 'item flex-box flex-align-center'
				},
				{
					id: '!starts',
					value: 4,
					description: $translate.instant('cloud.common.FilterUi_NotStartsWith'),
					cssClass: 'item flex-box flex-align-center'
				},
				{
					id: '!ends',
					value: 5,
					description: $translate.instant('cloud.common.FilterUi_NotEndsWith'),
					cssClass: 'item flex-box flex-align-center'
				},
				{
					id: 'between',
					value: 6,
					description: $translate.instant('cloud.common.FilterUi_IsBetween'),
					cssClass: 'item flex-box flex-align-center'
				},
				{
					id: '!between',
					value: 7,
					description: $translate.instant('cloud.common.FilterUi_NotIsBetween'),
					cssClass: 'item flex-box flex-align-center'
				}
			];
		}

		function getOperatorDescription() {
			// get Operators from API. Is needed for the descriptions for the operators.
			return basicsCommonDataDictionaryOperatorService.getOperators().then(function (response) {
				operatorDesc = response;
				return operatorDesc;
			});
		}

		function getCommonOperators(id) {
			return _.find(operatorDesc, function (item) {
				return item.DescriptionInfo.Description === id;
			});
		}

		function mapTranslatedDescriptionInOperators(item) {
			// get description from webApi call
			var operatorFromSearchService = getCommonOperators(item.id);
			// If there is one, then take this.
			item.description = operatorFromSearchService.DescriptionInfo.Translated ? operatorFromSearchService.DescriptionInfo.Translated : item.description;
			return item;
		}

		function getOperatorsByIds(ids) {
			return getOperatorDescription().then(function (response) {
				if (response) {
					// get the desired operators
					var customOperators = _.filter(getOperators(), function (operator) {
						return _.includes(ids, operator.id);
					});

					// get the right translated description for the operators
					return customOperators.map(mapTranslatedDescriptionInOperators);
				}
			});
		}
	}
})(angular);
