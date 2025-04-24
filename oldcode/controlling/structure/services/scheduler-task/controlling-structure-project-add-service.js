(function () {
	'use strict';

	let moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructureProjectAddService', ['globals','_','$injector','basicsLookupdataLookupViewService',
		function (globals,_,$injector,basicsLookupdataLookupViewService) {

			let service = {};

			service.showDialog = function() {

				let lookupConfig = globals.lookups.PrcProject($injector).lookupOptions;

				basicsLookupdataLookupViewService.showDialog (lookupConfig).then (function (result) {
					if (result.isOk && result.data) {
						$injector.get('controllingStructureProjectDataService').createItem(result.data);
					}
				}
				);
			};

			return service;

		}]);
})();
