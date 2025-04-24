/**
 * Created by lav on 12/9/2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('prcPackageCreateService', DataService);

	DataService.$inject = ['$q', '$http',
		'platformModalService', 'procurementPackageTotalDataService', '$translate'];

	function DataService($q, $http, platformModalService, procurementPackageTotalDataService, $translate) {

		function createItem(options) {
			var defer = $q.defer();
			$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/showassetmasterinprocurement').then(function (response) {
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
						if (result.Code !== $translate.instant('cloud.common.isGenerated')) {
							createData.Code = result.Code;
						}
						$http.post(globals.webApiBaseUrl + 'procurement/package/package/create/createpackage', createData)
							.then(function (response) {
								if (response && response.data) {
									var updateData = {// only save the main entity now
										MainItemId: response.data.Package.Id,
										PrcPackage: response.data.Package// ,
										// ClerkDataToSave: response.data.Package2ClerkDto,
										// TotalToSave: response.data.PrcTotalsDto
									};
									$http.post(globals.webApiBaseUrl + 'procurement/package/package/updatepackage', updateData)
										.then(function (response) {
											defer.resolve(response.data.PrcPackage);
										});
								}
							});
					}
				});
			});

			return defer.promise;
		}

		return {
			createItem: createItem
		};
	}

})(angular);
