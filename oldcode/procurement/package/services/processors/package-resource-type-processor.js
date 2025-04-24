/**
 * Created by mack on 4/21/2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';


	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc service
	 * @name packageResourceTypeProcessor
	 * @function
	 * @description
	 * The service to set resources type and css style and fields readonly.
	 *
	 */
	angular.module(moduleName).factory('packageResourceTypeProcessor', ['$injector', 'platformRuntimeDataService',
		function ($injector, platformRuntimeDataService) {
			return {
				processItem: processItem
			};

			function processItem(resource) {
				if (resource) {
					resource.EstResourceTypeFkExtend = resource.EstAssemblyTypeFk ? (4000 + resource.EstAssemblyTypeFk) : resource.EstResourceTypeFk;
				}

				var lineItemDataService = $injector.get('procurementPackageEstimateLineItemDataService');
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