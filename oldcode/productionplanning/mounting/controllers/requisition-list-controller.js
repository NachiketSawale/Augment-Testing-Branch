/**
 * Created by lid on 8/11/2017.
 */
(function () {
	/* global angular */
	'use strict';
	var moduleName = 'productionplanning.mounting';


	angular.module(moduleName).controller('productionplanningMountingRequisitionListController', ProductionplanningMountingRequisitionListController);

	ProductionplanningMountingRequisitionListController.$inject = ['$scope', '$translate', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningMoungtingRequisitionUIStandardService',
		'productionplanningMountingRequisitionDataService',
		'productionplanningMountingRequisitionGotoBtnsExtension',
		'productionplanningMountingRequisitionGobacktoBtnsExtension',
		'basicsCommonToolbarExtensionService',
		'ppsCommonModelFilterService',
		'documentsProjectDocumentDataService',
		'productionplanningMountingRequisitionDocumentProcessor'];

	function ProductionplanningMountingRequisitionListController($scope, $translate, platformContainerControllerService, platformTranslateService, uiStandardService,
		mntRequisitionDataService,
		gotoBtnsExtension,
		gobacktoBtnsExtension,
		basicsCommonToolbarExtensionService,
		ppsCommonModelFilterService,
		projectDocumentDataService,
		documentProcessor) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);

		platformContainerControllerService.initController($scope, moduleName, '42859c49547445f3862a4ec10588db45');

		basicsCommonToolbarExtensionService.insertBefore($scope, gotoBtnsExtension.createGotoBtns(mntRequisitionDataService));
		basicsCommonToolbarExtensionService.insertBefore($scope, gobacktoBtnsExtension.createGobacktoBtns(mntRequisitionDataService));

		mntRequisitionDataService.registerFilter();
		mntRequisitionDataService.registerSelectedEntitiesChanged(ppsCommonModelFilterService.updateMainEntityFilter);

		projectDocumentDataService.register({
			moduleName: moduleName,
			title: $translate.instant('productionplanning.mounting.entityRequisition'),
			parentService: mntRequisitionDataService,
			processors: [documentProcessor],
			columnConfig: [{
				documentField: 'MntRequisitionFk',
				dataField: 'Id',
				readOnly: false,
				projectFkField:'ProjectFk',
				lgmJobFkField:'LgmJobFk'
			}]
		});

		// un-register on destroy
		$scope.$on('$destroy', function () {
			mntRequisitionDataService.unregisterFilter();
			mntRequisitionDataService.unregisterSelectedEntitiesChanged(ppsCommonModelFilterService.updateMainEntityFilter);
			projectDocumentDataService.unRegister();
		});
	}
})();