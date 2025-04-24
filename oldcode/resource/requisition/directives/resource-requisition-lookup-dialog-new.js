/**
 * Created by leo on 18.12.2017.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name resource-requisition-lookup
	 * @requires LookupFilterDialogDefinition, basicsLookupdataConfigGenerator
	 * @description ComboBox to select a activity template
	 */

	angular.module('resource.requisition').directive('resourceRequisitionLookupDialogNew',
		['platformDataServiceProcessDatesBySchemeExtension', 'LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator',
			'resourceRequisitionConstantValues', 'resourceRequisitionFilterLookupDataService',

			function (platformDataServiceProcessDatesBySchemeExtension, LookupFilterDialogDefinition, basicsLookupdataConfigGenerator,
				resourceRequisitionConstantValues, resourceRequisitionFilterLookupDataService) {
				var formSettings = {
					fid: 'resource.requisition.selectionfilter',
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
						rid: 'job',
						label: 'Job',
						label$tr$: 'resource.requisition.entityJob',
						model: 'jobFk',
						type: 'directive',
						directive: 'logistic-job-paging-lookup',
						options: {
							showClearButton: true
						},
						sortOrder: 1
					},
					{
						gid: 'selectionfilter',
						rid: 'project',
						label$tr$: 'cloud.common.entityProject',
						type: 'directive',
						directive: 'basics-lookup-data-project-project-dialog',
						options: {
							showClearButton: true
						},
						model: 'projectFk',
						sortOrder: 2
					},
					{
						gid: 'selectionfilter',
						rid: 'resource',
						label: 'Resource',
						label$tr$: 'resource.master.entityResource',
						type: 'directive',
						directive: 'resource-master-resource-lookup-dialog-new',
						options: {
							showClearButton: true
						},
						model: 'resourceFk',
						sortOrder: 3
					},
					{
						gid: 'selectionfilter',
						rid: 'requestedFrom',
						label: 'Requested From',
						label$tr$: 'resource.requisition.entityRequestedFrom',
						type: 'dateutc',
						model: 'requestedFrom',
						sortOrder: 4
					},
					{
						gid: 'selectionfilter',
						rid: 'requestedTo',
						label: 'Requested To',
						label$tr$: 'resource.requisition.entityRequestedTo',
						type: 'dateutc',
						model: 'requestedTo',
						sortOrder: 5
					}]
				};
				var gridSettings = {
					columns: [
						{
							id: 'job',
							field: 'JobFk',
							name: 'Job',
							name$tr$: 'resource.requisition.entityJob',
							readonly: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'logisticJob',
								displayMember: 'Code',
								version: 3
							}
						},
						{
							id: 'description',
							field: 'Description',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter: 'description',
							readonly: true,
							width: 270
						},
						{
							id: 'resource',
							field: 'ResourceFk',
							name: 'Resource',
							name$tr$: 'resource.master.entityResource',
							readonly: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ResourceMasterResource',
								version: 3,
								displayMember: 'Code'
							}
						},
						{
							id: 'project',
							field: 'ProjectFk',
							name: 'Project',
							name$tr$: 'cloud.common.entityProject',
							readonly: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectNo'
							}
						},
						{
							id: 'requestedFrom',
							field: 'RequestedFrom',
							name: 'Requested From',
							name$tr$: 'resource.requisition.entityRequestedFrom',
							formatter: 'dateutc',
							readonly: true
						},
						{
							id: 'requestedTo',
							field: 'RequestedTo',
							name: 'Requested To',
							name$tr$: 'resource.requisition.entityRequestedTo',
							formatter: 'dateutc',
							readonly: true
						}
					]
				};
				var lookupOptions = {
					lookupType: 'resourceRequisition',
					valueMember: 'Id',
					displayMember: 'Description',
					filterOptions: {
						serverSide: true,
						serverKey: 'resourcerequisitionfilter',
						fn: function (item) {
							return resourceRequisitionFilterLookupDataService.getFilterParams(item);
						}
					},
					pageOptions: {
						enabled: true,
						size: 100
					},
					dataProcessors: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
						resourceRequisitionConstantValues.schemes.requisition)],
					version: 3,
					title: 'resource.requisition.lookupAssignRequisition',
					uuid: '3429e5da557542abad84498e8f67d06c'
				};
				return new LookupFilterDialogDefinition(lookupOptions, 'resourceRequisitionFilterLookupDataService', formSettings, gridSettings);
			}
		]
	);
})(angular);
