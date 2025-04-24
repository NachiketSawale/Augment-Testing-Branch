
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('productionplanningCommonEventTypeLookup', ProductionplanningCommonEventTypeLookup);

	ProductionplanningCommonEventTypeLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function ProductionplanningCommonEventTypeLookup(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'EventType',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			editable: 'false',
			version: 3
		};
		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
			processData: function (dataList, options) {
				if (options.useCustomData) {
					dataList = options.dataSources;
				}
				if(options.additionalFilters){
					if(options.additionalFilters.isForSequence === true){
						dataList = _.filter(dataList, function (item){
							return item.IsForSequence === true;
						});
					}
				}
				return dataList;
			}
		});
	}
})(angular);