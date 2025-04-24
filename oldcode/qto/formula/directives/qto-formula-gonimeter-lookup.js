/**
 * Created by lvi on 1/9/2015.
 */

(function (angular, globals) {
	'use strict';

	/* globals globals */

	globals.lookups.gonimeter = function gonimeter($injector){
		var qtoFormulaGonimeterDataService = $injector.get('qtoFormulaGonimeterDataService');
		return {
			lookupOptions:{
				lookupType: 'gonimeter',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				onDataRefresh: function ($scope) {
					qtoFormulaGonimeterDataService.loadAsync().then(function (data) {
						$scope.refreshData(data);
					});
				}
			},
			dataProvider: 'qtoFormulaGonimeterDataService'
		};
	};
	angular.module('qto.formula').directive('qtoFormulaGonimeterLookup', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			var defaults = globals.lookups.gonimeter($injector);

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}
	]);
})(angular, globals);