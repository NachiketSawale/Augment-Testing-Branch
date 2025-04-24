/**
 * Created by bel on 04.08.2017.
 */
(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainResourceSummaryUIConfigService
	 * @function
	 *
	 * @description
	 * This service provides Estimate  resource summary Configuration Grid UI Config for config dialog.
	 */
	angular.module(moduleName).factory('estimateMainResourceSummaryUIConfigService',
		['basicsLookupdataConfigGenerator', 'platformTranslateService',
			function (basicsLookupdataConfigGenerator, platformTranslateService) {

				let service = {};

				let gridColumns = [
					{
						id: 'f1',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'estimate.main.summaryConfig.gridConfigNameEntity',
						formatter: 'translation',
						editor: 'directive',
						editorOptions: {
							directive: 'basics-common-translate-cell',
							dataService: 'estimateMainResourceSummaryConfigGridDataService',
							containerDataFunction: 'getContainerData'
						},
						width: 200
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
			}
		]);
})(angular);
