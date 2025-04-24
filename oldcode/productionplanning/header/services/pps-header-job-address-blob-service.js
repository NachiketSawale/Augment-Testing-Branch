(function () {
	'use strict';
	const module = 'productionplanning.header';

	angular.module(module).factory('ppsHeaderJobAddressBlobService', ppsHeaderJobAddressBlobService);

	ppsHeaderJobAddressBlobService.$inject = ['globals', '$q', 'platformFileUtilServiceFactory', 'productionplanningHeaderDataService'];

	function ppsHeaderJobAddressBlobService(globals, $q, platformFileUtilServiceFactory, ppsHeaderDataService) {
		const routePrefix = globals.webApiBaseUrl + 'productionplanning/header/job/addressblob';
		const config = {
			fileFkName: 'LgmJobFk',
			dtoName: 'EntityDto',
			getUrl: routePrefix + '/get',
			importUrl: routePrefix + '/create',
			deleteUrl: routePrefix + '/delete',
		};

		const service = platformFileUtilServiceFactory.getFileService(config, ppsHeaderDataService);

		const originalImportFile = service.importFile;
		const originalDeleteFile = service.deleteFile;

		service.importFile = file => doSelectAfterDone(originalImportFile, file);
		service.deleteFile = fileEntity => doSelectAfterDone(originalDeleteFile, fileEntity);

		function doSelectAfterDone(originalFn, parameter) {
			const selectedItem = ppsHeaderDataService.getSelected();
			const defer = $q.defer();
			originalFn(parameter).then(data => {
				ppsHeaderDataService.deselect().then(() =>
					ppsHeaderDataService.setSelected(selectedItem));
				defer.resolve(data);
			});
			return defer.promise;
		}

		return service;
	}
})(angular);
