/**
 * Created by lcn on 10/8/2021.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonCreatePackageService', DataService);
	DataService.$inject = ['$q', '$http', 'platformModalService', 'basicsLookupdataLookupDescriptorService', '$translate'];

	function DataService($q, $http, platformModalService, basicsLookupdataLookupDescriptorService, $translate) {
		function createItem(options) {
			var defer = $q.defer();
			$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/showassetmasterinprocurement').then(function (response) {
				if (options.defaults.ProjectFk && options.defaults.StructureFk && options.IsAutoSave) {
					var result = options.defaults;
					var createData = {};

					var structure = _.find(basicsLookupdataLookupDescriptorService.getData('prcstructure'), {Id: result.StructureFk});
					createData.PrjProjectFk = result.ProjectFk;
					createData.StructureFk = result.StructureFk;
					createData.IsAutoSave = true;

					if (angular.isDefined(result.BasCurrencyFk)) {
						createData.BasCurrencyFk = result.BasCurrencyFk;
					}

					if (angular.isDefined(structure)) {
						createData.Description = structure.DescriptionInfo.Translated;
					}
					var project = _.find(basicsLookupdataLookupDescriptorService.getData('project'), {Id: createData.PrjProjectFk});
					if (project) {
						createData.AssetMasterFk = project.AssetMasterFk;
					}
					if (result.Code !== $translate.instant('cloud.common.isGenerated')) {
						createData.Code = result.Code;
					}

					let config = basicsLookupdataLookupDescriptorService.getData('PrcConfiguration');
					if (config) {
						let configuration = _.find(config, {Id: result.ConfigurationFk});
						if (configuration && configuration.PrcConfigHeaderFk) {
							createData.PrcConfigHeaderFk = configuration.PrcConfigHeaderFk;
							let packageConfig = _.sortBy(_.filter(config, function (item) {
								return item.PrcConfigHeaderFk === configuration.PrcConfigHeaderFk && item.RubricFk === 31;
							}), ['Sorting']);

							if (_.isArray(packageConfig) && packageConfig.length >= 1) {
								let item = _.find(packageConfig, {IsDefault: true});
								if (item) {
									createData.ConfigurationFk = item.Id;
								} else {
									createData.ConfigurationFk = packageConfig[0].Id;
								}
							}
						}
					}

					if (createData.ConfigurationFk) {
						createPackage(createData,defer);
					} else {
						var urlStr = 'basics/procurementconfiguration/configuration/getByStructure?structureId=' + createData.StructureFk + '&rubricId=31';
						$http.get(globals.webApiBaseUrl + urlStr).then(function (response) {
							createData.ConfigurationFk = response.data;
							createPackage(createData,defer);
						});
					}
				} else {
					platformModalService.showDialog({
						defaults: options.defaults,
						templateUrl: globals.appBaseUrl + 'procurement.package/partials/create-prc-package-project.html',
						backdrop: false,
						packageCreationShowAssetMaster: response.data
					}).then(function (result) {
						if (result) {
							var createData = {};
							createData.PrjProjectFk = result.ProjectFk;
							createData.ConfigurationFk = result.ConfigurationFk;
							createData.Description = result.Description;
							createData.StructureFk = result.StructureFk === -1 ? null : result.StructureFk;
							createData.ClerkPrcFk = result.ClerkPrcFk;
							createData.ClerkReqFk = result.ClerkReqFk;
							createData.AssetMasterFk = result.AssetMasterFk;
							createData.IsAutoSave = options.IsAutoSave || false;
							createData.BasCurrencyFk = result.BasCurrencyFk;
							if (result.Code !== $translate.instant('cloud.common.isGenerated')) {
								createData.Code = result.Code;
							}
							createPackage(createData,defer);
						}
					});
				}
			});
			return defer.promise;
		}

		function createPackage(createData, defer) {
			return $http.post(globals.webApiBaseUrl + 'procurement/package/package/create/createpackage', createData)
				.then(function (response) {
					let package2Header = _.has(response.data, 'Package2HeaderComplete.Package2Header') ? response.data.Package2HeaderComplete.Package2Header : undefined;
					let result = {
						package: {Id: response.data.Id, ProjectFk: response.data.ProjectFk},
						package2Header: package2Header === undefined ? undefined : {Id: package2Header.Id}
					};
					defer.resolve(result);
				});
		}

		return {
			createItem: createItem
		};
	}
})(angular);