(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.profile = function profile($injector) {
		var q = $injector.get('$q');
		var _ = $injector.get('_');

		return {
			lookupOptions: {
				lookupType: 'Profile',
				valueMember: 'Id',
				displayMember: 'Description',
				disableDataCaching: true
			},
			dataProvider: {

				getList: function (lookupOptions) {
					return q.when(lookupOptions.getList());
				},

				getItemByKey: function (value, lookupOptions) {
					var res = _.find(lookupOptions.getList(),function(item){
						return item.Id === value;
					});
					return q.when(res);
				}
			}
		};
	};

	angular.module(moduleName).directive('printItemBoqSettingCustomDialog',
		['$injector', 'BasicsLookupdataLookupDirectiveDefinition',

			function ($injector, BasicsLookupdataLookupDirectiveDefinition) {

				var defaults = globals.lookups.profile($injector);
				return new BasicsLookupdataLookupDirectiveDefinition('custom-dialog',
					defaults.lookupOptions, {
						dataProvider: defaults.dataProvider
					});
			}
		]);
})(angular, globals);
