/**
 * Created by anl on 8/23/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';
    angular.module(moduleName).directive('productionplanningMountingActivityLookup', MntActivityLookup);

    MntActivityLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataConfigGenerator'];

    function MntActivityLookup(BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataConfigGenerator) {

        var defaults = {
            lookupType: 'MntActivity',
            valueMember: 'Id',
            displayMember: 'Code',
            //editable: 'false'
            uuid: '79375772ac624db1acafd340c10886cf',
            columns: [
                {id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
                {
                    id: 'desc',
                    field: 'DescriptionInfo.Translated',
                    name: 'DescriptionInfo',
                    name$tr$: 'cloud.common.entityDescription'
                },
                {
                    id: 'MntActivityStatus',
                    field: 'ActStatusFk',
                    name: 'ActStatusFk',
                    formatter: 'lookup',
                    formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.mountingactivitystatus', null, {
                        showIcon: true
                    }).grid.formatterOptions,
                    name$tr$: 'cloud.common.entityState'
                }
            ],
            width: 500,
            height: 200,
            title: {
                name: 'Assign Mounting Activity',
                name$tr$: 'productionplanning.activity.activity.dialogTitle'
            },
            version: 3
        };
        return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
    }
})(angular);