(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonDependentUiService', ['platformTranslateService', function (platformTranslateService) {
		const service = {};

		const gridColumns = [
			{
				id: 'title',
				field: 'Title',
				name: 'Title',
				width: 200,
				toolTip: 'Title',
				formatter: 'description',
				name$tr$: 'basics.common.dependent.title'
			},
			// { id: 'count', field: 'Count', name: 'Title', width: 80, toolTip: 'Count', formatter: 'description', name$tr$: 'basics.common.dependent.count'},
			{
				id: 'title1',
				field: 'Title1',
				name: 'Title1',
				width: 180,
				toolTip: 'Title1',
				formatter: 'description',
				name$tr$: 'basics.common.dependent.title1'
			},
			{
				id: 'title2',
				field: 'Title2',
				name: 'Title2',
				width: 180,
				toolTip: 'Title2',
				formatter: 'description',
				name$tr$: 'basics.common.dependent.title2'
			}
		];

		platformTranslateService.translateGridConfig(gridColumns);

		service.getStandardConfigForListView = function () {
			return {
				addValidationAutomatically: false,
				columns: gridColumns
			};
		};

		return service;
	}]);
})(angular);