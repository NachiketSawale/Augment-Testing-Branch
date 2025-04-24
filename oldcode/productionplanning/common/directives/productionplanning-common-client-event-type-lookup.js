(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('productionplanningCommonClientEventTypeLookup', ProductionplanningCommonClientEventTypeLookup);

	ProductionplanningCommonClientEventTypeLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition','$q', 'productionplanningItemSplitConfigurationService'];

	function ProductionplanningCommonClientEventTypeLookup(BasicsLookupdataLookupDirectiveDefinition, $q, productionplanningItemSplitConfigurationService) {

		var defaults = {
			lookupType: 'SplitEventType',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			editable: 'false',
			version: 3
		};

		function getList() {
			var result = productionplanningItemSplitConfigurationService.eventTypes;
			return $q.when(result);
		}

		function getItemByKey(key) {
			var result = _.find(productionplanningItemSplitConfigurationService.eventTypes, {Id: key});
			return $q.when(result);
		}

		var provider = {
			dataProvider: {
				getList: getList,
				getItemByKey: getItemByKey
			}
		};

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, provider);
	}
})(angular);