/**
 * Created by henkel on 16.04.2015.
 */


(function (angular) {
	'use strict';
	angular.module('basics.company').factory('basicsCompanyMainModifyProcessor', ['platformRuntimeDataService', function (platformRuntimeDataService) {

		var service = {};
		service.processItem = function processItem(company) {

			var profitCentre = 3;
			var fields;
			if (company.CompanyTypeFk === profitCentre || company.Version > 0) {
				fields = [
					{
						field: 'ContextFk',
						readonly: true
					},
					{
						field: 'LineItemContextFk',
						readonly: true
					},
					{
						field: 'SubledgerContextFk',
						readonly: true
					},
					{
						field: 'LedgerContextFk',
						readonly: true
					},
					{
						field: 'ResourceContextFk',
						readonly: company.ResourceContextFk ? true : false
					},
					{
						field: 'DefectContextFk',
						readonly: company.DefectContextFk ? true : false
					},
					{
						field: 'TimesheetContextFk',
						readonly: company.TimesheetContextFk ? true : false
					},
					{
						field: 'ModuleContextFk',
						readonly: true
					},
					{
						field: 'TextModuleContextFk',
						readonly: true
					},
					{
						field: 'SchedulingContextFk',
						readonly: company.SchedulingContextFk ? true : false
					},
					{
						field: 'CompanyTypeFk',
						readonly: true
					},
					{
						field: 'LogisticContextFk',
						readonly: company.LogisticContextFk ? true : false
					},
					{
						field: 'EquipmentContextFk',
						readonly: company.EquipmentContextFk ? true : false
					},
					{
						field: 'ProjectContextFk',
						readonly: true
					},
					{
						field: 'IsCalculateOverGross',
						readonly: true
					}
				];
			} else {
				fields = [];
			}

			fields.push({
				field: 'PrrMethodFk',
				readonly: company.CompanyTypeFk !== 1
			});

			if (company.Version > 0) {
				fields.push(
					{
						field: 'CurrencyFk', readonly: true
					},
					{
						field: 'EquipmentDivisionFk', readonly: company.EquipmentDivisionFk ? true : false
					}
				);
			}

			platformRuntimeDataService.readonly(company, fields);
		};

		return service;

	}]);
})(angular);