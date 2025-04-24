(function () {

	/*global angular*/
	'use strict';
	let moduleName = 'productionplanning.ppsmaterial';
	let module = angular.module(moduleName);

	module.controller('productionplanningPpsmaterialSummarizedListController', SummarizedListController);

	SummarizedListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningPpsMaterialSummarizedUIStandardService',
		'basicsLookupdataLookupFilterService',
		'basicsLookupdataLookupDescriptorService',
	'productionplanningPpsMateriaSummarizedDataService'];

	function SummarizedListController($scope, platformContainerControllerService,
		platformTranslateService, uiStandardService,
		basicsLookupdataLookupFilterService,
		basicsLookupdataLookupDescriptorService,
		dataService) {

		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		let guid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, $scope.getContentValue('moduleName') || moduleName, guid);


		const getData = () => {
			dataService.setPpsMaterialUsedId(basicsLookupdataLookupDescriptorService.getData('PpsMaterialUsedId')[1].Data);
		};
		dataService.parentService().registerListLoaded(getData);

		let filters = [{
			key: 'pps-material-usedId-filter',
			fn: (ppsmaterial) => {
				let useIds = dataService.getPpsMaterialUsedId();
				return _.indexOf(useIds, ppsmaterial.Id) === -1;
			}
		}];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		$scope.$on('$destroy', function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
			dataService.parentService().unregisterListLoaded(getData);
		});
	}
})();