/**
 * Created by zov on 9/29/2019.
 */
(function (){
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.common';
    angular.module(moduleName).service('ppsCommonLoggingUiService', ppsCommonLoggingUiService);
    ppsCommonLoggingUiService.$inject = ['platformUIStandardConfigService', 'ppsCommonLoggingHelper'];
    function ppsCommonLoggingUiService(platformUIStandardConfigService, ppsCommonLoggingHelper) {

        function LoggingUIStandardService(layout, schemaOption, translateService) {
            var extResutl = ppsCommonLoggingHelper.extendLayoutIfNeeded(layout, schemaOption, translateService);
            platformUIStandardConfigService.call(this, extResutl.layout, extResutl.dtoSchema, extResutl.translateService);
        }

        LoggingUIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
        LoggingUIStandardService.prototype.constructor = LoggingUIStandardService;

        return LoggingUIStandardService;
    }
})();