/**
 * Created in workshop GZ
 */
// eslint-disable-next-line func-names
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformDetailControllerService
	 * @function
	 *
	 * @description
	 * Service to do the initializing of an item detail controller
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('platform').factory('platformDetailControllerService', platformDetailControllerService);

	platformDetailControllerService.$inject = ['_', 'globals', '$timeout', '$rootScope', 'platformContainerCreateDeleteButtonService', 'platformLayoutByDataService', 'platformValidationByDataService', 'platformObjectHelper'];

	function platformDetailControllerService(_, globals, $timeout, $rootScope, platformContainerCreateDeleteButtonService, platformLayoutByDataService, platformValidationByDataService, platformObjectHelper) {
		var service = {};

		service.initDetailController = function initDetailController($scope, itemService, validationService, uiStandardService, translationService) {
			var scope = $scope;

			function getFormConfig(uiStandardService, translationService) {
				var formConfig = null;

				if (!_.isNull(translationService) && !_.isUndefined(translationService)) {
					if (translationService.getTranslate) {
						scope.translate = translationService.getTranslate();
						formConfig = uiStandardService.getStandardConfigForDetailView();
					} else if (translationService.translateFormConfig) {
						formConfig = uiStandardService.getStandardConfigForDetailView();
						translationService.translateFormConfig(formConfig);
					}
				}
				if (_.isNull(formConfig)) {
					formConfig = uiStandardService.getStandardConfigForDetailView();
				}
				return formConfig;
			}

			scope.path = globals.appBaseUrl;
			scope.currentItem = itemService.getSelected();
			platformLayoutByDataService.registerLayout(uiStandardService, itemService);
			platformValidationByDataService.registerValidationService(validationService, itemService);

			var formConfig = getFormConfig(uiStandardService, translationService);
			formConfig.uuid = scope.getContainerUUID();

			var createDeleteBtnConfig = {isTree: itemService.createChildItem};
			platformContainerCreateDeleteButtonService.provideButtons(createDeleteBtnConfig, itemService);

			if (formConfig.addValidationAutomatically && !!validationService) {
				_.forEach(formConfig.rows, function (row) {
					var rowModel = row.model.replace(/\./g, '$');

					var syncName = 'validate' + rowModel;
					var asyncName = 'asyncValidate' + rowModel;

					if (validationService[syncName]) {
						row.validator = validationService[syncName];
					}

					if (validationService[asyncName]) {
						row.asyncValidator = validationService[asyncName];
					}
				});
			}

			if (itemService.markCurrentItemAsModified) {
				formConfig.dirty = function dirty(entity, model, options) {
					if (!options.isTransient) {
						itemService.markCurrentItemAsModified();
						(itemService.gridRefresh || angular.noop())();
					}
				};
			}

			scope.formOptions = {
				configure: formConfig,
				isDynamicReadonlyConfig: !!uiStandardService.isDynamicReadonlyConfig,
				isBtnSettingHide: !!uiStandardService.isBtnSettingHide,
				onPropertyChanged: function () {
					itemService.markCurrentItemAsModified();
				},
				onLeaveLastRow: function (isEditNavigate) {
					return itemService.goToNext(isEditNavigate);
				}
			};

			var navigationFunctions = {
				onFirstItem: function onFirstItem() {
					itemService.goToFirst();
				},

				onPrevItem: function onPrevItem() {
					itemService.goToPrev();
				},

				onNextItem: function onNextItem() {
					itemService.goToNext();
				},

				onLastItem: function onLastItem() {
					itemService.goToLast();
				}
			};

			if (itemService.isSubItemService()) {

				angular.extend(scope.formOptions, navigationFunctions);
			}

			scope.formContainerOptions = {
				formOptions: scope.formOptions
			};

			if (itemService.isSubItemService()) {

				angular.extend(scope.formContainerOptions, navigationFunctions);
			}

			scope.formContainerOptions.createBtnConfig = createDeleteBtnConfig.createBtnConfig;
			scope.formContainerOptions.deleteBtnConfig = createDeleteBtnConfig.deleteBtnConfig;
			scope.formContainerOptions.createChildBtnConfig = createDeleteBtnConfig.createChildBtnConfig;

			function loadCurrentItem() {
				if (platformContainerCreateDeleteButtonService.toggleButtons(createDeleteBtnConfig, itemService)) {
					scope.currentItem = itemService.getSelected();

					var containerScope = scope.$parent;

					while (containerScope && !containerScope.hasOwnProperty('setTools')) {
						containerScope = containerScope.$parent;
					}
					if (containerScope && containerScope.tools) {
						containerScope.tools.refresh();
					}
				} else {
					$timeout(function () {
						if (scope) {
							scope.currentItem = itemService.getSelected();
						}
					}, 0);
				}
			}

			itemService.registerSelectionChanged(loadCurrentItem);

			if (itemService.addUsingContainer) {
				itemService.addUsingContainer(formConfig.uuid);
			}

			scope.changeConfig = function changeConfig(dataService, uiService) {
				if (scope.formOptions.isDynamicReadonlyConfig) {
					itemService.unregisterSelectionChanged(loadCurrentItem);
					itemService = dataService;
					itemService.registerSelectionChanged(loadCurrentItem);
					scope.currentItem = itemService.getSelected();
					uiStandardService = uiService;
					scope.formOptions.configure = getFormConfig(uiStandardService, translationService);
				}
			};

			var unregisterUpdateEvent = $rootScope.$on('dataservice:update-done', function (/* event, info */) {
				var buttons = {disableCreate: false, disableDelete: false, disableCreateSub: false};
				if (platformContainerCreateDeleteButtonService.toggleButtonUsingContainerState(createDeleteBtnConfig, itemService, buttons)) {
					if (scope.tools && _.isFunction(scope.tools.refresh)) {
						scope.tools.refresh();

						$timeout(function () {
							scope.$apply();
						});
					}
				}
			});

			const unregisterBeforeFocusChangedEvent = $rootScope.$on('beforeContainerFocusChange', function(args, container) {
				if(_.isFunction(itemService.saveRecentChanges) && formConfig.uuid === container.containerId) {
					itemService.saveRecentChanges(container.newContainerId);
				}
			});

			// do not forget to unregister your subscription
			var unregister = scope.$on('$destroy', function () {
				unregisterBeforeFocusChangedEvent();
				unregisterUpdateEvent();
				itemService.unregisterSelectionChanged(loadCurrentItem);
				if (itemService.removeUsingContainer) {
					itemService.removeUsingContainer(formConfig.uuid);
				}

				unregister();
				unregister = null;

				platformObjectHelper.cleanupScope(scope);
				scope = null;
			});
		};

		return service;
	}
})(angular);