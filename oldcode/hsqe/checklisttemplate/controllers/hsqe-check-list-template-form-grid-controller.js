/**
 * Created by alm on 1/20/2021.
 */
(function (angular) {
	'use strict';

	angular.module('hsqe.checklisttemplate').controller('hsqeCheckListTemplate2FormGridController',
		['$scope', 'globals', '_', '$injector','platformGridControllerService', 'hsqeCheckListTemplate2FormUIStandardService', 'hsqeCheckListTemplate2FormService','hsqeCheckListTemplate2FromValidationService','userFormOpenMethod', 'basicsUserformCommonService',
			function ($scope, globals, _, $injector, gridControllerService, gridColumns, dataService,validationService,userFormOpenMethod,
				basicsUserformCommonService) {
				$scope.path = globals.appBaseUrl;
				gridControllerService.initListController($scope, gridColumns, dataService,validationService, {});

				var previewForm = function () {
					dataService.showFormData(true, userFormOpenMethod.NewWindow);
				};

				var editForm = function () {
					dataService.updateTemporaryCheckListId = false;
					dataService.showFormData(true, userFormOpenMethod.NewWindow);
				};

				var editPopForm = function () {
					dataService.updateTemporaryCheckListId = false;
					dataService.showFormData(true, userFormOpenMethod.PopupWindow);
				};
				var toolbarItems = [
					{
						id: 't100',
						caption: 'basics.common.preview.button.previewCaption',
						type: 'item',
						cssClass: 'tlb-icons ico-preview-form',
						fn: previewForm,
						disabled: function () {
							var item=dataService.getSelected();
							if (!item) {
								return true;
							}
							return !angular.isNumber(item.BasFormFk);
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
								fn: editForm
							},{
								id: 't-navigation-pop-window',
								type: 'item',
								caption: 'basics.userform.popWindow',
								iconClass: 'tlb-icons ico-preview-data',
								fn: editPopForm
							}]
						},
						disabled: function () {
							var selectedEntity = dataService.getSelected();
							return   _.isEmpty(selectedEntity);
						}
					}
				];

				gridControllerService.addTools(toolbarItems);

				function onFormDataSaved() {
					dataService.updateTemporaryCheckListId = true;
					dataService.load();
				}
				basicsUserformCommonService.formDataSaved.register(onFormDataSaved);
				$scope.$on('$destroy', function () {
					basicsUserformCommonService.formDataSaved.unregister(onFormDataSaved);
				});
			}
		]);
})(angular);
