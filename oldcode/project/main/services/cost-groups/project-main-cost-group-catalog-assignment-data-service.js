/**
 * Created by baf on 2019-08-08
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'project.main';

	//projectMainCostGroupCatalogAssignmentDataService
	angular.module(moduleName).service('projectMainCostGroupCatalogAssignmentDataService', ProjectMainCostGroupCatalogAssignmentDataService);

	ProjectMainCostGroupCatalogAssignmentDataService.$inject = ['_', 'platformRuntimeDataService', 'platformDataServiceHttpResourceExtension',
		'platformDataProcessExtensionHistoryCreator', 'basicCostGroupCatalogByLineItemContextLookupDataService',
		'basicsLookupdataLookupFilterService', 'projectMainService'];

	function ProjectMainCostGroupCatalogAssignmentDataService(_, platformRuntimeDataService, platformDataServiceHttpResourceExtension,
		platformDataProcessExtensionHistoryCreator, basicCostGroupCatalogByLineItemContextLookupDataService,
		basicsLookupdataLookupFilterService, projectMainService) {

		function doProcessNewAssignment(assignment, isMaster) {
			if(assignment.Version === 0) {
				assignment.IsProjectCatalog = !isMaster;
			}
		}

		function doProcessAssignment(assignment, isPrjCat, hasCostGrpCat, assignmentIsProject) {
			platformRuntimeDataService.readonly(assignment, [
				{field: 'IsProjectCatalog', readonly: !isPrjCat },
				{field: 'Code', readonly: !assignmentIsProject },
				{field: 'DescriptionInfo', readonly: !assignmentIsProject },
				{field: 'CostGroupCatalogFk', readonly: assignmentIsProject },
				{field: 'SourceCostGroupCatalogFk', readonly: !assignmentIsProject || hasCostGrpCat}]);
		}

		var data = {
			assignments: [],
			configuration: null,
			isEditable: false,
			canCreate: false,
			isMaster: false,
			lineItemContextId: 0,
			onCreateSucceeded: function onCatalogAssignmentCreateSucceeded(newData, data) {
				platformDataProcessExtensionHistoryCreator.processItem(newData);
				data.processItem(newData);
				newData.ProjectCatalogConfigurationFk = data.configuration.Id;
				data.assignments.push(newData);
				if(data.createCallback) {
					data.createCallback(newData);
				}
			},
			httpCreateRoute: globals.webApiBaseUrl + 'basics/customize/projectcostgroupcatalogassignment/',
			endCreate: 'create',
			createCallback: null,
			editableChangedCallback: null,
			projectCatalogEnabledCallback: null,
			selected: null
		};
		data.processItem = function processAssignment(assignment) {
			doProcessNewAssignment(assignment, data.isMaster);
			doProcessAssignment(assignment, data.isProjectType, !!assignment.CostGroupCatalogFk, assignment.IsProjectCatalog);
		};

		this.takeAssignments = function takeAssignments(catConfig) {
			data.assignments = [];
			data.configuration = catConfig.Configuration;
			data.isEditable = catConfig.IsEditable;
			data.isProjectType = !data.isMaster;
			if(!_.isNil(catConfig.Type)) {
				data.lineItemContextId = catConfig.Type.LineitemcontextFk;
				data.isProjectType = catConfig.Type.IsProject;
			}

			if (!catConfig.Type && !!projectMainService && !!projectMainService.getSelected() && !!projectMainService.getSelected().LineItemContextId) {
				data.lineItemContextId = projectMainService.getSelected().LineItemContextId;
			}

			_.forEach(catConfig.Assignments, function(assignment) {
				//maybe some kind of processing is necessary
				//platformRuntimeDataService.readonly(assignment, !catConfig.isEditable);
				data.assignments.push(assignment);
			});
		};

		this.getAssignments = function getAssignments() {
			return data.assignments;
		};

		this.setSelected = function setSelected(sel) {
			data.selected = sel;
		};

		this.setIsMaster = function setIsMaster(val) {
			data.isMaster = val;
		};

		this.setCanCreate = function setCanCreate(val) {
			data.canCreate = val;
			if(data.editableChangedCallback) {
				data.editableChangedCallback();
			}
		};

		this.enableProjectCatalog = function enableProjectCatalog(val) {
			data.isProjectType = val;

			_.forEach(data.assignments, function (assignment) {
				assignment.IsProjectCatalog = val && assignment.IsProjectCatalog;
				platformRuntimeDataService.readonly(assignment, [
					{field: 'IsProjectCatalog', readonly: !val}]);
				if(data.projectCatalogEnabledCallback) {
					data.projectCatalogEnabledCallback(assignment);
				}
			});
		};

		this.canCreate = function canCreate() {
			return data.canCreate;
		};

		this.setEditable = function setEditable(val) {
			data.isEditable = val;

			_.forEach(data.assignments, function(assignment) {
				//maybe some kind of processing is necessary
				platformRuntimeDataService.readonly(assignment, !val);

				if(val) {
					data.processItem(assignment);
				}
			});

			if(data.editableChangedCallback) {
				data.editableChangedCallback();
			}
		};

		this.isEditable = function isEditable() {
			return data.isEditable;
		};

		this.getAssignments = function getAssignments() {
			return data.assignments;
		};

		this.registerEntityCreated = function registerEntityCreated(cb) {
			data.createCallback = cb;
		};

		this.unregisterEntityCreated = function unregisterEntityCreated(cb) {
			if(data.createCallback === cb) {
				data.createCallback = null;
			}
		};

		this.registerEditableChanged = function registerEditableChanged(cb) {
			data.editableChangedCallback = cb;
		};

		this.unregisterEditableChanged = function unregisterEditableChanged(cb) {
			if(data.editableChangedCallback === cb) {
				data.editableChangedCallback = null;
			}
		};

		this.registerProjectCatalogEnabledChanged = function registerProjectCatalogEnabledChanged(cb) {
			data.projectCatalogEnabledCallback = cb;
		};

		this.unregisterProjectCatalogEnabledChanged = function unregisterProjectCatalogEnabledChanged(cb) {
			if(data.projectCatalogEnabledCallback === cb) {
				data.projectCatalogEnabledCallback = null;
			}
		};

		this.createItem = function createItem() {
			var creationData = {};

			platformDataServiceHttpResourceExtension.createEntityUsingHttpPost(creationData, data, data.onCreateSucceeded);
		};

		this.deleteItem = function deleteItem() {
			var delEntity = data.selected;
			data.assignments = _.filter(data.assignments, function (item) {
				return item.Id !== delEntity.Id;
			});
		};

		this.canDelete = function canDelete() {
			return !!data.selected && data.selected.Version === 0;
		};

		this.validateCostGroupCatalogFk = function validateCostGroupCatalogFk(assignment, value) {
			doProcessAssignment(assignment, data.isProjectType, !!value);
			if(!_.isNil(value)) {
				var cgCat = basicCostGroupCatalogByLineItemContextLookupDataService.getItemById(value, {lookupTyp: 'basicCostGroupCatalogByLineItemContextLookupDataService'});
				if(!_.isNil(cgCat)) {
					assignment.Code = cgCat.Code;
					assignment.DescriptionInfo.Description = cgCat.DescriptionInfo.Description;
					assignment.DescriptionInfo.Translated = cgCat.DescriptionInfo.Translated;
				}
			}

			return true;
		};

		this.validateIsProjectCatalog = function validateIsProjectCatalog(assignment, value) {
			if(value) {
				assignment.CostGroupCatalogFk = null;
			}
			doProcessAssignment(assignment, data.isProjectType, !!assignment.CostGroupCatalogFk, value);

			return true;
		};

		var filters = [
			{
				key: 'lineItemContext-filter',
				fn: function (costGroupCatalogAssignment) {
					return costGroupCatalogAssignment.LineItemContextFk === data.lineItemContextId;
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);
	}
})(angular);
