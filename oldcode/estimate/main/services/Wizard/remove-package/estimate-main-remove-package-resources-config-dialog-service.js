

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainRemovePackageResourcesConfigDialogService
	 * @function
	 *
	 * @description
	 * This is the configuration service to remove the Package assigned to the specific Resources.
	 */
	angular.module(moduleName).factory('estimateMainRemovePackageResourcesConfigDialogService', ['basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {

			let service = {};
			let getColumns = function getColumns(){
				let columns = [
					{
						id: 'isChecked',
						field: 'IsChecked',
						name$tr$: 'estimate.main.generateProjectBoQsWizard.select',
						toolTip: 'Select',
						formatter: 'boolean',
						editor: 'boolean',
						width: 65,
						headerChkbox: true,
						validator: 'isCheckedValueChange',
						isTransient : true,
						sortOrder:0
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 70,
						toolTip: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						sortOrder:1
					},
					{
						id: 'desc',
						field: 'DescriptionInfo',
						name: 'Description',
						width: 120,
						toolTip: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription',
						sortOrder:2
					},
					{
						id: 'PackageAssignments',
						field: 'PackageAssignments',
						name: 'PackageAssignments',
						width: 90,
						toolTip: 'PackageAssignments',
						formatter: 'description',
						name$tr$: 'estimate.main.createMaterialPackageWizard.procurementPackage',
						sortOrder:3
					},
					{
						id: 'estLineItemCode',
						field: 'EstLineItemCode',
						name: 'LineItem Code',
						name$tr$: 'estimate.main.aiWizard.lineItemCode',
						toolTip: 'LineItem Code',
						toolTip$tr$: 'estimate.main.aiWizard.lineItemCode',
						formatter: 'code',
						width: 90,
						sortOrder: 4
					},
					{
						id: 'estLineItemDesc',
						field: 'EstLineItemDescription',
						name: 'LineItem Description',
						name$tr$: 'estimate.main.aiWizard.lineItemDescription',
						toolTip: 'LineItem Description',
						toolTip$tr$: 'estimate.main.aiWizard.lineItemDescription',
						formatter: 'translation',
						width: 120,
						sortOrder: 5
					},
					{
						id: 'BusinessPartner',
						field: 'BusinessPartner',
						name: 'Business Partner',
						name$tr$: 'estimate.main.createMaterialPackageWizard.businessPartner',
						sortable: true,
						width: 120,
						toolTip: 'Business Partner',
						formatter: 'description',
						sortOrder:6
					},
					{
						id: 'CommentText',
						field: 'CommentText',
						name: 'Comment',
						width: 90,
						toolTip: 'Comment',
						formatter: 'comment',
						name$tr$: 'estimate.main.Comment',
						sortOrder:7
					},
					{
						id: 'DescriptionInfo1',
						field: 'DescriptionInfo1',
						name: 'Additional Description',
						width: 120,
						toolTip: 'Additional Description',
						formatter: 'translation',
						name$tr$: 'estimate.main.descriptionInfo1',
						sortOrder:8
					}
				];

				return columns;
			};

			service.getStandardConfigForListView = function () {
				return {
					columns: getColumns()
				};
			};

			return service;
		}]);
})();



