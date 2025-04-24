(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPesShipmentInfoController', ['$scope', '$translate', 'platformDetailControllerService', 'procurementPesHeaderService', 'procurementPesShipmentInfoService', 'procurementPesShipmentInfoUIStandardService', 'platformTranslateService',
		function ($scope, $translate, platformDetailControllerService, procurementPesHeaderService, procurementPesShipmentInfoService, procurementPesShipmentInfoUIStandardService, platformTranslateService) {
			platformDetailControllerService.initDetailController($scope, procurementPesShipmentInfoService, {}, procurementPesShipmentInfoUIStandardService, {
				getTranslate: function () {
					return platformTranslateService.instant;
				}
			});

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				hideButtons: ['first', 'previous', 'next', 'last'],
				customButtons: [
					{
						id: 'createBlank',
						caption$tr$: 'cloud.common.taskBarNewRecord',
						iconClass: 'tlb-icons ico-rec-new',
						permission: '#c',
						disabled: function cancreate() {
							var header = procurementPesHeaderService.getSelected();
							var selected = procurementPesShipmentInfoService.getSelected();
							return selected && angular.isDefined(selected.Id) || !header;
						},
						fn: procurementPesShipmentInfoService.createBlankItem
					},
					{
						id: 'delete',
						caption$tr$: 'cloud.common.taskBarDeleteRecord',
						iconClass: 'tlb-icons ico-rec-delete',
						permission: '#c',
						disabled: function candelete() {
							var selected = procurementPesShipmentInfoService.getSelected();
							return !(selected && angular.isDefined(selected.Id));
						},
						fn: function deleted() {
							var selected = procurementPesShipmentInfoService.getSelected();
							if (selected) {
								procurementPesShipmentInfoService.deleteItem(selected);
							}
						}
					}
				]
			};
		}
	]);
})(angular);