(function () {
	'use strict';
	/*global angular*/

	let module = angular.module('productionplanning.strandpattern');
	module.directive('productionplanningStrandpatternLookup', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition){
			var defaults = {
				lookupType: 'PpsStrandPattern',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '97145b37867a4298abf9cfa843c31ccc',
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
						id: 'cadCode',
						field: 'CadCode',
						name: '*Cad Code',
						width: 100,
						name$tr$: 'productionplanning.strandpattern.CadCode'
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})();