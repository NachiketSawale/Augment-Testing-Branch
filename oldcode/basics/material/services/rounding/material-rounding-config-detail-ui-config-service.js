(function (angular) {

    'use strict';
    let moduleName = 'basics.material';


    angular.module(moduleName).factory('materialRoundingConfigDetailUIConfigService',
        ['_', '$injector', 'basicsLookupdataConfigGenerator', 'platformTranslateService',
            function (_, $injector, basicsLookupdataConfigGenerator, platformTranslateService) {

                let service = {};

                let gridColumns = [
                    {
                        id: 'materialRoundingColumnId',
                        field: 'ColumnId',
                        name: 'Column ID',
                        name$tr$: 'basics.material.columnConfigDetails.ColumnId',
                        toolTip: 'Column ID',
                        formatter: 'lookup',
                        mandatory: true,
                        required: true,
                        width: 110,
                        readonly: true
                    },
                    {
                        id: 'uiDisplayTo',
                        field: 'UiDisplayTo',
                        name: 'UI Display To',
                        name$tr$: 'basics.material.roundingConfigurationDialogForm.uiDisplayTo',
                        domain: 'integer',
                        editor: 'integer',
                        width: 70,
                        toolTip: 'Length',
                        toolTip$tr$: 'basics.material.roundingConfigurationDialogForm.uiDisplayTo',
                        formatter: 'integer'
                    },
                    {
                        id: 'isWithoutRonding',
                        field: 'IsWithoutRounding',
                        name: 'Without Rounding',
                        name$tr$: 'basics.material.columnConfigurationDialogForm.isWithoutRonding',
                        domain: 'boolean',
                        editor: 'boolean',
                        width: 100,
                        toolTip: 'Length',
                        toolTip$tr$: 'basics.material.roundingConfigurationDialogForm.isWithoutRonding',
                        formatter: 'boolean'
                    },
                    {
                        id: 'roundTo',
                        field: 'RoundTo',
                        name: 'Round To',
                        name$tr$: 'basics.material.roundingConfigurationDialogForm.roundTo',
                        domain: 'integer',
                        editor: 'integer',
                        width: 70,
                        toolTip: 'Length',
                        toolTip$tr$: 'basics.material.roundingConfigurationDialogForm.roundTo',
                        formatter: 'integer'
                    },
                    {
                        id: 'roundToFk',
                        field: 'RoundToFk',
                        name: 'Rounding To',
                        name$tr$: 'basics.material.roundingConfigurationDialogForm.roundingTo',
                        width: 170,
                        toolTip: 'Rounding To',
                        toolTip$tr$: 'basics.material.roundingConfigurationDialogForm.roundingTo',
                        formatter: 'lookup'
                    },
                    {
                        id: 'roundingMethodFk',
                        field: 'RoundingMethodFk',
                        name: 'Rounding Method',
                        name$tr$: 'basics.material.roundingConfigurationDialogForm.roundingMethodFk',
                        toolTip: 'Rounding Method',
                        formatter: 'lookup',
                        width: 100
                    }
                ];


                let materialRoundingColumnIdConfig = _.find(gridColumns, function (item) {
                    return item.id === 'materialRoundingColumnId';
                });

                let materialRoundingColumnIdLookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                    dataServiceName: 'materialRoundingConfigColumnIdsLookupService',
                    valMember: 'ColumnId',
                    dispMember: 'Column',
                    readonly: true
                });

                angular.extend(materialRoundingColumnIdConfig, materialRoundingColumnIdLookupConfig.grid);

                let roundToConfig = _.find(gridColumns, function (item) {
                    return item.id === 'roundToFk';
                });

                let roundToLookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                    dataServiceName: 'basicsCustomRoundToLookupDataService',
                    valMember: 'Id',
                    dispMember: 'RoundTo'
                });

                angular.extend(roundToConfig, roundToLookupConfig.grid);

                let roundingMethodConfig = _.find(gridColumns, function (item) {
                    return item.id === 'roundingMethodFk';
                });

                let roundingMethodLookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                    dataServiceName: 'basicsCustomRoundingMethodLookupDataService',
                    valMember: 'Id',
                    dispMember: 'Type'
                });

                angular.extend(roundingMethodConfig, roundingMethodLookupConfig.grid);


                platformTranslateService.translateGridConfig(gridColumns);

                service.getStandardConfigForListView = function () {

                    return {
                        addValidationAutomatically: true,
                        columns: gridColumns
                    };
                };

                return service;
            }
        ]);

})(angular);
