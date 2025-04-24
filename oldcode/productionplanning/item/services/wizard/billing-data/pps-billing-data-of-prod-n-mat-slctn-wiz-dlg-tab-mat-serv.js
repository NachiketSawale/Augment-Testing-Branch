/**
 * Created by zwz on 12/27/2024.
 */
// remark: implementation of ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabMaterialService is based on copy from transportplanningTransportCreateTransportRouteDialogMaterialService
(angular => {
	'use strict';
	/* global globals, _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabMaterialService', Service);

	Service.$inject = [
		'platformDialogService',
		'$http',
		'ppsBillingDataOfProductAndMaterialSelectionWizardDialogTabServiceFactory',
		'packageTypes'];

	function Service(platformDialogService,
					 $http,
		tabServiceFactory,
					 packageTypes) {

		var service = tabServiceFactory.createInstance({
			pkgType: packageTypes.Material,
			resultName: 'Materials',
			'idProperty': 'Id'
		});

		var multiSelectedItems;

		service.setSelection = function (selectedItems) {
			multiSelectedItems = selectedItems;
		};

		service.createItem = function () {
			$http.get(globals.appBaseUrl + 'basics.material/templates/material-lookup/material-lookup-dialog.html').then(function (result) {
				if (result && result.data) {
					var dialogOptions = {
						id: 'a8e8d9913aec4dda99320a48fa29a49f',
						width: '75%',
						height: '80%',
						minWidth: '600px',
						minHeight: '400px',
						resizeable: true,
						template: result.data.replace('basicsMaterialLookupController', 'ppsBillingDataMaterialLookupController'),
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
		};

		return service;
	}
})(angular);