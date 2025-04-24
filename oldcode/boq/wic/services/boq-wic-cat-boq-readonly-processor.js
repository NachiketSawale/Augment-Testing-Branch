/**
 * Created by bh on 07.11.2017.
 */
(function (angular) {
	/* global _ */
	'use strict';
	/**
	 * @ngdoc service
	 * @name boqWicCatBoqReadonlyProcessor
	 * @function
	 *
	 * @description
	 * The boqWicBoqReadonlyProcessor adds runtime data information concerning the readonly status of the properties for WicBoqComposite items.
	 */

	angular.module('boq.wic').factory('boqWicCatBoqReadonlyProcessor', ['platformRuntimeDataService', 'boqWicCatBoqStandardConfigurationService', function (platformRuntimeDataService, boqWicCatBoqStandardConfigurationService) {

		var service = {};

		var allFields = boqWicCatBoqStandardConfigurationService.getAllFields();

		service.getReadOnlyFieldsForItem = function getReadOnlyFieldsForItem(wicBoqComposite, data) {
			// Check if we have a valid boqCompositeItem
			if (!(wicBoqComposite && angular.isDefined(wicBoqComposite.BoqRootItem))) {
				return null;
			}

			var readOnlyFields = null;

			if (data && data.readOnly) {
				// In this case the underlying data service is set to readonly
				// -> all fields are readonly
				readOnlyFields = allFields;
			}
			else if (data.isFrameworkWicBoq(wicBoqComposite)) {
				// When having a framework wic boq we only allow changes to the wic type property
				readOnlyFields = _.without(allFields, 'WicBoq.MdcWicTypeFk');
			}

			return readOnlyFields;
		};

		function maintainReadonlyForFields(fields, isReadonly, wicBoqComposite) {

			var fieldsMap = _.map(fields, function (field) {
				return {field: field, readonly: isReadonly};
			});

			platformRuntimeDataService.readonly(wicBoqComposite, fieldsMap);
		}

		service.processItem = function processItem(wicBoqComposite, data) {

			if (!(wicBoqComposite && angular.isDefined(wicBoqComposite.BoqRootItem))) {
				return;
			}

			var readOnlyFields = service.getReadOnlyFieldsForItem(wicBoqComposite, data);

			if (angular.isDefined(readOnlyFields) && (readOnlyFields !== null)) {
				maintainReadonlyForFields(readOnlyFields, true, wicBoqComposite);
			}
			else {
				maintainReadonlyForFields(allFields, false, wicBoqComposite);
			}
		};

		service.isFieldEditable = function isFieldEditable(wicBoqComposite, field, data) {
			var isEditable = false;

			var readOnlyFields = service.getReadOnlyFieldsForItem(wicBoqComposite, data);

			if (!_.isArray(readOnlyFields) || readOnlyFields.indexOf(field) === -1) {
				isEditable = true;
			}

			return isEditable;
		};

		return service;

	}]);
})(angular);