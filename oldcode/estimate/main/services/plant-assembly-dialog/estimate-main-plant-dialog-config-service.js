/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
    'use strict';
    /* globals _ */
    let moduleName = 'estimate.main';

    /**
     * @ngdoc service
     * @name estimateMainPlantDialogConfigService
     * @function
     * @description
     * estimateMainPlantDialogConfigService is the data service for estimate plant assembly dialog configuration.
     */
    angular.module(moduleName).factory('estimateMainPlantDialogConfigService', ['$injector', 'basicsLookupdataConfigGenerator', 'platformTranslateService',
        function ( $injector, basicsLookupdataConfigGenerator, platformTranslateService) {
            return{
                getStandardConfigForListView:getStandardConfigForListView
            };

            function getStandardConfigForListView() {
                let columns =  [
                    {
                        id: 'Selected',
                        field: 'IsChecked',
                        toolTip: 'Select',
                        name$tr$: 'estimate.main.dissolveAssemblyWizard.select',
                        formatter: 'boolean',
                        editor: 'boolean',
                        isTransient: true,
                        validator: function (item, value){
                            let groupSelected =  $injector.get('estimateMainPlantDialogService').getSelected();
                            let plantAssemblies =  $injector.get('estimateMainPlantAssemblyDialogService').getList();
                            let filteredPlantAssemblies = _.filter(plantAssemblies, function(item){
                                return item.PlantFk === groupSelected.Id;
                            });

                            item.IsChecked= value;

                            $injector.get('platformRuntimeDataService').applyValidationResult({
                                valid: true,
                                apply: true,
                            }, item, 'IsChecked');

                            let grid = $injector.get('platformGridAPI').grids.element('id', 'd9a7bad1ffd74002b1db662a6b2c2893');

                            if(value){
                                if(filteredPlantAssemblies && filteredPlantAssemblies.length >= 1 ){
                                    let ids = _.map(filteredPlantAssemblies, 'Id');
                                    let rows = grid.dataView.mapIdsToRows(ids);
                                    grid.instance.setSelectedRows(rows);
                                }
                            }else{
                                grid.instance.setSelectedRows({});
                            }
                            return true;
                        }
                    },
                    {
                        id: 1,
                        field: 'Code',
                        name: 'Code',
                        name$tr$: 'cloud.common.entityCode',
                        readonly: true,
                        editor: null,
                        width: 80
                    },
                    {
                        id: 2,
                        field: 'DescriptionInfo',
                        name: 'Description',
                        name$tr$: 'cloud.common.entityDescription',
                        formatter: 'translation',
                        editor: null,
                        readonly: true,
                        width: 160
                    },
                    {
                        id: 'EstPlantGroupFk',
                        field: 'PlantGroupFk',
                        name: 'Plant Group',
                        name$tr$: 'basics.customize.plantgroupfk',
                        readonly: true
                    }
                ];

                let plantGroupFkConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                    dataServiceName: 'resourceEquipmentGroupLookupDataService',
                    readonly: true,
                    cacheEnable: true,
                    additionalColumns: false
                });

                let plantGroupFk = _.find(columns, function (item) {
                    return item.id === 'EstPlantGroupFk';
                });

                angular.extend(plantGroupFk,plantGroupFkConfig.grid);
                plantGroupFk.editor = null;
                plantGroupFk.editorOptions = null;

                platformTranslateService.translateGridConfig(columns);
                return {
                    columns: columns,
                    isTranslated: true
                };
            }

        }]);

})(angular);