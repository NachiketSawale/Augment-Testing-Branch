(function (angular) {
	'use strict';
	/* global globals,_,$ */

	const moduleName = 'basics.material';
	angular.module(moduleName).factory('materialLookupDialogSearchOptionService', [
		'$q',
		'$http',
		'$injector',
		function(
			$q,
			$http,
			$injector) {
			const filterName = 'dialogSearchOptions';
			const service = {};
			let filterDefs = [];
			let initMaterialDefinitionsPromise = null;

			service.initMaterialDefinitions = function initMaterialDefinitions() {
				const deferred = $q.defer();
				getMaterialDefinitions().then(function (result) {
					filterDefs = result.FilterDef ? JSON.parse(result.FilterDef) : [];
					deferred.resolve(materialSearchOptionData(filterDefs));
				});
				initMaterialDefinitionsPromise = deferred.promise;
				return initMaterialDefinitionsPromise;
			}

			service.hasMaterialDefinitions = function hasMaterialDefinitions() {
				return (
					initMaterialDefinitionsPromise ?
					initMaterialDefinitionsPromise :
					service.initMaterialDefinitions()
				).then(function() {
					return true;
				});
			}

			function getMaterialDefinitions() {
				return $http.get(globals.webApiBaseUrl + 'basics/material/getmaterialdefinitions?filterName=' + filterName)
					.then(function (result) {
						return result.data ?? {};
					});
			}

			service.getMaterialSearchOption = function getMaterialSearchOption(filter) {
				const option = materialSearchOptionData(filterDefs);
				return option ? option[filter] : null;
			};

			service.postMaterialSearchOption = function postMaterialSearchOption(customizeSearchOptions) {
				const loginCompany = getLoginCompany();
				let optionInLoginCompany = _.find(filterDefs, {loginCompany: loginCompany});
				if (optionInLoginCompany) {
					optionInLoginCompany.config = {...optionInLoginCompany.config, ...customizeSearchOptions};
				} else {
					optionInLoginCompany = {
						loginCompany: loginCompany,
						config: customizeSearchOptions
					};
					filterDefs.push(optionInLoginCompany);
				}

				saveMaterialDefinitions(filterDefs);
			};

			function saveMaterialDefinitions(materialSearchOptions) {
				$http.post(globals.webApiBaseUrl + 'basics/material/savematerialdefinition', {
					FilterName: filterName,
					AccessLevel: 'User',
					FilterDef: JSON.stringify(materialSearchOptions)
				});
			}

			function materialSearchOptionData(options) {
				const loginCompany = getLoginCompany();
				const optionInLoginCompany = _.find(options, function (item) {
						return item.loginCompany === loginCompany;
					}) ?? null;

				if (optionInLoginCompany?.config) {
					return {
						sortOption: optionInLoginCompany.config.sortOption,
						itemsPerPage: optionInLoginCompany.config.itemsPerPage,
						showImageInPreview: optionInLoginCompany.config.showImageInPreview,
						previewAttributes: optionInLoginCompany.config.previewAttributes,
						isFilterByHeaderStructure: optionInLoginCompany.config.isFilterByHeaderStructure
					};
				}

				return {};
			}

			function getLoginCompany() {
				return $injector.get('platformContextService').clientId;
			}

			return service;
		}]);
})(angular);