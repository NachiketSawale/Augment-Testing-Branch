
(function (angular) {
    'use strict';

    let moduleName = 'estimate.parameter';

    angular.module(moduleName).factory('estimateParameterValueAssignmentGridValidationService',
        ['estimateParameterValueAssignmentGridService', '$injector', 'estimateRuleParameterConstant',
            function (estimateParameterValueAssignmentGridService, $injector, estimateRuleParameterConstant) {
                let service = {};

                service.validateIsDefault = function validateIsDefault(entity, value) {
                    if (value) {
                        let currentEstParameter = $injector.get('estimateParameterDialogDataService').getCurrentEstParameter();
                        if(entity.ValueType === estimateRuleParameterConstant.Text){
                            currentEstParameter.ValueText = entity.ValueText;
                            currentEstParameter.DefaultValue = null;
                        }else {
                            currentEstParameter.DefaultValue = entity.Value;
                            currentEstParameter.ValueText = null;
                        }
                        currentEstParameter.ValueDetail = entity.Id;
                        estimateParameterValueAssignmentGridService.setUniqueIsDefault(entity);
                    }
                };

                return service;
            }
        ]);
})(angular);

