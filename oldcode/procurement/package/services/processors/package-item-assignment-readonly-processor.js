/**
 * Created by chi on 6/28/2018.
 */
(function(angular){
	'use strict';
	/* global _ */
	var moduleName = 'procurement.package';

	angular.module(moduleName).factory('procurementPackageItemAssignmentReadonlyProcessor', procurementPackageItemAssignmentReadonlyProcessor);

	procurementPackageItemAssignmentReadonlyProcessor.$inject = ['platformRuntimeDataService', 'procurementPackageDataService', 'basicsLookupdataLookupDescriptorService'];

	function procurementPackageItemAssignmentReadonlyProcessor(platformRuntimeDataService, procurementPackageDataService, basicsLookupdataLookupDescriptorService) {
		var service = {};

		service.processItem = processItem;
		service.setReadonly = setReadonly;

		return service;

		// ///////////////////////////////
		function processItem(item) {
			if (!item) {
				return;
			}

			for (var prop in item) {
				// eslint-disable-next-line no-prototype-builtins
				if (item.hasOwnProperty(prop)) {
					setReadonly(item, prop, true);
				}
			}
		}

		function isProtectContractedPackage(item) {
			var isProtectContractedPackageItemAssignment = procurementPackageDataService.isProtectContractedPackageItemAssignment();
			if (isProtectContractedPackageItemAssignment && item && item.Version > 0) {
				if (item.IsContracted) {
					return true;
				}
				var parentItem = procurementPackageDataService.getSelected();
				if (parentItem) {
					var pakStatus = basicsLookupdataLookupDescriptorService.getData('PackageStatus');
					var status = _.find(pakStatus, {Id: parentItem.PackageStatusFk});
					if (status) {
						return status.IsContracted;
					}
				}
			}
			return false;
		}

		function setReadonly(item, field, flag) {
			var fields = [];
			var isProtest;
			switch (field) {
				case 'EstHeaderFk':
					isProtest = isProtectContractedPackage(item);
					flag = isProtest || false;
					break;
				case 'EstLineItemFk':
					isProtest = isProtectContractedPackage(item);
					flag = isProtest || item.EstHeaderFk === -1 || item.EstHeaderFk === 0;
					break;
				case 'BoqItemFk':
					flag = item.PrcItemFk > 0;
					break;
				case 'EstResourceFk':
					isProtest = isProtectContractedPackage(item);
					flag = isProtest || item.EstHeaderFk === -1 || item.EstHeaderFk === 0 || item.EstLineItemFk === -1 || item.EstLineItemFk === 0;
					break;
				case 'PrcItemFk':
					flag = item.BoqItemFk > 0;
					break;
				default:
					flag = !!flag;
					break;
			}

			fields.push({field: field, readonly: flag});
			platformRuntimeDataService.readonly(item, fields);
		}
	}
})(angular);