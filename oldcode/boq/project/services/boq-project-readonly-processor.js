/**
 * Created by bh on 21.09.2016.
 */
(function (angular) {
	/* global _ */
	'use strict';
	/**
	 * @ngdoc service
	 * @name boqProjectReadonlyProcessor
	 * @function
	 *
	 * @description
	 * The boqProjectReadonlyProcessor adds runtime data information concerning the readonly status of the properties for boqCompositeItems depending on there type.
	 */

	angular.module('boq.project').factory('boqProjectReadonlyProcessor', ['platformRuntimeDataService', function (platformRuntimeDataService) {

		var service = {};

		service.getReadOnlyFieldsForItem = function getReadOnlyFieldsForItem(boqCompositeItem) {
			// Check if we have a valid boqCompositeItem
			if (!(boqCompositeItem && angular.isDefined(boqCompositeItem.BoqRootItem))) {
				return null;
			}

			// Then we add the fields, that are generally set to readonly
			var readOnlyFields = ['BoqRootItem.Finalprice', 'BoqRootItem.Finalgross', 'BoqRootItem.InsertedAt', 'BoqRootItem.InsertedBy', 'BoqRootItem.UpdatedAt', 'BoqRootItem.UpdatedBy'];

			if (boqCompositeItem && _.isObject(boqCompositeItem.BoqHeader) && boqCompositeItem.BoqHeader.IsReadOnly) {
				readOnlyFields.push('BoqRootItem.BriefInfo');
				readOnlyFields.push('BoqHeader.IsGCBoq');
			}

			return readOnlyFields;
		};

		service.processItem = function processItem(boqCompositeItem) {

			if (!(boqCompositeItem && angular.isDefined(boqCompositeItem.BoqRootItem))) {
				return;
			}

			var readOnlyFields = service.getReadOnlyFieldsForItem(boqCompositeItem);

			if (angular.isDefined(readOnlyFields) && (readOnlyFields !== null)) {

				var fields = _.map(readOnlyFields, function (field) {
					return {field: field, readonly: true};
				});
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