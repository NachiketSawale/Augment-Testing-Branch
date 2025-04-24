/**
 * Created by zwz on 9/27/2019.
 */
(function () {

	'use strict';
	var moduleName = 'productionplanning.header';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningHeaderListController', ListController);

	ListController.$inject = ['$scope', '$translate', 'platformGridControllerService',
		'productionplanningHeaderDataService',
		'productionplanningHeaderUIStandardService',
		'productionplanningHeaderValidationService',
		'documentsProjectDocumentDataService',
		'productionplanningHeaderContainerInformationService',
		'ppsCommonModelFilterService',
		'basicsCommonToolbarExtensionService',
		'productionplanningHeaderGotoBtnsExtension',
		'productionplanningHeaderGobacktoBtnsExtension',
		'$rootScope', 'platformGridAPI', 'ppsDocumentForFieldOriginProcessor',
		'ppsCommonClipboardService'
	];
	function ListController($scope, $translate, platformGridControllerService,
		dataServ,
		uiStandardServ,
		validationServ,
		projectDocumentDataService,
		productionplanningHeaderContainerInformationService,
		ppsCommonModelFilterService,
		basicsCommonToolbarExtensionService,
		gotoBtnsExtension,
		gobacktoBtnsExtension,
		$rootScope, platformGridAPI, ppsDocumentForFieldOriginProcessor,
		ppsCommonClipboardService) {

		var gridConfig = {initCalled: false, columns: [], type: 'productionplanning.header', dragDropService: ppsCommonClipboardService};
		platformGridControllerService.initListController($scope, uiStandardServ, dataServ, validationServ, gridConfig);

		basicsCommonToolbarExtensionService.insertBefore($scope, gotoBtnsExtension.createGotoBtns(dataServ));
		basicsCommonToolbarExtensionService.insertBefore($scope, gobacktoBtnsExtension.createGobacktoBtns(dataServ));

		var config = {
			moduleName: 'productionplanning.header',
			title: $translate.instant('productionplanning.header.headerListTitle'),
			parentService: dataServ,
			columnConfig: [
				{documentField: 'PpsHeaderFk', dataField: 'Id', readOnly: false, projectFkField:'ProjectFk', lgmJobFkField:'LgmJobFk'}
			],
			processors: [ppsDocumentForFieldOriginProcessor],
			// add projectDocuments functionality for Upstream Requirement of ppsHeader for HP-ALM #130264 by zwz on 2022/4/29
			subModules: [{
				service: productionplanningHeaderContainerInformationService.getPpsUpstreamService(),
				title: $translate.instant('productionplanning.item.upstreamItem.entity'),
				columnConfig: [{
					documentField: 'PpsUpstreamItemFk',
					dataField: 'Id',
					readOnly: false,
					projectFkField:'ProjectId',
					lgmJobFkField:'LgmJobFk'
				}, {
					documentField: 'PpsItemFk',
					dataField: 'PpsItemUpstreamFk',
					readOnly: false
				}, {
					documentField: 'PrcPackageFk',
					dataField: 'PrcPackageFk',
					readOnly: false
				}]
			}]
		};

		projectDocumentDataService.register(config);
		dataServ.registerSelectedEntitiesChanged(ppsCommonModelFilterService.updateMainEntityFilter);

		const onGridClick = (e, args) => {
			let selectedItem = args.grid.getDataItem(args.row);
			$rootScope.$emit('documentsproject-parent-grid-click', {
				clickedItem: selectedItem,
				title: config.title
			});
		};
		platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);

		$scope.$on('$destroy', function () {
			projectDocumentDataService.unRegister();
			dataServ.unregisterSelectedEntitiesChanged(ppsCommonModelFilterService.updateMainEntityFilter);
			platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
		});
	}
})();