/**
 * Created by lcn on 5/22/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructureGrpSetDTLReadOnlyProcessor',['basicsCommonReadOnlyProcessor',
		function (commonReadOnlyProcessor) {

			var service = commonReadOnlyProcessor.createReadOnlyProcessor({
				typeName: 'ControllingGrpSetDTLDto',
				moduleSubModule: 'Controlling.Structure',
				readOnlyFields: ['ControllinggroupdetailFk']
			});


			service.handlerItemReadOnlyStatus = function (item) {
				service.setFieldsReadOnly(item);
			};

			service.getCellEditable = function getCellEditable(item,model) {
				switch (model) {
					case 'ControllinggroupdetailFk':
						return item.ControllinggroupFk > 0;
					default :
						return true;
				}
			};

			return service;

		}]);
	angular.module(moduleName).factory('controllingStructureGrpSetDTLValidationService',['platformDataValidationService','$translate','platformRuntimeDataService','controllingStructureGrpSetDTLReadOnlyProcessor',function (platformDataValidationService,$translate,platformRuntimeDataService,readOnlyProcessor) {
		return function (dataService) {
			var service = {};
			function onEntityCreated(e,item) {
				service.validateEntity(item);

			}
			if(!dataService.IsReadOnly()){
				service.validateControllinggroupFk = function validateControllinggroupFk(entity,value,model) {
					if (value === 0) {
						value = null;
						entity.ControllinggroupFk = null;
					}
					if (entity.ControllinggroupFk !== value || entity.Version === 0) {
						entity.ControllinggroupFk = value;
						entity.ControllinggroupdetailFk = null;
						service.validateControllinggroupdetailFk(entity,null,'ControllinggroupdetailFk');
					}
					readOnlyProcessor.processItem(entity);
					dataService.fireItemModified(entity);
					var fieldName = $translate.instant('businesspartner.main.ControllinggroupFk');
					var result = platformDataValidationService.isMandatory(value,model,{fieldName: fieldName});
					if (result.valid) {
						result = platformDataValidationService.isValueUnique(dataService.getList(),model,value,entity.Id,{object: fieldName});
					}

					platformRuntimeDataService.applyValidationResult(result,entity,model);
					return platformDataValidationService.finishValidation(result,entity,value,model,service,dataService);

				};
				service.validateControllinggroupdetailFk = function validateControllinggroupdetailFk(entity,value,model) {
					if (value === 0) {
						value = null;
					}
					var fieldName = $translate.instant('businesspartner.main.ControllinggrpdetailFk');
					var result = platformDataValidationService.isMandatory(value,model,{fieldName: fieldName});
					platformRuntimeDataService.applyValidationResult(result,entity,model);
					return platformDataValidationService.finishValidation(result,entity,value,model,service,dataService);
				};
				service.validateEntity = function (entity) {
					service.validateControllinggroupFk(entity, entity.ControllinggroupFk, 'ControllinggroupFk');
				};
				dataService.registerEntityCreated(onEntityCreated);
			}
			return service;
		};
	}]);

})(angular);