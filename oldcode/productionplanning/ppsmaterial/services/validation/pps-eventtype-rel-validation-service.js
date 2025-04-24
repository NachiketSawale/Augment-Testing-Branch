(function (angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name productionplanningPpsEventTypeRelationValidationService
     * @description provides validation methods for master instances
     */
    var moduleName = 'productionplanning.ppsmaterial';
    angular.module(moduleName).factory('productionplanningPpsMaterialPpsEventTypeRelationValidationService', productionplanningPpsMaterialPpsEventTypeRelationValidationService);

    productionplanningPpsMaterialPpsEventTypeRelationValidationService.$inject = [
        'platformDataValidationService', 'productionplanningPpsMaterialPpsEventTypeRelationDataService', 'basicsLookupdataLookupDescriptorService'];

    function productionplanningPpsMaterialPpsEventTypeRelationValidationService(platformDataValidationService, dataService, basicsLookupdataLookupDescriptorService) {
        var service = {};
        service.validatePpsEventTypeParentFk = function (entity, value, model) {
            var result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
            if (!result.valid) {
                return result;
            }
            return validateParentEventTypeAndChildEventType(value, entity.PpsEventTypeChildFk, entity, value, model, 'PpsEventTypeChildFk');
        };
        service.validatePpsEventTypeChildFk = function (entity, value, model) {
            //return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
            var result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
            if (!result.valid) {
                return result;
            }
            return validateParentEventTypeAndChildEventType(entity.PpsEventTypeParentFk, value, entity, value, model, 'PpsEventTypeParentFk');

        };
        service.validateRelationKindFk = function (entity, value, model) {
            return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
        };


        return service;


        function validateParentEventTypeAndChildEventType(parentEventTypeId, childEventTypeId, entity, value, model, relModel) {

            var eventTypes = basicsLookupdataLookupDescriptorService.getData('EventType');

            var parentEventType = _.find(eventTypes, {Id: parentEventTypeId});
            var childEventType = _.find(eventTypes, {Id: childEventTypeId});
            if (parentEventType && childEventType && parentEventType.IsSystemEvent && childEventType.IsSystemEvent) {
                var res = platformDataValidationService.createErrorObject('productionplanning.ppsmaterial.ppsEventTypeRelation.errorParentEventTypeAndChildEventTypeNotBeSystemEventType', {}, true);
                return platformDataValidationService.finishWithError(res, entity, value, model, service, dataService);
            }
            else {
                platformDataValidationService.ensureNoRelatedError(entity, model, [relModel], service, dataService);
                return true;
            }
        }
    }


})(angular);
