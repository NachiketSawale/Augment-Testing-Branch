/**
 * Created by anl on 5/4/2017.
 */
(function (angular) {
	/* global */
	'use strict';
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemDetailController', PPSItemDetailController);

	PPSItemDetailController.$inject = ['$scope', '$injector', 'platformFormConfigService', 'platformContainerControllerService',
		'productionplanningItemDataService', 'PpsCommonCharacteristic2RowEventsHelper'];

	function PPSItemDetailController($scope, $injector, platformFormConfigService, platformContainerControllerService,
		dataService, characteristic2RowEventsHelper) {

		const formContainerGuid = $scope.getContentValue('uuid');
		const ppsItemCharacteristics2Section = 69;
		const prodDescCharacteristics2Section = 62;

		$scope.onPropertyChange = function (entity, field) {
			dataService.onValueChanged(entity, field);
		};

		platformContainerControllerService.initController($scope, moduleName, formContainerGuid,
			'productionplanningItemTranslationService');

		// extend characteristics2
		const ppsItemCharacteristic2Config = {
			sectionId: ppsItemCharacteristics2Section,
			scope: $scope,
			formContainerId: formContainerGuid,
			dataService: dataService,
			containerInfoService: 'productionplanningItemContainerInformationService',
		};
		characteristic2RowEventsHelper.register(ppsItemCharacteristic2Config);

		const prodDescCharacteristic2Config = {
			sectionId: prodDescCharacteristics2Section,
			scope: $scope,
			formContainerId: formContainerGuid,
			dataService: dataService,
			containerInfoService: 'productionplanningItemContainerInformationService',
			additionalCellChangeCallBackFn: function(entity, field) {
				// sync other items with same ProductDescriptionFK.
				const otherItemsWithSameProductDescriptionFK = (item) => {
					return item.Id !== entity.Id && item.ProductDescriptionFk !== null && item.ProductDescriptionFk === entity.ProductDescriptionFk;
				};
				dataService.getList().filter(otherItemsWithSameProductDescriptionFK).forEach(item => item[field] = entity[field]);
				dataService.gridRefresh();
			},
		};
		characteristic2RowEventsHelper.register(prodDescCharacteristic2Config);

		$scope.$on('$destroy', function () {
			characteristic2RowEventsHelper.unregister(formContainerGuid, ppsItemCharacteristics2Section);
			characteristic2RowEventsHelper.unregister(formContainerGuid, prodDescCharacteristics2Section);
		});
	}
})(angular);