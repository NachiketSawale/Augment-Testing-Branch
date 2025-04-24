/**
 * Created by jie on 04/07/2023.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).directive('basicsLookupdataSourceNameLookup',['_','BasicsLookupdataLookupDirectiveDefinition',
		function (_, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'co2sourcename',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				filterOptions: {
					serverSide: false,
					fn: function (item) {
							return item.IsLive;
					}
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);
