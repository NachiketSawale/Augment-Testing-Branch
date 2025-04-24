/**
 * Created by aljami on 12.03.2020
 */
(function (angular) {

	'use strict';
	const moduleName = 'cloud.translation';

	/**
	 * @ngdoc controller
	 * @name cloudTranslationTodoTranslationController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of todo translation entities
	 **/
	angular.module(moduleName).controller('cloudTranslationTodoTranslationController', cloudTranslationTodoTranslationController);

	cloudTranslationTodoTranslationController.$inject = ['$scope', '_', '$http', '$timeout', '$translate', 'platformContainerControllerService', 'cloudTranslationTodoTranslationDataService', 'cloudTranslationLanguageDataService', 'platformDialogService', 'cloudDesktopInfoService', 'mainViewService'];

	function cloudTranslationTodoTranslationController($scope, _, $http, $timeout, $translate, platformContainerControllerService, cloudTranslationTodoTranslationDataService, cloudTranslationLanguageDataService, platformDialogService, cloudDesktopInfoService, mainViewService) {
		$scope.languages = [];
		$scope.loadingInBackground = true;
		$scope.selectedLanguage = '';

		let flagIcons = [];

		function constructFlagIcons(languageList){
			languageList = _.orderBy(languageList, 'Description');
			flagIcons = [];
			_.forEach(languageList, function (language){
				const iconObj = {
					iconClass: 'control-icons ico-' + language.Culture.trim().toLowerCase(),
					language: language.Description
				};
				flagIcons.push(iconObj);
			});
		}

		function loadLanguages() {
			return cloudTranslationLanguageDataService.getLiveLanguages();
		}

		const onClickRefresh = function () {
			loadTranslationsOfSelectedCulture();
		};

		function constructMenuButtons(itemList, filterIcon) {

			const divider0 = {
				id: 'tdDv0',
				type: 'divider',
				sort: -5
			};
			const refreshButton = {
				id: 'refreshToDo',
				type: 'item',
				caption: 'cloud.common.toolbarRefresh',
				iconClass: 'tlb-icons ico-refresh',
				sort: -4,
				fn: onClickRefresh,
				disabled: function () {
					return $scope.loadingInBackground;
				}
			};

			const languagesDropDown = {
				id: 'languagesToDo',
				type: 'dropdown-btn',
				caption: 'cloud.translation.languageListTitle',
				iconClass: filterIcon,
				showImages: true,
				showTitles: true,
				sort: -3,
				disabled: function () {
					return $scope.loadingInBackground;
				},
				list: {
					showTitles: true,
					cssClass: 'dropdown-menu-right',
					items: itemList
				}

			};

			$scope.addTools([divider0, refreshButton, languagesDropDown]);
			$timeout($scope.tools.update, 0, true);
		}


		const onSelectLanguage = function (id, item) {
			$scope.selectedLanguage = item.Culture;
			saveSelectedLanguage();
			updateTooltip(item.Description);
			loadTranslationsOfSelectedCulture();
		};

		function loadTranslationsOfSelectedCulture() {
			$scope.loadingInBackground = true;
			cloudTranslationTodoTranslationDataService.loadTodoTranslations($scope.selectedLanguage).then(function (response) {
				cloudTranslationTodoTranslationDataService.setList(response);
				cloudTranslationTodoTranslationDataService.gridRefresh();
				cloudTranslationTodoTranslationDataService.clearModifications(response);
				$scope.loadingInBackground = false;
			});
		}

		function convertToDropdownItemList(languageList) {
			let itemsList = languageList.filter(function (item) {
				return item.Description !== null;
			});
			itemsList = _.orderBy(itemsList, 'Description');
			itemsList.map(function (item) {
				const icon = _.find(flagIcons, {language: item.Description});
				if(icon) {
					angular.extend(item, {
						type: 'item',
						disabled: false,
						caption: item.Description,
						iconClass: icon.iconClass,
						fn: onSelectLanguage
					});
				}

			});

			return itemsList;
		}

		function getStorageKey() {
			const headerInfo = cloudDesktopInfoService.read();
			return $scope.gridId + 'usr' + headerInfo.userInfo.UserId;
		}

		function getPreviouslySelectedLanguage() {
			const key = getStorageKey();
			return mainViewService.customData($scope.gridId, key);
		}

		function saveSelectedLanguage() {
			const key = getStorageKey();
			mainViewService.customData($scope.gridId, key, $scope.selectedLanguage);
		}

		function setSelectedLanguageAtStart(languageList) {
			if (languageList.length === 0) {
				return;
			}
			const previouslySelectedLanguage = getPreviouslySelectedLanguage();
			if (previouslySelectedLanguage !== undefined && _.find(languageList, {'Culture': previouslySelectedLanguage}) !== undefined) {
				$scope.selectedLanguage = previouslySelectedLanguage;
			} else {
				const defaultLanguages = languageList.filter(function (item) {
					return item.IsDefault;
				});
				$scope.selectedLanguage = (defaultLanguages.length > 0) ? defaultLanguages[0].Culture : languageList[0].Culture;
			}
			saveSelectedLanguage();
			updateTooltip(_.find(languageList, {'Culture': $scope.selectedLanguage}).Description);
		}

		function updateTooltip(dropdownTooltip) {
			const menuItem = _.find($scope.tools.items, {'id': 'languagesToDo'});
			if (menuItem) {
				menuItem.caption = dropdownTooltip;
				menuItem.iconClass = _.find(flagIcons, {language: dropdownTooltip}).iconClass;
				$timeout($scope.tools.update, 0, true);
			}

		}

		function getFilterIcon(languageList) {
			if (languageList.length === 0) {
				return 'tlb-icons ico-filter';
			}

			const lang = _.find(languageList, {'Culture': $scope.selectedLanguage});
			if (lang) {
				return _.find(flagIcons, {language: lang.Description}).iconClass;
			} else {
				return 'tlb-icons ico-filter';
			}
		}

		platformContainerControllerService.initController($scope, moduleName, 'f3a44c895396452a925e4b464a1a7864');

		loadLanguages().then(function (languageList) {
			constructFlagIcons(languageList);
			setSelectedLanguageAtStart(languageList);
			const itemList = convertToDropdownItemList(languageList);
			constructMenuButtons(itemList, getFilterIcon(languageList));
			$scope.loadingInBackground = false;
			if (languageList.length > 0) {
				updateTooltip(_.find(languageList, {'Culture': $scope.selectedLanguage}).Description);
				if (cloudTranslationTodoTranslationDataService.getList().length === 0) {
					loadTranslationsOfSelectedCulture();
				}
			}
		});
	}
})(angular);
