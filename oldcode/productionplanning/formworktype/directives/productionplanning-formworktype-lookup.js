/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.formworktype';
	angular.module(moduleName).directive('productionplanningFormworktypeLookup', Lookup);

	Lookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function Lookup(BasicsLookupdataLookupDirectiveDefinition) {
		var defaults = {
			version: 3,
			lookupType: 'FormworkType',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated'
			//disableDataCaching: true
		};

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);

	}
})(angular);
