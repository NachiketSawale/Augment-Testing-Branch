/**
 * Created by nitsche on 23.02.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupEurolistDropService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatching ui entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentGroupEurolistDropService', ResourceEquipmentGroupEurolistDropService);

	ResourceEquipmentGroupEurolistDropService.$inject = [
		'_', '$q', 'platformDropServiceFactory', 'resourceEquipmentGroupEuroListDataService',
		'resourceEquipmentGroupDataService'
	];

	function ResourceEquipmentGroupEurolistDropService(
		_, $q, platformDropServiceFactory, resourceEquipmentGroupEuroListDataService,
		resourceEquipmentGroupDataService
	) {
		let self = this;

		this.isValidSource = function isValidSource(source) {
			return !_.isNull(source) && !_.isUndefined(source) && !_.isNull(source.data) && !_.isUndefined(source.data) && source.data.length > 0;
		};

		this.dropCatalogRecord = function dropCatalogRecord(source , itemOnDragEnd) {
			if(self.isPlantGroupEurolist(itemOnDragEnd)){
				_.forEach(source.data, function (sourceDataItem) {
					resourceEquipmentGroupEuroListDataService.SetCreationParameter(sourceDataItem.CatalogFk, sourceDataItem.Id);
					resourceEquipmentGroupEuroListDataService.createItem();
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
		self.isPlantGroupEurolist = function (sourceOrTarget) {
			return self.isOneOfType(sourceOrTarget, ['plantGroupEurolist']);
		};

		self.doCanPaste = function doCanPasteNew(source, target) {
			if(self.isCatalogRecord(source) && self.isPlantGroupEurolist(target) && !_.isNil(resourceEquipmentGroupDataService.getSelected())){
				return true;
			}
			else{
				return false;
			}
		};
	}
})(angular);
