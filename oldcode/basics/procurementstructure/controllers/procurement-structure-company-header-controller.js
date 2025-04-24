/**
 * Created by jie on 03/24/2023.
 */
(function (angular) {
	'use strict';

	var modulName = 'basics.procurementstructure';
	angular.module(modulName).value('basicsProcurementStructureInterCompanyStandardConfig', {

		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id:'id',
						field :'Id',
						readonly: true,
						width: 60,
						name: 'Id',
						sortable: true,
						name$tr$: 'basics.procurementstructure.entityId',
					},
					{
						id: 'description',
						field: 'DescriptionTranslateType.Translated',
						name: 'Description',
						name$tr$: 'basics.procurementstructure.entityMdcContextFk',
						editor: null,
						formatter: 'description',
						readonly: true,
						width: 150,
						sortable: true,
					}
				]
			};
		}
	});

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modulName).controller('basicsProcurementStructureInterCompanyHeaderController',
		['$scope', 'platformTranslateService','$translate', 'platformGridControllerService', 'basicsProcurementStructureInterCompanyStandardConfig', 'basicsInterCompanyHeaderConfigHeaderDataService',
			function ($scope, platformTranslateService, $translate,platformGridControllerService, uiStandardConfig, dataService) {
				var myGridConfig = {
					// initCalled: false,
					// columns: [],
					// parentProp: 'RubricFk',
					// childProp: 'RubricCategoryEntities'
				};

				$scope.getContainerUUID = function getContainerUUID() {
					return '8708D4B939B944FBA20F850CBE937186';
				};

				platformGridControllerService.initListController($scope, uiStandardConfig, dataService, null, myGridConfig);

			}
		]);
})(angular);