/**
 * Created by bh on 21.09.2016.
 */
(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	'use strict';
	/**
	 * @ngdoc service
	 * @name prcCommonBoqReadonlyProcessor
	 * @function
	 *
	 * @description
	 * The prcCommonBoqReadonlyProcessor adds runtime data information concerning the readonly status of the properties for prcBoqExtended items.
	 */

	angular.module('procurement.common').factory('prcCommonBoqReadonlyProcessor', [ 'platformRuntimeDataService', function (platformRuntimeDataService) {

		var service = {};

		service.getReadOnlyFieldsForItem = function getReadOnlyFieldsForItem(prcBoqExtended) {
			// Check if we have a valid boqCompositeItem
			if (!(prcBoqExtended && angular.isDefined(prcBoqExtended.BoqRootItem))) {
				return null;
			}

			// Then we add the fields, that are generally set to readonly
			return [ 'BoqRootItem.Reference', 'BoqRootItem.BriefInfo', 'BoqRootItem.Finalprice','BoqRootItem.FinalpriceOc', 'BoqHeader.BasCurrencyFk', 'PrcBoq.PackageFk', 'PrcStructureFk', 'BoqRootItem.Vat', 'BoqRootItem.VatOc', 'BoqRootItem.Finalgross', 'BoqRootItem.FinalgrossOc', 'Vat', 'VatOc', 'Finalgross', 'FinalgrossOc'];
		};

		service.processItem = function processItem(prcBoqExtended) {

			if (!(prcBoqExtended && angular.isDefined(prcBoqExtended.BoqRootItem))) {
				return;
			}

			var readOnlyFields = service.getReadOnlyFieldsForItem(prcBoqExtended);

			if (angular.isDefined(readOnlyFields) && (readOnlyFields !== null)) {

				var fields = _.map(readOnlyFields, function(field) {return {field: field, readonly: true};});
				platformRuntimeDataService.readonly(prcBoqExtended, fields);
			}
		};

		service.isFieldEditable = function isFieldEditable(prcBoqExtended, field) {
			var isEditable = false;

			var readOnlyFields = service.getReadOnlyFieldsForItem(prcBoqExtended);

			if (angular.isDefined(readOnlyFields) && (readOnlyFields !== null) && readOnlyFields.indexOf(field/* .toLowerCase() */) === -1) {
				isEditable = true;
			}

			return isEditable;
		};

		return service;

	}]);
})(angular);