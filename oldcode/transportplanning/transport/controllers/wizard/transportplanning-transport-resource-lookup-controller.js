/**
 * Created by lav on 10/30/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc controller
	 * @name transportplanningTransportResourceLookupController
	 * @requires $scope,$controller
	 * @description
	 * #
	 * Controller for the new resource search view
	 */
	/* jshint -W072*/ //many parameters because of dependency injection
	angular.module(moduleName).controller('transportplanningTransportResourceLookupController',
		['$scope', '$modalInstance', 'basicsLookupdataConfigGenerator', 'lookupFilterDialogControllerService',
			'resourceMasterResourceFilterLookupDataService',
			'transportplanningTransportCreateTransportRouteDialogResourceService',
			'PlatformMessenger',
			'lookupConverterService',
			'$options',
			'basicsLookupdataLookupFilterService',
			function ($scope, $modalInstance, basicsLookupdataConfigGenerator, lookupFilterDialogControllerService,
					  resourceMasterResourceFilterLookupDataService,
					  transportplanningTransportCreateTransportRouteDialogResourceService,
					  PlatformMessenger,
					  lookupConverterService,
					  $options,
					  basicsLookupdataLookupFilterService) {

				//register filters
				var filters = [{
					key: 'transportplanning-transport-stockyard-sitefk-filter',
					serverSide: true,
					fn: function () {
						return {IsStockyard: true};
					}
				}];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				var formSettings = {
					fid: 'resource.master.selectionfilter',
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'selectionfilter',
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: [{
						gid: 'selectionfilter',
						rid: 'site',
						label: 'Site',
						label$tr$: 'resource.master.SiteFk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'transportplanning-transport-stockyard-sitefk-filter'
							},
							lookupDirective: 'basics-site-site-isstockyard-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						},
						model: 'siteFk',
						sortOrder: 1
					},
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcekind', '',
							{
								gid: 'selectionfilter',
								rid: 'kind',
								label: 'Kind',
								label$tr$: 'resource.master.KindFk',
								type: 'integer',
								model: 'kindFk',
								sortOrder: 2
							}, false, {required: false}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcegroup', '',
							{
								gid: 'selectionfilter',
								rid: 'group',
								label: 'Group',
								label$tr$: 'resource.master.GroupFk',
								type: 'integer',
								model: 'groupFk',
								sortOrder: 3
							}, false, {required: false}),
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'resourceTypeLookupDataService',
								cacheEnable: true,
								additionalColumns: false,
								showClearButton: true
							},
							{
								gid: 'selectionfilter',
								rid: 'type',
								label: 'Type',
								label$tr$: 'resource.master.TypeFk',
								type: 'integer',
								model: 'typeFk',
								sortOrder: 4
							}),
						{
							gid: 'selectionfilter',
							rid: 'validFrom',
							label: 'Valid From',
							label$tr$: 'cloud.common.entityValidFrom',
							type: 'dateutc',
							model: 'validFrom',
							sortOrder: 5
						},
						{
							gid: 'selectionfilter',
							rid: 'validTo',
							label: 'Valid To',
							label$tr$: 'cloud.common.entityValidTo',
							type: 'dateutc',
							model: 'validTo',
							sortOrder: 6
						}]
				};

				var columns = [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						formatter: 'code'
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						readonly: true,
						width: 270
					},
					{
						id: 'kind',
						field: 'KindFk',
						name: 'Kind',
						name$tr$: 'resource.master.KindFk',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.resourcekind'
						}).formatterOptions
					},
					{
						id: 'group',
						field: 'GroupFk',
						name: 'Group',
						name$tr$: 'resource.master.GroupFk',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.resourcegroup'
						}).formatterOptions
					},
					{
						id: 'type',
						field: 'TypeFk',
						name: 'Type',
						name$tr$: 'resource.master.TypeFk',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
							dataServiceName: 'resourceTypeLookupDataService'
						}).formatterOptions
					},
					{
						id: 'validFrom',
						field: 'Validfrom',
						name: 'Valid From',
						name$tr$: 'cloud.common.entityValidFrom',
						formatter: 'dateutc',
						readonly: true
					},
					{
						id: 'validTo',
						field: 'Validto',
						name: 'Valid To',
						name$tr$: 'cloud.common.entityValidTo',
						formatter: 'dateutc',
						readonly: true
					}
				];

				$scope.options = {
					defaultFilter: function (request) {
						request.siteFk = $options.entity.preSelectionSite;
						return request;
					},
					lookupType: 'ResourceMasterResource',
					valueMember: 'Id',
					displayMember: 'Code',
					disableDataCaching: true,
					dataService: resourceMasterResourceFilterLookupDataService,
					detailConfig: formSettings,
					columns: columns,
					filterOptions: {
						serverSide: true,
						serverKey: 'resource-master-filter',
						fn: function (item) {
							return resourceMasterResourceFilterLookupDataService.getFilterParams(item);
						}
					},
					pageOptions: {
						enabled: true,
						size: 100
					},
					version: 3,
					title: 'resource.master.lookupAssignResource',
					uuid: 'aa75db0e84sb4679a1dd0608c0423496'
				};

				lookupConverterService.initialize($scope, $scope.options);
				lookupFilterDialogControllerService.initFilterDialogController($scope, $modalInstance);
				$scope.onSelectedItemsChanged = new PlatformMessenger();
				$scope.onSelectedItemsChanged.register(function (e, args) {
					transportplanningTransportCreateTransportRouteDialogResourceService.createReferences(args.selectedItems);
				});
			}]);

})(angular);