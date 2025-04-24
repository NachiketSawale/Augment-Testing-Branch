/**
 * Created by zov on 11/18/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.factory('ppsConfigurationLogConfigDataService', DataService);
    DataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'productionplanningConfigurationLogConfigurationProcessor'];

    function DataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor,logConfigProcessor) {

        var serviceInfo = {
            flatRootItem: {
                module: moduleName + '.logconfig',
                serviceName: 'ppsConfigurationLogConfigDataService',
                entityNameTranslationID: 'productionplanning.configuration.entityLogConfig',
                dataProcessor: [logConfigProcessor],
                httpCRUD: {
                    route: globals.webApiBaseUrl + 'productionplanning/configuration/logconfig/',
                    endRead: 'filtered',
                    usePostForRead: true
                },
                entityRole: {
                    root: {
                        itemName: 'LogConfig',
                        moduleName: 'productionplanning.configuration.moduleDisplayNameLogConfig',
                        descField: 'Description'
                    }
                },
                presenter: {
                    list: { },
                    handleCreateSucceeded:function (newItem) {
                        newItem.EntityType = undefined;
                    }
                }
            }
        };

        /*jshint-W003*/
        var container = platformDataServiceFactory.createNewComplete(serviceInfo);
        container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
            typeName: 'PpsLogConfigDto',
            moduleSubModule: 'ProductionPlanning.Configuration',
            validationService: 'ppsConfigurationLogConfigValidationService',
            mustValidateFields: ['LogConfigType']
        });

        container.service.handleFieldChange = function handleFieldChange(entity, field, validationService) {
            switch (field) {
                case 'EntityId':
                    if (entity.PropertyId) {
                        entity.PropertyId = null; // if set as undefined, there will validation issue in control-validation.js
                                                  // _.get(entity, field, modelValue) !== modelValue
                        validateField(entity, 'PropertyId', validationService);
                        container.service.markItemAsModified(entity);
                    }
                    entity.EntityType = null; //reset entity-type
                    break;
            }
        };

        function validateField(item, prop, validationService) {
            var tempProp = prop.replace(/\./g, '$');
            var syncProp = 'validate' + tempProp;
            var asyncProp = 'asyncValidate' + tempProp;
            var res = true;

            if (validationService[syncProp]) {
                res = validationService[syncProp].call(container.service, item, item[prop], prop, true);
                container.data.newEntityValidator.showUIErrorHint(res, item, prop);
            }

            if (isValid(res) && validationService[asyncProp]) {
                validationService[asyncProp].call(container.service, item, item[prop], prop, true).then(function (result) {
                    container.data.newEntityValidator.showUIErrorHint(result, item, prop);
                });
            }
        }

        function isValid(result) {
            return result === true || (!!result && result.valid === true);
        }

        return container.service;
    }
})();