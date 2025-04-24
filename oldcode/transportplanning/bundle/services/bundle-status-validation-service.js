/**
 * Created by waz on 9/20/2017.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name transportplanningBundleStatusValidationService
	 * @description
	 * Aservice to validate bundle status
	 *
	 */
	var moduleName = 'transportplanning.bundle';
	StatusValidationService.$inject = ['basicsLookupdataLookupDescriptorService','ppsCommonTransportInfoHelperService'];
	angular.module(moduleName).factory('transportplanningBundleStatusValidationService', StatusValidationService);


	function StatusValidationService(basicsLookupdataLookupDescriptorService, ppsCommonTransportInfoHelperService) {
		var service = {
			isPackageInPackaging: isPackageInPackaging,
			isTrsRequisitionAccepted: isTrsRequisitionAccepted,
			isParentTrsRequisitionAccepted: ppsCommonTransportInfoHelperService.isTrsRequisitionAccepted,
			isBundleModifyable: isBundleModifyable,
			isBundlesModifyable: isBundlesModifyable,
			isBundleDeleteable: isBundleDeleteable
		};

		function isPackageInPackaging(packageItem) {
			var statusId = packageItem.TrsPkgStatusFk;
			var status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsPackageStatus', statusId);
			return !status || status.Isinpackaging;
		}

		function isTrsRequisitionAccepted(requisitionItem) {
			var statusId = requisitionItem.TrsReqStatusFk;
			var status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRequisitionStatus', statusId);
			return status && status.IsAccepted;
		}

		function isBundleModifyable(item) {
			return item && !service.isParentTrsRequisitionAccepted(item);
		}

		function isBundlesModifyable(bundles) {
			if (bundles.length === 0) {
				return false;
			}

			return _.reduce(bundles, function (isModyiable, bundle) {
				return isModyiable && isBundleModifyable(bundle);
			}, true);
		}

		function isBundleDeleteable(item) {
			return item.TrsRequisitionFk === null;
		}

		return service;
	}

})(angular);