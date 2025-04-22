/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc service
	 * @name salesWipResourceTypeProcessor
	 * @function
	 * @description
	 * The service to set resources type and css style and fields readonly.
	 *
	 */
	angular.module(moduleName).factory('salesWipResourceTypeProcessor', ['_', '$injector', 'platformRuntimeDataService',
		function (_, $injector, platformRuntimeDataService) {
			return {
				processItem: processItem
			};

			function processItem(resource) {
				if (resource) {
					resource.EstResourceTypeFkExtend = resource.EstAssemblyTypeFk ? (4000 + resource.EstAssemblyTypeFk) : resource.EstResourceTypeFk;
				}

				var lineItemDataService = $injector.get('salesWipEstimateLineItemDataService');
				if (lineItemDataService.hasSelection()) {
					var selectedLineItem = lineItemDataService.getSelected();

					// if line item's EstLineItemFk has value, set all resources fileds readonly and a gray background css style
					// because the resources from the EstLineItemFk.
					if (selectedLineItem.EstLineItemFk > 0) {
						resource.cssClass = 'row-readonly-background';
						readOnly([resource], true);
					} else {
						if (resource.cssClass === 'row-readonly-background') {
							resource.cssClass = '';
						}
					}
				}
			}

			function readOnly(items, isReadOnly) {
				var fields = [],
					item = _.isArray(items) ? items[0] : null;

				_.forOwn(item, function (value, key) {
					var field = {field: key, readonly: isReadOnly};
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
