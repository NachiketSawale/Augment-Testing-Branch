(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).directive('projectMainPriceListOptionCombobox',
		['$q', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($q, BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'PriceListRetrievalOption',
					valueMember: 'id',
					displayMember: 'description',
					disableInput: true
				};

				var options = [
					{id: 1, sortIndx: 6, value: 'Weighting', description: 'Weighting'},
					{id: 2, sortIndx: 5, value: 'Average', description: 'Average'},
					{id: 3, sortIndx: 4, value: 'Min', description: 'Min'},
					{id: 4, sortIndx: 3, value: 'Max', description: 'Max'},
					{id: 5, sortIndx: 2, value: 'Earliest', description: 'Earliest'},
					{id: 6, sortIndx: 1, value: 'Latest', description: 'Latest'}
				];

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {
						getList: function () {
							return $q.when(options.sort(function (a, b) {
								return a.sortIndx - b.sortIndx;
							}));
						},
						getItemByKey: function (key) {
							return _.find(options, {id: key});
						}
					}
				});
			}]);

})(angular);
