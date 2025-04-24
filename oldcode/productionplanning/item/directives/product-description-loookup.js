/**
 * Created by anl on 1/9/2018.
 */

(function (angular) {
'use strict';

var moduleName = 'productionplanning.item';
angular.module(moduleName).directive('productionplanningItemProductDescriptionLookup', ProductDescriptionLookup);

ProductDescriptionLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

function ProductDescriptionLookup(BasicsLookupdataLookupDirectiveDefinition) {

    var defaults = {
        lookupType: 'PPSItemProductDescription',
        valueMember: 'Id',
        displayMember: 'Code',
        //editable: 'false'
        uuid: 'd8e6b5e9d5614af9b954a9c7ebb36ff8',
        columns: [
            {id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
            {
                id: 'desc',
                field: 'DescriptionInfo.Translated',
                name: 'DescriptionInfo',
                name$tr$: 'cloud.common.entityDescription'
            }
        ],
        width: 500,
        height: 200,
        title: {
            name: '*Assign Pps ProductDescription',
            name$tr$: 'productionplanning.item.descriptionDialogTitle'
        },
        version: 3
    };
    return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
}
})(angular);