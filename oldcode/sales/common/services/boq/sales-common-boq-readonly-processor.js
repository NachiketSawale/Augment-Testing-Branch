/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name salesCommonBoqReadonlyProcessor
	 * @function
	 *
	 * @description
	 * The salesCommonBoqReadonlyProcessor adds runtime data information concerning the readonly status of the properties for boqCompositeItems.
	 */

	angular.module('sales.common').factory('salesCommonBoqReadonlyProcessor', ['_', 'platformRuntimeDataService', function (_, platformRuntimeDataService) {

		var service = {};

		service.getReadOnlyFieldsForItem = function getReadOnlyFieldsForItem(boqCompositeItem, data) {
			// Check if we have a valid boqCompositeItem
			if (!(boqCompositeItem && angular.isDefined(boqCompositeItem.BoqRootItem))) {
				return null;
			}

			// Then we add the fields, that are generally set to readonly
			var readOnlyFields = [ 'BoqRootItem.Finalprice', 'BoqRootItem.Finalgross', 'BoqRootItem.InsertedAt', 'BoqRootItem.InsertedBy', 'BoqRootItem.UpdatedAt', 'BoqRootItem.UpdatedBy', 'BoqHeader.IsGCBoq'];

			if(data && data.readOnly) {
				// The calling data service is set readonly.
				// Add the remaining fields of the composite entity to be read only too.
				readOnlyFields = readOnlyFields.concat(['BoqRootItem.Reference', 'BoqRootItem.ExternalCode', 'BoqRootItem.BriefInfo', 'BoqHeader.BasCurrencyFk']);
			}

			return readOnlyFields;
		};

		service.processItem = function processItem(boqCompositeItem, data) {

			if (!(boqCompositeItem && angular.isDefined(boqCompositeItem.BoqRootItem))) {
				return;
			}

			var readOnlyFields = service.getReadOnlyFieldsForItem(boqCompositeItem, data);

			if (angular.isDefined(readOnlyFields) && (readOnlyFields !== null)) {

				var fields = _.map(readOnlyFields, function(field) {return {field: field, readonly: true};});
				platformRuntimeDataService.readonly(boqCompositeItem, fields);
			}
		};

		service.isFieldEditable = function isFieldEditable(boqCompositeItem, field) {
			var isEditable = false;

			var readOnlyFields = service.getReadOnlyFieldsForItem(boqCompositeItem);

			if (angular.isDefined(readOnlyFields) && (readOnlyFields !== null) && readOnlyFields.indexOf(field/* .toLowerCase() */) === -1) {
				isEditable = true;
			}

			return isEditable;
		};

		return service;

	}]);
})(angular);
