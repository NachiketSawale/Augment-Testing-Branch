/**
 * Created by lnb on 1/14/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.contract').value('procurementContractUserFormGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'formDescription',
						field: 'UserFormFk',
						name$tr$: 'cloud.contract.ConUserFormTitle',
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-user-form-combobox',
							displayMember: 'Description',
							lookupOptions: {
								filterKey: 'prc-con-header-userform-filter',
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'UserForm',
							displayMember: 'Description'
						},
						width: 120
					},
					{
						id: 'description',
						field: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						editor: 'description',
						formatter: 'description',
						width: 250
					}

				]
			};
		}
	}
	);

	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name procurementContractUserFormListController
	 * @require $scope, platformContextService, platformGridControllerBase, $filter,  procurementContractHeaderDataService, procurementContractHeaderGridColumns,  contractHeaderElementValidationService
	 * @description controller for contract header
	 */
	angular.module('procurement.contract').controller('procurementContractUserFormListController',
		['$scope', 'basicsUserformMainService', 'contractUserformFormDataListService', 'procurementContractUserFormGridColumns', 'contractUserFormValidationService', 'platformGridControllerService', 'basicsUserformCommonService', 'procurementContractHeaderDataService',
			function ($scope, basicsUserformMainService, dataService, gridColumns, validationService, gridControllerService, basicsUserformCommonService, procurementContractHeaderDataService) {

				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				var onCreateFormDataRequested = function () {

					var selectedFormId = dataService.getSelected().FormDataFk;
					var selectedContextFk = procurementContractHeaderDataService.getSelected().Id;
					if (selectedFormId > 0 && selectedContextFk > 0) {
						basicsUserformMainService.addFormData(selectedContextFk);
					}
				};
				dataService.createFormDataRequested.register(onCreateFormDataRequested);

				var onFormDataDeleted = function () {

					basicsUserformMainService.refresh();
					// basicsUserformFormDataListService.refresh();
				};
				dataService.formDataDeleted.register(onFormDataDeleted);

				var onFormDataSaved = function () {

					dataService.refresh();
				};
				basicsUserformCommonService.formDataSaved.register(onFormDataSaved);

				// unregister messenger
				$scope.$on('$destroy', function () {
					basicsUserformCommonService.formDataSaved.unregister(onFormDataSaved);
					dataService.formDataDeleted.unregister(onFormDataDeleted);
					dataService.createFormDataRequested.unregister(onCreateFormDataRequested);
				});

				// customize toolbar
				var toolbarItems = [
					{
						id: 't100',
						caption: 'Edit',
						type: 'item',
						cssClass: 'ico-zoom-100',
						fn: function () {

							// todo workaround since getSelected() does not work correctly!
							// var selectedFormData = basicsUserformFormDataListService.getSelected();
							var selectedFormData = $scope.getSelectedGridItem();

							if (selectedFormData && selectedFormData.Id > 0) {
								var formDataId = selectedFormData.Id;
								basicsUserformMainService.editFormData(formDataId);
							}
						}
					}
				];
				gridControllerService.addTools(toolbarItems);
			}
		]);
})(angular);
