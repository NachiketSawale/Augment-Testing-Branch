(function () {
    'use strict';
    let moduleName = 'basics.material';

    angular.module(moduleName).factory('materialRoundingConfigUIConfigurationService', ['basicsLookupdataConfigGenerator',
        function (basicsLookupdataConfigGenerator) {
            let service = {};

            let formConfig = {
                groups: [
                    {
                        gid: 'roundingConfig',
                        header: 'Rounding Config',
                        header$tr$: 'basics.material.roundingConfigurationDialogForm.dialogRoundingConfigHeaderText',
                        isOpen: true,
                        visible: true,
                        sortOrder: 5
                    }
                ],
                rows: [
                    {
                        gid: 'roundingConfig',
                        rid: 'materialRoundingConfigType',
                        label: 'Rounding Config Type',
                        label$tr$: 'basics.material.roundingConfigDialogForm.roundingConfigType',
                        type: 'directive',
                        directive: 'material-rounding-config-type-lookup',
                        model: 'roundingConfigTypeFk',
                        options: {
                            serviceName: 'materialRoundingConfigTypeLookupService',
                            displayMember: 'Description',
                            valueMember: 'Id',
                            watchItems: true,
                            showClearButton: true
                        },
                        readonly: true,
                        disabled: false,
                        visible: true,
                        sortOrder: 1
                    },
                    {
                        gid: 'roundingConfig',
                        rid: 'roundingConfigDesc',
                        label: 'Description',
                        label$tr$: 'cloud.common.entityDescription',
                        type: 'description',
                        model: 'roundingConfigDesc',
                        readonly: false,
                        visible: true,
                        sortOrder: 3
                    },
                    {
                        gid: 'roundingConfig',
                        label: 'Rounding Configure Detail',
                        label$tr$: 'basics.material.roundingConfigurationDialogForm.roundingConfigDetail',
                        rid: 'roundingConfigDetail',
                        type: 'directive',
                        model: 'roundingConfigDetail',
                        directive: 'material-rounding-config-detail-grid',
                        sortOrder: 4
                    }
                ],
                overloads: {}
            };

            service.getFormConfig = function () {
                let deepCopiedFormConfiguration = angular.copy(formConfig);
                return deepCopiedFormConfiguration;
            };

            return service;

        }
    ]);

})(angular);
