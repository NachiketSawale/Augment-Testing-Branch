/**
 * Created by waz on 1/9/2018.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';
    angular.module(moduleName).factory('productionplanningMountingResRequisitionClipBoardService', ProductionplanningMountingResRequisitionClipBoardService);

    ProductionplanningMountingResRequisitionClipBoardService.$inject = [];

    function ProductionplanningMountingResRequisitionClipBoardService() {
        var typeForActivity = 'resRequisition-activity';
        var typeForTrsRequisition = 'resRequisition-trsRequisition';

        var service = {
            paste: paste,
            doCanPaste: doCanPaste,
            copy: copy,
            setClipboardMode: setClipboardMode
        };
        var clipboard = { type: null, data: null, isCutting: false };

        function copy(data, type) {
            clipboard.data = _.isArray(data) ? data : [data];
            clipboard.type = type;
        }

        function paste(itemOnDragEnd, type, defaultHandler, itemService) {
            var selected = itemService.parentService().getSelected();
            if (type === typeForActivity) {
                _.forEach(clipboard.data, function (d) {
                    d.PpsEventFk = selected.PpsEventFk;
                });
            }
            else if (type === typeForTrsRequisition) {
                _.forEach(clipboard.data, function (d) {
                    d.TrsRequisitionFk = selected.Id;
                });
            }
			/*jshint -W064*/
            Refresh(itemService);
        }

        function doCanPaste(source, type, itemOnDragEnd, itemService) {
            return ((source.type === typeForActivity && type === typeForTrsRequisition) ||
				(source.type === typeForTrsRequisition && type === typeForActivity)) &&
				(type === typeForActivity || (type === typeForTrsRequisition && itemService.canCreate())) &&
				source.itemService.getSelected() &&
				source.itemService.parentService().getSelected() &&
				itemService.parentService().getSelected();
        }

        function setClipboardMode(clipboardMode) {
            clipboard.isCutting = clipboardMode;
        }

        function Refresh(dataService) {
            var allItems = dataService.getList();
            var targetItems = _.filter(clipboard.data, function (item) {//ignore the existing items
                return !_.find(allItems, { Id: item.Id });
            });
            if (targetItems.length === 0){
                return;
            }

            var targetAllItems = _.concat(allItems, targetItems);
            allItems.length = 0;
            allItems = _.forEach(targetAllItems, function (item) {
                allItems.push(item);
            });
            dataService.markEntitiesAsModified(targetItems);
            dataService.gridRefresh();
        }

        return service;
    }

})(angular);