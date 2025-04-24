/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	/**
	 * @ngdoc service
	 * @name projectCostCodesPriceListForJobProcessor
	 * @function
	 * @description
	 * The service to set css style and fields readonly.
	 */
	angular.module(moduleName).factory('projectCostCodesPriceListForJobProcessor', ['$injector', 'platformRuntimeDataService', '_',
		function ($injector, platformRuntimeDataService, _) {
			return {
				processItem: processItem
			};

			function processItem(resource) {
				if (!resource.LgmJobFk) {
					// if LgmJobFk is undefined, set all resources fields readonly and a gray background css style
					resource.cssClass = 'row-readonly-background';
					readOnly([resource], true);
				}
			}

			function readOnly(items, isReadOnly) {
				let fields = [];
				let item = _.isArray(items) ? items[0] : null;
				_.forOwn(item, function (value, key) {
					let field = {field: key, readonly: isReadOnly};
					fields.push(field);
				});
				angular.forEach(items, function (resItem) {
					if (resItem && resItem.Id) {
						platformRuntimeDataService.readonly(resItem, fields);
					}
				});
			}
		}
	]);
})(angular);