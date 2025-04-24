(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.deviationReference = function deviationReference($injector) {
		var q = $injector.get('$q');
		var _ = $injector.get('_');
		var basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
		var procurementPriceComparisonCommonService = $injector.get('procurementPriceComparisonCommonService');

		var options = [];
		var qtnReference = procurementPriceComparisonCommonService.qtnReference;

		return {
			lookupOptions: {
				lookupType: 'DeviationReference',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			},
			dataProvider: {
				getList: function () {
					var defer = q.defer();
					basicsLookupdataLookupDescriptorService.loadData('PrcItemEvaluation').then(function (data) {
						options = angular.copy(data);
						options.push(qtnReference);
						defer.resolve(options);
					});
					return defer.promise;
				},
				getItemByKey: function (key) {
					var defer = q.defer();
					basicsLookupdataLookupDescriptorService.loadData('PrcItemEvaluation').then(function (data) {
						options = angular.copy(data);
						options.push(qtnReference);
						var option = _.find(options, {Id: key});
						defer.resolve(option);
					});
					return defer.promise;
				}
			}
		};
	};

	angular.module(moduleName).directive('deviationReferenceCombobox', [
		'$injector','BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = globals.lookups.deviationReference($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit',
				defaults.lookupOptions, {
					dataProvider: defaults.dataProvider
				});
		}
	]);
})(angular, globals);