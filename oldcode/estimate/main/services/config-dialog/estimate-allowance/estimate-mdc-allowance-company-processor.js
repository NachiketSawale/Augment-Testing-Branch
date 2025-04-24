/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
    'use strict';
    /**
     * @ngdoc service
     * @name estimateMdcAllowanceCompanyProcessor
     */

    angular.module('estimate.main').factory('estimateMdcAllowanceCompanyProcessor', ['$injector', 'platformRuntimeDataService', function ($injector, platformRuntimeDataService) {

        let service = {};
        let fields = [
            {field: 'IsChecked', readonly: true}
        ];

        service.processItem = function processItem(item) {
            if(!item){
                return;
            }
            let estimateMdcAllowanceCompanyService = $injector.get('estimateMdcAllowanceCompanyService');
            let contextId = estimateMdcAllowanceCompanyService.getMdcContextId();
            if(estimateMdcAllowanceCompanyService.getIsReadOnlyContainer() || item.MdcContextFk !== contextId){
                platformRuntimeDataService.readonly(item, fields);
            }
        };
        return service;

    }]);
})(angular);