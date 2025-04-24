/**
 * Created by las on 7/10/2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	var packageModule = angular.module(moduleName);

	packageModule.controller('transportplanningPackageListController', TrsPackageListController);
	TrsPackageListController.$inject = ['_', '$scope', '$injector', 'platformGridControllerService', 'transportplanningPackageMainService',
		'transportplanningPackageValidationService', 'transportplanningPackageWithoutWaypointUIStandardService', 'transportplanningPackageDataServiceFactory',
		'ppsCommonClipboardService', 'platformModuleNavigationService', '$translate', 'platformGridAPI',
		'packageTypes',
		'basicsLookupdataLookupDescriptorService',
		'transportplanningPackageDataServicePropertychangedManager',
		'transportplanningBundleButtonService',
		'basicsCommonToolbarExtensionService'];

	function TrsPackageListController(
		_, $scope, $injector, platformGridControllerService, TrsPackageMainService, TrsPackageValidationService,
		uiService, TrsPackageDataServiceFactory,
		ppsCommonClipboardService, naviService, $translate, platformGridAPI, packageTypes, lookupService,
		propertyChangedManager, buttonService,
		basicsCommonToolbarExtensionService) {

		var parentServiceName = $scope.getContentValue('parentService');
		var currentModuleName = $scope.getContentValue('currentModule');
		var dataService = {};

		if (parentServiceName === null || parentServiceName === undefined) {
			dataService = TrsPackageMainService;
		} else {

			var parentService = $injector.get(parentServiceName);
			dataService = TrsPackageDataServiceFactory.getService(currentModuleName, parentService);
		}

		var gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'TransportPackageFk',
			childProp: 'ChildPackages',
			type: 'transportplanning.package',
			dragDropService: ppsCommonClipboardService
		};

		platformGridControllerService.initListController($scope, uiService, dataService, TrsPackageValidationService, gridConfig);

		//register cell changed
		var onCellChange = function (e, args) {
			var field = args.grid.getColumns()[args.cell].field;
			propertyChangedManager.onPropertyChanged(args.item, field, dataService);
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		if (currentModuleName === 'productionplanning.item') {
			$scope.tools.items.unshift({
				id: 'bundleGoto', caption: $translate.instant('cloud.common.Navigator.goTo') + ' ' +
					$translate.instant('transportplanning.bundle.entityBundle'),
				type: 'item',
				iconClass: 'tlb-icons ico-goto',
				fn: function gotoBundle() {

					// Then navigate to bundle module
					var navigator = {moduleName: 'transportplanning.bundle'},
						selectedItem = dataService.getSelected();

					if (dataService.isSelection(selectedItem)) {
						naviService.navigate(navigator, selectedItem, 'TrsProductBundleFk');
					}
				},
				disabled: function () {
					return _.isEmpty(dataService.getSelected());
				}
			});

			//after init Container , remove useless buttons
			var removeItems = ['createChild', 'create', 'delete'];
			$scope.tools.items = _.filter($scope.tools.items, function (item) {
				return item && removeItems.indexOf(item.id) === -1;
			});
		}

		buttonService.extendDocumentButtons($scope, dataService);

		// register callback for refreshing the preview-document button of tools when messenger UpdateDone is fired.(by zwz 2020/1/19)
		function onUpdateDone() {
			var selectedItem = dataService.getSelected();
			if (!_.isNil(selectedItem)) {
				$scope.tools.update();
			}
		}

		dataService.registerUpdateDone(onUpdateDone);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			dataService.unregisterUpdateDone(onUpdateDone);
		});

	}
})(angular);
