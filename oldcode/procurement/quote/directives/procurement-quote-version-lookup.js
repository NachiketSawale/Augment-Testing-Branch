/**
 * Created by lst on 1/18/2017.
 */
(function (angular, globals) {
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name scheduling-main-activity-parent-lookup
	 * @requires  schedulingMainService
	 * @description ComboBox to select a activity
	 */
	var moduleName = 'procurement.quote';

	globals.lookups.procurementQtnVersionLookType = function procurementQtnVersionLookType($injector) {
		var procurementQuoteCreateChangeContractColumnDef = $injector.get('procurementQuoteCreateChangeContractColumnDef');
		return {
			lookupOptions: {
				lookupType: 'procurementqtnversionlooktype',
				valueMember: 'Id',
				displayMember: 'QuoteVersion',
				uuid: '9999830140a1423981fea25c98b3941a',
				columns: angular.copy(procurementQuoteCreateChangeContractColumnDef.getStandardConfigForListView().columns)
			},
			dataProvider: 'procurementQuoteCreateContractWizardService'
		};
	};

	angular.module(moduleName).directive('procurementQuoteVersionLookup', [
		'$injector',
		'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector,
			BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.procurementQtnVersionLookType($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit',
				defaults.lookupOptions, {
					dataProvider: defaults.dataProvider
				});
		}
	]);

})(angular, globals);