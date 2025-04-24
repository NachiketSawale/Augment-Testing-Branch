// pps-common-product-link-icon-service

(function () {
    'use strict';
    var moduleName = 'productionplanning.common';

    angular.module(moduleName).service('ppsCommonProductLinkIconService', ['$translate', function ($translate) {
            var service = {};

            var icons = [
                {
                    id: 'Linked_Current',
                    res: 'status-icons ico-status46',
                    toolTip: 'productionplanning.common.product.linkedCurrent'
                }, {
                    id: 'Linked_Cross',
                    res: 'control-icons ico-link',
                    toolTip: 'productionplanning.common.product.linkedCross'
                }, {
                    id: 'Linked_Other',
                    res: 'status-icons ico-status47',
                    toolTip: 'productionplanning.common.product.linkedOther'
                }, {
                    id: 'Linked_Any',
                    res: 'control-icons ico-drag-link',
                    toolTip: 'productionplanning.common.product.linkedAny'
                }, {
                    id: 'Arrow',
                    res: 'control-icons ico-event-start',
                    toolTip: 'productionplanning.common.product.arrow'
                }, {
                    id: 'Tick',
                    res: 'control-icons ico-ca-inherit-access',
                    toolTip: 'productionplanning.common.product.tick'
                }];

            service.select = function (item) {
                if (item) {
                    var icon = _.find(icons, {'id': item.LinkProductIcon});
                    if (icon) {
                        return icon.res;
                    }
                }
            };

            service.selectTooltip = function (context) {
                if (context && context.AnnoStatusInfos !== null) {
                    var tip = '';
                    _.forEach(context.AnnoStatusInfos, function (info){
                        tip = tip + info.DocFileName + '\n';
                    });
                    return tip;
                }
            };

            service.getIcons = function () {
                return icons;
            };

            service.isCss = function () {
                return true;
            };

            return service;
        }]
    );
})();