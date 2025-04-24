/**
 * Created by zov on 12/17/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.common';
    angular.module(moduleName).service('ppsCommonLogUIStandardService', [
        'platformUIConfigInitService',
        'productionplanningCommonTranslationService',
        'ppsCommonLogLayout',
        'platformPermissionService',
        'ppsCommonLoggingConstant',
        function (platformUIConfigInitService,
                  ppsCommonTranslationService,
                  ppsCommonLogLayout) {
                  // platformPermissionService,
                  // ppsCommonLoggingConstant) {
            platformUIConfigInitService.createUIConfigurationService({
                service: this,
                layout: ppsCommonLogLayout,
                dtoSchemeId: {
                    moduleSubModule: 'ProductionPlanning.Common',
                    typeName: 'PpsLogReportVDto'
                },
                translator: ppsCommonTranslationService
            });

            // var canModifyRemark = platformPermissionService.hasWrite(ppsCommonLoggingConstant.AccessGuidModifyLogRemark);
            var columns = this.getStandardConfigForListView().columns;
            _.forEach(columns, function (o) {
                o.editor = null;
                // if(o.field !== 'Remark' || !canModifyRemark){
                //     o.editor = null;
                // }
            });
            var rows = this.getStandardConfigForDetailView().rows;
            _.forEach(rows, function (o) {
                o.reaonly = true;
                // if(o.model !== 'Remark' || !canModifyRemark){
                //     o.reaonly = true;
                // }
            });
        }]);
})();