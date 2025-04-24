/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global _ */
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesController
	 * @function
	 *
	 * @description
	 * Main controller for the estimate.assemblies module
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateAssembliesController', ['$scope', '$translate', 'cloudDesktopInfoService', 'platformMainControllerService', 'estimateAssembliesService', 'estimateAssembliesTranslationService','estimateMainWizardContext', 'initApp',
		'estimateProjectRateBookConfigDataService', 'estimateAssembliesFilterService',
		function ($scope, $translate, cloudDesktopInfoService, platformMainControllerService, estimateAssembliesService, translationService, estimateMainWizardContext, initAppService,
			estimateProjectRateBookConfigDataService, estimateAssembliesFilterService) {

			// Header info
			cloudDesktopInfoService.updateModuleInfo($translate.instant('cloud.desktop.moduleDisplayNameEstimateAssemblies'));

			let opt = {search: true};
			let mc = {};
			let sidebarReports = platformMainControllerService.registerCompletely($scope, estimateAssembliesService, mc, translationService, moduleName, opt);
			let exportOptions = {
				ModuleName: moduleName,
				permission: '4c869d7b2ee44830991ffd57cf3db23c#e',
				MainContainer: {
					Id: '1',
					Label: 'Assemblies'
				},
				SubContainers: [
				]
			};

			platformMainControllerService.registerExport(exportOptions);  // add export feature to the main-controller

			estimateMainWizardContext.setConfig(moduleName);

			let appStartupInfo = initAppService.getStartupInfo();
			if (appStartupInfo && appStartupInfo.navInfo) {
				let extparams = decodeURIComponent(appStartupInfo.navInfo.extparams);

				extparams = _.trim(extparams);
				if (extparams.length < 2 || extparams.indexOf('=') === -1) {
					return;
				}

				if (extparams.indexOf('(') === 0) {
					extparams = extparams.substring(1);
				}

				if (extparams.lastIndexOf(')') === extparams.length - 1) {
					extparams = extparams.substring(0, extparams.length - 1);
				}

				if (extparams.length < 2) {
					return;
				}
				let paramsObject = {};
				let ps = extparams.split('&');
				angular.forEach(ps, function (p) {
					let kv = p.split('=');
					paramsObject[kv[0].toLocaleLowerCase()] = kv.length > 1 ? kv[1] : null;
				});

				// eslint-disable-next-line no-prototype-builtins
				if (!paramsObject.hasOwnProperty('filtercategoryids')) {
					return;
				}
				// eslint-disable-next-line no-prototype-builtins
				if (!paramsObject.hasOwnProperty('projectid')) {
					return;
				}

				if (!paramsObject.filtercategoryids || paramsObject.filtercategoryids.length < 1) {
					return;
				}
				let idstrArr = paramsObject.filtercategoryids.split(',');
				if (!idstrArr || idstrArr.length < 1) {
					return;
				}

				// using in assembly master data filter
				let filterIds = [];

				angular.forEach(idstrArr, function (id) {
					if (/^\d+$/.test(id)) {
						filterIds.push({
							FilterType: 1,
							FilterId: parseInt(id)
						}
						);
					}
				});
				// set into
				estimateProjectRateBookConfigDataService.setRateBookData(filterIds);
				estimateProjectRateBookConfigDataService.setProjectId(paramsObject.projectid);

				// master data filter
				// let filterIdsForAssembly = estimateProjectRateBookConfigDataService.getFilterIds(1);
				if(filterIds && filterIds.length > 0) {
					let filterKey = 'ASSEMBLYMSDCAT';
					estimateAssembliesFilterService.setFilterIds(filterKey, [paramsObject.projectid]);
				}
				// master data filter end
			}

			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformMainControllerService.unregisterCompletely(estimateAssembliesService, sidebarReports, translationService, opt);
			});
		}]);

})();
