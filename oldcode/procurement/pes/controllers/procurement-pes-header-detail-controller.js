(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPesHeaderDetailController', ['$scope', '$translate', 'platformDetailControllerService', 'procurementPesHeaderService', 'procurementPesHeaderValidationService', 'procurementPesHeaderUIStandardService', 'platformTranslateService',
		'modelViewerStandardFilterService', '$injector', 'basicsCharacteristicDataServiceFactory', 'platformFormConfigService', 'procurementPesBillingSchemaDataService', '$timeout','procurementCommonCreateButtonBySystemOptionService',
		function ($scope, $translate, platformDetailControllerService, procurementPesHeaderService, procurementPesHeaderValidationService, procurementPesHeaderUIStandardService, platformTranslateService,
			modelViewerStandardFilterService, $injector, basicsCharacteristicDataServiceFactory, platformFormConfigService, procurementPesBillingSchemaDataService, $timeout,procurementCommonCreateButtonBySystemOptionService) {
			var containerInfoService = $injector.get('procurementPesContainerInformationService');
			var gridContainerGuid = 'ebe726dbf2c5448f90b417bf2a30b4eb';
			var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(procurementPesHeaderService, 49, gridContainerGuid.toUpperCase(), containerInfoService);

			var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(procurementPesHeaderService, 49);

			platformDetailControllerService.initDetailController($scope, procurementPesHeaderService, procurementPesHeaderValidationService(procurementPesHeaderService), procurementPesHeaderUIStandardService, {
				getTranslate: function () {
					return platformTranslateService.instant;
				}
			});

			// dev-10043: fix general performance issue, should be after initDetailController !important
			$injector.get('basicsCharacteristicColumnUpdateService').attachToForm($scope, characterColumnService, characteristicDataService);

			$scope.formContainerOptions.customButtons = [
				{
					id: 'create',
					caption: $translate.instant('procurement.pes.toolbarNewByCopy'),
					disabled: false,
					type: 'item',
					iconClass: 'tlb-icons ico-rec-new-copy',
					permission: '#c',
					fn: procurementPesHeaderService.createItem
				},
				{
					id: 'createBlank',
					caption: $translate.instant('cloud.common.taskBarNewRecord'),
					disabled: false,
					type: 'item',
					iconClass: 'tlb-icons ico-rec-new',
					permission: '#c',
					fn: procurementPesHeaderService.createBlankItem
				}
			];

			procurementPesBillingSchemaDataService.registerBillingSchemaChangeEvent();
			procurementPesBillingSchemaDataService.registerParentEntityCreateEvent();

			modelViewerStandardFilterService.attachMainEntityFilter($scope, procurementPesHeaderService.getServiceName());
			procurementCommonCreateButtonBySystemOptionService.removeDetailCreateButton($scope,['create','createBlank']);
		}
	]);
})(angular);