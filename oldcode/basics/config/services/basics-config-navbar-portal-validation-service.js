/**
 * Created by sandu on 11.03.2022.
 */
(function (angular) {

    /* global jjvEnvironment */
    'use strict';

    var moduleName = 'basics.config';

    /**
     * @ngdoc service
     * @name basicsConfigNavbarPortalValidationService
     * @description provides validation methods for Navbar entities
     */
    angular.module(moduleName).factory('basicsConfigNavbarPortalValidationService', basicsConfigNavbarPortalValidationService);

    basicsConfigNavbarPortalValidationService.$inject = ['$http'];

    function basicsConfigNavbarPortalValidationService($http) {

        var service = {};

        var env = jjvEnvironment();

        var SCHEME_NAME = 'basicsConfigNavbarPortalScheme';

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
                    url: globals.webApiBaseUrl + 'basics/config/navbar/scheme'
                }
            ).then(function (response) {
                env.addSchema(SCHEME_NAME, response.data);
            });
        };
        init();

        return service;
    }
})(angular);
