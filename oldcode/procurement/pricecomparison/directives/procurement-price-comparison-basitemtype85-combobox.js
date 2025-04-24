/**
 * Created by clv on 10/14/2018.
 */
(function(angular){

	'use strict';
	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).directive('procurementPriceComparisonBasicsitemtype85Combobox', priceComparisonBasicsitemtype85Combobox);
	priceComparisonBasicsitemtype85Combobox.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];
	function priceComparisonBasicsitemtype85Combobox(LookupdataLookupDirectiveDefinition){
		var defaults = {
			version:3,
			lookupType: 'PrcItemType85',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated'
		};

		return new LookupdataLookupDirectiveDefinition('combobox-edit', defaults);

	}
})(angular);
