(function () {
    /* global globals, _ */
    'use strict';

    const angularModule = angular.module('basics.material');

    angularModule.factory('materialRoundingConfigDialogService', ['$http', '$translate', '$q', '$injector', 'platformDialogService', 'platformModalFormConfigService', 'materialRoundingConfigUIConfigurationService', 'materialRoundingConfigDataService',
        function ($http, $translate, $q, $injector, platformDialogService, platformModalFormConfigService, materialRoundingConfigUIConfigurationService, materialRoundingConfigDataService) {
            var service = {};
            var dialogMode = '';

            service.startByRoundingConfig = function (roundingConfig, roundingConfigType, contextFk, dlgMode) {
                var dialogConfig;
                dialogMode = dlgMode;
                if (_.isObject(roundingConfig)) {
                    roundingConfig.MaterialRoundingConfigType = roundingConfigType;
                }
                let currentItem = materialRoundingConfigDataService.setData(roundingConfig, dlgMode, contextFk);
                var formConfig = materialRoundingConfigUIConfigurationService.getFormConfig();
                dialogConfig = {
                    title: $translate.instant('basics.material.roundingConfig'),
                    dataItem: currentItem,
                    formConfiguration: formConfig,
                    resizeable: true,
                    handleOK: function handleOK() {
                        let updateData = {};
                        materialRoundingConfigDataService.provideUpdateData(updateData);
                        $http.post(globals.webApiBaseUrl + 'basics/material/roundingconfig/savematerialroundingconfig', updateData).then(function(){
                            let customizeDataService = $injector.get('basicsCustomizeInstanceDataService');
                            if (customizeDataService){
                                customizeDataService.load();
                            }
                            $injector.get('basicsLookupdataSimpleLookupService').refreshCachedData({
                                valueMember: 'Id',
                                displayMember: 'Description',
                                lookupModuleQualifier:'basics.customize.materialroundingconfig'});
                        });
                    },
                    handleCancel: function handleCancel() {
                        // Reset state
                        dialogMode = '';
                        materialRoundingConfigDataService.setData({});
                    }
                };
                platformModalFormConfigService.showDialog(dialogConfig);

            };


            service.startByRoundingConfigFks = function (roundingConfigTypeFk, materialRoundingConfigFk, contextFk, dlgMode) {
                let roundingConfigType = null;
                let roundingConfig = null;
                let deferedRoundingConfig = $q.defer();
                $http.post(globals.webApiBaseUrl + 'basics/customize/materialroundingconfigtype/list').then(function (response) {
                    roundingConfigType = _.find(response.data, function (configType) {
                        return configType.Id === roundingConfigTypeFk && configType.ContextFk === contextFk;
                    });

                    if (_.isObject(roundingConfigType)) {
                        $http.get(globals.webApiBaseUrl + 'basics/material/roundingconfig/getmaterialroundingconfigbyid?id=' + roundingConfigType.MaterialRoundingConfigFk).then(function (response) {
                            roundingConfig = response.data;
                            deferedRoundingConfig.resolve(roundingConfig);
                        });
                    }
                });

                return deferedRoundingConfig.promise.then(function () {
                    service.startByRoundingConfig(roundingConfig, roundingConfigType, contextFk, dlgMode);
                });
            };

            return service;
        }
    ]);
})();
