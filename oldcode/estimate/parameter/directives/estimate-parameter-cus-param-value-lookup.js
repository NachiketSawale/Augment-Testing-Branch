/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
    'use strict';
    let moduleName = 'estimate.parameter';
    angular.module(moduleName).directive('estimateParameterCusParamValueLookup',
        ['_', '$q','$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateRuleParameterConstant',
            function (_, $q, $injector,BasicsLookupdataLookupDirectiveDefinition, estimateRuleParameterConstant) {
                let defaults = {
                    lookupType: 'estimateParameterCusParamValueLookup',
                    valueMember: 'Id',
                    displayMember: 'ValueDetail',
                    uuid: '5ca913432b69444e8578a29fe068c1a2',
                    disableDataCaching: true,
                    columns: [
                        { id: 'Description', field: 'DescriptionInfo', name: 'Description', formatter: 'translation', width: 150,name$tr$: 'cloud.common.entityDescription' },
                        { id: 'ValueDetail', field: 'ValueDetail', name: 'ValueDetail',formatter: valueDetailFormatter, width: 150,name$tr$: 'basics.customize.valuedetail' },
                    ],
                    events: [{
                        name: 'onInitialized', handler: (e, args) => {
                            $injector.get('estimateParameterValueAssignmentGridService').setParamValueLookup(args.lookup);
                        }
                    }],
                    onDataRefresh: function () {
                        return getParamValueList();
                    }
                };

                function valueDetailFormatter(row, cell, value, columnDef, entity) {
	                if (entity.ValueType === estimateRuleParameterConstant.Decimal2) {
		                return entity.ValueDetail;
	                } else if(entity.ValueType === estimateRuleParameterConstant.Text){
                        return entity.ValueText;
                    }else{
                        return entity.Value;
                    }
                }

                function getParamValueList() {
                    return $q.when($injector.get('estimateParameterValueAssignmentGridService').getList());
                }

                return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
                    dataProvider: {
                        getList: function () {
                            return getParamValueList();
                        },
                        getItemByKey: function (value) {
                            return _.find($injector.get('estimateParameterValueAssignmentGridService').getList(),function (item) {
                                return item.Id === parseInt(value);
                            });
                        }
                    }
                });
            }]);

})(angular);
