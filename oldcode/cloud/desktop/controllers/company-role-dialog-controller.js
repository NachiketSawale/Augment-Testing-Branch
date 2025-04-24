/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	/* global app */
	'use strict';

	/*
	 common used init function for the controllers
	 */
	const initCompanyRoleController = function initCompanyRoleController(_, $, $scope, $translate, $modalInstance, $timeout, initApp,
		platformContextService, platformTranslateService, tokenAuthentication, cloudDesktopCompanyService,
		cloudDesktopInfoService, platformModalService, $window, logonService) {

		$scope.embedded = globals.isEmbedded;
		$scope.modalOptions = {}; // important for use modaldialog-header-template.html

		// just set default values
		$scope.companyOptions = {
			languagesActive: !$modalInstance, // if modalinstance is null we're in the logon process, other called from App Settings.
			showReloadHint: function () {
				return showHintEnabled && companyRoleChanged();
			},
			showProcessingInfo: true,
			processingInfo: 'loading of Company structure in process',
			loading: true,
			loadingInfo: 'loading ...',
			alertClass: 'alert-info'
		};

		/**
		 *
		 * @param self
		 * @returns {*}
		 */
		function findLanguageItem(self) {
			// const self = $scope.uiLangOptions;
			const selectedId = self.selectedUiLang;
			return _.find(self.items, function (item) {
				return item.language === selectedId;
			});
		}

		$scope.uiLangOptions = {
			displayMember: 'languageName',
			valueMember: 'language',
			items: [],
			watchItems: true,
			selectedId: undefined,
			changed: false,
			navigationByKeyDisabled: true,
			changeEvent: function onUiLanguageChanged() {
				const self = $scope.uiLangOptions;
				const item = findLanguageItem(self);
				// const self = $scope.uiLangOptions;
				// const selectedId = self.selectedUiLang;
				// const item = _.find(self.items, function (item) {
				// return item.language === selectedId;
				// });
				self.changed = true; // keep track of changes
				platformContextService.setLanguage(item.language);
				platformContextService.culture(item.culture);
			}
		};

		$scope.dataLangOptions = {
			displayMember: 'DescriptionCulture',
			valueMember: 'Id',
			items: [],
			selectedDataLang: undefined,
			changed: false,
			navigationByKeyDisabled: true,
			changeEvent: function onDataLanguageChanged() {
				const self = $scope.dataLangOptions;
				const selectedId = self.selectedDataLang;
				platformContextService.setDataLanguageId(selectedId);
				self.changed = true; // keep track of changes
			}
		};

		$scope.additionalCss = 'e2e-language-item-';

		// loads or updates translated strings
		const loadTranslations = function () {
			// load translation ids and convert result to object
			// platformTranslateService.translateFormConfig(cloudSettingsDialogFormConfig);
			const context = $scope.companyOptions;
			context.cancelBtnText = $translate.instant('cloud.desktop.formConfigCancelBnt');
			context.actionBtnText = $translate.instant('cloud.desktop.formConfigOKBnt');
			context.continueBtnText = $translate.instant('cloud.desktop.mainMenuContinueBtn');
			context.companyLabel = $translate.instant('cloud.desktop.mainMenuCompanyLbl');
			context.roleLabel = $translate.instant('cloud.desktop.mainMenuRoleLbl');
			// context.dialogTitle = $translate.instant('cloud.desktop.companyFormTitle');
			context.dialogSubTitle = $translate.instant('cloud.desktop.companyFormSubTitle');
			context.reloadHint = $translate.instant('cloud.desktop.reloadApplicationHint');

			// just set default values
			context.dialogSubTitleLanguages = $translate.instant('cloud.desktop.mainMenuUiDataSubTitle');
			context.uilanguagelabel = $translate.instant('cloud.desktop.mainMenuUiLanguageLbl');
			context.datalanguagelabel = $translate.instant('cloud.desktop.mainMenuDataLanguageLbl');

			$scope.modalOptions.headerText = $translate.instant('cloud.desktop.companyFormTitle');
		};

		// register translation changed event
		platformTranslateService.translationChanged.register(loadTranslations);

		// register a module - translation table will be reloaded if module isn't available yet
		if (!platformTranslateService.registerModule('cloud.desktop')) {
			// if translation is already available, call loadTranslation directly
			loadTranslations();
		} else {
			loadTranslations();
		}

		$scope.data = {};
		$scope.productName = app.productName;
		$scope.productLogoPrimary = app.productLogoPrimary;

		const showHintEnabled = !!$modalInstance;
		let companyRoleOrigin;
		let companyRoleNewValue;

		/**
		 * @function companyRoleChanged
		 * checks for equality of companyRoleOrigin, companyRoleNewValue
		 * @returns {boolean}
		 */
		function companyRoleChanged() {
			return !_.isEqual(companyRoleOrigin, companyRoleNewValue);
		}

		// company properties
		// { "id": 1, "parentId": null, "companyType": 1, "name": "Gruppe 101", "code": "Z1011", .... }
		$scope.getDisplaytext = function getDisplaytext(node) {
			// const result = '['+node.id+'] '+node.code + (node.name ? ' ' + node.name : '') + '(' + node.companyType + ')';
			return node.code + (node.name ? ' ' + node.name : '');
		};

		/* set roles to the company and select first one or the one defined by selected */
		/**
		 * @function setRolesToCompany
		 * @param company
		 * @param selectedId
		 */
		function setRolesToCompany(company, selectedId) {

			companyRoleNewValue.signedInClientId = company.id;
			companyRoleNewValue.clientId = cloudDesktopCompanyService.getCompanyToSignedIn(company.id);

			const roleItems = cloudDesktopCompanyService.getRolesToCompany(company);
			$scope.roleOptions.items = roleItems;
			$scope.roleOptions.selectedRole = null; // unselect previous

			if (roleItems && roleItems.length > 0) {
				let selectedItem;
				if (selectedId) {
					selectedItem = _.find($scope.roleOptions.items, {key: selectedId});
				}
				$scope.roleOptions.selectedRole = selectedItem || roleItems[0];
			} else {
				$scope.roleOptions.selectedRole = null;  // rei@15.11.22 clean if not role is there.
			}
		}

		/*
		 */
		$scope.onNodeDblClick = function onNodeDblClick(node) {
			console.log('onNodeDblClick called: ', node);
			if (node) {
				_.noop();
			}
		};

		/*
		 */
		$scope.onSelection = function onSelection(node) {
			// $log.log('showSelected: ', node);
			if (node) {
				$scope.treeOptions.selectedNode = node;
				if (node) {
					setRolesToCompany(node);
				}
			}
		};

		/*
		 this function returns the ico class for the node, if node is not allowed to login we append '-d' and the
		 disabled icon will be taken.
		 */
		$scope.classByType = function classByType(node) {
			if (node) {
				// $log.log('showSelected: ',node);
				let theClass = node.companyType === 1 ? 'ico-comp-businessunit' :
					node.companyType === 2 ? 'ico-comp-root' : 'ico-comp-profitcenter';
				if (!node.canLogin) {
					theClass += '-d';
				}
				return theClass;
			}
			return 'ico-comp-businessunit';
		};

		/**
		 * @description
		 * This equality function just checks for different id
		 * @param a
		 * @param b
		 * @returns {boolean}
		 */
		function defaultEquality(a, b) {
			if (a === undefined || b === undefined) {
				return false;
			}
			return angular.equals(a.id, b.id);
		}

		$scope.treeOptions = {
			nodeChildren: 'children',
			dirSelectable: true,
			selectedNode: {},
			equality: defaultEquality
		};

		$scope.roleOptions = {
			displayMember: 'description',
			valueMember: 'key',
			selectedRole: null,
			items: [],
			navigationByKeyDisabled: true
		};

		// show initial processing info
		$scope.companyOptions.showProcessingInfo = false;
		$scope.companyOptions.processingInfo = ''; // 'loading of Company structure in process';

		// make sure the languages are loaded.
		logonService.readUiDataLanguages().then(function (/* data */) {

			let dataLangItems = [];
			_.forEach(globals.datalanguages, (lang) => {
				let displayLanguage = (lang.DescriptionInfo.Translated)? lang.DescriptionInfo.Translated : lang.DescriptionInfo.Description;
				let extendedItem = _.assign(lang, {DescriptionCulture: displayLanguage + ' (' + lang.Culture + ')'});
				dataLangItems.push(extendedItem);
			});

			$scope.dataLangOptions.items = dataLangItems;
			$scope.dataLangOptions.selectedDataLang = platformContextService.getDataLanguageId();

			Array.prototype.splice.apply($scope.uiLangOptions.items, [0, $scope.uiLangOptions.items.length].concat(logonService.getUiLanguages()));
			$scope.uiLangOptions.selectedUiLang = platformContextService.getLanguage() || platformContextService.getDefaultLanguage();

			cloudDesktopCompanyService.loadAssigedCompaniesToUser(/* forceReadContext */_.isNil($modalInstance)).then(function (data) {
				$scope.dataForTheTree = _.orderBy(data, 'code');

				if ($scope.dataForTheTree) { // expand first node, seems not to work
					createTreeDataMap();
					companyRoleOrigin = {
						signedInClientId: platformContextService.signedInClientId,
						clientId: platformContextService.clientId,
						roleId: platformContextService.permissionRoleId,
						permissionClientId: platformContextService.permissionClientId // this clientId is holding the permission role
					};
					angular.extend(companyRoleNewValue = {}, companyRoleOrigin);

					const actualCompany = cloudDesktopCompanyService.getCompanybyId(companyRoleOrigin.signedInClientId);
					if (actualCompany) {
						// console.log('Current settings Clientid/RoleClientId/RoleId/Company:',companyRoleOrigin.clientId, companyRoleOrigin.permissionClientId, companyRoleOrigin.roleId, actualCompany);
						// now find all parent to current selection and expand them complete, and select current selected company
						let allNodesUpToTop = cloudDesktopCompanyService.getAllNodesUpToRoot(companyRoleOrigin.clientId, null);
						if (allNodesUpToTop.length > 0) {
							allNodesUpToTop.splice(0, 1);
						}
						$scope.treeOptions.expandedNodes = allNodesUpToTop;
						$scope.treeOptions.selectedNode = actualCompany;

						// jump to middle of opened popup
						$timeout(function () {
							const p = angular.element('#company-scroller'); // scrollbar dom object
							const s = angular.element('.tree-selected'); // selected item has tree-selected class set
							const pOff = (p.offset() || {top: 0}).top;
							const sOff = (s.offset() || {top: 0}).top;
							const off = (sOff - pOff - (p.height() || 0) / 2) * (pOff < sOff ? 1 : -1);
							$(p).scrollTop(off);
						}, 0);

						// and now last not least, we set the items in the role combobox and select last role
						// if no longer there we take first role item
						setRolesToCompany(actualCompany, companyRoleOrigin.roleId);
					}
				} else {
					cloudDesktopCompanyService.companiesLoaded = false;  // reset already loading flag
					platformModalService.showErrorBox('cloud.desktop.loadCompanyNoDataBody', 'cloud.desktop.loadCompanyNoDataTitle')
						.then(CleanUpNoCompanyFound, CleanUpNoCompanyFound);
				}
				$scope.companyOptions.loading = false;
				$scope.companyOptions.showProcessingInfo = false;
				$scope.companyOptions.processingInfo = ' loading done...';
			}, function (error) {
				angular.extend($scope.companyOptions, {
					showProcessingInfo: true,
					processingInfo: $translate.instant('cloud.desktop.loadCompanyDataFailed', {p1: error.data.Message})
				});
				console.log('Company loading failed', error, $scope.companyOptions.processingInfo);
				// remove hint after after 5 sec
				$timeout(function () {
					$scope.companyOptions.showProcessingInfo = false;
					$scope.companyOptions.processingInfo = '';
					$scope.companyOptions.loading = false;
					app.closeCompanyNavigateToLogin();
				}, 3000, true);
			});
		});

		function createTreeDataMap() {
			$scope.treeDataMap = {};
			for (let i = 0; i < $scope.dataForTheTree.length; i++) {
				addToMapRecursive($scope.dataForTheTree[i], $scope.treeDataMap);
			}
		}

		function addToMapRecursive(item, map) {
			map[item.id] = item;
			if (item.hasChildren) {
				for (let i = 0; i < item.children.length; i++) {
					addToMapRecursive(item.children[i], map);
				}
			}
		}

		/**
		 * CleanUpNoCompanyFound
		 * @constructor
		 */
		function CleanUpNoCompanyFound() {
			cloudDesktopCompanyService.companiesLoaded = false;  // reset already loading flag
			tokenAuthentication.clearToken();
			platformContextService.resetUserContextToLocalStorage();
			app.closeCompanyNavigateToLogin();
		}

		/**
		 * @function fmtCompanyInfo
		 * @param company
		 * @returns {string}
		 */
		function fmtCompanyInfo(company) {
			return company.code + (!_.isNil(company.name) ? ' ' + company.name : '');
		}

		$scope.canExecuteOkButton = function canExecuteOkButton() {
			if ($scope.roleOptions && $scope.roleOptions.selectedRole) {
				let canExecute = !!$scope.roleOptions.selectedRole;
				canExecute &= !!$scope.treeOptions.selectedNode && $scope.treeOptions.selectedNode.canLogin && $scope.treeOptions.selectedNode.companyType !== 2;
				// console.log('canExecuteOkButton', canExecute);
				return canExecute;
			}
			return false;
		};

		_.set($scope, 'dialog.onReturnButtonPress', function onReturnButtonPress() {
			if ($scope.canExecuteOkButton()) {
				$scope.companyOptions.ok();
			}
		});

		/* This method will be called after user pressed OK Button.
		 we will take the selected client and Role (and according permissionRole ClientId
		 and save it back to the environment, so we can use next time this as the default clientid/roleid
		 */
		$scope.companyOptions.ok = function onOk(/* result */) {

			if ($scope.roleOptions && $scope.roleOptions.selectedRole) {
				const signedInClientId = $scope.treeOptions.selectedNode.id;
				const clientId = cloudDesktopCompanyService.getCompanyToSignedIn($scope.treeOptions.selectedNode.id);
				companyRoleNewValue = {
					signedInClientId: signedInClientId,
					clientId: clientId,
					permissionClientId: $scope.roleOptions.selectedRole.clientId,
					roleId: $scope.roleOptions.selectedRole.key
				};

				// save company selection info into platform context, prepare for display in mainframe and save to localdb
				const changedCompConfig = platformContextService.setCompanyConfiguration(
					companyRoleNewValue.signedInClientId,
					companyRoleNewValue.clientId,
					companyRoleNewValue.permissionClientId,
					companyRoleNewValue.roleId);

				// update CompanyName and Rolename to application data for usage in i.e. mainframe
				// const company = cloudDesktopCompanyService.getCompanybyId(companyRoleNewValue.clientId);
				const signedInCompany = cloudDesktopCompanyService.getCompanybyId(companyRoleNewValue.signedInClientId);
				const selectedRole = $scope.roleOptions.selectedRole;
				const companyNameFmt = fmtCompanyInfo(signedInCompany);
				cloudDesktopInfoService.update(companyNameFmt, selectedRole.value);

				// rei@16.5.18 check if culture is not already set, might have initialized with defaultCulture
				const _languageItem = findLanguageItem($scope.uiLangOptions);
				if (_languageItem) {
					const culture = platformContextService.getCulture();
					if (_languageItem.culture !== culture) {
						platformContextService.culture(_languageItem.culture);
						$scope.uiLangOptions.changed = true;
					}
				}

				// rei@15.3.18 support ui and data language
				// save it into the user setting
				if (changedCompConfig || $scope.uiLangOptions.changed || $scope.dataLangOptions.changed) {
					platformContextService.saveContextToLocalStorage();
				}
				if ($scope.uiLangOptions.changed || $scope.dataLangOptions.changed) {
					logonService.saveUiDataLanguages();
				}
			}

			cloudDesktopCompanyService.cleanupServiceData();

			if ($modalInstance) {
				if (companyRoleChanged()) {
					app.reloadDesktop();
				} else {
					$modalInstance.close('closed');
				}
			}

			if ($scope.onOk) {
				$scope.onOk();
			}
		};

		function getLastChild(item) {
			if (item.children && item.children.length > 0) {
				return _.orderBy(item.children, 'code')[item.children.length - 1];
			}

			return null;
		}

		function getFirstChild(item) {
			if (item.children && item.children.length > 0) {
				return _.orderBy(item.children, 'code')[0];
			}

			return null;
		}

		function isNodeOpen(item) {
			let openedItem = _.find($scope.treeOptions.expandedNodes, {id: item.id});
			return openedItem !== undefined;
		}

		function getSiblingList(item) {
			if (item.parentId) {
				let parentNode = $scope.treeDataMap[item.parentId];
				if (parentNode && parentNode.children) {
					return _.orderBy(parentNode.children, 'code');
				}
			} else {
				return $scope.dataForTheTree;
			}

			return [];
		}

		function getParentNode(item) {
			if (item.parentId) {
				return $scope.treeDataMap[item.parentId];
			}
			return null;
		}

		function getIndexInList(list, item) {
			let itemIndex = _.findIndex(list, (child) => {
				return child.id === item.id;
			});

			return itemIndex;
		}

		function getNextSibling(item) {
			let siblingList = getSiblingList(item);
			let position = getIndexInList(siblingList, item);
			if (position !== -1 && position < siblingList.length - 1) {
				return siblingList[position + 1];
			}
			return null;
		}

		function getPreviousSibling(item) {
			let siblingList = getSiblingList(item);
			let position = getIndexInList(siblingList, item);
			if (position !== -1 && position > 0) {
				return siblingList[position - 1];
			}
			return null;
		}

		function selectLastChildOrSelf(item) {
			if (item) {
				if (isNodeOpen(item)) {
					let lastChild = getLastChild(item);
					if (lastChild) {
						$scope.onSelection(lastChild);
					} else {
						$scope.onSelection(item);
					}
				} else {
					$scope.onSelection(item);
				}
			}
		}

		function scrollToElement(parent, elem) {
			let $parent = $(parent);
			let $this_top = $parent.offset().top;
			let $this_bottom = $this_top + $parent.height();
			let $elem = $(elem);
			let $elem_top = $elem.offset().top;
			let $elem_bottom = $elem_top + $elem.height();

			if ($elem_top > $this_top && $elem_bottom < $this_bottom) {
				// in view so don't do anything
				return;
			}
			let new_scroll_top;
			if ($elem_top < $this_top) {
				new_scroll_top = {scrollTop: $parent.scrollTop() - $this_top + $elem_top};
			} else {
				new_scroll_top = {scrollTop: $elem_bottom - $this_bottom + $parent.scrollTop()};
			}
			$parent.scrollTop(new_scroll_top.scrollTop);
			// $parent.animate(new_scroll_top, 100);
		}

		function getLastVisibleParent(item) {
			let parentList = [];
			let parent = getParentNode(item);
			while (parent) {
				parentList.push(parent);
				parent = getParentNode(parent);
			}
			let visibleParent = parentList.pop();
			while (visibleParent && isNodeOpen(visibleParent) && parentList.length > 0) {
				visibleParent = parentList.pop();
			}
			return visibleParent;
		}

		function isNodeVisible(item) {
			let visible = true;
			let parent = getParentNode(item);
			while (parent) {
				if (!isNodeOpen(parent)) {
					visible = false;
					break;
				}
				parent = getParentNode(parent);
			}
			return visible;
		}

		$scope.companyOptions.keyPress = function ($event) {
			$event.preventDefault();
			let currentNode = $scope.treeOptions.selectedNode;
			let parentNode = getParentNode(currentNode);
			switch ($event.key) {
				case 'Up':
				case 'ArrowUp': {
					let previousSibling = getPreviousSibling(currentNode);
					if (!isNodeVisible(currentNode)) {
						let lastVisibleParent = getLastVisibleParent(currentNode);
						$scope.onSelection(lastVisibleParent);
					} else if (previousSibling) {
						selectLastChildOrSelf(previousSibling);
					} else if (parentNode) {
						$scope.onSelection(parentNode);
					}
					break;
				}
				case 'Down':
				case 'ArrowDown': {
					if (!isNodeVisible(currentNode)) {
						let lastVisibleParent = getLastVisibleParent(currentNode);
						$scope.onSelection(lastVisibleParent);
					} else if (isNodeOpen(currentNode)) {
						let firstChild = getFirstChild(currentNode);
						if (firstChild) {
							$scope.onSelection(firstChild);
						}
					} else {
						let nextSibling = getNextSibling(currentNode);
						if (nextSibling) {
							$scope.onSelection(nextSibling);
						} else if (parentNode) {
							let nextSiblingOfParent = getNextSibling(parentNode);
							if (nextSiblingOfParent) {
								$scope.onSelection(nextSiblingOfParent);
							}
						}
					}
					break;
				}
			}

			$timeout(function () {
				let scroller = angular.element('#company-scroller'); // scrollbar dom object
				let selectedElement = angular.element('.tree-selected'); // selected item has tree-selected class set
				scrollToElement(scroller, selectedElement);
			}, 0);
		};

		$scope.modalOptions.cancel = function (/* result */) {

			if ($modalInstance) {
				$modalInstance.dismiss('cancel'); // only closes the dialog, but leaves the backdrop
			}
			if ($scope.onCancel) {
				$scope.onCancel();
			}

			// $modalInstance.dismiss('cancel');
			cloudDesktopCompanyService.cleanupServiceData();

		};

		// register translation changed event
		platformTranslateService.translationChanged.register(loadTranslations);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformTranslateService.translationChanged.unregister(loadTranslations);
		});

	};

	/**
	 @ngdoc controller
	 * @name cloudCompanyRoleDialogController
	 * @function
	 *
	 * @description
	 * Controller for the Document Properties Structure Details view.
	 */
	angular.module('cloud.desktop').controller('cloudCompanyRoleDialogController', cloudCompanyRoleDialogController);

	cloudCompanyRoleDialogController.$inject = ['$log', '$scope', '$state', '$modalInstance',
		'platformTranslateService', '$translate', 'tokenAuthentication', 'initApp', 'platformContextService',
		'_', '$', 'cloudDesktopCompanyService', '$timeout', 'cloudDesktopInfoService', 'platformModalService',
		'$window', 'platformLogonService'];

	function cloudCompanyRoleDialogController($log, $scope, $state, $modalInstance,
		platformTranslateService, $translate, tokenAuthentication, initApp, platformContextService,
		_, $, cloudDesktopCompanyService, $timeout, cloudDesktopInfoService, platformModalService,
		$window, logonService) {

		initCompanyRoleController(_, $, $scope, $translate, $modalInstance,
			$timeout, initApp, platformContextService, platformTranslateService, tokenAuthentication,
			cloudDesktopCompanyService, cloudDesktopInfoService, platformModalService, $window,
			logonService);

	}

	/**
	 @ngdoc controller
	 * @name cloudCompanySelectionController
	 * @function
	 *
	 * @description
	 * Controller for the Document Properties Structure Details view.
	 */
	angular.module('cloud.desktop').controller('cloudCompanyRoleSelectionController', cloudCompanyRoleSelectionController);

	cloudCompanyRoleSelectionController.$inject = ['$log', '$scope', '$state', 'platformTranslateService',
		'$translate', 'tokenAuthentication', 'initApp', 'platformContextService', '_', '$',
		'cloudDesktopCompanyService', '$timeout', 'cloudDesktopInfoService', 'platformModalService',
		'$window', 'platformLogonService'];

	function cloudCompanyRoleSelectionController($log, $scope, $state, platformTranslateService,
		$translate, tokenAuthentication, initApp, platformContextService, _, $,
		cloudDesktopCompanyService, $timeout, cloudDesktopInfoService, platformModalService,
		$window, logonService) {

		logonService.UiDataLanguagesChanged(false);  // indicate there is a cahnge in the language settings

		initCompanyRoleController(_, $, $scope, $translate, null, $timeout, initApp, platformContextService,
			platformTranslateService, tokenAuthentication, cloudDesktopCompanyService, cloudDesktopInfoService, platformModalService, $window, logonService);

		/* */
		$scope.onOk = function () {
			// console.log('ok called');
			let navDone = false;

			// if there is a Ui/Data Language Setting, we have to relaod, otherwise not a places having new language set.
			// rei 28.1.22
			if (logonService.UiDataLanguagesChanged()) {
				let reloadUrl;
				if (initApp) {
					const startupInfo = initApp.getStartupInfo();
					reloadUrl = startupInfo ? startupInfo.url : '';
				}
				// app.reloadDesktop();
				app.reloadDesktop(reloadUrl); // jump to desktop by reloading whole application >> clear all services data implicite
			}
			if (initApp) {
				const startupInfo = initApp.getStartupInfo();
				if (startupInfo) {
					navDone = initApp.navigateWithParameter(startupInfo.navInfo);
				}
			}
			if (!navDone) {
				app.closeCompanyNavigateToDesktop();
			}
		};

		/*
		 */
		$scope.onCancel = function () {
			console.log('cancel called');
			app.closeCompanyNavigateToLogin();
		};

	}
})(angular);
