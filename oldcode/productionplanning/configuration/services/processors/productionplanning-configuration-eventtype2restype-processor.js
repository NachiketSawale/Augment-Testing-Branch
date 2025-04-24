(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    angular.module(moduleName).factory('productionplanningConfigurationEventtype2restypeProcessor', Processor);
    Processor.$inject = ['$injector', 'platformRuntimeDataService'];
    function Processor($injector, platformRuntimeDataService) {

        var service = {};

        service.processItem = function processItem(item) {
            var parentItem = $injector.get('productionplanningConfigurationMainService').getSelected();
            var flag = parentItem && parentItem.IsSystemEvent;
			var columns = ['Code', 'DescriptionInfo', 'IsDefault', 'IsLive', 'Sorting','RubricFk',
				'RubricCategoryFk', 'PpsEntityFk', 'BasResourceContextFk'];
            service.setColumnsReadOnly(item,columns,flag);
			if (item.Version > 0) {
				service.setColumnsReadOnly(item, ['BasResourceContextFk'], true);
			}
        };

        service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
            var fields = [];
            _.each(columns, function (column) {
                fields.push({field: column, readonly: flag});
            });
            platformRuntimeDataService.readonly(item, fields);
        };

        return service;
    }
})(angular);
