/**
 * Created by chm on 8/12/2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.common.basicsCommonReadOnlyProcessorExtension
	 * @description
	 * # A processor service to deal with readonly logic for entity.
	 *
	 */
	angular.module('basics.common').factory('basicsCommonReadOnlyProcessorExtension', ['platformRuntimeDataService', '_', function (platformRuntimeDataService, _) {
		/**
		 * A processor dealing with readonly logic. If the entity item is new created, it's editable. otherwise, the specified fields in the entity is readonly.
		 *
		 * @private
		 * @param {Array} fields A list of fields of a entity item.
		 * @returns {function} Returns the processor handler.
		 */
		return function (fields) {
			const self = this;
			self.processItem = function processItem(item) {
				const entityFields = [];
				if (item.Version === 0) {
					_.forEach(fields, function (field) {
						entityFields.push({field: field, readonly: false});
					});

					platformRuntimeDataService.readonly(item, entityFields);
				} else {
					_.forEach(fields, function (field) {
						entityFields.push({field: field, readonly: true});
					});

					platformRuntimeDataService.readonly(item, entityFields);
				}
			};
		};
	}]);
})(angular);