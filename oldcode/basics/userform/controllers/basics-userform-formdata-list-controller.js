/**
 * Created by reimer on 18.11.2014.
 */

(function () {

	'use strict';
	var moduleName = 'basics.userform';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsUserformFormDataListController
	 * @function
	 *
	 * @description
	 * Controller for the data list view of userform data entities.
	 **/
	angModule.controller('basicsUserformFormDataListController', [
		'_',
		'$scope',
		'basicsUserformMainService',
		'basicsUserformFormDataListService',
		'basicUserformFormDataGridColumnsService',
		'platformGridControllerService',
		'$translate',
		'platformModalService',
		'basicsUserformCommonService',
		'platformGridAPI',
		function (
			_,
			$scope,
			basicsUserformMainService,
			basicsUserformFormDataListService,
			basicUserformFormDataGridColumnsService,
			platformGridControllerService,
			$translate,
			platformModalService,
			basicsUserformCommonService,
			platformGridAPI) {

			var myGridConfig = {initCalled: false, columns: []};
			platformGridControllerService.initListController($scope, basicUserformFormDataGridColumnsService, basicsUserformFormDataListService, null, myGridConfig);

			var onCreateFormDataRequested = function () {

				var selectedFormId = basicsUserformMainService.getSelectedFormId();
				if (selectedFormId > 0) {

					var modalOptions = {
						headerText: 'Input Context ID',
						bodyText: '',
						pattern: '^\\d+$'
						// textInput: '123'
					};

					platformModalService.showInputDialog(modalOptions).then(
						function (result) {

							if (_.isInteger(result.value.text)) {
								basicsUserformMainService.addFormData(result.value.text);
							}
						}
					);
				}
			};
			basicsUserformFormDataListService.createFormDataRequested.register(onCreateFormDataRequested);

			var onFormDataDeleted = function () {

				// todo refresh grid
				// basicsUserformMainService.refresh();

			};
			basicsUserformFormDataListService.formDataDeleted.register(onFormDataDeleted);

			var onFormDataSaved = function () {

				basicsUserformFormDataListService.refresh();
			};
			basicsUserformCommonService.formDataSaved.register(onFormDataSaved);

			// unregister messenger
			$scope.$on('$destroy', function () {
				basicsUserformCommonService.formDataSaved.unregister(onFormDataSaved);
				basicsUserformFormDataListService.formDataDeleted.unregister(onFormDataDeleted);
				basicsUserformFormDataListService.createFormDataRequested.unregister(onCreateFormDataRequested);
			});

			// customize toolbar
			var toolbarItems = [
				{
					id: 't100',
					caption: 'Edit',
					type: 'item',
					cssClass: 'tlb-icons ico-preview-data',
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
			platformGridControllerService.addTools(toolbarItems);

			var init = function () {

				$scope.hideInfo();

			};
			init();

			// todo remove when selected row bug is fixed!
			$scope.getSelectedGridItem = function () {
				var selected = platformGridAPI.rows.selection({
					gridId: $scope.gridId
				});
				return _.isArray(selected) ? selected[0] : selected;
			};

		}
	]);
})();
