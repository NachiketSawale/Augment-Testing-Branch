/**
 * Created by lst on 9/16/2019.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.package';

	globals.lookups.packageBaselinePhaseLookup = function packageBaselinePhaseLookup($injector) {

		var q = $injector.get('$q');
		var _ = $injector.get('_');
		var translate = $injector.get('$translate');

		var allIsTranslated = false;
		var options = [
			{Id: 0, Description: 'Inquiry', IsTranslated: false, DescriptionTr: 'procurement.package.baselinePhaseValues.inquiry'},
			{Id: 1, Description: 'Award', IsTranslated: false, DescriptionTr: 'procurement.package.baselinePhaseValues.award'},
			{Id: 2, Description: 'Contract', IsTranslated: false, DescriptionTr: 'procurement.package.baselinePhaseValues.contract'}
		];

		function translateAllItems(items) {
			angular.forEach(items,function (item) {
				translateItem(item);
			});
			allIsTranslated = true;
		}

		function translateItem(item) {
			if(!item){
				return;
			}
			if(!item.IsTranslated){
				item.Description = translate.instant(item.DescriptionTr);
				item.IsTranslated = true;
			}
		}

		return {
			lookupOptions: {
				lookupType: 'PackageBaselinePhaseLookup',
				valueMember: 'Id',
				displayMember: 'Description',
				disableInput: true
			},
			dataProvider: {
				getList: function () {
					if(!allIsTranslated){
						translateAllItems(options);
					}
					return q.when(options);
				},
				getItemByKey: function (key) {
					var item = _.find(options, {Id: key});
					translateItem(item);
					return q.when(item);
				}
			}
		};
	};

	angular.module(moduleName).directive('procurementPackageBaselinePhaseLookup',
		['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($injector, BasicsLookupdataLookupDirectiveDefinition) {

				var defaults = globals.lookups.packageBaselinePhaseLookup($injector);
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit',
					defaults.lookupOptions, {
						dataProvider: defaults.dataProvider
					});
			}]);
})(angular, globals);