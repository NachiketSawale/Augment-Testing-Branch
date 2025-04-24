/**
 * Created by xsi on 2016-03-09.
 */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainInstanceParameterListController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main instance parameter grid.
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMainInstanceParameterListController', [
		'_', '$scope', 'platformGridControllerService', 'constructionSystemMainInstanceParameterUIConfigService',
		'constructionSystemMainInstanceParameterService', 'constructionSystemMainInstanceParameterValidationService',
		'basicsLookupdataLookupDescriptorService', 'platformGridAPI', 'constructionSystemMainInstanceParameterUserformPopupHelpService', '$http',
		'constructionSystemCommonParameterErrorFormInputDialog',
		'constructionSystemMasterParameterValidationHelperService', 'constructionSystemMainInstanceService',
		function (
			_, $scope, platformGridControllerService, uiConfigService, dataService, validationService,
			basicsLookupdataLookupDescriptorService, platformGridAPI, userformPopupHelper, $http,
			errorFormInputDialogService, cosParameterValidationHelperService, constructionSystemMainInstanceService) {

			dataService.registerSelectionChanged = dataService.registerSelectionChanged2('grid');

			platformGridControllerService.initListController($scope, uiConfigService, dataService, validationService, {useFilter: true});

			var toolbarItems = [{
				id: 't101',
				caption: 'basics.common.edit',
				type: 'item',
				cssClass: 'tlb-icons ico-preview-data',
				fn: onEditForm,
				disabled: function () {
					if (!dataService.parentService().hasSelection()) {
						return true;
					}
					var instanceEntity = dataService.parentService().getSelected();
					return !angular.isNumber(instanceEntity.FormId) || instanceEntity.IsReadonly;
				}
			}
			];

			platformGridControllerService.addTools(toolbarItems);

			dataService.parentService().registerSelectionChanged(onSelectedItemChanged);

			dataService.performScriptValidation.register(validationService.validator);
			cosParameterValidationHelperService.validationInfoChanged.register(dataService.onValidationInfoChanged);

			dataService.performScriptValidation.fire();

			dataService.isGridActivated = true;

			$scope.$on('$destroy', function () {
				dataService.performScriptValidation.unregister(validationService.validator);
				cosParameterValidationHelperService.validationInfoChanged.unregister(dataService.onValidationInfoChanged);
				dataService.parentService().unregisterSelectionChanged(onSelectedItemChanged);
				dataService.isGridActivated = false;
			});
			_.remove($scope.tools.items, function (obj) {
				return obj.iconClass === 'tlb-icons ico-rec-new';
			});


			function onEditForm(/* e, args */) {
				if (dataService.parentService().hasSelection()) {
					var instanceEntity = dataService.parentService().getSelected();
					var options = {
						formId: instanceEntity.FormId,
						formDataId: instanceEntity.FormDataFk,
						editable: true,
						setReadonly: false,
						modal: true,
						contextId: instanceEntity.Id,
						// eslint-disable-next-line no-unused-vars
						saveFormDataAsync: function (formData) {
							return constructionSystemMainInstanceService.update();
						}
					};
					userformPopupHelper.editData(options);
				}
			}

			function onSelectedItemChanged() {
				$scope.tools.update();  // force to call disabled fn of toolbar buttons
			}
		}
	]);

})(angular);
