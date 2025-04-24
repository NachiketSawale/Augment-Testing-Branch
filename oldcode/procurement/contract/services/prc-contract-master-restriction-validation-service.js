/**
 * Created by lvy on 12/30/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';
	angular.module(moduleName).service('procurementContractMasterRestrictionValidationService', procurementContractAdvanceValidationService);

	procurementContractAdvanceValidationService.$inject = ['basicsLookupdataLookupDescriptorService',
		'procurementContractMasterRestrictionDataService', '_'];

	function procurementContractAdvanceValidationService(basicsLookupdataLookupDescriptorService, dataService, _) {
		var self = this;// jshint ignore:line

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
			} else {
				entity.BoqHeaderFk = null;
			}
			return true;
		};

		self.validateBoqWicCatFk = function validateBoqWicCatFk(entity) {
			entity.BoqItemFk = null;
			entity.BoqHeaderFk = null;
			return true;
		};

		self.validateConHeaderBoqFk = function validateConHeaderBoqFk(entity) {
			entity.BoqHeaderFk = null;
			entity.ConBoqHeaderFk = null;
			return true;
		};

		self.validateConBoqHeaderFk = function validateConBoqHeaderFk(entity, value) {
			entity.BoqHeaderFk = value;
		};

		self.validateCopyType = function validateCopyType(entity, value) {
			dataService.setReadonlyBaseCopyType(entity, value);
			if (entity.CopyType !== value) {
				entity.ProjectFk = null;
				entity.PrjBoqFk = null;
				entity.MdcMaterialCatalogFk = null;
				entity.PackageFk = null;
				entity.BoqHeaderFk = null;
				entity.ConHeaderBoqFk = null;
				entity.ConBoqHeaderFk = null;
				entity.BoqItemFk = null;
				entity.PackageBoqHeaderFk = null;
				entity.BoqWicCatFk = null;
			}
			return true;
		};

		self.validateProjectFk = function validateBoqWicCatFk(entity) {
			entity.PrjBoqFk = null;
			return true;
		};

		self.validatePackageFk = function validateBoqWicCatFk(entity) {
			entity.BoqHeaderFk = null;
			entity.PackageBoqHeaderFk = null;
			return true;
		};

		self.validatePackageBoqHeaderFk = function validatePackageBoqHeaderFk(entity, value) {
			entity.BoqHeaderFk = value;
		};
	}

})(angular);