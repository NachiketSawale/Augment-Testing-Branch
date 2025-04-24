(function (angular) {
	'use strict';
	let moduleName='controlling.projectcontrols';


	angular.module(moduleName).controller('controllingProjectControlsLineItemListController',
		['$scope','_','controllingCommonLineItemListControllerFactory','controllingProjectControlsLineItemListDataService','$timeout','controllingStructureLineItemUIStandardService', 'controllingProjectcontrolsDashboardService',
			function ($scope,_,controllingCommonLineItemListControllerFactory,dataService,$timeout,uiStandardService, mainService) {

				let viewCols = uiStandardService.getStandardConfigForDetailView().rows;
				// overwrite mdcControllingUnitFk
				let viewMcu = _.find(viewCols, {'rid': 'mdccontrollingunitfk'});
				viewMcu.grid = {
					editor: 'directive',
					editorOptions: {
						showClearButton: true,
						displayMember: 'Code',
						directive: 'controlling-common-controlling-unit-lookup',
						'additionalColumns': true
					},
					formatter: 'lookup',
					formatterOptions: {
						dataServiceName: 'controllingCommonControllingUnitLookupDataService',
						displayMember: 'Code',
						mainServiceName: 'controllingProjectControlsLineItemListDataService',
						lookupType: 'GccCommonControllingUnit'
					},
					width: 130
				};

				let listCols = uiStandardService.getStandardConfigForListView().columns;
				let listMcu = _.find(listCols, {'id': 'mdccontrollingunitfk'});
				listMcu.formatterOptions = {
					dataServiceName: 'controllingCommonControllingUnitLookupDataService',
					displayMember: 'Code',
					lookupType: 'GccCommonControllingUnit',
					mainServiceName: 'controllingProjectControlsLineItemListDataService'
				};

				let listMcuDesc = _.find(listCols, function (d){
					return d.id === 'mdccontrollingunitfkdescription' || d.id ==='MdcControllingUnitFk';
				});
				listMcuDesc.additionalColumn = null;
				listMcuDesc.IsReadonly = true;
				listMcuDesc.displayMember = 'Description.Translated';
				listMcuDesc.editor = null;
				listMcuDesc.name$tr$ = 'controlling.generalcontractor.entityControllingUnitDesc';
				listMcuDesc.sortable = true;
				listMcuDesc.field='MdcControllingUnitFk';
				listMcuDesc.id ='MdcControllingUnitFk';

				listMcuDesc.editorOptions = {
					showClearButton: true,
					displayMember: 'Description.Translated',
					directive: 'controlling-common-controlling-unit-lookup'
				};

				listMcuDesc.formatterOptions= {
					dataServiceName: 'controllingCommonControllingUnitLookupDataService',
					displayMember: 'Description.Translated',
					mainServiceName: 'controllingProjectControlsLineItemListDataService',
					lookupType: 'GccCommonControllingUnit'
				};


				// overwrite the prjChangeFk
				let prjChangeFormatterOptions = {
					dataServiceName: 'controllingCommonProjectChangeLookupDataService',
					displayMember: 'Code',
					mainServiceName: 'controllingProjectControlsLineItemListDataService',
					lookupType: 'GccCommonProjectChangeHandler'
				};

				let viewPrjChange = _.find(viewCols, {'rid': 'prjchangefk'});
				viewPrjChange.grid = {
					editor: 'directive',
					editorOptions: {
						showClearButton: true,
						displayMember: 'Code',
						directive: 'controlling-common-project-change-lookup',
						'additionalColumns': true
					},
					formatter: 'lookup',
					formatterOptions: prjChangeFormatterOptions,
					width: 130
				};

				let listPrjChange = _.find(listCols, {'id': 'prjchangefk'});
				listPrjChange.formatterOptions = prjChangeFormatterOptions;

				let listPrjChangeStatus = _.find(listCols, {'id': 'prjchangestatusfk'});
				if(listPrjChangeStatus && listPrjChangeStatus.formatterOptions) {
					listPrjChangeStatus.formatterOptions.dataServiceName = 'controllingProjectcontrolsPrjChangeStatusLookupService';
				}
				let viewPrjChangeStatus = _.find(viewCols, {'rid': 'prjchangestatusfk'});
				if(viewPrjChangeStatus && viewPrjChangeStatus.grid && viewPrjChangeStatus.grid.formatterOptions) {
					viewPrjChangeStatus.grid.formatterOptions.dataServiceName = 'controllingProjectcontrolsPrjChangeStatusLookupService';
				}

				let sortCodeColumns = ['sortcode01fk', 'sortcode02fk', 'sortcode03fk', 'sortcode04fk', 'sortcode05fk', 'sortcode06fk', 'sortcode07fk', 'sortcode08fk', 'sortcode09fk', 'sortcode10fk'];
				_.forEach(listCols, (col) => {
					if(sortCodeColumns.indexOf(col.id) > -1) {
						if(col.formatterOptions){
							col.formatterOptions.filter = function () {
								return mainService.getProjectInfo() ? mainService.getProjectInfo().Id : -1;
							}
						}
					}
				})

				controllingCommonLineItemListControllerFactory.initLineItemListController($scope, dataService, uiStandardService);

				function updateTools() {
					$scope.tools.items = _.filter($scope.tools.items, function (d) {
						return d.id === 't12' || d.id === 'gridSearchAll' ||
							d.id === 'gridSearchColumn' || d.id === 't200' || d.id === 'collapsenode' ||
							d.id === 'expandnode' || d.id === 'collapseall' || d.id === 'expandall';
					});
					$timeout(function () {
						$scope.tools.update();
					});
				}

				updateTools();
			}
		]);
})(angular);