/**
 * Created by anl on 5/23/2017.
 */


(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.item';
    angular.module(moduleName).directive('productionplanningItemItemLookup', PoductionPlanningItemLookup);

    PoductionPlanningItemLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

    function PoductionPlanningItemLookup(BasicsLookupdataLookupDirectiveDefinition) {

        var defaults = {
            lookupType: 'PPSItem',
            valueMember: 'Id',
            displayMember: 'Code',
            uuid: '',
            columns: [
                { id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
                { id: 'Description', field: 'DescriptionInfo.Description', name: 'Description', name$tr$: 'basics.site.entitySite' }
            ],
            treeOptions: {
                parentProp: 'PPSItemFk',
                childProp: 'ChildItems',
                initialState: 'expanded',
                inlineFilters: true,
                hierarchyEnabled: true
            },
            width: 500,
            height: 200,
            version: 3
        };

        return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
    }
})(angular);