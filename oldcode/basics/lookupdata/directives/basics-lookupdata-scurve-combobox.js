/**
 * Created by wui on 11/23/2016.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataScurveCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataLookupFilterService',
		function (BasicsLookupdataLookupDirectiveDefinition,lookupFilterService) {
			var filter = {
				key: 'basics-scurve-lookup-filter',
				serverSide: true,
				fn: function () {
					return 'sorting >' + 0;
				}
			};


			var defaults = {
				lookupType: 'Scurve',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				filterKey: filter.key
			};

			init();

			function init(){
				lookupFilterService.registerFilter(filter);
			}

			var customConf = {
				controller: ['$scope', function ($scope) {
					if(!lookupFilterService.hasFilter(filter.key)){
						init();
					}
					$scope.$on('$destroy', function (data) {
						if( data&& data.currentScope && data.currentScope.$$destroyed){
							if(lookupFilterService.hasFilter(filter.key)){
								lookupFilterService.unregisterFilter(filter);
							}
						}
					});
				}]
			};


			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults,customConf);
		}
	]);

})(angular);