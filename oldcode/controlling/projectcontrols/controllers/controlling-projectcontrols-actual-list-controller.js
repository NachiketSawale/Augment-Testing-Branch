(function (angular) {
	/* global  _ */
	'use strict';
	let moduleName='controlling.projectcontrols';


	angular.module(moduleName).controller('controllingProjectControlsActualListController',
		['$scope','controllingCommonActualListControllerFactory','controllingProjectControlsActualListDataService','controllingStructureActualUIStandardService',
			function ($scope,controllingCommonActualListControllerFactory,dataService,uiStandardService) {
				// overwrite companyperiodfk
				let viewCols = uiStandardService.getStandardConfigForDetailView().rows,
					viewCompanyPeriodFk = _.find(viewCols, {'rid': 'companyperiodfk'});
				viewCompanyPeriodFk.grid = {
					'editor': 'directive',
					'editorOptions': {
						'showClearButton': true,
						'displayMember': 'TradingPeriod',
						'directive': 'controlling-common-company-period-lookup',
						'additionalColumns': true
					},
					'formatter': 'lookup',
					'formatterOptions': {
						'dataServiceName': 'controllingCommonCompanyPeriodLookupDataService',
						'displayMember': 'TradingPeriod',
						'lookupType': 'CompanyPeriodCache'
					},
					'width': 130
				};
				let listCols = uiStandardService.getStandardConfigForListView().columns;
				let listCompanyPeriodFk = _.find(listCols, {'id': 'companyperiodfk'});
				listCompanyPeriodFk.formatterOptions = {
					dataServiceName: 'controllingCommonCompanyPeriodLookupDataService',
					displayMember: 'TradingPeriod',
					lookupType: 'CompanyPeriodCache',
					mainServiceName :'controllingProjectControlsActualListDataService'
				};
				
				controllingCommonActualListControllerFactory.initActualListController($scope, dataService, uiStandardService);
				
				function updateTools() {
					$scope.tools.items = _.filter($scope.tools.items, function (d) {
						return d.id === 't12' || d.id === 'gridSearchAll' ||
							d.id === 'gridSearchColumn' || d.id === 't200' || d.id === 'collapsenode' ||
							d.id === 'expandnode' || d.id === 'collapseall' || d.id === 'expandall';
					});
					$scope.tools.update();
				}
				
				updateTools();
			}
		]);
})(angular);