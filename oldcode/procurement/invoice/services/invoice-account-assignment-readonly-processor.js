/**
 * Created by jhe on 9/10/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	angular.module(moduleName).factory('procurementInvoiceAccountAssignmentReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService', '$injector', '_', 'basicsLookupdataLookupDescriptorService',
			function (commonReadOnlyProcessor, moduleContext, $injector, _, basicsLookupdataLookupDescriptorService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'InvAccountAssignmentDto',
					moduleSubModule: 'Procurement.Invoice',
					readOnlyFields: ['Version', 'ItemNO','Description', 'BreakdownPercent', 'BreakdownAmount', 'BreakdownAmountOc', 'BasCompanyYearFk', 'MdcControllingUnitFk',
						'BasAccAssignItemTypeFk','BasAccountFk','IsDelete', 'AccountAssignment01', 'AccountAssignment02', 'AccountAssignment03','BasAccAssignMatGroupFk','BasAccAssignAccTypeFk','BasAccAssignFactoryFk']
				});

				service.setAccountAssignmentFieldsReadOnly = function setAccountAssignmentFieldsReadOnly(item) {
					service.setFieldsReadOnly(item);
				};

				service.getCellEditable = function getCellEditable(item, model) {
					var isInvAccountChangeable = service.getIsInvAccountChangeable();
					var accountAssignmentField = ['AccountAssignment01', 'AccountAssignment02', 'AccountAssignment03'];
					if(model === 'Version') {
						return false;
					}
					if(_.includes(accountAssignmentField, model)) {
						if(item.BasAccAssignAccTypeFk && isInvAccountChangeable){
							var basAccassignAccTypeEntity = _.find(basicsLookupdataLookupDescriptorService.getData('BasAccassignAccType'), {Id: item.BasAccAssignAccTypeFk});
							if (basAccassignAccTypeEntity) {
								if(model === 'AccountAssignment01'){
									return !basAccassignAccTypeEntity.Is2Fields;
								}
								else {
									return basAccassignAccTypeEntity.Is2Fields;
								}
							}
							return false;
						}
						else{
							return false;
						}
					}
					return isInvAccountChangeable;
				};

				service.getIsInvAccountChangeable = function getIsInvAccountChangeable() {
					var invoiceHeaderService = moduleContext.getLeadingService();
					var invoiceHeader = invoiceHeaderService.getSelected();
					var isInvAccountChangeable = true;
					if (invoiceHeader) {
						if(invoiceHeader.BasAccassignConTypeFk){
							var accassignConTypeEntity = _.find(basicsLookupdataLookupDescriptorService.getData('BasAccassignConType'), {Id: invoiceHeader.BasAccassignConTypeFk});
							return  accassignConTypeEntity && accassignConTypeEntity.IsCreateInvAccount;
						}
						var conHeaderService = $injector.get('procurementContractHeaderDataService');
						if (conHeaderService) {
							var conHeader = _.find(conHeaderService.getList(), {Id: invoiceHeader.ConHeaderFk});
							if (conHeader) {
								isInvAccountChangeable = conHeader.IsInvAccountChangeable;
							}
							else
							{
								isInvAccountChangeable = invoiceHeader.IsInvAccountChangeable;
							}
						}
					}
					return isInvAccountChangeable;
				};

				return service;
			}]);

})(angular);