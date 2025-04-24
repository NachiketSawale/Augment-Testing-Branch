(function () {
	/* global angular */
	'use strict';

	function basicsWorkflowUIService(_, platformGridAPI, platformModuleStateService, basicsWorkflowInstanceService, basicsWorkflowTemplateService, platformTranslateService, basicsWorkflowMasterDataService, basicsLookupdataConfigGenerator, platformDialogService, $q) {
		var service = {};
		var loadedGrids = [];

		service.addGridId = function addGridId(gridId) {
			loadedGrids.push(gridId);
		};

		service.removeGridId = function removeGridId(gridId) {
			var index = _.indexOf(loadedGrids, gridId);
			loadedGrids.splice(index, gridId);
		};

		service.prepareSave = function prepareSave() {
			_.each(loadedGrids, function (gridId) {
				platformGridAPI.grids.commitEdit(gridId);
			});
		};

		service.addHistoryFields = function addHistoryFields(fieldList) {
			if (_.isArray(fieldList)) {
				fieldList.push({
					id: 'insertedat',
					formatter: 'history',
					field: '__rt$data.history.inserted',
					readonly: true,
					name$tr$: 'basics.workflow.insertedAt',
					sortable: true,
					grouping: {
						title: 'InsertedAt',
						title$tr$: 'basics.workflow.insertedAt',
						getter: 'InsertedAt',
						aggregators: [],
						aggregateCollapsed: false
					}
				});
				fieldList.push({
					id: 'insertedby',
					formatter: 'history',
					field: '__rt$data.history.insertedBy',
					readonly: true,
					name$tr$: 'basics.workflow.insertedBy',
					sortable: true,
					grouping: {
						title: 'InsertedAt',
						title$tr$: 'basics.workflow.insertedBy',
						getter: 'InsertedBy',
						aggregators: [],
						aggregateCollapsed: false
					}
				});
				fieldList.push({
					id: 'updatedat',
					formatter: 'history',
					field: '__rt$data.history.updated',
					readonly: true,
					name$tr$: 'basics.workflow.updatedAt',
					sortable: true,
					grouping: {
						title: 'updatedAt',
						title$tr$: 'basics.workflow.updatedAt',
						getter: 'UpdatedAt',
						aggregators: [],
						aggregateCollapsed: false
					}
				});
				fieldList.push({
					id: 'updatedby',
					formatter: 'history',
					field: '__rt$data.history.updatedBy',
					readonly: true,
					name$tr$: 'basics.workflow.updatedBy',
					sortable: true,
					grouping: {
						title: 'updatedBy',
						title$tr$: 'basics.workflow.updatedBy',
						getter: 'UpdatedBy',
						aggregators: [],
						aggregateCollapsed: false
					}
				});
			}
		};

		service.removeItemAndRefreshList = function removeItemAndRefreshList(callingModuleName, item2Delete) {
			var state = platformModuleStateService.state(callingModuleName);
			var index;

			state.selectedMainEntity = angular.isArray(state.selectedMainEntity) ? state.selectedMainEntity : state.selectedMainEntity && state.selectedMainEntity.Id ? _.castArray(state.selectedMainEntity) : _.castArray(item2Delete);

			_.forEach(state.selectedMainEntity, function (selectedMainEntity) {
				if (selectedMainEntity && selectedMainEntity.Id) {
					index = _.findIndex(state.mainEntities, {Id: selectedMainEntity.Id});
					_.remove(state.mainEntities, {Id: selectedMainEntity.Id});
					_.remove(basicsWorkflowInstanceService.task.list, {Id: selectedMainEntity.Id});
					_.remove(basicsWorkflowInstanceService.taskListForModule, {Id: selectedMainEntity.Id});
				}
			});

			index = index > 0 ? index - 1 : index;

			if (callingModuleName === 'basics.workflowTask') {
				basicsWorkflowInstanceService.changeSelectedTask(state.mainEntities[index], null);
			} else {
				basicsWorkflowTemplateService.changeSelectedMainEntity(state.mainEntities[index], null);
			}
			return state.mainEntities[index];
		};

		service.getStandardConfigForListView = function getStandardConfigForListView() {
			return {
				columns: getWorkflowTemplateColumns(),
				isTranslated: true
			}
		};

		function getWorkflowTemplateColumns() {
			var state = platformModuleStateService.state('basics.workflow');

			let columns = [
				{
					id: 'id',
					formatter: 'integer',
					field: 'Id',
					sortable: true,
					width: 30,
					name: 'ID',
					grouping: {
						title: 'Id',
						getter: 'Id',
						aggregators: [],
						aggregateCollapsed: true
					}
				},
				{
					id: 'UseTextModuleTranslation',
					field: 'UseTextModuleTranslation',
					name: 'UseTextModuleTranslation',
					name$tr$: 'basics.workflow.template.useTextModuleTranslation',
					domain: 'boolean',
					editor: 'boolean',
					width: 150,
					sortable: true,
					formatter: 'boolean'
				},
				{
					id: 'description',
					formatter: 'comment',
					field: 'Description',
					name$tr$: 'basics.workflow.template.description',
					name: 'description_NT',
					toolTip: 'description',
					editor: 'comment',
					readonly: false,
					width: 180,
					sortable: true,
					grouping: {
						title: 'Description',
						title$tr$: 'basics.workflow.template.description',
						getter: 'Description',
						aggregators: [],
						aggregateCollapsed: true
					}
				},
				{
					id: 'commentText',
					formatter: 'comment',
					field: 'CommentText',
					name$tr$: 'basics.workflow.template.comment',
					name: 'description_NT',
					toolTip: 'comment',
					editor: 'comment',
					readonly: false,
					width: 180,
					sortable: true,
					grouping: {
						title: 'CommentText',
						title$tr$: 'basics.workflow.template.comment',
						getter: 'CommentText',
						aggregators: [],
						aggregateCollapsed: true
					}
				},
				{
					id: 'kindId',
					field: 'KindId',
					name$tr$: 'basics.workflow.template.kind',
					name: 'Kind_NT',
					domain: 'select',
					editor: 'select',
					formatter: 'select',
					readonly: false,
					editorOptions: {
						items: state.workflowKinds,
						valueMember: 'Id',
						displayMember: 'Description'
					},
					width: 150,
					sortable: true,
					grouping: {
						title: 'Kind_NT',
						title$tr$: 'basics.workflow.template.kind',
						getter: 'KindId',
						aggregators: [],
						aggregateCollapsed: true
					}
				},
				{
					id: 'type',
					field: 'TypeId',
					name: 'Type',
					name$tr$: 'basics.workflow.template.type.description',
					readonly: false,
					editor: 'lookup',
					formatter: 'lookup',
					width: 150
				},
				{
					id: 'escalationWorkflow',
					field: 'EscalationWorkflowId',
					name: 'Escalation Workflow',
					name$tr$: 'basics.workflow.template.type.2',
					readonly: false,
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-workflow-escalation-workflows-combo-box'
					},
					formatter: function (row, cell, value, columnDef, dataContext) {
						if (dataContext.EscalationWorkflow) {
							return dataContext.EscalationWorkflow;
						} else {
							var item = _.find(state.mainEntitiesReduced, {TypeId: 2, Id: dataContext.EscalationWorkflowId});
							if (item) {
								return item.Description;
							}
							return '';
						}
					},
					width: 180,
					sortable: true,
					grouping: {
						title: 'Escalation Workflow',
						title$tr$: 'basics.workflow.template.escalationWorkflow',
						getter: 'EscalationWorkflowId',
						aggregators: [],
						aggregateCollapsed: true
					}
				},
				{
					id: 'entityId',
					field: 'EntityId',
					name: 'Entity',
					name$tr$: 'basics.workflow.template.entity',
					sortable: true,
					readonly: false,
					width: 150,
					directive: 'basics-lookupdata-lookup-composite',
					editor: 'lookup',
					editorOptions: {
						lookupDirective: 'basics-workflow-entity-dialog-lookup',
						lookupOptions: {
							showClearButton: true,
							valueMember: 'Id',
							displayMember: 'EntityName',
							dataProvider: {
								getList: function () {
									return basicsWorkflowMasterDataService.getFacadesCombined().then(function (response) {
										return _.uniqBy(response, 'Id');
									});
								},
								getItemByKey: function (id) {
									return basicsWorkflowMasterDataService.getFacadesCombined().then(function (response) {
										return _.find(response, {id: id});
									});
								},
								getSearchList: function () {
									var searchObj = arguments[arguments.length - 1];
									return basicsWorkflowMasterDataService.getFacadesCombined().then(function (response) {
										response = _.filter(response, function (item) {
											return _.includes(item.EntityName.toUpperCase(), searchObj.searchString.toUpperCase());
										});
										return _.uniqBy(response, 'Id');
									});
								}
							}
						},
					},
					formatter: function (row, cell, value, columnDef, dataContext) {
						if (dataContext.Entity) {
							return dataContext.Entity;
						} else {
							if (state.workflowEntities && state.workflowDataEntities) {
								var all = _.concat(state.workflowEntities, state.workflowDataEntities);
								var entity = _.find(all, {Id: value});

								if (entity) {
									return entity.EntityName;
								}
							}
						}
						return '';
					},
					grouping: {
						title: 'Entity',
						title$tr$: 'basics.workflow.template.entity',
						getter: 'Entity',
						aggregators: [],
						aggregateCollapsed: true
					}
				},
				{
					directive: 'basics-lookupdata-lookup-composite',
					editor: 'lookup',
					editorOptions: {
						lookupDirective: 'cloud-clerk-clerk-dialog',
						lookupOptions: {
							showClearButton: true
						}
					},
					field: 'OwnerId',
					formatter: 'lookup',
					formatterOptions: {
						displayMember: 'Description',
						lookupType: 'Clerk'
					},
					id: 'ownerId',
					name: 'Owner',
					name$tr$: 'basics.workflow.template.owner',
					sortable: true,
					readonly: false,
					toolTip: 'Owner',
					toolTip$tr$: 'basics.workflow.template.owner',
					grouping: {
						title: 'Owner',
						title$tr$: 'basics.workflow.template.owner',
						getter: 'EntityId',
						aggregators: [],
						aggregateCollapsed: true
					}
				},
				{
					directive: 'basics-lookupdata-lookup-composite',
					editor: 'lookup',
					editorOptions: {
						lookupDirective: 'cloud-clerk-clerk-dialog',
						lookupOptions: {
							showClearButton: true
						}
					},
					field: 'KeyUserId',
					formatter: 'lookup',
					formatterOptions: {
						displayMember: 'Description',
						lookupType: 'Clerk'
					},
					id: 'keyUserId',
					name: 'Key User',
					name$tr$: 'basics.workflow.template.keyUser',
					sortable: true,
					readonly: false,
					toolTip: 'Key User',
					toolTip$tr$: 'basics.workflow.template.keyUser',
					grouping: {
						title: 'Key User',
						title$tr$: 'basics.workflow.template.keyUser',
						getter: 'KeyUserId',
						aggregators: [],
						aggregateCollapsed: true
					}

				},
				{
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-company-company-lookup',
						lookupOptions: {
							showClearButton: true
						}
					},
					field: 'CompanyId',
					formatter: 'lookup',
					formatterOptions: {
						displayMember: 'Code',
						lookupType: 'company'
					},
					id: 'CompanyId',
					name: 'Company',
					name$tr$: 'basics.workflow.action.customEditor.company',
					sortable: true,
					readonly: false,
					toolTip: 'Company',
					toolTip$tr$: 'basics.workflow.action.customEditor.company',
					grouping: {
						title: 'Company',
						title$tr$: 'basics.workflow.action.customEditor.company',
						getter: 'CompanyId',
						aggregators: [],
						aggregateCollapsed: true
					}
				},
				{
					id: 'IsSingleton',
					field: 'IsSingleton',
					name: 'IsSingleton',
					name$tr$: 'basics.workflow.template.isSingleton',
					domain: 'boolean',
					editor: 'boolean',
					sortable: true,
					width: 50,
					formatter: 'boolean',
					grouping: {
						title: 'IsSingleton',
						title$tr$: 'basics.workflow.template.isSingleton',
						getter: 'IsSingleton',
						aggregators: [],
						aggregateCollapsed: true
					}
				},
				{
					id: 'retentionTime',
					field: 'RetentionTime',
					name: 'RetentionTime',
					name$tr$: 'basics.workflow.template.RetentionTime',
					domain: 'integer',
					editor: 'integer',
					sortable: true,
					validator: function (item, value) {
						var res = value >= 0;
						return {valid: res, apply: res};
					},
					width: 200,
					formatter: 'integer'
				},
				{
					id: 'DisablePermission',
					field: 'DisablePermission',
					name: 'DisablePermission',
					name$tr$: 'basics.workflow.template.disablePermission',
					domain: 'boolean',
					editor: 'boolean',
					sortable: true,
					asyncValidator: function (item, value) {
						if (value === true) {
							var modalOptions = {
								headerText$tr$: 'basics.workflow.template.showDialog.disablePermissionHeaderText',
								bodyText$tr$: 'basics.workflow.template.showDialog.disablePermissionWarn',
								showYesButton: true,
								showNoButton: true,
							};

							return platformDialogService.showDialog(modalOptions).then(function (result) {
								let valid = false;
								if (result.yes) {
									valid = true;
								}
								return {valid: true, apply: valid};
							});
						}
						return $q.when({valid: true, apply: true});
					},
					width: 200,
					formatter: 'boolean',
					grouping: {
						title: 'DisablePermission',
						title$tr$: 'basics.workflow.template.disablePermission',
						getter: 'DisablePermission',
						aggregators: [],
						aggregateCollapsed: true
					}
				},
			];

			// setup workflow type lookup
			var workflowTypeDataConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsWorkflowWorkflowTypeLookupDataService',
				showClearButton: false
			}, {
				required: true
			});
			workflowTypeDataConfig.grid.editorOptions.lookupOptions.selectableCallback = function (item) {
				return item.IsLive;
			};
			_.extend(_.find(columns, {id: 'type'}), workflowTypeDataConfig.grid);

			service.addHistoryFields(columns);

			return platformTranslateService.translateGridConfig(columns);
		}

		return service;
	}

	angular.module('basics.workflow').factory('basicsWorkflowUIService', ['_', 'platformGridAPI', 'platformModuleStateService', 'basicsWorkflowInstanceService', 'basicsWorkflowTemplateService', 'platformTranslateService', 'basicsWorkflowMasterDataService', 'basicsLookupdataConfigGenerator', 'platformDialogService', '$q', basicsWorkflowUIService]);

})();
