/**
 * Created by anl on 1/9/2018.
 */

(function (angular) {
'use strict';

var moduleName = 'productionplanning.producttemplate';
angular.module(moduleName).directive('productionplanningProducttemplateProductDescriptionLookup', ProductDescriptionLookup);

ProductDescriptionLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

function ProductDescriptionLookup(BasicsLookupdataLookupDirectiveDefinition) {

    var defaults = {
        lookupType: 'PPSProductDescriptionTiny',
        valueMember: 'Id',
        displayMember: 'Code',
        //editable: 'false'
        uuid: '57d3cef0d6bd4482a6695d90bdae0927',
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
            name: '*Assign PPS ProductDescription',
            name$tr$: 'productionplanning.producttemplate.productDescriptionDialogTitle'
        },
        version: 3
    };
    return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
}
})(angular);