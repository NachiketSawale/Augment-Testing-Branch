/**
 * Created by zov on 11/18/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.service('ppsConfigurationLogConfigValidationService', ValidationService);
    ValidationService.$inject = ['platformDataValidationService', 'ppsConfigurationLogConfigDataService', 'platformModuleStateService'];

    function ValidationService(platformDataValidationService, dataService, platformModuleStateService) {

        var self = this;

        self.validateEntityId = function (entity, value, model){
            let result = platformDataValidationService.validateMandatory(entity, value, model, self, dataService);
            if(result.valid === true){
                return validateUniqueLogConfig(entity, value, model);
            }
            return result;
        };

        self.validatePropertyId = function (entity, value, model){
            let result = platformDataValidationService.validateMandatory(entity, value, model, self, dataService);
            if(result.valid === true){
                return validateUniqueLogConfig(entity, value, model);
            }
            return result;
        };

        self.validateLogConfigType = function (entity, value, model){
            return  platformDataValidationService.validateMandatory(entity, value, model, self, dataService);
        };

        self.validateEntityType = function (entity, value, model){
            return validateUniqueLogConfig(entity, value, model);
        };

        function validateUniqueLogConfig(entity, value, model){
            let entityId = model === 'EntityId'? value : entity.EntityId;
            let propertyId = model === 'PropertyId'? value : entity.PropertyId;
            let entityType = model === 'EntityType'? value : entity.EntityType;
            let logName = entityId + '-' + propertyId + '-' + entityType;
            let logList = dataService.getList().filter(e => e.Id !== entity.Id);
            let result = null;
            if(_.some(logList, {LogName : logName})){
                result = platformDataValidationService.createErrorObject('productionplanning.configuration.logCfg_Unique_Validation',{fieldName: model.toLowerCase()});
                return platformDataValidationService.finishValidation(result, entity, value, model, self, dataService);
            } else {
                let fields = ['EntityId', 'PropertyId', 'EntityType'];
                var modState = platformModuleStateService.state(dataService.getModule());
                modState.validation.issues = _.filter(modState.validation.issues, function (err) {
                    return err.entity.Id !== entity.Id || !fields.includes(err.model);
                });
                if(entity.__rt$data && entity.__rt$data.errors){
                    _.forEach(fields, function (field){
                        if(entity.__rt$data.errors[field] && entity.__rt$data.errors[field].error$tr$param$.fieldName === model.toLowerCase()){
                            entity.__rt$data.errors[field] = null;
                        }
                    });
                }
                entity.LogName = logName;
                return  platformDataValidationService.createSuccessObject();
            }
        }
    }
})();