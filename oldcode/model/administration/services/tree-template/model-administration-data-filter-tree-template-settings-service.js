/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc service
	 * @name modelAdministrationDataFilterTreeTemplateSettingsService
	 * @function
	 *
	 * @description
	 * The modelAdministrationDataFilterTreeTemplateSettingsService handles the logic for displaying and saving settings in a modal dialog for tree templates.
	 */

	angular.module(moduleName).service('modelAdministrationDataFilterTreeTemplateSettingsService', ModelAdministrationDataFilterTreeTemplateSettingsService);

	ModelAdministrationDataFilterTreeTemplateSettingsService.$inject = ['$http', '$injector', '$translate', 'platformModalFormConfigService', 'platformTranslateService', 'modelAdministrationDataService', 'basicsLookupdataConfigGenerator'];

	function ModelAdministrationDataFilterTreeTemplateSettingsService($http, $injector, $translate, platformModalFormConfigService, platformTranslateService, modelAdministrationDataService, basicsLookupdataConfigGenerator) {

		// Lazy-load the grid data service when needed
		function getGridDataService() {
			return $injector.get('modelAdministrationDataFilterTreeNodeTemplateDataService');
		}
		this.openSettingsDialog = function openSettingsDialog(selectedNode) {
			//var settingsJson = JSON.parse(selectedNode.SettingsJson);
			var settingsJson = {};
			try {
				if (selectedNode.SettingsJson) {
					settingsJson = JSON.parse(selectedNode.SettingsJson);
				}
			} catch (e) {
				settingsJson = {}; // Default to empty object on error
			}
			var modalDialogConfig = {
				title: $translate.instant('model.administration.filterTreeTemplate.treeTemplateSettings'),
				dataItem: selectedNode.Nodetype === 'ObjectSetList' ? settingsJson : selectedNode,  // The selected node object
				formConfiguration: {
					fid: 'model.administration.treeTemplateDialog',
					version: '0.1.0',
					showGrouping: false,
					groups: [{
						gid: 'baseGroup',
						attributes: []
					}],
					rows: []
				},
				
				handleOK: function processOKResult(result) {
					// Move specific fields into the JSON settings object for ObjectSetList node type
					if (selectedNode.Nodetype === 'ObjectSetList') {
						var updatedSettingsJson = {
							isExpandObjects: result.data.isExpandObjects || false,
							isRestrictToIFCGroups: result.data.isRestrictToIFCGroups || false,
							isRestrictToIFCZones: result.data.isRestrictToIFCZones || false
						};
						// Ensure `__rt$data` is removed only if it exists
						if (result.data.__rt$data) {
							delete result.data.__rt$data;
						}
						// Update the local record
						selectedNode.settingsJson = JSON.stringify(updatedSettingsJson);
					}
					selectedNode.modelPropertyKeyFk = result.data.ModelPropertykeyFk || 0;
					selectedNode.isOptionalLevel = result.data.IsOptionalLevel || false;
					selectedNode.displayName = result.data.DisplayName || null;
					selectedNode.objectMode = result.data.ObjectMode || null;

					// Mark item as modified in the data service
					var gridService = getGridDataService();
					gridService.markItemAsModified(selectedNode);
				},


				handleCancel: function handleCancel() {
					// Handle cancel action if necessary
				}
			};

			// Function to generate the form fields based on Node type
			function generateFormFields(node) {
				var settingsJson = {};
				try {
					if (node.SettingsJson) {
						settingsJson = JSON.parse(node.SettingsJson);
					}
				} catch (e) {
					settingsJson = {}; // Default to empty object on error
				}
				var rows = [];

				if (node.Nodetype === 'AttributeFilter') {
					// For AttributeFilter type, create fields for Type, Name, etc.
					rows.push(
						{
							required: true,
							gid: 'baseGroup',
							rid: 'Id',
							label: 'Property Key',
							label$tr$: 'model.administration.filterTreeTemplate.propertyKey',
							model: 'ModelPropertykeyFk',
							sortOrder: 1,
							readonly: false,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PropertyKey',
								displayMember: 'PropertyName'
							},
							type: 'directive',
							directive: 'model-main-property-key-dialog'
						},
					)

					rows.push({
						gid: 'baseGroup',
						rid: 'IsOptionalLevel',
						label: 'Optional Level',
						label$tr$: 'model.administration.filterTreeTemplate.isOptionalLevel',
						type: 'boolean',
						model: 'IsOptionalLevel',  // Binding to the node's IsOptionalLevel
						value: node.IsOptionalLevel || false,
						sortOrder: 3
					});

				}
				else if (node.Nodetype === 'FixedNode') {
					// For FixedNode type, create fields for DisplayName, ObjectIdsMode, etc.
					rows.push({
						gid: 'baseGroup',
						rid: 'DisplayName',
						label: 'Display Name',
						label$tr$: 'model.administration.filterTreeTemplate.displayName',
						type: 'description',
						model: 'DisplayName',  // Binding to the node's DisplayName
						value: node.DisplayName || '',
						sortOrder: 0
					});

					// Add a hardcoded dropdown for NodeType
					rows.push({
						gid: 'baseGroup',
						rid: 'ObjectIdsMode',
						label: 'Object Mode',
						label$tr$: 'model.administration.filterTreeTemplate.ObjectIdsMode',
						type: 'select',
						model: 'ObjectMode', // Binding to the node's NodeType
						sortOrder: 1, // Ensure this appears first
						options: {
							items: [
								{ id: 'CurrentContext', description: $translate.instant('model.administration.filterTreeTemplate.currentContext') },
								{ id: 'FromParent', description: $translate.instant('model.administration.filterTreeTemplate.parent') },
								{ id: 'FromChildren', description: $translate.instant('model.administration.filterTreeTemplate.children') },
								{ id: 'FromDescendants', description: $translate.instant('model.administration.filterTreeTemplate.descendants') }
							],
							valueMember: 'id',
							displayMember: 'description'
						}
					});

				}
				else if (node.Nodetype === 'ObjectSetList') {
					// For ObjectSetList type, create fields for ExpandObjects, RestrictToIfcGroups, etc.
					rows.push({
						gid: 'baseGroup',
						rid: 'Isexpandobjects',
						label: 'Expand Objects',
						label$tr$: 'model.administration.filterTreeTemplate.expandObjects',
						type: 'boolean',
						model: 'isExpandObjects',  // Binding to the node's ExpandObjects
						value: settingsJson.isExpandObjects || false,
						sortOrder: 1
					});

					rows.push({
						gid: 'baseGroup',
						rid: 'Isrestricttoifcgroups',
						label: 'Restrict to IFC Groups',
						label$tr$: 'model.administration.filterTreeTemplate.restricttoIFCGroups',
						type: 'boolean',
						model: 'isRestrictToIFCGroups',  // Binding to the node's RestrictToIfcGroups
						value: settingsJson.isRestrictToIFCGroups || false,
						visible: true,
						sortOrder: 2
					});

					rows.push({
						gid: 'baseGroup',
						rid: 'Isrestricttoifczones',
						label: 'Restrict to IFC Zones',
						label$tr$: 'model.administration.filterTreeTemplate.restricttoIFCZones',
						type: 'boolean',
						model: 'isRestrictToIFCZones',  // Binding to the node's RestrictToIfcZones
						value: settingsJson.isRestrictToIFCZones || false,
						visible: true,
						sortOrder: 2

					});


				}
				return rows;
			}


			// Generate form fields based on the selected node
			modalDialogConfig.formConfiguration.rows = generateFormFields(selectedNode);

			// Translate the form configuration if needed
			platformTranslateService.translateFormConfig(modalDialogConfig.formConfiguration);

			// Show the dialog with the configuration
			platformModalFormConfigService.showDialog(modalDialogConfig);
		};
	}
})(angular);

