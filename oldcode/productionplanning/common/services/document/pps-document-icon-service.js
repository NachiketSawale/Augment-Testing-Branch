(function () {
    'use strict';
    var moduleName = 'productionplanning.common';

    angular.module(moduleName).service('ppsDocumentIconService', ['$translate', function ($translate) {
            var service = {};

            var icons = [
                {
                    id: 'parentUnit',
                    res: 'control-icons ico-accordion-root',
                    toolTip: 'productionplanning.common.document.parentUnit'
                }, {
                    id: 'currentUnit',
                    res: 'control-icons ico-accordion-grp',
                    toolTip: 'productionplanning.common.document.currentUnit'
                }];

            service.select = function (item) {
                if (item) {
                    var icon = _.find(icons, {'id': item.Belonging});
                    if (icon) {
                        return icon.res;
                    }
                }
            };

            service.selectTooltip = function (context) {
                if (context) {
                    var icon = _.find(icons, {'id': context.Belonging});
                    if (icon) {
                        return $translate.instant(icon.toolTip);
                    }
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