(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	var module = angular.module(moduleName);

	module.controller('transportplanningTransportPackageListController', transportplanningTransportPackageListController);
	transportplanningTransportPackageListController.$inject = [
		'$injector',
		'$scope',
		'_',
		'platformGridAPI',
		'platformGridControllerService',
		'transportplanningTransportPackageDataService',
		'transportplanningTransportPackageUIService',
		'transportplanningTransportPackageValidationService',
		'transportplanningPackageDataServicePropertychangedManager',
		'transportplanningBundleButtonService',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonToolbarExtensionService'];

	function transportplanningTransportPackageListController(
		$injector,
		$scope,
		_,
		platformGridAPI,
		gridControllerService,
		dataService,
		uiStandardService,
		validationService,
		propertychangedManager,
		buttonService,
		basicsLookupdataLookupDescriptorService,
		basicsCommonToolbarExtensionService) {

		var gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'TransportPackageFk',
			childProp: 'ChildPackages',
			type: 'trsPackage'
		};

		gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		function selectPackage() {
			var packageServ = $injector.get('transportplanningTransportMainService');
			var selected = packageServ.getSelected();
			if (selected) {
				selected.Package = dataService.getSelected();
				//weight calculated
				if (selected.Package) {
					if (!_.isNil(selected.Package.Weight) && selected.Package.Weight > 0) {
						selected.Package.CalcWeight = (!_.isUndefined(selected.Package.UomWeightFk) && selected.Package.UomWeightFk > 0) ? selected.Package.Weight +//* 1000 +
							' ' + basicsLookupdataLookupDescriptorService.getLookupItem('UoM', selected.Package.UomWeightFk).Unit : selected.Package.Weight; //* 1000;
					} else if (!_.isNil(selected.Package.WeightCalculated) && selected.Package.WeightCalculated > 0) {
						selected.Package.CalcWeight = (!_.isUndefined(selected.Package.UomWeightFk) && selected.Package.UomWeightFk > 0) ? selected.Package.WeightCalculated +// * 1000 +
							' ' + basicsLookupdataLookupDescriptorService.getLookupItem('UoM', selected.Package.UomWeightFk).Unit : selected.Package.WeightCalculated;//  * 1000;
					}
				}

			}
			// Temporary solution to refresh preview-document button of tools. Sometimes the preview-document button won't be updated when selection changed, so here we have to refresh tools.(by zwz 2020/1/17)
			if ($scope.tools)
				$scope.tools.update();
		}

		dataService.registerSelectionChanged(selectPackage);

		//register cell changed
		var onCellChange = function (e, args) {
			var field = args.grid.getColumns()[args.cell].field;
			propertychangedManager.onPropertyChanged(args.item, field, dataService);
		};

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		buttonService.extendDocumentButtons($scope, dataService);

		// register callback for refreshing the preview-document button of tools when messenger UpdateDone is fired.(by zwz 2020/1/19)
		function onUpdateDone() {
			var selectedItem = dataService.getSelected();
			if (!_.isNil(selectedItem)) {
				$scope.tools.update();
			}
		}

		dataService.parentService().registerUpdateDone(onUpdateDone);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			dataService.parentService().unregisterUpdateDone(onUpdateDone);
			dataService.unregisterSelectionChanged(selectPackage);
		});
	}
})(angular);