(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.pes';
	angular.module(moduleName).value('procurementPesHeaderRemarkConfiguration', {
		getStandardConfigForDetailView: function () {
			return {
				fid: 'procurement.pes.header.remark',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: '1',
						header: '',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [
					{
						gid: '1',
						rid: 'remark',
						label: '',
						type: 'remark',
						model: 'Remark',
						visible: true,
						sortOrder: 1,
						readonly: false
					}
				]
			};
		}
	});

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPesHeaderRemarkController', ['$scope', 'platformDetailControllerService', 'procurementPesHeaderService', 'procurementPesHeaderValidationService', 'procurementPesHeaderRemarkConfiguration', 'schedulingMainTranslationService',
		function ($scope, platformDetailControllerService, procurementPesHeaderService, procurementPesHeaderValidationService, procurementPesHeaderRemarkConfiguration, schedulingMainTranslationService) {
			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};
			platformDetailControllerService.initDetailController($scope, procurementPesHeaderService, procurementPesHeaderValidationService(procurementPesHeaderService), procurementPesHeaderRemarkConfiguration, schedulingMainTranslationService);
		}
	]);
})(angular);