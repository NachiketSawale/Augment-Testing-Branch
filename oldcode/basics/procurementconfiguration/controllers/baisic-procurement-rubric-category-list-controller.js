/**
 * Created by wuj on 8/31/2015.
 */
(function (angular) {
	'use strict';

	var modulName = 'basics.procurementconfiguration';
	angular.module(modulName).value('basicsProcurementConfigurationRubricCategoryStandardConfig', {

		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						editor: null,
						formatter: 'translation',
						readonly: true,
						width: 300
					}
				]
			};
		}
	});

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modulName).controller('basicsProcurementConfigurationRubricCategoryController',
		['$scope', 'platformTranslateService', 'platformGridControllerService', 'basicsProcurementConfigurationRubricCategoryStandardConfig', 'basicsProcurementConfigurationRubricCategoryService',
			function ($scope, platformTranslateService, platformGridControllerService, uiStandardConfig, dataService) {
				var myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'RubricFk',
					childProp: 'RubricCategoryEntities'
				};

				$scope.getContainerUUID = function getContainerUUID() {
					return '8708D4B939B944FBA20F850CBE937185';
				};

				platformGridControllerService.initListController($scope, uiStandardConfig, dataService, null, myGridConfig);

			}
		]);
})(angular);