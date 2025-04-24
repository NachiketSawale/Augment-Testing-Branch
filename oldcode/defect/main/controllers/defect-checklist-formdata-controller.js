/**
	 * Created by alm on 5/13/2021.
	 */
(function (angular) {
	'use strict';

	angular.module('defect.main').controller('defectChecklistFormDataController',
		['$scope', 'globals', '$injector', 'platformGridControllerService', 'hsqeCheckListFormUIStandardService',
			'defectCheckListFormDataService','userFormOpenMethod',
			function ($scope, globals, $injector, gridControllerService, gridColumns, dataService,userFormOpenMethod) {
				$scope.path = globals.appBaseUrl;
				gridControllerService.initListController($scope, gridColumns, dataService, {}, {});

				var toolbarItems = [
					{
						id: 't100',
						caption: 'Preview',
						type: 'item',
						cssClass: 'tlb-icons ico-preview-form',
						fn: function () {
							var basicsUserformCommonService = $injector.get('basicsUserformCommonService');
							var userformPopupHelper = basicsUserformCommonService.createNewInstance();
							var item = dataService.getSelected();
							if (item) {
								var basicsUserFormPassthroughDataService = $injector.get('basicsUserFormPassthroughDataService');
								basicsUserFormPassthroughDataService.setInitialData({showInvalidCheckList:true,userFormOpenMethod:userFormOpenMethod.NewWindow,editable:false});
								var options = {
									formId: item.FormFk,
									formDataId: item.BasFormDataFk,
									modal: false,
									editable: true,
									contextId: item.HsqCheckListFk,
									fromModule:73
								};
								userformPopupHelper.showData(options);
							}
						},
						disabled: function () {
							var item = dataService.getSelected();
							if (!item) {
								return true;
							}
							return !angular.isNumber(item.BasFormDataFk);
						}
					}
				];

				gridControllerService.addTools(toolbarItems);
			}
		]);
})(angular);
