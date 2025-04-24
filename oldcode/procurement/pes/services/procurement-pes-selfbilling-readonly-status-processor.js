/**
 * Created by lsi on 7/16/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/**
	 * @ngdoc service
	 * @name procurementPesSelfbillingReadonlyStatusProcessor
	 * @function
	 *
	 * @description
	 * The procurementPesSelfbillingReadonlyStatusProcessor sets the readonly status of the properties by the current status of the entity.
	 */
	angular.module('procurement.pes').factory('procurementPesSelfbillingReadonlyStatusProcessor', ['basicsCommonReadOnlyProcessor', 'basicsLookupdataSimpleLookupService',
		'procurementPesHeaderService',
		function (basicsCommonReadOnlyProcessor, basicsLookupdataSimpleLookupService, procurementPesHeaderService) {
			return function (options) {
				var statusList = basicsLookupdataSimpleLookupService.getList({
					displayMember: 'Description',
					lookupModuleQualifier: 'prc.sbhstatus',
					valueMember: 'Id',
					filter: {
						customBoolProperty: 'READ_ONLY'
					}
				});
				var service = basicsCommonReadOnlyProcessor.createReadOnlyProcessor(options);
				service.handlerItemReadOnlyStatus = function (item) {
					var headerSelectedItem = procurementPesHeaderService.getSelected();
					var pesHeaderIsReadonly = procurementPesHeaderService.validateItemIsReadOnly(headerSelectedItem);
					var statusItem = _.find(statusList.$$state.value, {Id: item[options.statusField]});
					var isReadOnly = pesHeaderIsReadonly || _.get(statusItem,'ReadOnly');
					service.setRowReadOnly(item, isReadOnly);
				};
				return service;
				// _.extend(this, service);
			};
		}]);
})(angular);
