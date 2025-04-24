/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name model.viewer.controller:modelMainObjectSetListController
	 *
	 * @description The controller for the model object set list container.
	 */
	angular.module('model.main').controller('modelMainObjectSetListController',
		ModelMainObjectSetListController);

	ModelMainObjectSetListController.$inject = ['_', '$scope', '$translate',
		'platformContainerControllerService', 'modelMainObjectSetDataService',
		'basicsUserformCommonService', 'platformGridControllerService', 'platformGridAPI',
		'platformMenuListUtilitiesService'];

	function ModelMainObjectSetListController(_, $scope, $translate,
		platformContainerControllerService, modelMainObjectSetDataService,
		basicsUserformCommonService, platformGridControllerService, platformGridAPI,
		platformMenuListUtilitiesService) {

		platformContainerControllerService.initController($scope, 'model.main', 'a358f29d65c74a0f955ed5c1a1a57651');
		const toolbarItems = [
			{
				id: 't101',
				caption: 'Edit',
				type: 'item',
				cssClass: 'tlb-icons ico-preview-data',
				fn: onEditForm,
				disabled: true /* function () {
						if (!modelMainObjectSetDataService.hasSelection()) {
							return true;
						}
						const objectSetEntity = modelMainObjectSetDataService.getSelected();
						return _.isNull(objectSetEntity.FormFk) || _.isUndefined(objectSetEntity.FormFk);
					} */
			}, platformMenuListUtilitiesService.createToggleItemForObservable({
				value: modelMainObjectSetDataService.updateModelSelection,
				toolsScope: $scope
			})
		];

		platformGridControllerService.addTools(toolbarItems);

		function onSelectedRowsChanged() {
			let selected = platformGridAPI.rows.selection({
				gridId: 'a358f29d65c74a0f955ed5c1a1a57651'
			});
			selected = _.isArray(selected) ? selected[0] : selected;

			const find = _.find($scope.tools.items, {id: 't101'});
			if (find) {
				if (_.isNull(selected) || _.isUndefined(selected)) {
					find.disabled = true;
				} else {
					find.disabled = _.isNull(selected.FormFk) || _.isUndefined(selected.FormFk);
				}
				if ($scope.tools) {
					$scope.tools.update();
				}
			}
		}

		platformGridAPI.events.register('a358f29d65c74a0f955ed5c1a1a57651', 'onSelectedRowsChanged', onSelectedRowsChanged);

		function onEditForm(/* e, args */) {
			if (modelMainObjectSetDataService.hasSelection()) {
				const objectSetEntity = modelMainObjectSetDataService.getSelected();
				/** @namespace instanceEntity.FormDataFk */
				const options = {
					formId: objectSetEntity.FormFk,
					formDataId: objectSetEntity.FormDataFk,
					editable: true,
					setReadonly: false,
					modal: true
				};
				basicsUserformCommonService.editData(options);
			}
		}

		function onFormSaved(e) {

			if (modelMainObjectSetDataService.hasSelection()) {
				const mainItem = modelMainObjectSetDataService.getSelected();
				if (!mainItem) {
					return;
				}

				mainItem.FormdataFk = e;
				modelMainObjectSetDataService.markCurrentItemAsModified();
			}
		}

		const items = modelMainObjectSetDataService.getList();
		if (items.length <= 0) {
			modelMainObjectSetDataService.loadAllObjectSets();
		}

		basicsUserformCommonService.formDataSaved.register(onFormSaved);

		$scope.$on('$destroy', function () {
			basicsUserformCommonService.formDataSaved.unregister(onFormSaved);
			platformGridAPI.events.unregister('a358f29d65c74a0f955ed5c1a1a57651', 'onSelectedRowsChanged', onSelectedRowsChanged);
		});
	}
})(angular);
