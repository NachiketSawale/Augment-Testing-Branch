/**
 * Created by wwa on 1/4/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/* jshint -W072 */
	angular.module('procurement.common').factory('procurementCommonGeneralsReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService', 'basicsLookupdataLookupDescriptorService', 'purchaseOrderType',
			function (commonReadOnlyProcessor, moduleContext, basicsLookupdataLookupDescriptorService,purchaseOrderType) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'PrcGeneralsDto',
					moduleSubModule: 'Procurement.Common',
					uiStandardService: 'procurementCommonGeneralsUIStandardService',
					readOnlyFields: ['ControllingUnitFk', 'TaxCodeFk', 'PrcGeneralstypeFk', 'ValueType','CommentText','Value']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					if(!moduleContext.getMainService()){
						return true;
					}
					var isPackage = moduleContext.getMainService().name === 'procurement.package';
					var readOnyStatus = false;
					if(isPackage){
						readOnyStatus = moduleContext.isReadOnly;
					}
					service.setRowReadonlyFromLayout(item, readOnyStatus);
					return readOnyStatus;
				};

				service.getCellEditable = function (item, model, value) {
					var editable = true;
					var prcGeneralsType=basicsLookupdataLookupDescriptorService.getData('PrcGeneralsType');

					if (model === 'ControllingUnitFk' || model === 'TaxCodeFk') {
						editable = item.IsCost;
					}
					else if (model === 'Value')
					{
						var generalsType = _.find(prcGeneralsType, {'Id': value ? value : item.PrcGeneralstypeFk});
						if (_.isObject(generalsType))
						{
							editable = generalsType.CrbPriceconditionTypeFk===null;
						}
					}

					var moduleName = moduleContext.getModuleName();
					if(moduleName === 'procurement.contract'){
						var leadingService = moduleContext.getLeadingService();
						if(leadingService !== null){
							var leadinSelectedItem = leadingService.getSelected();
							if( leadinSelectedItem !== null && leadinSelectedItem.ConHeaderFk !== null && leadinSelectedItem.ProjectChangeFk !== null){
								editable = false;
							}
							// For change order, if general type is % type, this line cannot be changed. Else if non % type, user can change value field
							if (model === 'Value' && leadinSelectedItem) {
								var isChangeOrder = leadinSelectedItem.PurchaseOrders === purchaseOrderType.changeOrder;
								var data = _.find(prcGeneralsType, {Id: item.PrcGeneralstypeFk});
								if (angular.isObject(data)) {
									if (!data.IsPercent && isChangeOrder) {
										editable = true;
									}
								}
							}
						}
					}

					return editable;
				};

				return service;
			}]);
})(angular);