/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular, globals) {
	/* global globals */
	'use strict';
	let moduleName = 'basics.textmodules';

	globals.lookups.textModule = function textModule() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'textmodule',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100,name$tr$: 'cloud.common.entityCode' },
					{ id: 'Description', field: 'DescriptionInfo.Translated', name: 'Description', width: 150,name$tr$: 'cloud.common.entityDescription' }
				],
				pageOptions: {
					enabled: true
				}
			}
		};
	};

	angular.module(moduleName).directive('basicsTextModuleLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.textModule().lookupOptions);
		}]);

})(angular, globals);
