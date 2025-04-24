

(function (angular) {
    'use strict';
    angular.module('controlling.generalcontractor').factory('controllingGeneralcontractorDocumentProjectProcessor', ['_', 'platformRuntimeDataService', function (_, platformRuntimeDataService) {

        let service = {};

        service.processItem = function processItem(item) {
            // set document project readOnly
            let allFieldsReadOnly = [];
            _.forOwn(item, function (value, key) {
                let field = {field: key, readonly: true};
                allFieldsReadOnly.push(field);
            });
            platformRuntimeDataService.readonly(item, allFieldsReadOnly);
            item.CanWriteStatus = false;
            item.IsReadonly = true;
            item.IsLockedType = true;
        };

        return service;
    }]);
})(angular);
