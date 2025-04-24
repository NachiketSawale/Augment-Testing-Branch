/**
 * Created by nitsche on 23.02.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEurolistDropService
	 * @function
	 *
	 * @description
	 * This service provides drag and drop for catalog records into plant estimate eurolist container
	 **/
	angular.module(moduleName).service('resourcePlantEstimateEurolistDropService', ResourcePlantEstimateEurolistDropService);

	ResourcePlantEstimateEurolistDropService.$inject = ['_', '$q', 'platformDropServiceFactory',
		'resourcePlantEstimateEquipmentEurolistDataService', 'resourcePlantEstimateEquipmentDataService'
	];

	function ResourcePlantEstimateEurolistDropService(
		_, $q, platformDropServiceFactory, resourcePlantEstimateEquipmentEurolistDataService,
		resourcePlantEstimateEquipmentDataService
	) {
		let self = this;

		this.isValidSource = function isValidSource(source) {
			return !_.isNull(source) && !_.isUndefined(source) && !_.isNull(source.data) && !_.isUndefined(source.data) && source.data.length > 0;
		};

		this.dropCatalogRecord = function dropCatalogRecord(source , itemOnDragEnd) {
			if(self.isPlantEurolist(itemOnDragEnd)){
				_.forEach(source.data, function (sourceDataItem) {
					resourcePlantEstimateEquipmentEurolistDataService.SetCreationParameter(sourceDataItem.CatalogFk, sourceDataItem.Id);
					resourcePlantEstimateEquipmentEurolistDataService.createItem();
				});

			}
		};

		platformDropServiceFactory.initializeDropService(self, [
			{
				type: 'sourceCatalogRecord1',
				fn: self.dropCatalogRecord
			},
			{
				type: 'sourceCatalogRecord2',
				fn: self.dropCatalogRecord
			}
		]);
		self.isOneOfType = function (sourceOrTarget, types) {
			let type = !_.isNil(sourceOrTarget.type) ? sourceOrTarget.type : sourceOrTarget;
			return _.some(types, t => type === t);
		};
		self.isCatalogRecord = function (sourceOrTarget) {
			return self.isOneOfType(sourceOrTarget, ['sourceCatalogRecord1','sourceCatalogRecord2']);
		};
		self.isPlantEurolist = function (sourceOrTarget) {
			return self.isOneOfType(sourceOrTarget, ['plantEurolist']);
		};

		self.doCanPaste = function doCanPasteNew(source, target) {
			if(self.isCatalogRecord(source) && self.isPlantEurolist(target) && !_.isNil(resourcePlantEstimateEquipmentDataService.getSelected())){
				return true;
			}
			else{
				return false;
			}
		};
	}
})(angular);
