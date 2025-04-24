(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module('procurement.invoice').factory('procurementInvoiceOtherReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementInvoiceHeaderDataService', 'basicsLookupdataLookupDescriptorService',
			function (commonReadOnlyProcessor, headerDataService, basicsLookupdataLookupDescriptorService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'InvOtherDto',
					moduleSubModule: 'Procurement.Invoice',
					uiStandardService: 'procurementInvoiceOtherUIStandardService',
					readOnlyFields: ['IsAssetManagement', 'BasCompanyDeferalTypeFk', 'DateDeferalStart', 'FixedAssetFk']
				});


				var itemStatus, readOnlyStatus;

				service.handlerItemReadOnlyStatus = function (item) {
					var rightByStatus = headerDataService.haveRightByStatus('InvStatusEditRightToOther');
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

						if(!readOnlyStatus) {
							readOnlyStatus=!rightByStatus.right;
						}
					}

					service.setRowReadonlyFromLayout(item, readOnlyStatus);
					return readOnlyStatus;
				};

				service.getCellEditable = function getCellEditable(item, model) {
					switch (model) {
						case 'BasCompanyDeferalTypeFk':
						case 'DateDeferalStart':
							var parentSelectedItem = headerDataService.getSelected();
							return !(parentSelectedItem && parentSelectedItem.BillSchemeIsChained);
						case 'FixedAssetFk':
							return item.IsAssetManagement;
						case 'IsAssetManagement':
							var controllingUnits = basicsLookupdataLookupDescriptorService.getData('Controllingunit');
							if (controllingUnits && item.ControllingUnitFk) {
								var controllingUnit = _.find(controllingUnits, {Id: item.ControllingUnitFk});
								if (controllingUnit) {
									return controllingUnit.Isassetmanagement;
								}
							}
							return true;
						default :
							return true;
					}
				};

				return service;

			}]);
})(angular);