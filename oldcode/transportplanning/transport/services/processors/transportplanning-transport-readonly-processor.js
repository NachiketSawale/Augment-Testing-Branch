(function (angular) {
	'use strict';
	/* globals angular, _ */
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportReadOnlyProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * transportplanningTransportReadOnlyProcessor is the service to set fields readonly or editable.
	 *
	 */
	angular.module(moduleName).factory('transportplanningTransportReadOnlyProcessor', processor);

	processor.$inject = [
		'platformRuntimeDataService',
		'transportplanningTransportRouteStatusLookupService'];

	function processor(platformRuntimeDataService, routeStatusServ) {

		function removeFromArray(arr, value) {
			if (!Array.isArray(arr)) {
				console.error("Provided argument is not an array");
				return arr;
			}
			const index = arr.indexOf(value);
			if (index > -1) {
				arr.splice(index, 1); // Removes the item at the found index
			}
			return arr;
		}

		var service = {};

		service.processItem = function processItem(item) {
			var statusList = routeStatusServ.getList();
			var status = _.find(statusList, {Id: item.TrsRteStatusFk});
			var flag = status && status.IsInTransport === true;
			if(status.BackgroundColor) {
				item.BackgroundColor = status.BackgroundColor;
			}

			if (item && item.Version > 0) {
				var routeFields = [];
				_.forEach(item, function (propValue, propName) {
					routeFields.push(propName);
				});

				removeFromArray(routeFields, 'CommentText');
				removeFromArray(routeFields, 'Userdefined1');
				removeFromArray(routeFields, 'Userdefined2');
				removeFromArray(routeFields, 'Userdefined3');
				removeFromArray(routeFields, 'Userdefined4');
				removeFromArray(routeFields, 'Userdefined5');
				removeFromArray(routeFields, 'DriverFk');
				removeFromArray(routeFields, 'TruckFk');
				removeFromArray(routeFields, 'PlannedDeliveryTime');
				service.setColumnsReadOnly(item, routeFields, flag);

			}
			service.setColumnsReadOnly(item, ['BusinessPartnerFk'], !item.JobDefFk);
			service.setColumnsReadOnly(item, ['DeliveryAddressContactFk'], _.isNil(item.BusinessPartnerFk));
			service.setColumnsReadOnly(item, ['PlannedDeliveryDay'], true);

		};

		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			var fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			fields.push({field: 'DateshiftMode', readonly: item.Version > 0});
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}
})(angular);
