/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainCostRiskLookup',[
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				lookupType: 'CostRiskSchema',
				valueMember: 'Id',
				displayMember: 'Description',
				isDataUpdatedPopup: true,
				showClearButton: true,
				uuid: '40e69bf8d8d548e0a85f356cf171db41',
				columns:[
					{ id: 'Description', field: 'Description', name: 'Description', width: 300, formatter:'description',  name$tr$: 'cloud.common.entityDescription'}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit',defaults,{
				dataProvider: 'estimateMainCostRiskDataService'
			});

		}
	]);
})(angular);
