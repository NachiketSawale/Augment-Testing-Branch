
(function () {
    /* global globals */
    'use strict';

    let moduleName = 'estimate.parameter';

    angular.module(moduleName).factory('estimateParameterDialogUIService', [
        'platformTranslateService',
        'basicsLookupdataConfigGenerator',
        '$injector',
        'estimateRuleParameterConstant',
        function (platformTranslateService,
                  basicsLookupdataConfigGenerator,
                  $injector,
                  estimateRuleParameterConstant) {
            let service = {};

            function getBaseFormConfig(isLookup){
               let formConfiguration = {
                    showGrouping: true,
                    change: 'change',
                    addValidationAutomatically: true,
                    groups: [
                        {
                            gid: 'basicGroup',
                            header: 'Basic Settings',
                            header$tr$: 'estimate.main.bidCreationWizard.basic',
                            isOpen: true,
                            visible: true,
                            sortOrder: 1,
                            attributes: []
                        },
                        {
                            gid: 'estimateParameterValueAssignment',
                            header: 'Parameter Value',
                            header$tr$: 'basics.customize.parametervalue',
                            isOpen: true,
                            visible: true,
                            sortOrder: 3,
                            attributes: []
                        }
                    ],
                    rows: [
                        {
                            gid: 'basicGroup',
                            label: 'Code',
                            label$tr$: 'estimate.main.estimateCode',
                            rid: 'Code',
                            model: 'Code',
                            sortOrder: 1,
                            type: 'code',
                            domain: 'code',
                        },
                        {
                            gid: 'basicGroup',
                            rid: 'descriptioninfo',
                            label: 'Description',
                            label$tr$: 'cloud.common.entityDescription',
                            model: 'DescriptionInfo',
                            sortOrder: 2,
                            readonly: false,
                            type: 'translation',
                        },
                        basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm ('basics.customize.estparametervaluetype', 'Description',
                            {
                                gid: 'basicGroup',
                                rid: 'ParamvaluetypeFk',
                                model: 'ParamvaluetypeFk',
                                sortOrder: 3,
                                label: 'Param Value Type',
                                label$tr$: 'basics.customize.paramvaluetypefk',
                                type: 'integer',
                                validator: function validator(entity, value) {
                                    entity.oldParamValueTypeFk = value;
                                    return true;
                                },
                                change: function (entity) {
                                    $injector.get('estimateParameterDialogDataService').paramValueTypeChange(entity);
                                },
                            }
                        ),
                        {
                            gid: 'basicGroup',
                            rid: 'Islookup',
                            label: 'Is Lookup',
                            label$tr$: 'estimate.parameter.isLookup',
                            model: 'Islookup',
                            readonly: false,
                            type: 'boolean',
                            change: function (entity) {
                                $injector.get('estimateParameterDialogDataService').isLookUpChange(entity);
                            },
                            sortOrder: 4,
                        },
                        {
                            gid: 'basicGroup',
                            rid: 'UomFk',
                            model: 'UomFk',
                            field: 'UomFk',
                            label: 'Uom',
                            label$tr$: 'basics.costcodes.uoM',
                            formatter: 'lookup',
                            formatterOptions: {
                                lookupType: 'uom',
                                displayMember: 'Unit'
                            },
                            type: 'directive',
                            directive: 'basics-lookupdata-uom-lookup',
                            sortOrder: 5,
                            readonly:false,
                        },
                        {
                            gid: 'estimateParameterValueAssignment',
                            rid: 'estimateParameterValueDetails',
                            type: 'directive',
                            model: 'estimateParameterValueAssignment',
                            required: true,
                            directive: 'estimate-parameter-value-assignment-grid',
                            sortOrder: 8
                        }
                    ],
                    overloads: {},
                    skipPermissionCheck: true
                };

               if(isLookup){
                   formConfiguration.rows.push(
                       {
                           gid: 'basicGroup',
                           rid: 'ValueDetail',
                           label: 'Value',
                           label$tr$: 'cloud.common.entityValue',
                           model: 'ValueDetail',
                           sortOrder: 6,
                           readonly: false,
                           formatter: 'lookup',
                           formatterOptions: {
                               lookupType: 'estimateParameterCusParamValueLookup',
                               displayMember: 'ValueDetail'
                           },
                           type: 'directive',
                           directive: 'estimate-parameter-cus-param-value-lookup'
                       },
                   );
               }else {
                   formConfiguration.rows.push(
                       {
                           gid: 'basicGroup',
                           rid: 'ValueDetail',
                           label: 'Value',
                           label$tr$: 'cloud.common.entityValue',
                           model: 'ValueDetail',
                           sortOrder: 6,
                           readonly: false,
                           type: 'dynamic',
                           domain: function (item, column) {
                               let domain;
                               if(item.ParamvaluetypeFk === estimateRuleParameterConstant.Boolean){
                                   domain = 'boolean';
                                   column.DefaultValue = null;
                                   column.ValueText = null;
                                   column.field = 'ValueDetail';
                                   column.editorOptions = null;
                                   column.formatterOptions = null;
                                   column.regex = null;
                               }else if(item.ParamvaluetypeFk === estimateRuleParameterConstant.Text){
                                   domain = 'comment';
                                   column.DefaultValue = 0;
                                   column.field = 'ValueText';
                                   column.editorOptions = null;
                                   column.formatterOptions = null;
                                   column.maxLength= 255;
                                   column.regex = null;
                               }else{   // means the valueType is Decimal2 or the valueType is Undefined
                                   domain = 'quantity';
                                   column.field = 'DefaultValue';
                                   column.ValueText = null;
                                   column.editorOptions = { decimalPlaces: 3 };
                                   column.formatterOptions = { decimalPlaces: 3 };
                               }
                               return domain;
                           }
                       }
                   )
               }

               return formConfiguration;
            }

            service.getFormConfig = function(isLookup) {
                let formConfig = getBaseFormConfig(isLookup);
                platformTranslateService.translateFormConfig(formConfig);
                return formConfig;
            };

            return service;
        }]);
})();
