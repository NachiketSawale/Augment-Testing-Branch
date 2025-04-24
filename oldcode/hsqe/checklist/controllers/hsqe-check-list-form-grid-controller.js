/**
 * Created by yew on 1/26/2021.
 */
(function (angular) {
	'use strict';

	angular.module('hsqe.checklist').controller('hsqeCheckListFormGridController',
		['$scope', 'globals', '_', '$injector', 'platformGridControllerService', 'hsqeCheckListFormUIStandardService',
			'hsqeCheckListFormDataService', 'hsqeCheckListFormValidationService', 'userFormOpenMethod','hsqeCheckListDataService',
			function ($scope, globals, _, $injector, gridControllerService, gridColumns, dataService, validationService, userFormOpenMethod,parentService) {
				$scope.path = globals.appBaseUrl;
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, {});

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
							var parentItem=parentService.getSelected();
							if (item) {
								var basicsUserFormPassthroughDataService = $injector.get('basicsUserFormPassthroughDataService');
								var invalidCheckList = (parentItem.HsqCheckListFk > 0);
								basicsUserFormPassthroughDataService.setInitialData({
									showInvalidCheckList: invalidCheckList,
									userFormOpenMethod: userFormOpenMethod.NewWindow,
									editable: false
								});
								var options = {
									formId: item.FormFk,
									formDataId: item.BasFormDataFk,
									setReadonly: false,
									modal: false,
									editable: true,
									contextId: item.HsqCheckListFk,
									fromModule: parentItem.HsqCheckListFk > 0 ? 73 : null
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
					},
					{
						id: 't101',
						caption: 'basics.userform.editBy',
						type: 'dropdown-btn',
						iconClass: 'tlb-icons ico-preview-data',
						list: {
							showImages: true,
							cssClass: 'dropdown-menu-right',
							items: [{
								id: 't-navigation-new-window',
								type: 'item',
								caption: 'basics.userform.newWindow',
								iconClass: 'tlb-icons ico-preview-data',
								fn: function () {
									dataService.showFormData(true, userFormOpenMethod.NewWindow);
								}
							},{
								id: 't-navigation-pop-window',
								type: 'item',
								caption: 'basics.userform.popWindow',
								iconClass: 'tlb-icons ico-preview-data',
								fn: function () {
									dataService.showFormData(true, userFormOpenMethod.PopupWindow);
								}
							}]
						},
						disabled: function () {
							var selectedEntity = dataService.getSelected();
							var parentItem=parentService.getSelected();
							return  _.isEmpty(selectedEntity)||parentItem.IsReadonlyStatus;
						}
					}
				];

				gridControllerService.addTools(toolbarItems);

				function onSelected() {
					$scope.tools.update();
				}

				dataService.registerSelectionChanged(onSelected);

				$scope.$on('$destroy', function () {
					dataService.unregisterSelectionChanged(onSelected);
				});
			}
		]);
})(angular);
