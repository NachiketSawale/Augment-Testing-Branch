(function (angular) {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopSidebarSearchFormService', cloudDesktopSidebarSearchFormService);

	cloudDesktopSidebarSearchFormService.$inject = ['$http', '$q', 'platformWizardDialogService', 'basicsCommonConfigLocationListService', 'cloudDesktopEnhancedFilterService', 'mainViewService', 'permissions', 'platformPermissionService', '$translate', 'platformCustomTranslateService', 'platformTranslateService'];

	function cloudDesktopSidebarSearchFormService($http, $q, platformWizardDialogService, basicsCommonConfigLocationListService, cloudDesktopEnhancedFilterService, mainViewService, permissions, platformPermissionService, $translate, customTranslateService, platformTranslateService) {
		var sectionName = 'searchForms'; // for the translation controller

		var service = {
			getWizardConfig: getWizardConfig,
			saveSearchformDefinition: saveSearchformDefinition,
			deleteSearchformItem: deleteSearchformItem,
			loadAllSearchFormFilter: loadAllSearchFormFilter,
			createItemsForSelectBox: createItemsForSelectBox,
			openSearchForm: openSearchForm,
			setSelectedItem: setSelectedItem,
			getSelectedItem: getSelectedItem,
			getSectionName: getSectionName,
			deleteTranslationById: deleteTranslationsById,
			accessRightsForSearchForms: accessRightsForSearchForms,
			loadAutoFilter: loadAutoFilter
		};

		function getAccesRightsList() {
			return basicsCommonConfigLocationListService.createItems();
		}

		function accessRightsForSearchForms() {
			return basicsCommonConfigLocationListService.checkAccessRights({
				u: 'd8fa3a03e8314952b41ab659217e6cb2',
				r: 'da63204cc70643c1bebe4c7a9bd3b272',
				g: '35866bede7d3481284fef40332c547a0',
				permission: permissions.execute
			}).then(function (rights) {
				return _.filter(getAccesRightsList(), function (o) {
					return rights[o.id];
				});
			});
		}

		function getSectionName() {
			return sectionName;
		}

		function loadAutoFilter(autoFilterDefinition) {
			if (_.isObject(autoFilterDefinition.filterDef)) {
				autoFilterDefinition.filterDef = JSON.stringify(autoFilterDefinition.filterDef);
			}
			var filter = _.find(service.allSerachFormItems, {id: autoFilterDefinition.id});
			if (filter) {
				/*
				UseCase: Searchform item has translations and is selected in selectbox.
							Without this translation-function is displayed in created language, not in UI Language.
				 */
				platformTranslateService.translateObject(autoFilterDefinition, undefined, {recursive: true});
				_.merge(filter, autoFilterDefinition);
				setSelectedItem(filter);
				service.autoFilterDefDto = {};
			} else {
				service.autoFilterDefDto = autoFilterDefinition;
			}
		}

		service.allSerachFormItems = [];
		service.autoFilterDefDto = {};

		var selectedItem;
		var savedModule = ''; // flag for load datas from http or not

		function createItemsForSelectBox(resultFromHttp) {
			var items = [];

			var accessLevels = [
				{
					id: 'g',
					caption: $translate.instant('basics.common.configLocation.system'),
					cssClass: 'title control-icons ico-search-system'
				},
				{
					id: 'u',
					caption: $translate.instant('basics.common.configLocation.user'),
					cssClass: 'title control-icons ico-search-user'
				},
				{
					id: 'r',
					caption: $translate.instant('basics.common.configLocation.role'),
					cssClass: 'title control-icons ico-search-role'
				}
			];

			angular.forEach(accessLevels, function (level) {
				var itemsFromList = _.filter(resultFromHttp, {accessLevel: level.id});

				// fill header
				if (itemsFromList.length > 0) {
					items.push({
						id: level.id,
						name: level.caption, // for new select
						type: 'title',
						childId: level.id,
						cssClassButton: level.cssClass,
						disabled: true
					});

					// fill items for access level
					angular.forEach(itemsFromList, function (item) {
						items.push(item);
					});
				}
			});

			return items;
		}

		function saveSearchformDefinition(searchFormDefinitionInfo) {
			return $http.post(
				globals.webApiBaseUrl + 'cloud/common/searchform/save',
				searchFormDefinitionInfo
			);
		}

		function deleteSearchformItem(searchFormDefinitionInfo) {
			var moduleName = searchFormDefinitionInfo.moduleName;

			return $http.post(
				globals.webApiBaseUrl + 'cloud/common/searchform/delete',
				searchFormDefinitionInfo
			).then(function (response) {
				return callHTTPForAvailableItems(moduleName).then(function (response) {
					service.allSerachFormItems = response;
				});
			});
		}

		function loadAllSearchFormFilter(modulename) {

			if (savedModule === '') {
				// initialize first time
				savedModule = modulename;
			}

			var currentModule = mainViewService.getCurrentModuleName();

			if ((savedModule === currentModule) && (service.allSerachFormItems.length > 0)) {
				/*
				usecase: searchform item with 2 translations. e.g. en/de. switch to germany and edit searchform item.
				write a new name --> new item, but the items in selectbox are in german and in englich name
				 */
				return $q.when(_.cloneDeep(service.allSerachFormItems));
			}
			return callHTTPForAvailableItems(modulename).then(function (response) {
				savedModule = currentModule;

				service.allSerachFormItems = response;
				setSearchFormItemsInCorrectTranslationValue();
				return service.allSerachFormItems;
			});
		}

		function setSearchFormItemsInCorrectTranslationValue() {
			platformTranslateService.translateObject(service.allSerachFormItems, undefined, {recursive: true});
		}

		function callHTTPForAvailableItems(modulename) {
			return $http({
				url: globals.webApiBaseUrl + 'cloud/common/searchform/list',
				method: 'GET',
				params: {modulename: modulename}
			}).then(function (result) {
				return _.sortBy(result.data, function (item) {
					return item.name.toLowerCase();
				});
			});
		}

		function getWizardConfig() {
			return {
				title$tr$: 'cloud.desktop.searchFormWizard.headerTitle',
				height: globals.isIE11 ? '500px' : 'auto',
				steps: [
					{
						id: 'selectCriterionItem',
						title$tr$: 'cloud.desktop.searchFormWizard.step1.subHeaderTitle',
						topDescription$tr$: 'cloud.desktop.searchFormWizard.step3.topDescription',
						cssClass: 'flex-in-form',
						form: {
							fid: 'selectCriterionItem',
							version: '1.0.0',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'step1'
							}],
							rows: [{
								gid: 'step1',
								rid: 'criterions',
								type: 'directive',
								directive: 'cloud-desktop-search-form-save-information'
							}]
						},
						disallowNext: true  // show button if search name not ''
					},
					{
						id: 'selectCriterionItem',
						title$tr$: 'cloud.desktop.searchFormWizard.step2.subHeaderTitle',
						topDescription$tr$: 'cloud.desktop.searchFormWizard.step1.topDescription',
						form: {
							fid: 'showDisplayOptions',
							version: '1.0.0',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'step2'
							}],
							rows: [{
								gid: 'step2',
								rid: 'criterions',
								type: 'directive',
								directive: 'cloud-desktop-search-form-criterions'
							}]
						}
					},
					{
						id: 'createSearchForm',
						title$tr$: 'cloud.desktop.searchFormWizard.step3.subHeaderTitle',
						topDescription$tr$: 'cloud.desktop.searchFormWizard.step2.topDescription',
						form: {
							fid: 'showInformation',
							version: '1.0.0',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'step3'
							}],
							rows: [{
								gid: 'step3',
								rid: 'criterions',
								type: 'directive',
								directive: 'cloud-desktop-search-form-display-options'
							}]
						},
						canFinish: true
					}

				],
				onStepChanging: function (info) {
					if (info.model.searchFormDefinitionInfo.accessLevel !== 'u' && (info.stepIndex === 0 || info.stepIndex === 2)) {
						// var key = customTranslateService.createTranslationKey(scope.descCtrlOptions);
						customTranslateService.writeCachedData();
					}
				}
			};
		}

		function openSearchForm(currentFilterDefItem, edit) {
			var wzConfig = getWizardConfig();

			platformWizardDialogService.translateWizardConfig(wzConfig);

			var wizardModel = {
				edit: edit,
				filterDef: currentFilterDefItem,
				criterionItems: [],
				step3: {
					locationSelectOption: {
						displayMember: 'name',
						valueMember: 'id'
					}
				}
			};

			function showDialog() {
				platformWizardDialogService.showDialog(wzConfig, wizardModel).then(function (result) {
					var defInfo = result.data.searchFormDefinitionInfo;

					if (result.success) {
						var module = result.data.searchFormDefinitionInfo.moduleName;
						customTranslateService.reloadTranslations(sectionName);
						defInfo.filterDef = result.data.edit ? JSON.stringify(defInfo.filterDef) : cloudDesktopEnhancedFilterService.filterDefAsJSONString(defInfo.filterDef);

						saveSearchformDefinition(defInfo).then(function (result) {
							// after save -> exist a new item -> update service-variable
							callHTTPForAvailableItems(module).then(function (response) {
								service.allSerachFormItems = response;
							});
						});
					}
				});
			}

			var accessRights = getAccesRightsList();

			basicsCommonConfigLocationListService.checkAccessRights({
				u: 'd8fa3a03e8314952b41ab659217e6cb2',
				r: 'da63204cc70643c1bebe4c7a9bd3b272',
				g: '35866bede7d3481284fef40332c547a0',
				permission: permissions.execute
			}).then(function (rights) {
				wizardModel.step3.locationSelectOption.items = _.filter(accessRights, function (o) {
					return rights[o.id];
				});

				showDialog();
			});
		}

		function deleteTranslationsById(searchformId) {
			customTranslateService.deleteTranslationsById(sectionName, searchformId);
		}

		function setSelectedItem(newValue) {
			selectedItem = newValue;
		}

		function getSelectedItem() {
			return selectedItem;
		}

		return service;
	}
})(angular);