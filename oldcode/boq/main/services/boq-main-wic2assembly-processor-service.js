/**
 * Created by mov on 4/21/2017.
 */
/* global _ */

(function (angular) {
	'use strict';
	var moduleName = 'boq.main';
	/**
	 * @ngdoc service
	 * @name boqMainWic2AssemblyProcessorService
	 * @function
	 * @requires platformRuntimeDataService, basicsLookupdataLookupDescriptorService, boqMainService
	 *
	 * @description
	 * boqMainWic2AssemblyProcessorService is the service to set assembly assignments records readonly or editable.
	 *
	 */
	angular.module(moduleName).factory('boqMainWic2AssemblyProcessorService',
		['platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'boqMainService',
			function (platformRuntimeDataService, basicsLookupdataLookupDescriptorService, boqMainService) {

				var service = {};

				angular.extend(service, {
					processItem: processItem
				});

				function processItem(item) {
					if (item && item.Id) {
						if (!boqMainService.isWicBoq()) {
							readOnly(item, true);
						}

						if (item.EstLineItemFk && _.isEmpty(item.EstAssemblyCatFk)) {
							var assemblyLookupItem = basicsLookupdataLookupDescriptorService.getLookupItem('estassemblyfk', item.EstLineItemFk);
							if (!_.isEmpty(assemblyLookupItem)) {
								item.EstAssemblyCatFk = assemblyLookupItem.EstAssemblyCatFk;
							}
						}
					}
				}

				function readOnly(item, isReadOnly) {
					var fields = [];
					_.forOwn(item, function (value, key) {
						var field = {field: key, readonly: isReadOnly};
						fields.push(field);
					});
					platformRuntimeDataService.readonly(item, fields);
				}

				return service;
			}]);
})(angular);
