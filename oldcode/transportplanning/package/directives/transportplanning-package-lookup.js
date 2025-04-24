/**
 * Created by las on 7/21/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.package';
    angular.module(moduleName).directive('transportplanningPackageLookup', transportplanningPackageLookup);

    transportplanningPackageLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'transportplanningPackageImageProcessor'];

    function transportplanningPackageLookup(BasicsLookupdataLookupDirectiveDefinition, transportplanningPackageImageProcessor) {

        var defaults = {
            lookupType: 'TrsPackageLookup',
            version: 3,//for new lookup master api, the value of version should be greater than 2
            valueMember: 'Id',
            displayMember: 'Code',
            uuid: 'e7508ce7d070430383d3e5691529464d',
            treeOptions: {
                parentProp: 'TransportPackageFk',
                childProp: 'ChildPackages',
                initialState: 'expanded',
                inlineFilters: true,
                hierarchyEnabled: true
            },
            columns: [
                { id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
                { id: 'Description', field: 'DescriptionInfo.Description', name: 'Description', name$tr$: 'cloud.common.entityDescription' }
            ],
            width: 500,
            height: 200
        };

        return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
            processData: function (dataList) {
                return transportplanningPackageImageProcessor.processData(dataList);
            }
        });
    }
})(angular);