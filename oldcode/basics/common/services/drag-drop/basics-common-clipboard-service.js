(function(angular){
    'use strict';

    let moduleName = 'basics.common';

    angular.module(moduleName).factory('basicsCommonClipboardService', basicsCommonClipboardService);

    function basicsCommonClipboardService() {
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