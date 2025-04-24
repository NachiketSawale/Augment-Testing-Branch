/**
 * $Id: estimate-main-generate-estimate-from-boq-wizard-service.js 31421 2022-03-09 06:11:48Z badugula $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'basics.import';

	angular.module(moduleName).factory('basicImportCustomEstimateService', ['$injector','$http','$translate','platformTranslateService',
		'platformModalService', 'estimateMainService',
		function ($injector, $http, $translate, platformTranslateService,platformModalService, estimateMainService) {

			let service = {};

			let self = service;

			service.dataItem = {searchCriteria:1,sourceBoqItems:false, existingEstimate: 1};
			service.gridData = [];
			service.formConfiguration = {
				fid:  'basics.import.resource',
				version: '0.1.1',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'searchCriteria',
						header: $translate.instant('basics.import.MergeOption'),
						header$tr$: 'basics.import.MergeOption',
						visible: true,
						isOpen: true,
						attributes: []
					},
					{
						gid: 'selectBoqs',
						header: $translate.instant('basics.import.Resource'),
						header$tr$: 'basics.import.Resource',
						visible: true,
						isOpen: true,
						attributes: []
					}],
				rows: [
					{
						gid: 'searchCriteria',
						rid: 'searchCriteria',
						label: $translate.instant('basics.import.MergeOption'),
						label$tr$: 'basics.import.MergeOption',
						type: 'radio',
						model: 'searchCriteria',
						sortOrder: 0,
						options: {
							labelMember: 'Description',
							valueMember: 'Value',
							groupName: 'SearchCriteria',
							items: [
								{
									Id: 1,
									Description: $translate.instant('basics.import.MergeSame'),
									Value: 1
								},
								{
									Id: 2,
									Description: $translate.instant('basics.import.MergeAll'),
									Value: 2
								}
							]
						}
					},
					{
						gid: 'selectBoqs',
						rid: 'selectProjects',
						type: 'directive',
						model: 'BoqItems',
						required: true,
						'directive': 'basics-Import-Custom-Estimate-Tree-Grid',
						sortOrder: 1,
						// options: {
						// 	tree: true,
						// 	childProp: 'BoqItems',
						// 	type: 'boqitem',
						// 	skipPermissionCheck: true,
						// 	parentProp: 'BoqItemFk',
						// 	idProperty: 'Id',
						// 	collapsed: false,
						// 	indicator: true,
						// 	enableDraggableGroupBy: false
						// },
					}

				]
			};

			Object.defineProperties(service, {
					'dialogTitle': {
						get: function () {
							return '';
						}, enumerable: true
					}
				}
			);

			service.getDataItem = function getDataItem() {
				return service.dataItem;
			};

			service.getFormConfiguration = function getFormConfiguration() {
				return service.formConfiguration;
			};

			return service;
		}]);

})(angular);
