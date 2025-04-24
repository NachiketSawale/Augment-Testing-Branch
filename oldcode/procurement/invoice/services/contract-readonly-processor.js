(function (angular) {

	'use strict';
	// jshint -W074
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/**
	 * @ngdoc service
	 * @name basicsCompanyImageProcessor
	 * @function
	 *
	 * @description
	 * The basicsCompanyImageProcessor adds path to images for companies depending on there type.
	 */

	angular.module('procurement.invoice').factory('procurementInvoiceContractReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementInvoiceHeaderDataService','platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService',
			function (commonReadOnlyProcessor, headerDataService,platformRuntimeDataService, basicsLookupdataLookupDescriptorService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'Inv2ContractDto',
					moduleSubModule: 'Procurement.Invoice',
					readOnlyFields: ['MaterialCode', 'Description', 'OrderQuantity', 'Uom', 'Price', 'PriceOc',
						'TotalPrice', 'TotalPriceOc', 'PrcItemFk', 'PrcBoqFk', 'ContractDate', 'IsAssetManagement', 'FixedAssetFk', 'DiscountSplit', 'DiscountSplitOc']
				});

				var additionalUIFields = ['Percentage','TotalValueGross','TotalValueOcGross','MaterialCode'];

				var readOnlyStatus, itemStatus;

				service.handlerItemReadOnlyStatus = function (item) {
					var rightByStatus = headerDataService.haveRightByStatus('InvStatusEditRightToContract');
					if (rightByStatus.hasDescriptor) {
						readOnlyStatus = false;
					}
					else {
						itemStatus = headerDataService.getItemStatus();
						if (itemStatus) {
							readOnlyStatus = itemStatus.IsReadOnly;
						} else {
							readOnlyStatus = false;
						}
						if (!readOnlyStatus) {
							readOnlyStatus = !rightByStatus.right;
						}
					}

					service.setRowReadOnly(item, readOnlyStatus);

					var readonlyProperties = [];
					_.forEach(additionalUIFields,function(prop){
						readonlyProperties.push({field: prop, readonly: readOnlyStatus});
					});

					platformRuntimeDataService.readonly(item, readonlyProperties);
					return readOnlyStatus;
				};

				service.getCellEditable = function getCellEditable(item, model) {
					switch (model) {
						case 'PrcItemFk':
							return !!item.ConHeaderFk && !item.PrcBoqFk;
						case 'PrcBoqFk':
							return !!item.ConHeaderFk && !item.PrcItemFk;
						case 'MaterialCode':
						case 'Description':
						case 'OrderQuantity':
						case 'Uom':
						case 'Price':
						case 'PriceOc':
						case 'TotalPrice':
						case 'TotalPriceOc':
						case 'ContractDate':
						case 'DiscountSplit':
						case 'DiscountSplitOc':
							return false;
						case 'FixedAssetFk':
							return item.IsAssetManagement;
						case 'IsAssetManagement':
							var controllingUnits = basicsLookupdataLookupDescriptorService.getData('Controllingunit');
							if (controllingUnits && item.ControllingUnitFk) {
								var controllingUnit = _.find(controllingUnits, {Id: item.ControllingUnitFk});
								if (controllingUnit) {
									return controllingUnit.Isassetmanagement;
								}
								return true;
							}
							return true;
						default :
							return true;
					}
				};

				return service;

			}]);
})(angular);