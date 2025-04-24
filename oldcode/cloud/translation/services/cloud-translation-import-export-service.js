/**
 * Created by Tanveer Al Jami on 12.12.2019.
 */
(function (angular) {
	'use strict';

	angular.module('cloud.translation').service('cloudTranslationImportExportService', cloudTranslationImportExportService);

	cloudTranslationImportExportService.$inject = ['$http', 'globals', '$q'];

	function cloudTranslationImportExportService($http, globals, $q) {
		let self = this;
		self.resourceCategories = [];

		this.loadResourceCategories = function (){
			// return $q.when(true);
			if(self.resourceCategories.length === 0){
				return $http.get(globals.webApiBaseUrl + 'cloud/Translation/resource/categories').then(function (result){
					self.resourceCategories = result.data;
					return true;
				}, function (){
					return false;
				});
			}else{
				return $q.when(true);
			}
		};



		this.export = function (selectedLanguages, untranslated, changed) {
			const requestData = {
				columns: selectedLanguages,
				untranslated: untranslated || false,
				changed: changed || false
			};
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/import/executeExport', requestData);
		};

		this.exportWithFilter = function (selectedLanguages, filter) {
			const requestData = {
				columns: selectedLanguages,
				untranslated: filter.untranslated || false,
				changed: filter.changed || false,
				resourceRemark: (filter.resourceRemark === undefined) ? true : filter.resourceRemark,
				path: filter.path || false,
				parameterInfo : filter.parameterInfo || false,
				translationRemark : filter.translationRemark || false,
				addCategory : filter.addCategory || false,
				categories: filter.categories
			};
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/import/executeExport', requestData);
		};

		this.getLanguages = function () {
			return $http.get(globals.webApiBaseUrl + 'cloud/Translation/import/languages');
		};

		this.getExportColumnMap = function (){
			return $http.post(globals.webApiBaseUrl + 'cloud/translation/language/listLanguage').then((result)=>{
				let map = {};
				result.data.forEach((language) => {
					map[language.Culture] = language.ExportColumnName;
				});

				return map;
			});
		};

		this.getResourceCategories = function (){
			return $http.get(globals.webApiBaseUrl + 'cloud/Translation/resource/categories');
		};

		this.clearTempTable = function (uuidImport) {
			const requestData = {
				uuid: uuidImport
			};
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/import/clear', requestData);
		};

		this.executeImport = function (selectedCultures, userId, resetChanged, uuidImport) {
			const requestData = {
				cultures: selectedCultures,
				userId: userId,
				resetChanged: resetChanged || false,
				uuid: uuidImport
			};
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/import/executeImport', requestData);
		};

		this.executeImportDirect = function (selectedCultures, userId, resetChanged, uuidImport) {
			const requestData = {
				cultures: selectedCultures,
				userId: userId,
				resetChanged: resetChanged || false,
				uuid: uuidImport
			};
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/import/executeImportDirect', requestData);
		};

		this.statusAndValidationCheck = function (selectedCultures, userId, resetChanged, uuidImport) {
			const requestData = {
				cultures: selectedCultures,
				userId: userId,
				resetChanged: resetChanged || false,
				uuid: uuidImport
			};
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/import/preview', requestData);
		};

		this.uploadFile = function (file) {
			let formData = new FormData();
			formData.append('file', file);
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/import/uploadFile', formData, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		};

		this.exportModulesToJson = function (moduleInternalName){
			let params = {
				uri: moduleInternalName,
				uuid: 'c566b39fbd46434fa4235a2f39620005'
			};

			let config = {
				params: params,
				headers: {'Accept' : 'application/json'}
			};

			return $http.get(globals.webApiBaseUrl + 'cloud/Translation/resource/exportmodule/json', config);
		};

		return this;
	}

})(angular);
