(function (angular) {
	'use strict';
	/* global globals */

	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsFormulaScriptDataService', ppsFormulaScriptDataService);

	ppsFormulaScriptDataService.$inject = ['ppsFormulaScriptDataServiceFactory', 'ppsFormulaVersionDataService', 'ppsFormulaInstanceDataService'];

	function ppsFormulaScriptDataService(ppsFormulaScriptDataServiceFactory, ppsFormulaVersionDataService, ppsFormulaInstanceDataService) {

		const service = ppsFormulaScriptDataServiceFactory.getService(ppsFormulaVersionDataService,
			'BasClobsFk',
			'ClobToSave.Content',
			{
				Parameters : function getParametersByVersion($q, $http) {
					const deferred = $q.defer();
					const result = {};
					if (hasLinkedVersion()) {
						const versionId = getLinkedVersion().Id;
						$http.get(globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/parameter/listbyformulaversion?versionId=' + versionId)
							.then((response) => {
								if (response) {
									for (const data of response.data) {
										result[data.VariableName] = data.Value;
									}
								}
								deferred.resolve(result);
							});
					} else {
						deferred.resolve(result);
					}
					return deferred.promise;
				},
			},
			function readonlyFn() {
				return !hasLinkedVersion() || getLinkedVersion().Status !== 0;
			}
		);

		service.markScriptAsModified = (newScript) =>  {
			const selectedItem = ppsFormulaVersionDataService.getSelected();
			if (selectedItem && selectedItem.ClobToSave.Content !== newScript) {
				selectedItem.ClobToSave.Content = newScript;
				ppsFormulaVersionDataService.markItemAsModified(selectedItem);
				ppsFormulaVersionDataService.gridRefresh();
			}
		};

		service.hasLinkedVersion = hasLinkedVersion;
		service.getLinkedVersion = getLinkedVersion;

		function hasLinkedVersion() {
			return getLinkedVersion() !== null;
		}

		function getLinkedVersion() {
			return getSelectedVersion() || getReleasedVersionOfSelectedInstance();
		}

		function getSelectedVersion() {
			const selectedVersion = ppsFormulaVersionDataService.getSelectedEntities();
			return selectedVersion && selectedVersion.length > 0 ? selectedVersion[0] : null;
		}

		function getReleasedVersionOfSelectedInstance() {
			const selectedInstances = ppsFormulaInstanceDataService.getSelectedEntities();
			if (selectedInstances.length > 0) {
				const versions = ppsFormulaVersionDataService.getList();
				const releasedVersion = versions.filter(i => i.Status === 1)[0];
				return releasedVersion || null;
			}
			return null;
		}

		return service;
	}
})(angular);