(function(angular){
    'use strict';

    let moduleName = 'controlling.common';

    angular.module(moduleName).factory('controllingCommonClipboardService', controllingCommonClipboardService);

    function controllingCommonClipboardService() {
        let service = {};


        service.setClipboardMode = function (clipboardMode) {

        };

        service.canDrag = function () {
            return true;
        };

        service.canPaste = function canPaste() {
            return false;
        };

        service.copy = function copy() {

        };

        return service;
    }

})(angular);