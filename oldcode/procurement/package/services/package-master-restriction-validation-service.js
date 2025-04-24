(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */


	var moduleName = 'procurement.package';
	angular.module(moduleName).service('prcPackageMasterRestrictionValidationService', [
		'basicsLookupdataLookupDescriptorService',
		'prcPackageMasterRestrictionDataService',
		'_', 'platformRuntimeDataService',
		function(
			basicsLookupdataLookupDescriptorService,
			dataService,
			_, platformRuntimeDataService
		) {
			var self = this;

			self.validateCopyType = function validateCopyType(entity, value) {
				dataService.setReadonlyBaseCopyType(entity, value);
				if (entity.CopyType !== value) {
					entity.PrjProjectFk = null;
					entity.PrjBoqFk = null;
					entity.MdcMaterialCatalogFk = null;
					entity.PrcPackageBoqFk = null;
					entity.BoqHeaderFk = null;
					entity.ConHeaderFk = null;
					entity.ConBoqHeaderFk = null;
					entity.BoqItemFk = null;
					entity.PackageBoqHeaderFk = null;
					entity.BoqWicCatFk = null;
				}
				return true;
			};

			self.validateBoqItemFk = function validateBoqItemFk(entity, value) {
				var boqWicCatBoqs = basicsLookupdataLookupDescriptorService.getData('procurementCommonWicBoqLookupService');
				var selBoqWicCatBoq;
				if (value) {
					if (boqWicCatBoqs) {
						selBoqWicCatBoq = _.find(boqWicCatBoqs, {Id: value});
						if (selBoqWicCatBoq !== undefined) {
							entity.BoqHeaderFk = selBoqWicCatBoq.BoqHeaderFk;
						}
					}
				}
				else {
					entity.BoqHeaderFk = null;
				}
				return true;
			};

			self.validateBoqWicCatFk = function validateBoqWicCatFk(entity) {
				entity.BoqItemFk = null;
				entity.BoqHeaderFk = null;
				return true;
			};

			self.validatePrjProjectFk = function validateBoqWicCatFk(entity) {
				entity.PrjBoqFk = null;
				return true;
			};

			self.validatePrcPackageBoqFk = function validateBoqWicCatFk(entity) {
				entity.BoqHeaderFk = null;
				entity.PackageBoqHeaderFk = null;
				return true;
			};

			self.validateConHeaderFk = function validateConHeaderBoqFk(entity, value) {
				entity.BoqHeaderFk = null;
				entity.ConBoqHeaderFk = null;
				platformRuntimeDataService.readonly(entity, [{field: 'ConBoqHeaderFk', readonly: (!value || value.length < 1)}]);
				return true;
			};

			self.validateConBoqHeaderFk = function validateConBoqHeaderFk(entity, value) {
				entity.BoqHeaderFk = value;
			};

			self.validatePackageBoqHeaderFk = function validatePackageBoqHeaderFk(entity, value) {
				entity.BoqHeaderFk = value;
			};
		}
	]);
})();