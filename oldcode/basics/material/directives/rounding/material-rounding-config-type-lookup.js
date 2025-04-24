(function () {
    'use strict';

    angular.module('basics.material').directive('materialRoundingConfigTypeLookup', [
        '$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'materialRoundingConfigTypeLookupService',
        function ($injector, BasicsLookupdataLookupDirectiveDefinition, materialRoundingConfigTypeLookupService) {

            let defaults = {
                lookupType: 'materialroundingconfigtype',
                valueMember: 'Id',
                displayMember: 'Description',
                uuid: '',
                onDataRefresh: function ($scope) {
                    materialRoundingConfigTypeLookupService.loadData().then(function (data) {
                        $scope.refreshData(data);
                        $scope.settings.dataView.dataCache.isLoaded = false;
                    });
                }
            };

            return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
                dataProvider: 'materialRoundingConfigTypeLookupService',
                controller: ['$scope', function ($scope) {
                    $scope.$watch('entity.roundingConfigTypeFk', function (newValue) {
                        if (newValue === null) {
                            $injector.get('materialRoundingConfigDataService').setData({});
                        }
                    });
                }]
            });
        }]);
})();
