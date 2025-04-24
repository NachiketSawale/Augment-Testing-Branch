/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettlementItemDataService
	 * @description pprovides methods to access, create and update logistic settlement item entities
	 */
	myModule.service('logisticSettlementItemReadOnlyProcessorService', LogisticSettlementItemReadOnlyProcessorService);

	LogisticSettlementItemReadOnlyProcessorService.$inject = ['_', 'platformRuntimeDataService', 'logisticSettlementConstantValues', 'logisticSettlementDataService', 'logisticSettlementItemLayoutService'];

	function LogisticSettlementItemReadOnlyProcessorService(_, platformRuntimeDataService, logisticSettlementConstantValues, logisticSettlementDataService, logisticSettlementItemLayoutService) {

		var oldHeaderId = null;
		var isRevision = null;
		var isReadOnly = null;
		var oldHeaderStatus = null;
		var oldHeaderReadOnlyId = null;
		var oldHeaderReadOnlyStatus = null;

		function getRevision(){
			var newHeader = logisticSettlementDataService.getSelected();
			if (newHeader && newHeader.Id !== oldHeaderId || newHeader.SettlementStatusFk !== oldHeaderStatus) {
				isRevision = logisticSettlementDataService.isRevision(newHeader);
				oldHeaderId = newHeader.Id;
				oldHeaderStatus = newHeader.SettlementStatusFk;
			}
			return isRevision;
		}
		function getReadOnly(){
			var newHeader = logisticSettlementDataService.getSelected();
			if (newHeader && newHeader.Id !== oldHeaderReadOnlyId || newHeader.SettlementStatusFk !== oldHeaderReadOnlyStatus) {
				isReadOnly = logisticSettlementDataService.isReadOnly(newHeader);
				oldHeaderReadOnlyId = newHeader.Id;
				oldHeaderReadOnlyStatus = newHeader.SettlementStatusFk;
			}
			return isReadOnly;
		}

		this.processItem = function processItem(entity) {
			var readonly = true;
			var scheme = logisticSettlementItemLayoutService.getDtoScheme();
			var isMaterial = entity.SettlementItemTypeFk === logisticSettlementConstantValues.types.item.materialNonStock ||
				entity.SettlementItemTypeFk === logisticSettlementConstantValues.types.item.materialStock;
			if (entity.PlantFk !== null) {
				readonly = false;
			}

			var isBulkPlant = entity.SettlementItemTypeFk === logisticSettlementConstantValues.types.item.bulkPlantHire;

			var revision = getRevision();
			var statusReadonly = getReadOnly();
			var fields = [];
			_.each(Object.getOwnPropertyNames(scheme), function (prop) {
				var newReadOnly = statusReadonly || revision;
				switch (prop) {
					case 'ControllingUnitFk':
						newReadOnly = statusReadonly && !revision;
						break;
					case 'WorkOperationTypeFk':
						newReadOnly = revision || readonly || statusReadonly;
						break;
					case 'PricePortion1':
						newReadOnly = revision || isMaterial || statusReadonly;
						break;
					case 'PricePortion2':
						newReadOnly = revision || isMaterial || statusReadonly;
						break;
					case 'PricePortion3':
						newReadOnly = revision || isMaterial || statusReadonly;
						break;
					case 'PricePortion4':
						newReadOnly = revision || isMaterial || statusReadonly;
						break;
					case 'PricePortion5':
						newReadOnly = revision || isMaterial || statusReadonly;
						break;
					case 'PricePortion6':
						newReadOnly = revision || isMaterial || statusReadonly;
						break;
					case 'PriceOrigCur1':
						newReadOnly = revision || isMaterial || statusReadonly;
						break;
					case 'PriceOrigCur2':
						newReadOnly = revision || isMaterial || statusReadonly;
						break;
					case 'PriceOrigCur3':
						newReadOnly = revision || isMaterial || statusReadonly;
						break;
					case 'PriceOrigCur4':
						newReadOnly = revision || isMaterial || statusReadonly;
						break;
					case 'PriceOrigCur5':
						newReadOnly = revision || isMaterial || statusReadonly;
						break;
					case 'PriceOrigCur6':
						newReadOnly = revision || isMaterial || statusReadonly;
						break;
					case 'Price':
						newReadOnly = revision || !isMaterial || statusReadonly;
						break;
					case 'PriceOrigCur':
						newReadOnly = revision || !isMaterial || statusReadonly;
						break;
					case 'QuantityMultiplier':
						newReadOnly = revision || !isBulkPlant || statusReadonly;
						break;
					default:
						newReadOnly = revision || statusReadonly;
				}
				fields.push({field: prop, readonly: newReadOnly});
			});
			platformRuntimeDataService.readonly(entity, fields);
		};
	}
})(angular);