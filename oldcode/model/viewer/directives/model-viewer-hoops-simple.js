/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.viewer.directive:modelViewerHoopsSimple
	 * @element div
	 * @restrict A
	 * @description A simple HOOPS 3D viewer.
	 */
	angular.module('model.viewer').directive('modelViewerHoopsSimple',
		modelViewerHoopsSimple);

	modelViewerHoopsSimple.$inject = ['_', 'modelViewerHoopsLoadingService', '$log',
		'$translate', '$q', 'modelViewerModelSelectionService',
		'modelProjectSelectedModelInfoService', 'Communicator',
		'modelAdministrationViewerSettingsRuntimeService', 'modelViewerHoopsUtilitiesService'];

	function modelViewerHoopsSimple(_, modelViewerHoopsLoadingService, $log,
		$translate, $q, modelViewerModelSelectionService,
		modelProjectSelectedModelInfoService, Communicator,
		modelAdministrationViewerSettingsRuntimeService, modelViewerHoopsUtilitiesService) {

		return {
			restrict: 'A',
			template: '<div data-model-viewer-hoops></div>',
			replace: true,
			scope: {
				viewer: '=',
				config: '<',
				modelId: '<'
			},
			link: function ($scope) {
				const privateState = {
					currentLoadRequest: null,
					loadedModelId: null,
					config: _.assign({
						statusFieldId: null,
						updateState: null,
						registerSizeChanged: null,
						unregisterSizeChanged: null,
						additionalViewerInitialization: null,
						additionalGeneralInitialization: null,
						useModelSelectionService: false,
						getUiAddOns: null,
						registerRefreshRequested: null,
						unregisterRefreshRequested: null
					}, _.isObject($scope.config) ? $scope.config : {}),
					state: {
						ready: false,
						loading: false
					},
					updateState: function (info) {
						if (_.isBoolean(info.ready)) {
							this.state.ready = info.ready;
						}
						if (_.isBoolean(info.loading)) {
							this.state.loading = info.loading;
						}

						if (Object.prototype.hasOwnProperty(info, 'shortMessage') && (this.state.shortMessage !== info.shortMessage)) {
							this.state.shortMessage = info.shortMessage;
							if (_.isString(this.config.statusFieldId)) {
								privateState.config.getUiAddOns().getStatusBar().getLink().updateFields([{
									id: this.config.statusFieldId,
									value: this.state.shortMessage
								}]);
							}
						}

						if (Object.prototype.hasOwnProperty(info, 'longMessage') && (this.state.longMessage !== info.longMessage)) {
							this.state.longMessage = info.longMessage;
						}

						if (_.isFunction(this.config.updateState)) {
							this.config.updateState(_.clone(this.state));
						}
					}
				};

				$scope.isLightweightHoopsViewer = true;

				function resizeContent() {
					if ($scope.viewer) {
						$scope.resizeViewer();
					}
				}

				if (_.isFunction(privateState.config.registerSizeChanged)) {
					privateState.config.registerSizeChanged(resizeContent);
					if (_.isFunction(privateState.config.unregisterSizeChanged)) {
						$scope.$on('$destroy', function () {
							privateState.config.unregisterSizeChanged(resizeContent);
						});
					}
				}

				function getActiveModel() {
					if (privateState.config.useModelSelectionService) {
						return $q.when(modelViewerModelSelectionService.getSelectedModel());
					} else {
						if (_.isNumber($scope.modelId)) {
							return modelProjectSelectedModelInfoService.loadSelectedModelInfoFromId($scope.modelId);
						}
					}
					return $q.when(null);
				}

				function updateModel() {
					return $q.all({
						selModel: getActiveModel(),
						activeSettings: modelAdministrationViewerSettingsRuntimeService.loadActiveSettings()
					}).then(function (data) {
						const selModel = data.selModel;
						if (selModel) {
							if (privateState.loadedModelId === selModel.info.modelId) {
								return;
							}

							if (privateState.currentLoadRequest) {
								privateState.currentLoadRequest.cancel();
								privateState.currentLoadRequest = null;
							}

							const newLoadRequest = modelViewerHoopsLoadingService.loadModel($scope, selModel, {
								rendererType: modelViewerHoopsUtilitiesService.stringToRendererType(data.activeSettings.renderMode),
								streamingMode: modelViewerHoopsUtilitiesService.stringToStreamingMode(data.activeSettings.streamingMode),
								showLoadingInfo: function (msg) {
									privateState.updateState({
										longMessage: msg
									});
								},
								shutdownViewer: function () {
									privateState.updateState({
										loading: false,
										ready: false
									});
								}
							});
							privateState.currentLoadRequest = newLoadRequest;

							privateState.updateState({
								shortMessage: $translate.instant('model.viewer.loading.loading'),
								longMessage: '',
								loading: true,
								ready: false
							});

							const loadPromises = {
								viewer:
									newLoadRequest.promise.then(function defaultInitialization() {
										$scope.viewer().setCallbacks({
											timeoutWarning: function () {
												if (data.activeSettings.preventTimeout) {
													if ($scope.viewer) {
														$scope.viewer().resetClientTimeout();
													}
												}
											}
										});

										$scope.viewer().operatorManager.clear();
									}).then(function customInitialization() {
										if (_.isFunction(privateState.config.additionalViewerInitialization)) {
											return privateState.config.additionalViewerInitialization({
												viewer: $scope.viewer()
											});
										}
									})
							};
							if (_.isFunction(privateState.config.additionalGeneralInitialization)) {
								loadPromises.additional = $q.when(privateState.config.additionalGeneralInitialization());
							}

							return $q.all(loadPromises).then(function finalizeInitialization() {
								privateState.currentLoadRequest = null;

								privateState.updateState({
									shortMessage: $translate.instant('model.viewer.loading.ready'),
									loading: false,
									ready: true
								});
								$log.info('The model can now be used.');
							}, function (reason) {
								if (newLoadRequest === privateState.currentLoadRequest) {
									if (!reason.viewer || (reason.viewer === $scope.viewer())) {
										privateState.updateState({
											shortMessage: '',
											loading: false,
											ready: false
										});
										privateState.currentLoadRequest = null;
									}
								}
							});
						} else {
							if (_.isNil(privateState.loadedModelId)) {
								return;
							}

							// TODO: shutdown viewer
						}
					});
				}

				if (privateState.config.useModelSelectionService) {
					modelViewerModelSelectionService.onSelectedModelChanged.register(updateModel);
					$scope.$on('$destroy', function () {
						modelViewerModelSelectionService.onSelectedModelChanged.unregister(updateModel);
					});
				} else {
					$scope.$watch('modelId', function () {
						updateModel();
					});
				}

				updateModel();

				if (_.isFunction(privateState.config.registerRefreshRequested)) {
					privateState.config.registerRefreshRequested(updateModel);
					if (_.isFunction(privateState.config.unregisterRefreshRequested)) {
						$scope.$on('$destroy', function () {
							privateState.config.unregisterRefreshRequested(updateModel);
						});
					}
				}
			}
		};
	}
})(angular);
