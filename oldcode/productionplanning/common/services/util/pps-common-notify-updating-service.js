(function () {
    'use strict';
    /*globals angular*/
    var moduleName = 'productionplanning.common';
    angular.module(moduleName).factory('ppsCommonNotifyUpdatingService', [
        '$rootScope',
        function ($rootScope) {
            var service = {};
            var updatingNotifier = new Platform.Messenger();
            var updateDoneNotifier = new Platform.Messenger();

            var updating = false;
            $rootScope.$on('before-save-entity-data', function markAsUpdating() {
                updating = true;
                updatingNotifier.fire();
            });
            $rootScope.$on('after-save-entity-data', function markAsUpdateDone() {
                updating = false;
                updateDoneNotifier.fire();
            });

            service.registerUpdating = function (callBackFn) {
                return updatingNotifier.register(callBackFn);
            };
            service.unregisterUpdating = function (callBackFn) {
                return updatingNotifier.unregister(callBackFn);
            };
            service.registerUpdateDone = function (callBackFn) {
                return updateDoneNotifier.register(callBackFn);
            };
            service.unregisterUpdateDone = function (callBackFn) {
                return updateDoneNotifier.unregister(callBackFn);
            };

            service.isUpdating = function () {
                return updating;
            };

            return service;
        }
    ]);
})();