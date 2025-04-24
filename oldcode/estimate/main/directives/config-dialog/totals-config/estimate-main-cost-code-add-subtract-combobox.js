/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainCostCodeAddSubtractCombobox
	 * @requires
	 * @description dropdown lookup grid to select the DirectCost item
	 */

	angular.module(moduleName).directive('estimateMainCostCodeAddSubtractCombobox',[
		'$http', '$q', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($http, $q, BasicsLookupdataLookupDirectiveDefinition) {

			let defaults = {
				lookupType: 'getaddsubtracts',
				valueMember: 'Id',
				displayMember: 'ShortKeyInfo.Translated',
				uuid: '6dbacbf6d9b846de9b19a5dd9b6d7db8',
				columns:[
					{ id: 'id', field: 'ShortKeyInfo.Translated', name: '+/-',toolTip: '+/-', formatter: 'code'},
					{ id: 'Description', field: 'DescriptionInfo.Translated', name: 'Description', toolTip: 'Description', formatter: 'description' }
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: 'estimateMainEstCostcodeAddSubtractComboboxService'
			});
		}]);
})(angular);

