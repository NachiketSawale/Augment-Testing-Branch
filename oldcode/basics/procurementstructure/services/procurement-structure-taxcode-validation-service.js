(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementStructureTaxCodeValidationService',
		['platformDataValidationService', 'basicsProcurementStructureTaxCodeService',
			'platformRuntimeDataService', '$translate',
			function (platformDataValidationService, dataService, platformRuntimeDataService, $translate) {
				var service ={};

				service.validateMdcLedgerContextFk=function(entity, value,model){
					var result = platformDataValidationService.isMandatory(value, model);
					if (result.apply) {
						result = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, false);
						if (!result.valid) {
							result.error = result.error$tr$ = $translate.instant('basics.procurementstructure.mdcLedgerContextFkUniqueError');
						}
					}
					entity.MdcTaxCodeFk=null;
					entity.MdcSalesTaxGroupFk=null;
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(result, entity, 'MdcLedgerContextFk');
					return result;
				};

				function onEntityCreated(e, item) {
					service.validateMdcLedgerContextFk(item, item.MdcLedgerContextFk, 'MdcLedgerContextFk');
				}
				dataService.registerEntityCreated(onEntityCreated);

				return service;
			}]);

})(angular);
