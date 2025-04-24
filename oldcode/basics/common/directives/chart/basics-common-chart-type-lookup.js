(function (){
	'use strict';

	let moduleName = 'basics.common';
	angular.module(moduleName).directive('basicsCommonChartTypeLookup', [
		'_','$q','$translate', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $q, $translate, BasicsLookupdataLookupDirectiveDefinition){
			let defaults = {
				lookupType: 'basicsCommonChartTypeLookup',
				valueMember: 'id',
				displayMember: 'description',
				uuid: '04e6bbd4934642be827F8c167470d50d'
				// filterKey: 'boqMainGaebExtensionsByFormat'
			};

			// TODO: need to get this list from DB dynamic
			let chartTypes  = [
				{id: 1,  description: $translate.instant('basics.common.chartType.lineChart')},
				{id: 2,  description: $translate.instant('basics.common.chartType.barChart')}
			];

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: function () {

						return $q.when(chartTypes, null, null, null);
					},

					getItemByKey: function (value) {

						return $q.when(_.find(chartTypes, {id:value}), null, null, null);
					}
				}
			});
		}
	]);

})();