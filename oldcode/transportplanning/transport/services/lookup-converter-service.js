/**
 * Created by lav on 11/22/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('lookupConverterService', Service);

	Service.$inject = ['basicsLookupdataLookupDataService',
		'basicsLookupdataLookupViewService'];

	function Service(basicsLookupdataLookupDataService,
					 basicsLookupdataLookupViewService) {

		var service = {};

		service.initialize = function (scope, options) {
			if (options.gridSettings) {
				options.columns = options.gridSettings.columns;
				options.inputSearchMembers = options.gridSettings.inputSearchMembers;
			}
			scope.options = options;
			scope.options.dataProvider = basicsLookupdataLookupDataService.registerDataProviderByType(scope.options.lookupType, null, true);
			scope.settings = createDialogSettings(scope, scope.options);

			scope.canSelect = function () {
				return true;
			};
		};

		function createDialogSettings(scope, config) {
			var settings = {};
			basicsLookupdataLookupViewService.config('input-base', settings);
			settings.dataView.setScope(scope);
			settings.dataView.init(config);
			var searchSettings = {
				lookupType: config.lookupType,
				initialSearchValue: '',
				eagerSearch: false,
				idProperty: 'Id',
				disableDataCaching: true,
				inputSearchMembers: config.inputSearchMembers || ['SearchPattern'],
				pageOptions: config.pageOptions
			};
			var uiSettings = {
				title: config.title
			};
			var gridOptions = {
				gridOptions: {
					multiSelect: true
				},
				gridId: config.uuid,
				uuid: config.uuid,
				idProperty: config.idProperty,
				lazyInit: false,
				columns: config.columns
			};
			_.merge(settings, searchSettings, uiSettings, gridOptions);
			return settings;
		}

		return service;
	}
})(angular);