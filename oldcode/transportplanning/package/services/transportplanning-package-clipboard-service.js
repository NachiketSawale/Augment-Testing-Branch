/**
 * Created by anl on 7/20/2017.
 */

(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name transportplanningPackageClipboardService
     * @description provides cut, copy and paste functionality for the treeview grid
     */
    var moduleName = 'transportplanning.package';

    angular.module(moduleName).factory('transportplanningPackageClipboardService', TransportPlanningPackageClipboardService);

    TransportPlanningPackageClipboardService.$inject = ['$http', 'platformDragdropService', 'transportplanningPackageMainService', 'basicsLookupdataLookupDescriptorService', 'transportplanningTransportRouteStatusLookupService'];

    function TransportPlanningPackageClipboardService($http, platformDragdropService, packageMainService, basicsLookupdataLookupDescriptorService, routeStatusServ) {

        var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
        var service = {};

        // events
        service.clipboardStateChanged = new Platform.Messenger();
        service.onDragStart = new Platform.Messenger();
        service.onDragEnd = new Platform.Messenger();
        service.onDrag = new Platform.Messenger();
        service.onPostClipboardError = new Platform.Messenger();
        service.onPostClipboardSuccess = new Platform.Messenger();

        var getChildren = function (list, items) {
            angular.forEach(items, function (item) {
                list.push(item);
                if (item.HasChildren) {
                    getChildren(list, item.Items);
                }
            });
        };

        var add2Clipboard = function add2Clipboard(node, type) {
            clipboard.type = type;
            clipboard.data = angular.copy(node);
            clipboard.dataFlattened = [];
            for (var i = 0; i < clipboard.data.length; i++) {
                clipboard.dataFlattened.push(clipboard.data[i]);
                if (clipboard.data[i].HasChildren) {
                    getChildren(clipboard.dataFlattened, clipboard.data[i].Items);
                }
            }
            service.clipboardStateChanged.fire();
        };

        var clearClipboard = function () {
            clipboard.type = null;
            clipboard.data = null;
            clipboard.dataFlattened = null;
            service.clipboardStateChanged.fire();
        };


        // removes a node including all sub-nodes
        var removeNode = function removeNode(trsPackage) {

            switch (clipboard.type) {
                case 'trsPackage':
                    packageMainService.moveItem(trsPackage);
                    break;
            }
        };


        var postClipboard = function (targetId, action, type, data, onSuccessCallback) {
            if (!targetId) {
                targetId = null;
            }
            var api = action === platformDragdropService.actions.move ? 'move' : 'copy';
            var url = 'transportplanning/package/';

            $http.post(globals.webApiBaseUrl + url + api + '?targetId=' + targetId, //+ '&toProjectId='=projectMainService.getSelected().Id,
                data)
                .then(function onSuccess(response) {
                    onSuccessCallback(response);
                })
                .catch(function onError(response) {
                    // console.log(response.Exception.Message);
                    service.onPostClipboardError.fire(response);
                });
        };

        service.setClipboardMode = function (cut) {
            clipboard.cut = cut;
        };


        service.getClipboardMode = function getClipboardMode() {
            return clipboard.cut;
        };

        /**
         * @ngdoc function
         * @name cut
         * @function
         * @methodOf transportplanningPackageClipboardService
         * @description adds the trsPackage to the cut clipboard
         * @param {object} Package selected node
         * @returns
         */
        service.cut = function (trsPackages, type) {
            add2Clipboard(trsPackages, type);
            clipboard.cut = true; // set clipboard mode
        };

        /**
         * @ngdoc function
         * @name copy
         * @function
         * @methodOf transportplanningPackageClipboardService
         * @description adds the trsPackage to the copy clipboard
         * @param {object} trsPackage selected node
         * @returns
         */
        service.copy = function copy() {
            //add2Clipboard(ppsItems, type);
            //clipboard.cut = true; // set clipboard mode
        };

        /**
         * @ngdoc function
         * @name doPaste
         * @function
         * @methodOf transportplanningPackageClipboardService
         * @description move or copy the clipboard to the selected template group
         * @param {object} selected template group selected node
         * @returns
         */
        service.doPaste = function doPaste(pastedContent, targetPackage, type, onSuccess) {
            if (!targetPackage) {
                return;
            }

            var pastedData = angular.copy(pastedContent.data);

            if (angular.isArray(pastedData) && pastedData.length > 0) {

                // send changes to the server
                postClipboard(targetPackage.Id, pastedContent.action, pastedContent.type, pastedData, function (data) {
                    // remove node first
                    if (pastedContent.action === 'platformDragdropService.actions.move') {
                        removeNode(pastedContent.data);
                    }

                    // update clipboard and
                    pastedData = data;

                    //refresh Package list
                    packageMainService.load();

                    onSuccess(pastedContent.type);   // callback on success
                    clearClipboard();

                });
            }
        };

        /**
         * @ngdoc function
         * @name paste
         * @function
         * @methodOf transportplanningPackageClipboardService
         * @description move or copy the clipboard to the selected template group
         * @returns
         */
        service.paste = function (targetPackage, targetType, onSuccess) {
            service.doPaste({
                    type: clipboard.type,
                    data: clipboard.data,
                    action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
                },
                targetPackage, targetType, onSuccess);
        };

        /**
         * @ngdoc function
         * @name doCanPaste
         * @function
         * @methodOf transportplanningPackageClipboardService
         * @description check if the copied data can be moved or copied to the targetPackage
         * @returns
         */
        service.doCanPaste = function doCanPaste(canPastedContent, type, targetPackage) {
            var result = true;

            if (canPastedContent.type !== 'trsPackage') {
                return false;
            }

            if(!angular.isDefined(canPastedContent.data[0]))
            {
                return false;
            }

            var dragedPackage = canPastedContent.data[0];
            if(targetPackage === null || targetPackage.Id === dragedPackage.Id){
                return false;
            }

            var temptargetPackage = targetPackage;
            while(temptargetPackage.TransportPackageFk)
            {
                var parent = basicsLookupdataLookupDescriptorService.getLookupItem('TrsPackageLookup', temptargetPackage.TransportPackageFk);
                if(parent && parent.Id === dragedPackage.Id){
                    return false;
                }
                else {temptargetPackage = parent;}
            }

            if (dragedPackage.TrsRouteFk && dragedPackage.TrsRteStatusFk) {
                var statusList = routeStatusServ.getList();
                var status = _.find(statusList, {Id: dragedPackage.TrsRteStatusFk});
                if (status && status.IsInTransport === true) {
                return false;
                }
            }
            return result;
        };

        /**
         * @ngdoc function
         * @name canPaste
         * @function
         * @methodOf transportplanningPackageClipboardService
         * @description check if the copied data can be moved or copied to the target Package
         * @returns
         */
        service.canPaste = function (type, selectedPackage) {
            return service.doCanPaste({
                    type: clipboard.type,
                    data: clipboard.data,
                    action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
                },
                type, selectedPackage);
        };

        service.getClipboard = function getClipboard() {
            return clipboard;
        };

        service.fireOnDragStart = function fireOnDragStart() {
            service.onDragStart.fire();
        };

        service.fireOnDragEnd = function fireOnDragEnd(e, arg) {
            service.onDragEnd.fire(e, arg);
        };

        service.fireOnDrag = function fireOnDragEnd(e, arg) {
            service.onDrag.fire(e, arg);
        };

        service.clearClipboard = function clearClipboard() {
            clearClipboard();
        };

        service.clipboardHasData = function clipboardHasData() {
            return angular.isDefined(clipboard.data) && (clipboard.data !== null) && angular.isDefined(clipboard.data.length) && (clipboard.data.length > 0);
        };

        return service;
    }

})(angular);