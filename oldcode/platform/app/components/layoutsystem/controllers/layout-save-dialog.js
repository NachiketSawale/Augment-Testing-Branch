/*
 * $Id: layout-save-dialog.js 567029 2019-11-15 14:22:31Z kh $
 * Copyright (c) RIB Software GmbH
 */

((angular) => {
	'use strict';

	/**
	 @ngdoc controller
	 * @name LayoutSaveDialogController
	 * @function
	 *
	 * @description
	 * Controller for the Layout Configurator Dialog view.
	 */
	const LayoutSaveController = function ($scope, $q, $timeout, $modalInstance, platformTranslateService, platformPermissionService, $translate, mainViewService, permissions, platformModalService,
		platformUserInfoService, moment, basicsCommonConfigLocationListService, $rootScope, platformObjectHelper, cloudDesktopBulkSearchDataService, cloudDesktopSidebarService, platformDialogService,
		platformDataValidationService, platformCustomTranslateService, platformLayoutSaveDialogService, platformContextService) {

		let availableViews = mainViewService.getAllViewNames();
		var currentModuleName;
		var systemviewId = '1';
		var userviewId = '0';
		var roleviewId = '2';
		var portalViewId = '3';
		var noneFilter = {
			id: 0,
			displayName: 'None',
			disabled: false
		};

		$scope.displayedViews = [];
		$scope.selections = {
			selectedView: null,
			inputView: null,
			selectedType: null,
			selectedFilter: null,
			loadDataModuleStart: false,
			loadDataTabChanged: false,
			filterDefs: {
				valueMember: 'id',
				displayMember: 'displayName',
				group: {
					groupById: 'accessLevel'
				},
				items: []
			}
		};

		$scope.viewnameCtrlOptions = {
			onInitiated: function (info) {
				// if(!checkInputView()) {
				if (!platformLayoutSaveDialogService.checkInputViewTranslation($scope.selections)) {
					platformCustomTranslateService.control.setValue(
						platformCustomTranslateService.createTranslationKey($scope.viewnameCtrlOptions),
						$scope.selections.inputView.Description);
				} else if (!$scope.selections.selectedView && $scope.selections.inputView) {
					$scope.selections.selectedView = $scope.selections.inputView;
				}
			},
			onTranslationChanged: function (info) {
				if (!$scope.selections.inputView) {
					$scope.selections.inputView = {};
				}

				$scope.selections.inputView.Description = info.newValue; // jshint ignore:line

				if ((!_.isNaN(info.newValue) && info.oldValue !== info.newValue) || (info.newValue && info.newValue !== '')) {
					// let availableItem = checkIsAvailable();
					let availableItem = platformLayoutSaveDialogService.checkIsViewAvailable($scope.displayedViews, $scope.selections.inputView.Description);
					if (availableItem) {
						//set existing id for translationskey
						platformLayoutSaveDialogService.setIdForDescriptionTranslation($scope.viewnameCtrlOptions, availableItem.Id);
					} else {
						//set new id for translationskey
						platformLayoutSaveDialogService.setNewIdForDescriptionTranslation($scope.selections.inputView, $scope.viewnameCtrlOptions);
					}
				}
			},
			inputDomain: 'comment',
			section: 'views',
			id: platformLayoutSaveDialogService.getDefaultTranslationID(),
			name: 'Description',
			watchId: true,
			hiddenClearButton: true
		};

		$scope.viewTypes = basicsCommonConfigLocationListService.createItems({user: true, role: true, system: true, portal: true});
		$scope.selections.selectedType = $scope.viewTypes[0];
		if (cloudDesktopSidebarService.filterRequest.enhancedSearchEnabled && cloudDesktopSidebarService.filterRequest.enhancedSearchVersion === '2.0') {
			retrieveFilterDefBasedOnSelectedType($scope.selections.selectedType).then(function () {
				$scope.showSaveFilterInput = true;
			});
		} else {
			$scope.showSaveFilterInput = false;
		}

		platformTranslateService.registerModule(['cloud.common', 'basics.common']);

		var setItemsFormatInSelectbox = function (items) {
			var generatedItems = [];

			var accessLevels = [
				{
					id: 'System',
					caption: $translate.instant('basics.common.configLocation.system'),
					cssClass: 'title control-icons ' + (cloudDesktopBulkSearchDataService.hasSysFtrWrAccess ? 'ico-search-system' : 'ico-search-system-prot')
				},
				{
					id: 'User',
					caption: $translate.instant('basics.common.configLocation.user'),
					cssClass: 'title control-icons ' + (cloudDesktopBulkSearchDataService.hasUserFtrWrAccess ? 'ico-search-user' : 'ico-search-user-prot')
				},
				{
					id: 'Role',
					caption: $translate.instant('basics.common.configLocation.role'),
					cssClass: 'title control-icons ' + (cloudDesktopBulkSearchDataService.hasRoleFtrWrAccess ? 'ico-search-role' : 'ico-search-role-prot')
				}
			];

			angular.forEach(accessLevels, function (level) {
				var itemsFromList = _.filter(items, {accessLevel: level.id});

				// fill title
				if (itemsFromList.length > 0) {
					generatedItems.push({
						id: 666,
						displayName: level.caption,
						type: 'title',
						childId: level.id,
						cssClassButton: level.cssClass,
						disabled: true
					});

					// fill items for access level
					generatedItems = generatedItems.concat(itemsFromList);
				}
			});

			generatedItems.unshift(noneFilter);

			return generatedItems;
		};

		function retrieveFilterDefBasedOnSelectedType(selectedType) {
			if (selectedType) {
				currentModuleName = cloudDesktopSidebarService.filterRequest.moduleName;
				if (currentModuleName) {
					cloudDesktopBulkSearchDataService.fetchFilters(currentModuleName).then(function (filters) {
						if (filters) {
							var availableFilterDefs = filters.filter(function (e) {
								if (selectedType.name === 'System' || selectedType.name === 'Portal') {
									return e.accessLevel === 'System';
								} else if (selectedType.name === 'Role') {
									return e.accessLevel === 'System' || e.accessLevel === 'Role';
								} else {
									return true;
								}
							});
							$scope.selections.filterDefs.items = setItemsFormatInSelectbox(availableFilterDefs);

							$scope.selections.selectedFilter = noneFilter;
						}
					});
				}
			} else {
				$scope.selections.filterDefs.items = setItemsFormatInSelectbox([]);
			}
			return $q.when($scope.selections.filterDefs.items);
		}

		function refreshViews(setSelectedType = false) {
			let currentView = mainViewService.getCurrentView();

			if (currentView && setSelectedType) {
				let views = mainViewService.getAllViewNames();
				let initialView = _.find(views, ['Id', currentView.ModuleTabViewOriginFk], 0);
				if (initialView) {
					if (initialView.IsPortal) {
						$scope.selections.selectedType = $scope.viewTypes.byId.p;
					} else if (initialView.Issystem) {
						$scope.selections.selectedType = $scope.viewTypes.byId.g;
					} else if (initialView.FrmAccessroleFk) {
						$scope.selections.selectedType = $scope.viewTypes.byId.r;
					} else {
						$scope.selections.selectedType = $scope.viewTypes.byId.u;
					}
				}
			}

			let selectedType = $scope.selections.selectedType.value;

			$scope.selections.selectedView = null;

			$scope.displayedViews = _.filter(availableViews, function (view) {
				if (view.Description === null) {
					return false;
				}
				if (selectedType === systemviewId && view.Issystem) {
					return true;
				}
				if (selectedType === portalViewId && view.IsPortal) {
					return true;
				}
				if (selectedType === roleviewId && view.FrmAccessroleFk !== null) {
					return true;
				}
				if (selectedType === userviewId && view.FrmUserFk !== null && !view.FrmAccessroleFk) {
					return true;
				}
			});

			$scope.displayedViews = _.sortBy($scope.displayedViews, 'Description');

			_.each($scope.displayedViews, function (view) {
				let userName = platformUserInfoService.logonName(view.UpdatedBy || view.InsertedBy);
				//let extStr;
				let dateTime = moment.utc(view.UpdatedAt || view.InsertedAt).local().format('L | LTS');

				if (userName) {
					view.extStr = userName + ' | ' + dateTime;
					view.dialogName = view.Description + ' (' + view.extStr + ')' + (view.Isdefault && (' (' + $scope.modalOptions.defaultButtonText + ')') || '');
				} else {
					console.log('user info not found:' + view.UpdatedBy + ' | ' + view.InsertedBy);
					view.dialogName = view.Description + ' ( loading ...)';

					platformUserInfoService.loadUsers([view.UpdatedBy || view.InsertedBy])
						.then(function () {
							userName = platformUserInfoService.logonName(view.UpdatedBy || view.InsertedBy);
							view.extStr = userName + ' | ' + dateTime;
							view.dialogName = view.Description + ' (' + view.extStr + ')' + (view.Isdefault && (' (' + $scope.modalOptions.defaultButtonText + ')') || '');
						});
				}
			});

			if (currentView) {
				let selectedView = _.find($scope.displayedViews, function (n) {
					if (n.Id === currentView.ModuleTabViewOriginFk) {
						return true;
					}
				});

				$scope.selections.selectedView = selectedView;

				$scope.selectedViewChanged();
			}
		}

		/**
		 * @param permission
		 * @returns {boolean}
		 */
		function checkPermissions(permission) {
			var result = false;
			switch ($scope.selections.selectedType.value) {
				case userviewId:
					result = platformPermissionService.has('00f979839fb94839a2998b4ca9dd12e5', permission);
					break;
				case systemviewId:
					result = platformPermissionService.has('1b77aedb2fae468cb9fd539af120b87a', permission);
					break;
				case roleviewId:
					result = platformPermissionService.has('842f845cb6934b109a40983366f981ef', permission);
					break;
				case portalViewId:
					result = platformPermissionService.has('c9e2ece5629b4037b4f8695c92e59c1b', permission);
					break;
			}
			return result;
		}

		$scope.disableDelete = true;
		$scope.disableInput = false;

		function disableDel() {
			var result;
			if ($scope.selections.selectedView !== null) {
				result = !checkPermissions(permissions.delete);
			} else {
				result = true;
			}
			return result;
		}

		$scope.disableRename = function disableRename() {
			let result;
			if ($scope.selections.selectedView !== null) {
				result = !checkPermissions(permissions.write);
			} else {
				result = true;
			}
			return result;
		};

		$scope.disableDefault = function disableDefault() {
			var result = false;

			result = !_.isUndefined($scope.selections.selectedView) && $scope.selections.selectedView !== null && !$scope.selections.selectedView.Isdefault && $scope.selections.selectedType.value !== userviewId && checkPermissions(permissions.write);

			return !result;
		};

		$scope.disableOkay = function () {
			var result = false;
			if ($scope.selections.selectedType !== null) {
				result = !checkPermissions(permissions.write);
			}
			if (_.isNil($scope.selections.inputView) || _.isNil($scope.selections.inputView.Description) || $scope.selections.inputView.Description === '') {
				result = true;
			}
			return result;
		};

		$scope.selectedViewChanged = function () {
			$scope.selections.inputView = angular.copy($scope.selections.selectedView);
			$scope.selections.selectedFilter = noneFilter;

			if ($scope.selections.inputView) {
				platformLayoutSaveDialogService.setIDForCustomTranslation($scope.viewnameCtrlOptions, $scope.selections);

				if ($scope.selections.inputView.Config.filterId) {
					let selectedFilter = $scope.selections.filterDefs.items.find(function (item) {
						return item.id === $scope.selections.inputView.Config.filterId;
					});
					if (selectedFilter) {
						$scope.selections.selectedFilter = selectedFilter;
					}
				}
				$scope.selections.loadDataTabChanged = $scope.selections.inputView.Config.loadDataTabChanged ? $scope.selections.inputView.Config.loadDataTabChanged : false;
				$scope.selections.loadDataModuleStart = $scope.selections.inputView.Config.loadDataModuleStart ? $scope.selections.inputView.Config.loadDataModuleStart : false;

				if (cloudDesktopSidebarService.filterRequest.containsGlobalData) {
					$scope.disableLoadDataModuleStart = true;
					$scope.selections.loadDataModuleStart = false;
				} else {
					$scope.disableLoadDataModuleStart = false;
				}
			} else {
				$scope.selections.loadDataTabChanged = false;
				$scope.selections.loadDataModuleStart = false;
			}
			$scope.disableDelete = disableDel();
		};

		$scope.selectedTypeChanged = function () {
			$scope.selections.selectedView = null;
			$scope.selections.selectedFilter = null;
			$scope.disableInput = !checkPermissions(permissions.write);
			retrieveFilterDefBasedOnSelectedType($scope.selections.selectedType).then(function () {
				refreshViews();
				$scope.disableDelete = disableDel();
			});
		};

		$scope.inputChanged = function () {
			$scope.selections.selectedView = null;
			$scope.disableDelete = true;
		};

		$scope.onFilterChanged = function () {
			if ($scope.selections.selectedFilter !== noneFilter) {
				$scope.selections.loadDataTabChanged = true;
				$scope.selections.loadDataModuleStart = true;
			}
		};

		$scope.showIt = false;
		$scope.modalOptions = {
			closeButtonText: $translate.instant('basics.common.button.cancel'),
			actionButtonText: $translate.instant('basics.common.button.ok'),
			deleteButtonText: $translate.instant('cloud.common.delete'),
			defaultButtonText: $translate.instant('basics.common.button.default'),
			renameButtonText: $translate.instant('basics.common.button.rename'),
			headerText: $translate.instant('basics.common.button.save')
		};

		function savedViewPostProcess(view, result) {
			$rootScope.$emit('layout-system:layout-saved', view);
			// mainViewService.selectView(view);
			$modalInstance.close(result);
		}

		$scope.saveview = $scope.modalOptions.ok = function () {
			var result = {};
			result.type = 'ok';
			// ToDO: append view data to result.
			var viewType = $scope.selections.selectedType.value;

			var found = _.find($scope.displayedViews, function (item) {
				if ($scope.selections.inputView) {
					return item.Description === $scope.selections.inputView.Description;
				}
			});

			if (found || $scope.selections.selectedView || $scope.selections.inputView.Description !== 'Latest View') {
				$scope.selections.selectedView = found;
				var view = angular.isDefined($scope.selections.selectedView) && $scope.selections.selectedView !== null ? $scope.selections.selectedView : $scope.selections.inputView;

				if (!$scope.selections.selectedView) {
					view.Id = -1;
				}

				/*
				The new saved objects get a value in the property.
				This value is important for the process in translation objects
				 */
				if ($scope.selections.selectedType.id !== 'u' && !$scope.selections.inputView.DescriptionTr) {
					view.DescriptionTr = -1;
				}

				var additionalConfig = {
					filterId: $scope.selections.selectedFilter ? $scope.selections.selectedFilter.id : null,
					loadDataModuleStart: $scope.selections.loadDataModuleStart,
					loadDataTabChanged: $scope.selections.loadDataTabChanged
				};

				$timeout(() => {
					const promise = mainViewService.saveview(view, viewType, null, additionalConfig);

					if (platformObjectHelper.isPromise(promise)) {
						promise.then(view => {

							if ($scope.selections.selectedType.id !== 'u') {
								//no customtranslate for USER
								return platformCustomTranslateService.renameTranslationId('views', $scope.viewnameCtrlOptions.id, view.Id).then(function (resp) {
									if (resp) {
										$scope.viewnameCtrlOptions.id = view.Id;
									}
									platformCustomTranslateService.writeCachedData();
									savedViewPostProcess(view, result);
								});
							} else {
								savedViewPostProcess(view, result);
							}
						});
					}
				}, 0);
			} else {
				const exception = {
					ErrorCode: '',
					ErrorMessage: '',
					ErrorDetails: ''
				};
				if ($scope.selections.inputView.Description === 'Latest View') {
					// ToDo: Error dialog here.
					exception.ErrorCode = 0;
					exception.ErrorMessage = 'You can not name a user layout Latest View';
					exception.ErrorDetails = '';
				} else {
					exception.ErrorCode = 0;
					exception.ErrorMessage = 'Something went wrong.';
					exception.ErrorDetails = '';
				}
				platformModalService.showErrorDialog(exception);
			}
		};

		$scope.modalOptions.delete = function () {
			platformLayoutSaveDialogService.deleteCustomTranslation($scope.selections.selectedType.id, $scope.selections.selectedView.Id);

			mainViewService.deleteView($scope.selections.selectedView);

			refreshViews();
			$scope.selections.inputView = null;
		};

		//Rename-process via translations-object
		$scope.modalOptions.renameTranslationObject = function () {
			const selectedView = $scope.selections.selectedView;
			if (!selectedView) {
				return;
			}

			let languageKey = $scope.selections.inputView.Description$tr$;

			return platformCustomTranslateService.openTranslationDialog(languageKey, 'comment').then(function (response) {
				if (response.ok) {

					let trans = {};
					_.each(response.value, function (item) {
						trans[item.culture] = item.description;
					});

					return platformCustomTranslateService.saveTranslations(languageKey, trans).then(function (result) {
						platformCustomTranslateService.control.update(languageKey);
						platformTranslateService.reloadCustomTranslation(languageKey);
						let toChangeView = _.find($scope.displayedViews, (v) => v.Id === selectedView.Id);
						toChangeView.Description = trans[platformContextService.getLanguage()];
						refreshViews();
						platformCustomTranslateService.writeCachedData();
					});
				}
			});
		};

		function renameview(selectedView, newName) {
			mainViewService.renameview(selectedView.Id, newName).then(() => {
				let toChangeView = _.find($scope.displayedViews, (v) => v.Id === selectedView.Id);
				toChangeView.Description = newName;
				refreshViews();
			});
		}

		$scope.modalOptions.rename = function () {
			function existView(viewName) {
				let existingView = _.find($scope.displayedViews, (view) => view.Description === viewName);
				return !_.isUndefined(existingView);
			}

			const selectedView = $scope.selections.selectedView;
			if (!selectedView) {
				return;
			}

			platformDialogService.showInputDialog({
				headerText: $scope.modalOptions.renameButtonText,
				bodyText: selectedView.Description,
				value: {text: selectedView.Description},
				topDescription: $translate.instant('cloud.common.layout.renameDescription'),
				pattern: '^[0-9a-zA-Z \\-_]*$', // only numbers and letters,
				labelText: $translate.instant('cloud.common.layout.savename'),
				maxLength: 63,
				width: '300px',
				onValidateInput: (newValue) => {
					if (newValue === selectedView.Description) {
						return true;
					}

					if (existView(newValue)) {
						return platformDataValidationService.createErrorObject('cloud.common.layout.existingViewNameError');
					}

					return true;
				}
			}).then(function (result) {
				if (result.ok) {
					let newName = result.value.text;

					if (newName === selectedView.Description) {
						// No changes in view name
						return;
					}

					renameview(selectedView, newName);
				}
			});
		};

		$scope.modalOptions.default = function () {
			mainViewService.setDefaultView($scope.selections.selectedView)
				.then(function () {
					refreshViews();
				});
			$scope.selections.inputView = null;
		};

		$scope.modalOptions.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		$scope.labels = [
			{
				description: $translate.instant('cloud.common.layout.savelocation') !== 'cloud.common.layout.savelocation' ? $translate.instant('cloud.common.layout.savelocation') : 'Location'
			},
			{
				description: $translate.instant('cloud.common.layout.viewname') !== 'cloud.common.layout.viewname' ? $translate.instant('cloud.common.layout.viewname') : 'Available Views'
			},
			{
				description: $translate.instant('cloud.common.layout.assignSidebarFilter') !== 'cloud.common.layout.assignSidebarFilter' ? $translate.instant('cloud.common.layout.assignSidebarFilter') : 'Assign Sidebar Filter'
			},
			{
				description: $translate.instant('cloud.common.layout.savename') !== 'cloud.common.layout.savename' ? $translate.instant('cloud.common.layout.savename') : 'View Name'
			},
			{
				description: $translate.instant('cloud.common.layout.loadModuleStart') !== 'cloud.common.layout.loadModuleStart' ? $translate.instant('cloud.common.layout.loadModuleStart') : 'Load Data at Module Start'
			},
			{
				description: $translate.instant('cloud.common.layout.loadTabChanged') !== 'cloud.common.layout.loadTabChanged' ? $translate.instant('cloud.common.layout.loadTabChanged') : 'Load Data at View- / Tab changed'
			}
		];

		// loads or updates translated strings
		var loadTranslations = function () {
			// load translation ids and convert result to object
			$scope.modalOptions.closeButtonText = $translate.instant('basics.common.button.cancel');
			$scope.modalOptions.actionButtonText = $translate.instant('basics.common.button.ok');
			$scope.modalOptions.deleteButtonText = $translate.instant('cloud.common.delete');
			$scope.modalOptions.defaultButtonText = $translate.instant('basics.common.button.default');
			$scope.modalOptions.headerText = $translate.instant('basics.common.button.save');
			$scope.modalOptions.renameButtonText = $translate.instant('basics.common.button.rename');
		};

		// register translation changed event
		platformTranslateService.translationChanged.register(loadTranslations);

		// extract user ids from UpdatedBy and InsertedBy properties and remove duplicates
		var userIds = _.compact(_.union(_.map(availableViews, 'InsertedBy'), _.map(availableViews, 'UpdatedBy')));

		platformUserInfoService.loadUsers(userIds)
			.then(function () {
				refreshViews(true);
			});

		/* $timeout(function () {
			$scope.$apply();
		}, 10); */
	};

	LayoutSaveController.$inject = ['$scope', '$q', '$timeout', '$modalInstance', 'platformTranslateService', 'platformPermissionService', '$translate', 'mainViewService', 'permissions',
		'platformModalService', 'platformUserInfoService', 'moment', 'basicsCommonConfigLocationListService', '$rootScope', 'platformObjectHelper', 'cloudDesktopBulkSearchDataService',
		'cloudDesktopSidebarService', 'platformDialogService', 'platformDataValidationService', 'platformCustomTranslateService',
		'platformLayoutSaveDialogService', 'platformContextService'];
	angular.module('platform').controller('layoutSaveController', LayoutSaveController);

})(angular);
