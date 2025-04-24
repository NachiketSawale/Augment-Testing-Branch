/**
 * Created by sandu on 11.03.2022.
 */
(function (angular) {

    /* global jjvEnvironment */
    'use strict';

    var moduleName = 'basics.config';

    /**
     * @ngdoc service
     * @name basicsConfigCommandbarPortalValidationService
     * @description provides validation methods for Commandbar entities
     */
    angular.module(moduleName).factory('basicsConfigCommandbarPortalValidationService', basicsConfigCommandbarPortalValidationService);

    basicsConfigCommandbarPortalValidationService.$inject = ['$http'];

    function basicsConfigCommandbarPortalValidationService($http) {

        var service = {};

        var env = jjvEnvironment();

        var SCHEME_NAME = 'basicsConfigCommandbarPortalScheme';

        service.validateModel = function (entity, model, value) {
            return env.validateModel(entity, model, value, SCHEME_NAME);
        };

        service.validateEntity = function (entity) {
            return env.validateEntity(entity, SCHEME_NAME);
        };

        var init = function () {
            $http(
                {
                    method: 'GET',
                    url: globals.webApiBaseUrl + 'basics/config/commandbar/scheme'
                }
            ).then(function (response) {
                env.addSchema(SCHEME_NAME, response.data);
            });
        };
        init();

        return service;
    }
})(angular);
