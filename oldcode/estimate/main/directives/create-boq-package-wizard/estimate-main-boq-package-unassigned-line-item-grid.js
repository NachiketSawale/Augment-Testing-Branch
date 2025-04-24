/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateMainBoqPackageUnassignedLineItemGrid', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/estimate-main-boq-package-generic-grid.html',
				controller: ['$scope', 'platformGridAPI', 'platformTranslateService', function ($scope, platformGridAPI, platformTranslateService) {
					let gridId = '60E48A3F17D34FDDA0A5A1E0846A0EE1';
					$scope.gridData = {
						state: gridId
					};
					$scope.message= 'estimate.main.createBoqPackageWizard.wicErrorDialogMessage';

					let columns = [{
						id: 'code',
						formatter: 'code',
						// field: 'PackageCode',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode'
					}, {
						id: 'description',
						// field: 'PackageCode',
						field: 'DescriptionInfo',
						formatter: 'translation',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription'
					}, {
						id: 'assemblyTemplate',
						field: 'EstAssemblyFk',
						name$tr$: 'estimate.main.estAssemblyFk',
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'estAssemblyFk',
							'displayMember': 'Code'
						}
					}, {
						id: 'assemblyTemplateDescription',
						field: 'EstAssemblyFk',
						name: 'Assembly Description',
						name$tr$: 'estimate.main.assemblyDescription',
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'estAssemblyFk',
							'displayMember': 'DescriptionInfo.Translated'
						}
					}];
					let gridConfig = {
						columns: columns,
						data: $scope.entity.lineItemList,
						id: gridId,
						// lazyInit: true
						options: {
						}
					};
					platformGridAPI.grids.config(gridConfig);
					platformTranslateService.translateGridConfig(gridConfig);
				}]
			};
		}
	]);

})(angular);
