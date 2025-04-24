
(function (angular) {
    'use strict';

    angular.module('controlling.generalcontractor').controller('controllingGeneralContractorCreateCostControlFrmEstWizardController',
        ['_', '$log', '$timeout', '$scope', '$injector', '$translate','platformGridAPI', 'platformDataValidationService', 'platformRuntimeDataService', 'platformTranslateService', 'controllingGeneralContractorCreateCostControlFrmEstWizardDialogService',
            function (_, $log, $timeout, $scope, $injector, $translate, platformGridAPI,platformDataValidationService, platformRuntimeDataService, platformTranslateService, dialogConfigService) {

                $scope.options = $scope.$parent.modalOptions;
                $scope.dataItem = $scope.options.dataItem;

                let estHeaders =[];
                $scope.dataItem = $scope.options.dataItem;

                function ensureColumnsAreTranslated(columns) {
                    if (!columns.isTranslated) {
                        $injector.get('platformTranslateService').translateGridConfig(columns);
                        columns.isTranslated = true;
                    }
                }

                function createGrid(scope, columns, dataItems) {
                    let platformCreateUuid = $injector.get('platformCreateUuid');
                    let platformGridAPI = $injector.get('platformGridAPI');

                    ensureColumnsAreTranslated(columns);

                    if(!scope.gridId) {
                        scope.gridId = platformCreateUuid ();
                    }
                    scope.gridData = {
                        state: scope.gridId
                    };

                    if (!platformGridAPI.grids.exist(scope.gridId)) {
                        let gridConfig = {
                            columns: columns,
                            data: dataItems,
                            id: scope.gridId,
                            lazyInit: false,
                            enableConfigSave: true,
                            options: {
                                tree: false,
                                indicator: true,
                                idProperty: 'Id',
                                iconClass: ''
                            }
                        };
                        platformGridAPI.grids.config(gridConfig);

                    } else {
                        platformGridAPI.columns.configuration(scope.gridId, columns);
                    }

                    scope.$on('$destroy', function () {
                        if (platformGridAPI.grids.exist(scope.gridId)) {
                            platformGridAPI.grids.unregister(scope.gridId);
                        }
                    });

                    return scope.gridId;
                }

                function  validateIsCost(entity, value) {
                    let readonly = false;
                    if(!value && !entity.IsBudget && !entity.IsRevenue){
                        readonly = true;
                        entity.IsMarked = false;
                    }

                    platformRuntimeDataService.readonly(entity, [
                        {field: 'IsMarked', readonly: readonly}
                    ]);
                    $scope.$emit('IsMarkedChanged');
                }

                function   validateIsBudget(entity, value){
                    let readonly = false;
                    if(!value && !entity.IsCost && !entity.IsRevenue){
                        readonly = true;
                        entity.IsMarked = false;
                    }

                    platformRuntimeDataService.readonly(entity, [
                        {field: 'IsMarked', readonly: readonly}
                    ]);
                    $scope.$emit('IsMarkedChanged');
                }

                function validateIsRevenue(entity, value){
                    let readonly = false;
                    if(!value && !entity.IsCost && !entity.IsBudget){
                        readonly = true;
                        entity.IsMarked = false;
                    }

                    platformRuntimeDataService.readonly(entity, [
                        {field: 'IsMarked', readonly: readonly}
                    ]);
                    $scope.$emit('IsMarkedChanged');
                }

                function getColumns() {
                    let columns =[
                        {
                            id: 'marker',
                            formatter: 'boolean',
                            field: 'IsMarked',
                            name: 'Selection',
                            name$tr$: 'controlling.generalcontractor.IsMarkedTitle',
                            editor: 'boolean',
                            readonly: false,
                            pinned: true,
                            headerChkbox: false,
                            width: 60
                        },
                        {
                            id: 'flag',
                            field: 'Flag',
                            name: 'Info',
                            editor:null,
                            'formatter': function (row, cell, value) {
                                value = !value? '':value;
                                let outValue = '<div class="flex-align-center flex-element text-center">';

                                if(value === '1'){ // green icon
                                    outValue += '<i class="block-image status-icons ico-status02" title="' + $translate.instant('controlling.generalcontractor.greenHints') + '"></i>';
                                }else if(value === '2'){ // red icon
                                    outValue += '<i class="block-image status-icons ico-status39" title="' + $translate.instant('controlling.generalcontractor.redHints') + '"></i>';
                                }else if(value === '3'){ // yellow icon
                                    outValue += '<i class="block-image type-icons ico-warning19" title="' + $translate.instant('controlling.generalcontractor.yellowHints') + '"></i>';
                                }else if(value === '4'){
                                    outValue += '<i class="block-image status-icons ico-status05" title="' + $translate.instant('controlling.generalcontractor.yellowHints') + '"></i>';
                                }

                                outValue += '</div>';
                                return outValue;
                            },
                            name$tr$: 'controlling.generalcontractor.Flag'
                        },
                        {
                            id: 'Code',
                            field: 'Code',
                            name: 'Code',
                            formatter: 'code',
                            name$tr$: 'cloud.common.entityCode'
                        },
                        {
                            id: 'comment',
                            field: 'Comment',
                            name: 'Comment',
                            toolTip: 'Comment',
                            editor: 'description',
                            maxLength: 240,
                            formatter: 'description',
                            name$tr$: 'controlling.generalcontractor.Comment'
                        },
                        {
                            id: 'estStatusFk',
                            field: 'EstStatusFk',
                            name: 'Status',
                            toolTip: 'Status',
                            editor: null,
                            maxLength: 240,
                            readOnly: true,
                            formatter: 'lookup',
                            formatterOptions: {
                                backgroundColorLayer: '',
                                backgroundColorType: '',
                                displayMember: 'Description',
                                imageSelector: 'platformStatusIconService',
                                lookupModuleQualifier: 'basics.customize.eststatus',
                                lookupSimpleLookup: true,
                                svgBackgroundColor: '',
                                valueMember: 'Id'
                            },
                            name$tr$: 'cloud.common.entityStatus'
                        },{
                            id: 'estTypeFk',
                            field: 'EstTypeFk',
                            name: 'Estimate Type',
                            toolTip: 'Estimate Type',
                            editor: null,
                            maxLength: 240,
                            readOnly: true,
                            formatter: 'lookup',
                            formatterOptions: {
                                valueMember:'Id',
                                displayMember:'Description',
                                lookupName:'estimate.lookup.esttype',
                                lookupType:'estimate.lookup.esttype',
                                lookupSimpleLookup: true,
                                lookupModuleQualifier:'estimate.lookup.esttype'
                            },
                            name$tr$: 'controlling.generalcontractor.EstType'
                        },
                        {
                            id: 'Description',
                            field: 'DescriptionInfo',
                            name: 'Description',
                            formatter: 'translation',
                            name$tr$: 'cloud.common.entityDescription',
                            width: 100
                        },{
                            id: 'isCost',
                            field: 'IsCost',
                            name: 'Is Cost',
                            name$tr$: 'controlling.generalcontractor.isCost',
                            sortable: true,
                            editor: 'boolean',
                            width: 90,
                            formatter: 'boolean',
                            validator: validateIsCost
                        },
                        {
                            id: 'isBudget',
                            field: 'IsBudget',
                            name: 'Is Budget',
                            name$tr$: 'controlling.generalcontractor.isBudget',
                            formatter: 'boolean',
                            editor: 'boolean',
                            width: 100,
                            validator: validateIsBudget
                        },
                        {
                            id: 'isRevenue',
                            field: 'IsRevenue',
                            name: 'Is Revenue',
                            name$tr$: 'controlling.generalcontractor.isRevenue',
                            formatter: 'boolean',
                            editor: 'boolean',
                            width: 100,
                            validator: validateIsRevenue
                        }
                    ];

                    return columns;
                }

                $scope.gridId = createGrid($scope, getColumns(), []);

                function updateGrid(data) {
                    $scope.isOkDisabled = _.size(_.filter(data, {'IsMarked': true})) === 0;

                    _.each(data, function (item) {
                        platformRuntimeDataService.readonly(item, [
                            {field: 'Comment', readonly: false}
                        ]);
                        item.__rt$data.readonly = [{'field': 'Comment', 'readonly': false}];
                    });

                    platformGridAPI.items.data($scope.gridId, data);
                }



                function addOnCellChangeEvent(scope, gridId, column, handlerFunction) {
                    if (_.isFunction(handlerFunction)) {
                        // marker change event
                        let onCellChange = function onCellChange(e, arg) {
                            let col = arg.grid.getColumns()[arg.cell].field;
                            if (col === column) {
                                let value = arg.item[column];
                                let selectedItem = arg.item;
                                handlerFunction(value, selectedItem);
                            }
                        };

                        // register and unregister onCellChange event
                        let platformGridAPI = $injector.get('platformGridAPI');
                        platformGridAPI.events.register(scope.gridId, 'onCellChange', onCellChange);
                        scope.$on('$destroy', function () {
                            platformGridAPI.events.unregister(scope.gridId, 'onCellChange', onCellChange);
                        });
                    }
                }

                addOnCellChangeEvent($scope, $scope.gridId, 'IsMarked', function () {
                    $scope.$emit('IsMarkedChanged');
                });

                $scope.loadData = function loadData() {
                    dialogConfigService.getEstHeaderFromServer().then (function (data) {
                        estHeaders = data;
                        updateGrid(data);
                    });
                };

                // prepare and set data (preselected items will be marked initially)
                $scope.loadData();

                $scope.noPinProjectError = {
                    show: false,
                    messageCol: 1,
                    message: $translate.instant('controlling.generalcontractor.noPinnedProject'),
                    iconCol: 1,
                    type: 3
                };

                $scope.$on('IsMarkedChanged', function () {
                    $scope.isOkDisabled = _.size(_.filter(estHeaders, {'IsMarked': true})) === 0;

                });

                $scope.modalOptions = {
                    headerText: $translate.instant ('controlling.generalcontractor.CreateUpdateCostControlStructureWizardFrmEst')
                };

                function init(){
                    $scope.noPinProjectError.show  = false;
                    let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
                    let context = cloudDesktopPinningContextService.getContext();
                    let item =_.find(context, {'token': 'project.main'});
                    $scope.noPinProjectError.show = $scope.isOkDisabled = !item;
                }

                init();

                $scope.modalOptions.ok = function () {
                    let entities = _.filter(estHeaders, {'IsMarked': true});

                    $scope.dataItem.EstHeaderHelper = [];
                    if(entities && entities.length){
                        _.forEach(entities,function (d) {
                            let estHeaderHelper ={};
                            estHeaderHelper.EstHeaderFk = d.Id;
                            estHeaderHelper.Comment = d.Comment;
                            estHeaderHelper.IsCost = d.IsCost;
                            estHeaderHelper.IsBudget = d.IsBudget;
                            estHeaderHelper.IsRevenue = d.IsRevenue;
                            $scope.dataItem.EstHeaderHelper.push(estHeaderHelper);
                        });
                    }

                    $scope.$close({ok: true, data: $scope.dataItem});
                };

                $scope.modalOptions.cancel = function () {
                    $scope.$close(false);
                };

                $scope.$on('$destroy', function () {
                    platformGridAPI.grids.unregister($scope.gridId);
                });
            }
        ]
    );
})(angular);

