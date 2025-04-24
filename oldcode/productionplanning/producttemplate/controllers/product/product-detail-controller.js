(function () {
	/* global _ */
	'use strict';
	const moduleName = 'productionplanning.producttemplate';
	const angModule = angular.module(moduleName);

	angModule.controller('productionplanningProducttemplateProductDetailController', DetailController);

	DetailController.$inject = ['$scope', 'platformDetailControllerService',
		'$injector',
		'$timeout',
		'platformFormConfigService',
		'productionplanningCommonProductUIStandardService',
		'productionplanningCommonProductValidationFactory'];
	function DetailController($scope, platformDetailControllerService,
		$injector,
		$timeout,
		platformFormConfigService,
		uiStandardServ,
		validationServiceFactory) {

		const formContainerGuid = $scope.getContentValue('uuid');
		const characteristic2SectionId = 64;

		const containerId = $scope.getContentValue('id');
		const seviceOptions = $scope.getContentValue('serviceOptions');
		const dataServ = $injector.get(seviceOptions.dataService);
		const validationServ = validationServiceFactory.getValidationService(dataServ);
		platformDetailControllerService.initDetailController($scope, dataServ, validationServ, uiStandardServ, 'productionplanningCommonTranslationService');

		// extend characteristic2
		const characteristic2Config = {
			sectionId: characteristic2SectionId,
			scope: $scope,
			formContainerId: formContainerGuid,
			dataService: dataServ,
			containerInfoService: 'productionplanningProductContainerInformationService',
		};
		const characteristic2RowEventsHelper = $injector.get('PpsCommonCharacteristic2RowEventsHelper');
		characteristic2RowEventsHelper.register(characteristic2Config);

		if(containerId === 'productionplanning.product.product.details'){
			const detailView = uiStandardServ.getStandardConfigForDetailView();
			_.forEach(detailView.rows, function (row) {
				row.change = function (entity, field) {
					dataServ.onEntityPropertyChanged(entity, field);
				};
			});
		}

		$scope.$on('$destroy', function () {
			characteristic2RowEventsHelper.unregister(characteristic2Config, characteristic2SectionId);
		});
	}
})();