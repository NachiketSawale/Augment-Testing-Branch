/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.main.directive:modelMainObjectSource
	 * @element div
	 * @restrict A
	 * @description A directive that lets users select one out of several possible sources for model object IDs.
	 */
	angular.module('model.main').directive('modelMainObjectSource',
		modelMainObjectSource);

	modelMainObjectSource.$inject = ['$translate', 'modelViewerSelectionWizardService',
		'modelViewerCompositeModelObjectSelectionService', 'modelViewerObjectTreeService', '_',
		'modelViewerModelIdSetService', 'modelViewerModelSelectionService'];

	function modelMainObjectSource($translate, modelViewerSelectionWizardService,
		modelViewerCompositeModelObjectSelectionService, modelViewerObjectTreeService, _,
		modelViewerModelIdSetService, modelViewerModelSelectionService) {

		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'model.main/templates/model-main-object-source.html',
			scope: {
				model: '=',
				readonly: '<',
				allowCollapse: '<'
			},
			link: function ($scope) {
				if (_.isNil($scope.allowCollapse)) {
					$scope.allowCollapse = true;
				}

				const objectIds = {
					minc: null,
					l: null,
					custom: null
				};

				$scope.labels = {
					title: $translate.instant('model.main.objectSrcTitle'),
					customEdit: $translate.instant('model.main.objectSrcCustomEdit')
				};

				function updateObjectCount() {
					const isModelSelected = !!modelViewerModelSelectionService.getSelectedModel();

					const currentSelection = {
						objectIds: isModelSelected ? modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds() : new modelViewerModelIdSetService.MultiModelIdSet()
					};
					if (isModelSelected) {
						objectIds.minc = modelViewerObjectTreeService.retrieveObjectsByMode(currentSelection, {
							treePart: 'minc'
						}).objectIds;
						objectIds.l = modelViewerObjectTreeService.retrieveObjectsByMode(currentSelection, {
							treePart: 'l'
						}).objectIds;
					} else {
						objectIds.minc = currentSelection.objectIds;
						objectIds.l = currentSelection.objectIds;
					}

					$scope.$evalAsync(function () {
						$scope.labels.minc = $translate.instant('model.main.objectSrcViewer', {
							treePart: $translate.instant('model.viewer.selectionWz.treePartMinimalComposite'),
							objectCount: objectIds.minc.totalCountTruthy()
						});
						$scope.labels.l = $translate.instant('model.main.objectSrcViewer', {
							treePart: $translate.instant('model.viewer.selectionWz.treePartLeaves'),
							objectCount: objectIds.l.totalCountTruthy()
						});
					});
				}

				updateObjectCount();

				modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(updateObjectCount);
				$scope.$on('$destroy', function () {
					modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(updateObjectCount);
				});

				function updateCustomObjectCount() {
					$scope.$evalAsync(function () {
						$scope.labels.custom = $translate.instant('model.main.objectSrcCustom', {
							objectCount: _.isObject(objectIds.custom) ? objectIds.custom.totalCountTruthy() : 0
						});
					});
				}

				updateCustomObjectCount();

				$scope.editCustomSource = function () {
					modelViewerSelectionWizardService.showDialogEmbedded().then(function (result) {
						if (result.success) {
							objectIds.custom = result.objectIds;
							$scope.$evalAsync(function () {
								$scope.selectedMode.id = 'custom';
								updateCustomObjectCount();
							});
						}
					});
				};

				$scope.selectedMode = {
					id: 'l'
				};

				$scope.$watch('selectedMode.id', function (newValue) {
					$scope.model = _.isObject(objectIds[newValue]) ? _.cloneDeep(objectIds[newValue]) : new modelViewerModelIdSetService.MultiModelIdSet();
				});
			}
		};
	}
})(angular);
