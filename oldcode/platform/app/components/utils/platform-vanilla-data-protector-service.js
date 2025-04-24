(function (angular) {
    'use strict';
    angular.module('platform').factory('platformVanillaDataProtectorService', platformVanillaDataProtectorService);

    function platformVanillaDataProtectorService() {
        const service = {};
        const MAXVANILLADATAID = 1000000;

        service.isVanillaData = function isVanillaData(item) {
            return (item && item.Id < MAXVANILLADATAID);
        };
        return service;
    }
})(angular);