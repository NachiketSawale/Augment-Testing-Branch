/**
 * Created by wwa on 1/4/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/* jshint -W072 */
	angular.module('procurement.common').factory('procurementCommonTotalReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService', 'basicsLookupdataLookupDescriptorService', 'basicsProcurementConfigurationTotalKinds',
			function (commonReadOnlyProcessor, moduleContext, basicsLookupdataLookupDescriptorService, totalKinds) {

				return function (parentService) {
					var service = commonReadOnlyProcessor.createReadOnlyProcessor({
						typeName: 'PrcCertificateDto',
						moduleSubModule: 'Procurement.Common',
						uiStandardService: 'procurementCommonTotalUIStandardService',
						readOnlyFields: ['ValueNet', 'ValueNetOc', 'ValueTax', 'ValueTaxOc', 'Gross', 'GrossOc', 'TotalTypeFk']
					});
					var isPackage = moduleContext.getMainService().name === 'procurement.package';

					service.handlerItemReadOnlyStatus = function (item) {
						var readOnyStatus = false;
						if (isPackage) {
							readOnyStatus = moduleContext.isReadOnly;
						}
						service.setRowReadonlyFromLayout(item, readOnyStatus);
						return readOnyStatus;
					};

					service.getConfigurationFk = function getConfigurationFk() {
						if (parentService.getSelected()) {
							return isPackage ? parentService.getSelected().ConfigurationFk : parentService.getSelected().PrcHeaderEntity.ConfigurationFk;
						}
					};

					/* jshint -W074 */
					service.getCellEditable = function (item, model) {
						var editable = true;
						if (item && item.TotalTypeFk !== null && item.TotalTypeFk !== undefined) {
							var configuration = _.find(basicsLookupdataLookupDescriptorService.getData('PrcConfiguration'), {Id: service.getConfigurationFk()});
							var totalType = _.find(basicsLookupdataLookupDescriptorService.getData('PrcTotalType'), {
								Id: item.TotalTypeFk,
								PrcConfigHeaderFk: configuration? configuration.PrcConfigHeaderFk:-1
							});

							if (totalType) {
								if ((totalType.PrcTotalKindFk === totalKinds.fromPackage && !isPackage) ||
									totalType.PrcTotalKindFk === totalKinds.netTotal ||
									totalType.PrcTotalKindFk === totalKinds.costPlanningNet ||
									totalType.PrcTotalKindFk === totalKinds.budgetNet ||
									totalType.PrcTotalKindFk === totalKinds.formula) {
									return false;
								}
								if (model === 'ValueNet' || model === 'ValueNetOc') {
									editable = totalType.IsEditableNet;
								}
								if (model === 'ValueTax' || model === 'ValueTaxOc') {
									editable = totalType.IsEditableTax;
								}
								if (model === 'Gross' || model === 'GrossOc') {
									editable = totalType.IsEditableGross;
								}
								if (model === 'TotalTypeFk') {
									editable = totalType.PrcTotalKindFk !== totalKinds.netTotal;
								}
							} else {
								editable = true;
							}
						} else {
							editable = false;
						}

						return editable;
					};

					return service;
				};
			}]);
})(angular);