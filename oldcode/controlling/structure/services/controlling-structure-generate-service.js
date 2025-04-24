/**
 * Created by janas on 18.05.2016.
 */


(function () {
	'use strict';
	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureGenerateService
	 * @function
	 *
	 * @description
	 * controllingStructureGenerateService capsulates generation (of controlling units) functionality
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	controllingStructureModule.factory('controllingStructureGenerateService', ['globals', '_', '$http', '$translate', 'platformModalService', 'projectMainForCOStructureService', 'platformDataServiceDataProcessorExtension', 'controllingStructureDynamicAssignmentsService',
		function (globals, _, $http, $translate, platformModalService, projectMainForCOStructureService, platformDataServiceDataProcessorExtension, controllingStructureDynamicAssignmentsService) {

			var service = {};

			// take over properties helper functions
			function copySpecificProperties(unit) {
				var properties = ['Id', 'Code', 'DescriptionInfo', 'ControllingunitFk']
					// Assignment01, Assignment02, ..., Assignment10
					.concat(_.map(_.range(1, 11), function (i) {return 'Assignment' + _.padStart(i, 2, 0);}))
					.concat(_.map(_.range(1, 11), function (i) {return 'ControllingGrpDetail' + _.padStart(i, 2, 0) + 'Fk';}));

				var newObj = {};
				// copy properties if no undefined
				_.each(properties, function (prop) {
					if (unit[prop]) {
						newObj[prop] = unit[prop];
					}
				});
				return newObj;
			}

			service.bulkCreateOnServer = function (list, serviceContainer) {
				if (_.size(list) === 0) {
					return;
				}

				controllingStructureDynamicAssignmentsService.setControllingGrpDetailsByAssignments(list);

				// create all controlling unit groups so we have to collect them first
				var CUGs = [];
				_.each(list, function (unit) {
					var currentCUGs = _.filter(unit.__context, {entityName: 'CUG'});
					_.each(currentCUGs, function (cug) {
						CUGs.push({CUG: cug.Object, UnitID: unit.Id});
					});
				});

				// case from alm 116941 // TODO: simplify
				var size = _.size(list);
				var number =  size === 1 ? 2 : size;

				var params = {ProjectId: projectMainForCOStructureService.getSelected().Id, number: number, groupNumber: _.size(CUGs)};
				var parastr = '?projectId=' + params.ProjectId + '&number=' + params.number + '&groupNumber=' + params.groupNumber;

				$http.post(globals.webApiBaseUrl + 'controlling/structure/bulkcreate' + parastr, params)
					.then(function (response) {

						var cunitTemplate = response.data.ControllingUnit,
							Ids = response.data.Ids,
							cunitGroupTemplate = response.data.ControllingUnitGroup,
							GroupIds = response.data.GroupIds;

						// assign all Ids
						if (size > 1) { // case alm 116941 // TODO: simplify (see above)
							Ids.unshift(cunitTemplate.Id);
						}
						_.merge(list, _.map(Ids, function (id) { return {Id: id}; }));

						if (GroupIds) {
							GroupIds.unshift(cunitGroupTemplate.Id);
							_.merge(CUGs, _.map(GroupIds, function (id) { return {Id: id}; }));
							_.each(CUGs, function (cug) { cug.UnitID = Ids[cug.UnitID]; });
						}

						function setControllingUnitFk(cunit) {
							_.each(cunit.ControllingUnits, function (child) {
								child.ControllingunitFk = cunit.Id;
								setControllingUnitFk(child);
							});
						}
						_.each(list, setControllingUnitFk);

						var controllingUnitGroups = [];
						_.each(CUGs, function (group) {
							var newgroup = angular.extend({}, cunitGroupTemplate, {
								Id: group.Id,
								ControllingunitFk: group.UnitID,
								ControllinggroupFk: group.CUG.ControllinggroupFk,
								ControllinggroupdetailFk: group.CUG.Id
							});
							controllingUnitGroups.push(newgroup);
						});

						var controllingUnitsToSave = [];
						cunitTemplate.IsDefault = false; // we only want one default unit, see below // TODO: change cunitTemplate on server?
						_.each(list, function (unit) {
							var newunit = angular.extend({}, cunitTemplate, copySpecificProperties(unit));

							controllingUnitsToSave.push({
								ControllingUnits: newunit,
								ControllingUnitGroupsToSave: _.filter(controllingUnitGroups, {ControllingunitFk: newunit.Id}),
								MainItemId: newunit.Id
							});
						});

						// only one default unit
						_.set(controllingUnitsToSave, '[0].ControllingUnits.IsDefault', true);

						var BulkCreateDataOnServer = {
							EntitiesCount: params.number + params.groupNumber,
							ProjectId: params.ProjectId,
							ControllingUnitCompleteList: controllingUnitsToSave
						};

						$http.post(globals.webApiBaseUrl + 'controlling/structure/bulkcreateonserver', BulkCreateDataOnServer)
							.then(function (/* response */) {
								serviceContainer.service.load();
							});
					});
			};

			service.bulkCreate = function (list, serviceContainer) {
				if (_.size(list) === 0) {
					return;
				}
				var params = {ProjectId: projectMainForCOStructureService.getSelected().Id, number: _.size(list)};

				var parastr = '?projectId=' + params.ProjectId + '&number=' + params.number;
				$http.post(globals.webApiBaseUrl + 'controlling/structure/bulkcreate' + parastr, params)
					.then(function (response) {

						var cunitTemplate = response.data.ControllingUnit,
							Ids = response.data.Ids;
						Ids.unshift(cunitTemplate.Id);

						// assign all Ids
						_.merge(list, _.map(Ids, function (id) {
							return {Id: id};
						}));

						function setControllingUnitFk(cunit) {
							_.each(cunit.ControllingUnits, function (child) {
								child.ControllingunitFk = cunit.Id;
								setControllingUnitFk(child);
							});
						}
						_.each(list, setControllingUnitFk);

						controllingStructureDynamicAssignmentsService.setControllingGrpDetailsByAssignments(list);

						// change internal function for bulk generation
						var internalHandleOnCreateSucceeded = serviceContainer.data.handleOnCreateSucceeded;
						serviceContainer.data.handleOnCreateSucceeded = function handleOnCreateSucceededForBulk(newItem, data) {
							platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);
							data.itemList.push(newItem);
							data.markItemAsModified(newItem, data);
						};

						_.each(list, function (unit) {
							var creationData = {parent: _.find(serviceContainer.data.itemList, {Id: unit.ControllingunitFk}) || null},
								newunit = angular.extend({}, cunitTemplate, copySpecificProperties(unit));
							serviceContainer.data.onCreateSucceeded(newunit, serviceContainer.data, creationData);
						});

						// revert: change internal function for bulk generation
						serviceContainer.data.handleOnCreateSucceeded = internalHandleOnCreateSucceeded;

						serviceContainer.service.gridRefresh();
					});
			};

			service.setAndSavePrjCodetemplate = function (ControllingUnitTemplateFk) {
				var project = projectMainForCOStructureService.getSelected();
				// update code template of current project if it differs
				if (project.ControllingUnitTemplateFk !== ControllingUnitTemplateFk) {
					project.ControllingUnitTemplateFk = ControllingUnitTemplateFk;

					$http.post(globals.webApiBaseUrl + 'project/main/save', project)
						.then(function (response) {
							// update project entity (after update needed -> version propery)
							angular.extend(project, response.data);
							projectMainForCOStructureService.fireItemModified(project);

							// show an info message box
							var bodyText = $translate.instant('controlling.structure.generateMsgBoxBodyCodetemplateChanged', {
								projectNo: project.ProjectNo,
								projectName: project.ProjectName
							});
							platformModalService.showMsgBox(bodyText, 'controlling.structure.generateMsgBoxInfoCodetemplateChanged', 'info');
						});
				}
			};

			return service;

		}]);
})();
