/**
 * Created by lav on 10/19/2018.
 */
/* global angular, globals */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportCreateTransportRouteDialogMaterialService', Service);

	Service.$inject = [
		'platformDialogService',
		'$http',
		'transportplanningTransportCreateTransportRouteDialogServiceFactory',
		'packageTypes'];

	function Service(platformDialogService,
					 $http,
					 transportplanningTransportCreateTransportRouteDialogServiceFactory,
					 packageTypes) {

		var service = transportplanningTransportCreateTransportRouteDialogServiceFactory.createInstance({
			pkgType: packageTypes.Material,
			resultName: 'Materials',
			'idProperty': 'Uuid'
		});

		var multiSelectedItems;

		service.setSelection = function (selectedItems) {
			multiSelectedItems = selectedItems;
		};

		service.createItem = function () {
			$http.get(globals.appBaseUrl + 'basics.material/templates/material-lookup/material-lookup-dialog.html').then(function (result) {
				if (result && result.data) {
					var dialogOptions = {
						id: 'f0143a50afe046949a2bed5ff5496ee6',
						width: '75%',
						height: '80%',
						minWidth: '600px',
						minHeight: '400px',
						resizeable: true,
						template: result.data.replace('basicsMaterialLookupController', 'transportplanningTransportMaterialLookupController'),
						windowClass: 'ms-modal-dialog',
						headerText$tr$:'basics.material.materialSearchLookup.htmlTranslate.materialSearch',
						// showMinimizeMaximizeButton: true, // doesn't support
						onReturnButtonPress: function () {
						}
					};
					platformDialogService.showDialog(dialogOptions).then(function (result) {
						if (result.isOk && (result.selectedItem || multiSelectedItems)) {
							service.createReferences(multiSelectedItems ? multiSelectedItems : [result.selectedItem]);
						}
						multiSelectedItems = null;
					});
				}
			});
		};

		service.onAddNewItem = function (item) {
			item.PUomFk = item.BasUomFk;
			item.PQuantity = 1;
			//map the field with different dto
			item.MaterialGroupFk = item.MdcMaterialGroupFk;
			item.MaterialCatalogFk = item.MdcMaterialCatalogFk;
			item.DescriptionInfo1 = item.DescriptionInfo;
			item.UomFk = item.BasUomFk;
		};

		return service;
	}
})(angular);