/**
 * Created by zov on 12/27/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.configuration';
    angular.module(moduleName).service('ppsConfigurationLogConfigTypeService', [
        'platformTranslateService', '$translate',
        function (platformTranslateService, $translate) {

            var translatePromise = null;
            var configTypes = [
                {id: 0, description: '*required', translationId: 'productionplanning.configuration.logCfgType_Required'},
                {id: 1, description: '*optional', translationId: 'productionplanning.configuration.logCfgType_Optional'},
                {id: 2, description: '*silent', translationId: 'productionplanning.configuration.logCfgType_Silent'},
            ];

            this.translateConfigTypes = function () {
                if(!translatePromise){
                    translatePromise = platformTranslateService.registerModule(moduleName, true).then(function () {
                        configTypes.forEach(function (cfgType) {
                            var translatedDesc = $translate.instant(cfgType.translationId);
                            if(translatedDesc !== cfgType.translationId){
                                cfgType.description = translatedDesc;
                            }
                        });
                    });
                }
                
                return translatePromise;
            };
            
            this.getLogConfigTypes = function () {
                return configTypes;
            };
        }
    ]);
})();