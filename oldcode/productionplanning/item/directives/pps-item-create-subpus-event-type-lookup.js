(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).directive('ppsItemCreateSubpusEventTypeLookup', PpsItemCreateSubpusEventTypeLookup);

	PpsItemCreateSubpusEventTypeLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition','$q', 'ppsItemCreateSubPUsService'];

	function PpsItemCreateSubpusEventTypeLookup(BasicsLookupdataLookupDirectiveDefinition, $q, ppsItemCreateSubPUsService) {

		var defaults = {
			lookupType: 'SplitEventType',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			editable: 'false',
			version: 3
		};

		function getList() {
			var result = ppsItemCreateSubPUsService.eventTypes;
			return $q.when(result);
		}

		function getItemByKey(key) {
			var result = _.find(ppsItemCreateSubPUsService.eventTypes, {Id: key});
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