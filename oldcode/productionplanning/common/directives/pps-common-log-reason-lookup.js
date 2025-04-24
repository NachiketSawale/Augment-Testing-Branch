/**
 * Created by zov on 10/9/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.common';
    angular.module(moduleName).directive('ppsCommonLogReasonLookup', ppsCommonLogReasonLookup);
    ppsCommonLogReasonLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];
    function ppsCommonLogReasonLookup(BasicsLookupdataLookupDirectiveDefinition) {
        var defaults = {
            lookupType: 'PpsLogReason',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated',
            uuid: '029a61e39e5b47d8b363348491248f36',
            columns: [
                {
                    id: 'description',
                    field: 'DescriptionInfo.Translated',
                    name: 'Description',
                    width: 120,
                    name$tr$: 'cloud.common.entityDescription'
                }
            ],
            treeOptions: {
                parentProp: 'PpsLogReasonGroupFk',
                childProp: 'ChildItems',
                initialState: 'expanded',
                inlineFilters: true,
                hierarchyEnabled: true
            },
            selectableCallback: function (dataItem) {
                return !!dataItem.PpsLogReasonGroupFk;
            }
        };

        return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
            processData: function processData(dataList) {
                if (dataList) {
                    for (var i = 0; i < dataList.length; ++i) {
                        var data = dataList[i];
                        if (data.PpsLogReasonGroupFk) {
                            data.image = 'control-icons ico-active';
                        }
                        processData(data.ChildItems);
                    }
                }

                return dataList;
            }
        });
    }
})();