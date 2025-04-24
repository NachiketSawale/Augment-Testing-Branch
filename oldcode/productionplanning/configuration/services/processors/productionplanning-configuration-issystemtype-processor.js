(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    angular.module(moduleName).factory('productionplanningConfigurationIssystemtypeProcessor', processor);

    processor.$inject = ['productionplanningCommonDataReadonlyService'];

    function processor(readonlyService) {
        var service = {};
        service.processItem = function processItem(item) {
            if (item.IsSystemType === true) {
                readonlyService.setColumnsReadOnly(item, ['Code','DescriptionInfo','IsDefault','Sorting','IsLive','RubricFk','RubricCategoryFk','PpsEntityFk'], true);
            }
        };

        return service;
    }
})(angular);
