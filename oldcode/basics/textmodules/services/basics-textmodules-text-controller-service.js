/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.textmodules';

	angular.module(moduleName).factory('basicsTextModulesTextControllerService', controllerService);
	controllerService.$inject = ['$q', '_', '$timeout', 'globals', 'platformContextService', 'basicsTextModulesMainService',
		'basicsCommonTextFormatConstant',
		'basicsCommonVariableService',
		'cloudCommonLanguageService'];

	function controllerService($q, _, $timeout, globals, platformContextService, parentService,
		basicsCommonTextFormatConstant,
		basicsCommonVariableService,
		cloudCommonLanguageService){

		// it means they have the same parent service.
		// let parentServiceInited = false;
		let loginLanguageId = platformContextService.getDataLanguageId();

		return {
			initController: initController
		};

		function initController($scope, dataService, uuid){
			uuid = uuid || $scope.getContentValue('uuid');
			$scope.contentField = $scope.contentField || 'TextBlob';
			$scope.isVariableVisible = $scope.isVariableVisible || false;
			dataService.selectedLanguageId = dataService.selectedLanguageId || {};
			let isLanguageDependent = (parentService.getSelected() && parentService.getSelected().IsLanguageDependent) || false;
			let textContentEditable = parentService.getSelected() ? parentService.getSelected().TextFormatFk === $scope.textFormatType : false;
			$scope.containerLoading = false;
			$scope.loadingInfo = 'loading';
			$scope.textareaEditable = textContentEditable;
			$scope.oldContent = null;

			$scope.editoroptions = {
				language: {
					current: null,
					editable: isLanguageDependent,
					visible: true,
					onChanged: onLanguageChanged,
					list: []
				},
				variable: {
					current: null,
					visible: $scope.isVariableVisible,
					list: []
				}
			};

			let variableHandler = basicsCommonVariableService.getHandler({
				getLanguage: getCurrentLanguage,
				beforeGetting: beforeGettingVariableList,
				afterGetting: afterGettingVariableList
			});

			function updateLanguageBtnValue(languageId) {
				if ($scope.textFormatType !== basicsCommonTextFormatConstant.specification) {
					return;
				}
				let language = _.find($scope.editoroptions.language.list, {Id: languageId});
				if (language) {
					let langSelector = document.querySelector('.ql-language .ql-picker-label');
					if (langSelector) {
						langSelector.setAttribute('data-value', language.DescriptionInfo.Translated);
					}
				}
			}

			// after language change
			function onLanguageChanged(languageId){
				if(languageId){
					getDataByLanguageId(languageId);
					$scope.editoroptions.language.current = _.find($scope.editoroptions.language.list, {Id: languageId});
					if($scope.isVariableVisible){
						variableHandler.getByLanguageId(languageId).then(function(list){
							$scope.editoroptions.variable.list = list;
							$scope.$broadcast('variableListUpdated');
						});
					}
				}
				else{
					actionWithoutLanguage();
				}
			}
			// todo
			$scope.onChange = function() {
				if (checkContentChanged()) {
					dataService.markItemAsModified($scope.translation);
					$scope.oldContent = angular.copy($scope.translation[$scope.contentField]);
					dataService.updateParentItem(getCurrentLanguage());
				}
			};

			// item list changed.
			if(dataService.itemListChanged){
				// register service messenger
				dataService.itemListChanged.register(itemListChange);
			}
			// parentEntity changed.
			if(parentService.registerSelectionChanged){
				parentService.registerSelectionChanged(parentSelectionChanged);
			}
			// IsLanguageDependent of parentEntity changed.
			if(parentService.isLanguageDependentChanged){
				parentService.isLanguageDependentChanged.register(languageDependentChanged);
			}
			// register.
			if(parentService.textFormatChanged){
				parentService.textFormatChanged.register(textFormatChanged);
			}
			// auto to load data list.
			if(dataService.addUsingContainer){
				dataService.addUsingContainer(uuid);
			}else if(dataService.load){
				dataService.load();
			}

			function enableDisableLanguageSelect(isEnabled) {
				let langSelector = document.querySelector('.ql-language .ql-picker-label');
				if (langSelector) {
					isEnabled ? $(langSelector).css({'pointer-events':'auto', 'color':'#333'}) : $(langSelector).css({'pointer-events':'none', 'color':'#ccc'});
				}
			}

			function getLanguageList() {
				return cloudCommonLanguageService.getLanguageItems().then(function (list) {
					let currentLanguageId = getCurrentLanguage();
					getDataByLanguageId(currentLanguageId);
					$scope.editoroptions.language.list = list;
					$scope.editoroptions.language.current = _.find(list, {Id: currentLanguageId}) || null;
					updateLanguageBtnValue(currentLanguageId);
					let selectedItem = parentService.getSelected();
					$timeout(function() {
						if(selectedItem) {
							enableDisableLanguageSelect(selectedItem.IsLanguageDependent);
						}
					}, 500);
					$scope.$broadcast('languageListUpdated');
					$scope.$broadcast('languageEditableChanged');
					return list;
				}, function () {
					return []; // TODO chi: right?
				});
			}

			function getVariableList() {
				let currentLanguageId = getCurrentLanguage();
				return variableHandler.getByLanguageId(currentLanguageId)
					.then(function (list) {
						$scope.editoroptions.variable.list = list;
						$scope.$broadcast('variableListUpdated');
						return list;
					});
			}

			// itemList changed, then get new data.
			function itemListChange(){
				if($scope.editoroptions.language.current){
					getDataByLanguageId($scope.editoroptions.language.current.Id);
				}
				else{
					actionWithoutLanguage();
				}
			}

			// parentEntity change.
			function parentSelectionChanged(event, parentItem){
				if(parentItem){
					$scope.entity = parentItem;
					$scope.textareaEditable = parentItem.TextFormatFk === $scope.textFormatType;
					languageDependentChanged(parentItem.IsLanguageDependent);
				}else{
					$scope.textareaEditable = false;
					languageDependentChanged(false);
				}
			}
			// IsLanguageDependent of parentEntity change.
			function languageDependentChanged(value){
				enableDisableLanguageSelect(value);
				$scope.editoroptions.language.editable = value;
				if(!value){
					$scope.editoroptions.language.current = _.find($scope.editoroptions.language.list, {Id: loginLanguageId}) || null;
					updateLanguageBtnValue(loginLanguageId);
					if($scope.editoroptions.language.current){
						onLanguageChanged($scope.editoroptions.language.current.Id);
					}
					else{
						$scope.translation = {};
					}
				}
				$scope.$broadcast('languageEditableChanged');
			}
			function textFormatChanged(value){
				$scope.textareaEditable = value === $scope.textFormatType;
				let currentLanguageId = getCurrentLanguage();
				getDataByLanguageId(currentLanguageId);
			}

			// get data by language id.
			function getDataByLanguageId(languageId){
				if (!languageId || !$scope.textareaEditable) {
					if ($scope.textFormatType === basicsCommonTextFormatConstant.specification) {
						$scope.translation = {
							TextBlob: {Content: ''}
						};
					}
					if ($scope.textFormatType === basicsCommonTextFormatConstant.html) {
						$scope.translation = {};
					}
					$scope.oldContent = null;
					return;
				}
				$scope.containerLoading = true;
				dataService.getDataByLanguageId(languageId, $scope.contentField).then( function(entity){
					$scope.translation = entity;
					$scope.oldContent = entity[$scope.contentField]? angular.copy(entity[$scope.contentField]) : null;
					$scope.containerLoading = false;
				});
			}

			// when $scope.language is null.
			function actionWithoutLanguage(){
				$scope.translation = {};
				$scope.oldContent = null;
			}
			// check whether content changed.
			function checkContentChanged(){
				if(!$scope.oldContent){
					return false;
				}
				if(!$scope.translation){
					return false;
				}
				if(!$scope.oldContent.Content && !$scope.translation[$scope.contentField].Content){
					return false;
				}
				if($scope.oldContent.Content !== $scope.translation[$scope.contentField].Content){
					return true;
				}
				return false;
			}
			$scope.$on('$destroy', function () {
				if (dataService.removeUsingContainer) {
					dataService.removeUsingContainer(uuid);
				}
				// dataService has some what event. message sender.
				if(dataService.itemListChanged){
					dataService.itemListChanged.unregister(itemListChange);
				}
				if(parentService.registerSelectionChanged){
					parentService.unregisterSelectionChanged(parentSelectionChanged);
				}
				if(parentService.isLanguageDependentChanged){
					parentService.isLanguageDependentChanged.unregister(languageDependentChanged);
				}
				if(parentService.textFormatChanged){
					parentService.textFormatChanged.unregister(textFormatChanged);
				}
				dataService.selectedLanguageId[$scope.contentField] = ($scope.editoroptions.language.current && $scope.editoroptions.language.current.Id) || null;
			});

			$q.all(getLanguageList(), getVariableList())
				.then(function () {
					if ($scope.textFormatType === basicsCommonTextFormatConstant.html) {
						$scope.$broadcast('initHTMLEditorToolbar');
						$scope.$broadcast('languageListUpdated');
					}
				}, function (){
					if ($scope.textFormatType === basicsCommonTextFormatConstant.html) {
						$scope.$broadcast('initHTMLEditorToolbar');
					}
				});

			function getCurrentLanguage() {
				return !$scope.editoroptions.language.editable? loginLanguageId : (($scope.editoroptions.language.current && $scope.editoroptions.language.current.Id) || dataService.selectedLanguageId[$scope.contentField] || loginLanguageId || null);
			}

			function beforeGettingVariableList() {
				$scope.containerLoading = true;
			}

			function afterGettingVariableList() {
				$scope.containerLoading = false;
			}
		}
	}

})(angular);