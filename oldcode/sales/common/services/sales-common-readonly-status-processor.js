/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name salesCommonReadonlyStatusProcessor
	 * @function
	 *
	 * @description
	 * The salesCommonReadonlyStatusProcessor sets the readonly status of the properties by the current status of the entity.
	 */

	angular.module('sales.common').factory('salesCommonReadonlyStatusProcessor', ['_', '$log', 'basicsCommonReadOnlyProcessor', '$injector',
		function (_, $log, basicsCommonReadOnlyProcessor, $injector) {

			return function (options) {
				var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				var statusDataService = $injector.get(options.statusDataServiceName);
				var statusList = statusDataService.getListSync({lookupType: options.statusDataServiceName});
				var statusField = options.statusField;

				if (_.size(statusList) === 0) {
					$log.warn('salesCommonReadonlyStatusProcessor: ' + options.statusDataServiceName + '-> statusList is empty!');
				}
				var service = basicsCommonReadOnlyProcessor.createReadOnlyProcessor(options);

				service.handlerItemReadOnlyStatus = function (item) {
					// FIXME: see #101568, try to solve here the issue temporary
					if (_.size(statusList) === 0) {
						statusList = statusDataService.getListSync({lookupType: options.statusDataServiceName});
					}

					var isReadOnly = _.get(_.find(statusList, {Id: item[statusField]}), 'IsReadOnly');
					item.IsReadonlyStatus = isReadOnly; // use by document upload service (see #107271)
					service.setRowReadOnly(item, isReadOnly);
					platformRuntimeDataService.readonly(item, isReadOnly); // make sure entityReadonly flag is set
				};
				_.extend(this, service);
			};
		}]);
})(angular);