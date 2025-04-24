/**
 * Created by anl on 06/12/2018.
 */
(function (angular) {
	'use strict';
	/*global angular*/
	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).service('transportplanningRequisitionReturnRequisitionUIService', UIStandardService);

	UIStandardService.$inject = [
		'_', '$http',
		'platformTranslateService',
		'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService',
		'platformStatusIconService',
		'transportplanningTransportRouteStatusLookupService',
		'transportplanningRequisitionValidationService',
		'platformDataValidationService'];

	function UIStandardService(
		_, $http,
		platformTranslateService,
		basicsLookupdataConfigGenerator,
		basicsLookupdataLookupFilterService,
		platformStatusIconService,
		routeStatusLookupService,
		requisitionValidationService,
		platformDataValidationService) {

		var service = {};

		service.getRequisitionCreateForm = function (forResource) {
			var resourceTypeForm = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
				dataServiceName: 'resourceTypeLookupDataService',
				showClearButton: true
			}, {
				gid: 'baseGroup',
				rid: 'resourcetypefk',
				model: 'ResTypeFk',
				sortOrder: 8,
				label$tr$: 'productionplanning.common.event.resTypeFk'
			});

			var requisitionCreationFormConfig = {
				fid: 'transportplanning.transport.createTrsRequisitionForm',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'code',
						label$tr$: 'cloud.common.entityCode',
						model: 'Code',
						type: 'code',
						required: true,
						sortOrder: 1
					},
					{
						gid: 'baseGroup',
						rid: 'Description',
						label$tr$: 'cloud.common.entityDescription',
						model: 'DescriptionInfo',
						type: 'translation',
						sortOrder: 2
					},
					{
						gid: 'baseGroup',
						rid: 'projectfk',
						model: 'ProjectFk',
						sortOrder: 3,
						label$tr$: 'cloud.common.entityProject',
						type: 'directive',
						required: true,
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							displayMember: 'Code',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											args.entity.LgmJobFk = null;
										}
									}
								]
							}
						}
					},
					{
						gid: 'baseGroup',
						rid: 'clerkFk',
						model: 'ClerkFk',
						sortOrder: 4,
						label$tr$: 'cloud.common.entityClerk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'cloud-clerk-clerk-dialog',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true
							}
						},
						required: true

					},
					{
						gid: 'baseGroup',
						rid: 'lgmjobfk',
						model: 'LgmJobFk',
						sortOrder: 5,
						label$tr$: 'logistic.job.entityJob',
						type: 'directive',
						required: true,
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'logistic-job-paging-extension-lookup',
							displayMember: 'Code',
							descriptionMember: 'Address.Address',
							lookupOptions: {
								defaultFilter: {projectFk: 'ProjectFk'},
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											// set relative fields BusinessPartnerFk and ContactFk according to changed of LgmJobFk
											args.entity.BusinessPartnerFk = args.selectedItem ? args.selectedItem.BusinessPartnerFk : null;
											args.entity.ContactFk = args.selectedItem ? args.selectedItem.DeliveryAddressContactFk : null;
										}
									}
								]
							}
						}
					},
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
						'basics.customize.transportrequisitionstatus',
						'Description',
						{
							gid: 'baseGroup',
							rid: 'reqStatusFk',
							model: 'TrsReqStatusFk',
							label: 'Requisition Status',
							label$tr$: 'basics.customize.transportrequisitionstatus',
							sortOrder: 6
						},
						false,
						{
							required: true,
							showIcon: true
						}
					),
					{
						gid: 'baseGroup',
						label: 'Date',
						label$tr$: 'cloud.common.entityDate',
						model: 'PlannedStart',
						readonly: false,
						rid: 'plannedstart',
						sortOrder: 7,
						type: 'datetimeutc'
					},
					{
						gid: 'baseGroup',
						label: '*Pickup',
						label$tr$: 'transportplanning.requisition.pickup',
						model: 'IsPickup',
						readonly: true,
						required: true,
						rid: 'ispickup',
						sortOrder: 9,
						type: 'boolean'
					}
				]
			};
			_.forEach(requisitionCreationFormConfig.rows, function (row) {
				var rowModel = row.model.replace(/\./g, '$');
				var syncName = 'validate' + rowModel;
				if (!row.validator && requisitionValidationService[syncName]) {
					row.validator = requisitionValidationService[syncName];
				}
			});

			if (forResource) {
				requisitionCreationFormConfig.rows.push(resourceTypeForm);
			}

			return {configure: platformTranslateService.translateFormConfig(requisitionCreationFormConfig)};
		};

		service.getTrsRequisitionPlantFilterForm = function getTrsRequisitionPlantFilterForm() {
			var filterFormConfig = {
				fid: 'transportplanning.requisition.returnRequisitionFilterForm',
				showGrouping: false,
				groups: [
					{
						gid: 'filterGroup',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [
					{
						gid: 'filterGroup',
						rid: 'projectfk',
						model: 'ProjectFk',
						sortOrder: 1,
						label$tr$: 'cloud.common.entityProject',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							displayMember: 'Code',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								showClearButton: true
							}
						}
					}, {
						gid: 'filterGroup',
						rid: 'sitefk',
						model: 'SiteFk',
						sortOrder: 2,
						label$tr$: 'basics.site.entitySite',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'transportplanning-transport-stockyard-sitefk-filter'
							},
							lookupDirective: 'basics-site-site-isstockyard-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					{
						gid: 'filterGroup',
						rid: 'businesspartnerfk',
						model: 'BusinessPartnerFk',
						sortOrder: 3,
						label$tr$: 'cloud.common.entityBusinessPartner',
						type: 'directive',
						directive: 'business-partner-main-business-partner-dialog',
						options: {
							showClearButton: true
						}
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
						{
							dataServiceName: 'resourceEquipmentGroupLookupDataService',
							cacheEnable: true,
							additionalColumns: false,
							showClearButton: true
						},
						{
							gid: 'filterGroup',
							rid: 'plantgroup',
							label: 'Equipment Group',
							label$tr$: 'resource.equipmentgroup.entityResourceEquipmentGroup',
							type: 'integer',
							model: 'PlantGroupFk',
							sortOrder: 4
						}),
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.planttype', '', {
						gid: 'filterGroup',
						rid: 'planttype',
						model: 'PlantTypeFk',
						sortOrder: 5,
						label$tr$: 'basics.customize.planttype'
					}, false, {}),
					{
						gid: 'filterGroup',
						rid: 'hasremainingquantity',
						type: 'boolean',
						label$tr$: 'transportplanning.transport.wizard.remainingQuantityBigZero',
						model: 'HasRemainingQuantity',
						sortOrder: 6
					}
				]
			};
			return {configure: platformTranslateService.translateFormConfig(filterFormConfig)};
		};

		service.getSelectPlantOptions = function (dataService) {
			var options = {
				jobGrid: {
					state: '8098d435ad974beba8e8676a300ca370',
					columns: [
						{
							field: 'Checked',
							formatter: 'boolean',
							id: 'checked1',
							width: 20,
							pinned: true
						},
						{
							id: 'code',
							field: 'Code',
							name$tr$: 'cloud.common.entityCode',
							width: 70,
							sortable: true,
							formatter: 'code'
						},
						{
							id: 'total',
							field: 'RemainingQuantity',
							formatter: 'quantity',
							name$tr$: 'transportplanning.transport.wizard.remainingQuantity',
							width: 70,
							sortable: true,
							searchable: true
						},
						{
							id: 'description',
							field: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							width: 100,
							sortable: true,
							formatter: 'description'
						},
						{
							id: 'address',
							formatter: 'description',
							field: 'Address',
							name$tr$: 'cloud.common.entityDeliveryAddress',
							width: 100,
							sortable: true,
							formatterOptions: {
								displayMember: 'Address'
							}
						},
						{
							id: 'contactname',
							field: 'ContactName',
							name$tr$: 'transportplanning.transport.wizard.contactName',
							width: 70,
							sortable: true,
							formatter: 'description'
						},
						{
							id: 'contactPhone',
							field: 'ContactPhone',
							name$tr$: 'transportplanning.transport.wizard.contactPhone',
							width: 100,
							sortable: true,
							formatter: 'description'
						}
					]
				},
				plantGrid: {
					idProperty: 'OriginalId',
					state: 'e23339128c134f04bf3e821dcce91996',
					columns: [
						{
							editor: 'boolean',
							field: 'Checked',
							formatter: 'boolean',
							id: 'checked',
							width: 80,
							pinned: true,
							headerChkbox: true,
							name$tr$: 'cloud.common.entitySelected'
						},
						{
							id: 'code',
							field: 'Code',
							name$tr$: 'cloud.common.entityCode',
							width: 60,
							sortable: true,
							formatter: 'code'
						},
						{
							id: 'description',
							field: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							width: 90,
							formatter: 'description'
						},
						{
							id: 'planttype',
							field: 'PlantType',
							name: 'Plant Type',
							name$tr$: 'basics.customize.planttype',
							readonly: true,
							formatter: 'lookup',
							formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
								lookupName: 'basics.customize.planttype',
								att2BDisplayed: 'Description',
								readOnly: true,
								options: null
							}).formatterOptions
						},
						{
							id: 'remainingquantity',
							field: 'RemainingQuantity',
							name$tr$: 'transportplanning.transport.wizard.remainingQuantity',
							formatter: 'quantity',
							width: 110,
							sortable: true,
							searchable: true
						},
						{
							id: 'transportquantity1',
							field: 'TransportQuantity',
							name$tr$: 'cloud.common.entityQuantity',
							disallowNegative: true,
							editor: 'quantity',
							formatter: 'quantity',
							width: 70,
							sortable: true,
							validator: function (entity, value, model) {
								if (value === null || value === undefined) {
									return platformDataValidationService.validateMandatory(entity, value, model, null, dataService);
								} else {
									if (value <= 0) {
										var errObj = platformDataValidationService.createErrorObject('transportplanning.transport.wizard.errorQtyInput', {}, true);
										return platformDataValidationService.finishWithError(errObj, entity, value, model, null, dataService);
									} else {
										platformDataValidationService.removeFromErrorList(entity, model, null, dataService);
										return true;
									}
								}
							}
						}
					]
				},
				planGrid: {
					state: 'b22d50cb199b445d9c73a855783772e9',
					columns: [
						{
							id: 'transporttype',
							field: 'TransportType',
							name$tr$: 'transportplanning.transport.wizard.transportType',
							width: 90,
							sortable: true,
							formatter: 'description'
						},
						{
							id: 'transportdate',
							field: 'TransportDate',
							name$tr$: 'cloud.common.entityDate',
							width: 140,
							sortable: true,
							formatter: 'datetimeutc'
						},
						{
							id: 'transportquantity',
							field: 'TransportQuantity',
							name$tr$: 'cloud.common.entityQuantity',
							formatter: 'quantity',
							width: 100,
							sortable: true,
							searchable: true
						},
						{
							id: 'remainingquantity1',
							field: 'RemainingQuantity',
							name$tr$: 'transportplanning.transport.wizard.remainingQuantity',
							formatter: 'quantity',
							width: 140,
							sortable: true,
							searchable: true
						},
						{
							id: 'remark',
							field: 'Remark',
							name$tr$: 'cloud.common.entityRemark',
							formatter: 'remark',
							width: 140,
							sortable: true,
							searchable: true
						}
					]
				}
			};
			return options;
		};

		return service;
	}

})(angular);