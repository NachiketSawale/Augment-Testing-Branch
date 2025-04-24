(function () {
	'use strict';
	let moduleName = 'productionplanning.header';

	angular.module(moduleName).controller('ppsHeaderJobAddressRemarkController', ppsHeaderJobAddressRemarkController);

	ppsHeaderJobAddressRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'productionplanningHeaderDataService'];

	function ppsHeaderJobAddressRemarkController($scope, platformSingleRemarkControllerService, headerDataService) {
		let layout = {
			version: '1.0.0',
			fid: 'pps.header.job.deliveryAddressRemark',
			addValidationAutomatically: false,
			remark: 'deliveryAddressRemark',
			model: 'DeliveryAddressRemark'
		};
		platformSingleRemarkControllerService.initController($scope, headerDataService, {}, layout);
	}
})();