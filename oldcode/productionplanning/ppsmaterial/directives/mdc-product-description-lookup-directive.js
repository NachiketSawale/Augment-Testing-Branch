(function () {
	'use strict';
	/*global angular*/

	let module = angular.module('productionplanning.ppsmaterial');
	module.directive('materialProductDescriptionLookup', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition){
			var defaults = {
				lookupType: 'MDCProductDescriptionTiny',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'a0e639626ce64945a0235f9035c4784d',
				version: 3,
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: '*Code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'desc',
						field: 'DescriptionInfo.Translated',
						name: 'DescriptionInfo',
						name$tr$: 'cloud.common.entityDescription'
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})();