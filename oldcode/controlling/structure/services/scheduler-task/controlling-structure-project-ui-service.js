
(function () {
	'use strict';
	let moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructureProjectUiService', [
		'basicsLookupdataConfigGenerator', 'platformTranslateService',
		function (basicsLookupdataConfigGenerator, platformTranslateService) {

			let service = {};

			service.getGridColumns = function() {
				let columns = [
					{
						id: 'ProjectNo',
						field: 'ProjectNo',
						name$tr$: 'controlling.structure.ProjectNumber',
						readonly: true
					},
					{
						id: 'projectName',
						field: 'ProjectName',
						formatter: 'description',
						name$tr$: 'controlling.structure.ProjectName',
						readonly: true
					}
				];

				platformTranslateService.translateGridConfig(columns);

				return columns;
			};

			service.getStandardConfigForListView = function () {
				return {
					addValidationAutomatically: true,
					columns: service.getGridColumns()
				};
			};

			return service;
		}]);
})();
