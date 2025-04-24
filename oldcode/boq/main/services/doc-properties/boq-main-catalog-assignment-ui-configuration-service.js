/**
 * Created by benny on 09.06.2017.
 */

(function () {
	/* global */
	'use strict';

	var modulename = 'boq.main';

	/**
	 * @ngdoc
	 * @name boqMainCatalogAssignmentUIConfigService
	 * @description
	 * This is the configuration service for boq catalog assignment dialog.
	 */
	angular.module(modulename).factory('boqMainCatalogAssignmentUIConfigService', [
		function () {

			var service = {};

			var formConfig = {
				showGrouping: true,
				change: 'change',
				groups: [
					{
						gid: 'boqCatalog',
						header: 'Split Quantity Catalog Assignments',
						header$tr$: 'boq.main.catalogSection',
						isOpen: true,
						visible: true,
						sortOrder: 4
					}
				],
				rows: [
					{
						gid: 'boqCatalog',
						rid: 'boqCatalogAssignType',
						label: 'BoQ Catalog Assign Type',
						label$tr$: 'boq.main.boqCatalogAssignType',
						type: 'select',
						model: 'boqCatAssignTypeId',
						options: {
							serviceName: 'boqMainCatalogAssignTypeService',
							displayMember: 'DescriptionInfo.Translated',
							valueMember: 'Id'
						},
						readonly: false,
						visible: true,
						sortOrder: 1
					},
					{
						gid: 'boqCatalog',
						rid: 'editBoqCatalogConfigType',
						label: 'Edit Type',
						label$tr$: 'boq.main.editBoqCatalogConfigType',
						type: 'boolean',
						model: 'editBoqCatalogConfigType',
						checked: false,
						readonly: false,
						visible: true,
						sortOrder: 2
					},
					{
						gid: 'boqCatalog',
						rid: 'boqCatalogAssignDesc',
						label: 'Description',
						label$tr$: 'cloud.common.entityDescription',
						type: 'description',
						model: 'boqCatalogAssignDesc',
						readonly: false,
						visible: true,
						sortOrder: 3
					},
					{
						gid: 'boqCatalog',
						rid: 'boqCatalogAssignDetails',
						label: 'BoQ Catalog Assign Details',
						label$tr$: 'boq.main.boqCatalogAssignDetails',
						type: 'directive',
						model: 'boqCatalogAssignDetails',
						directive: 'boq-main-catalog-assign-details',
						readonly: false,
						rows: 20,
						visible: true,
						sortOrder: 4
					}
				]
			};

			service.getFormConfig = function () {
				var deepCopiedFormConfiguration = angular.copy(formConfig);

				return deepCopiedFormConfiguration;
			};

			return service;
		}
	]);
})();
