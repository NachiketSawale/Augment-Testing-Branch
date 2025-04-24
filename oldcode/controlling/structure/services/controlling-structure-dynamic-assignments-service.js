/**
 * Created by janas on 06.03.2018.
 */

(function () {
	'use strict';

	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureDynamicAssignmentsService
	 * @function
	 *
	 * @description
	 * controllingStructureDynamicAssignmentsService contains logic for dynamic assignments based on customized data
	 */
	controllingStructureModule.factory('controllingStructureDynamicAssignmentsService', ['_', 'controllingStructureContextService', 'basicsLookupdataConfigGenerator', 'controllingStructureLookupService', 'controllingGroupDetailLookupDataService', 'platformSchemaService',
		function (_, controllingStructureContextService, basicsLookupdataConfigGenerator, controllingStructureLookupService, controllingGroupDetailLookupDataService, platformSchemaService) {

			var service = {};

			service.getCurrentAssignment = function getCurrentAssignment() {
				var assignmentData = controllingStructureLookupService.getControllingUnitAssignments();

				// filter for context, see also controlling unit context
				var currentMasterDataContext = controllingStructureContextService.getMdcContextFk();
				var assignment = _.first(_.filter(assignmentData, {ContextFk: currentMasterDataContext}));

				return assignment;
			};

			service.getAssignment2Label = function getAssignment2Label() {
				var assignment2Label = {};
				var assignment = service.getCurrentAssignment();
				// found a assignment?
				if (assignment) {
					var groups = controllingStructureLookupService.getControllingUnitGroups();
					// [1, 2, ..., 10]
					_.each(_.range(1, 11), function (no) {
						var controllinggroupFk = assignment['Controllinggroup' + no + 'Fk'];
						var groupDesc = _.get(_.find(groups, {Id: controllinggroupFk}), 'DescriptionInfo.Translated');

						if (_.isString(groupDesc) && _.size(groupDesc) > 0) {
							assignment2Label['Assignment' + _.padStart(no, 2, '0') + 'Name'] = groupDesc;
						}
					});
				}

				return assignment2Label;
			};

			service.setAssignmentLabels = function setAssignmentLabels(rows) {
				var assignment2Label = service.getAssignment2Label();
				var assignmentRows = _.filter(rows, {gid: 'assignments'});
				_.each(assignmentRows, function (row) {
					var name = assignment2Label[row.model + 'Name'];
					if (_.isString(name)) {
						row.label = name;
					}
				});
			};

			service.setAssignmentColumnNames = function setAssignmentColumnNames(columns) {
				var assignment2Label = service.getAssignment2Label();
				var assignmentCols = _.filter(columns, function (col) {
					return _.includes(col.field, 'Assignment');
				});
				_.each(assignmentCols, function (col) {
					var name = assignment2Label[col.field + 'Name'];
					if (_.isString(name)) {
						if ((_.includes(col.id, 'description') || _.includes(col.id, 'commenttext')) && _.includes(col.name, '-')) {
							// "Assignment-Description" => e.g. "Regions-Description"
							col.name = [name].concat(_.drop(_.split(col.name, '-'))).join('-');
						} else {
							col.name = name;
						}
						delete col.name$tr$;
						delete col.name$tr$param$;
					}
				});
			};

			service.validateAssignment = function validateAssignment(assignmentField, newValue, curUnit) {
				var assignment = service.getCurrentAssignment();
				if (assignment) {
					const assignmentNo = parseInt(assignmentField.slice(-2));
					const result = getLookupDataByField(null, newValue, assignmentField);

					const controllingGrpDetailField = 'ControllingGrpDetail' + _.padStart(assignmentNo, 2, '0') + 'Fk';
					// it's not a lookup value
					if (angular.isUndefined(result)) {
						// ... so the fk should be reset to null
						curUnit[controllingGrpDetailField] = null;
					} else if (_.has(result, 'Id')) {
						// set the fk (for bulk editor will not be set by the event handler)
						curUnit[controllingGrpDetailField] = result.Id;
					}
				}

				return true;
			};

			service.setControllingGrpDetailsByAssignments = function setControllingGrpDetailsByAssignments(controllingUnits) {
				var assignment = service.getCurrentAssignment();
				if (assignment) {
					var groupDetails = controllingGroupDetailLookupDataService.getListSync({lookupType: 'controllingGroupDetailLookupDataService'});

					_.each(controllingUnits, function (unit) {
						// [1, 2, ..., 10], i.e. for each Assignment01..10 and ControllingGrpDetail01..10
						_.each(_.range(1, 11), function (no) {
							no = _.padStart(no, 2, '0'); // "1" -> "01"
							var controllingGrpDetailFk = unit['ControllingGrpDetail' + no + 'Fk'];
							var assignment = unit['Assignment' + no];
							// if not set yet, we check if for assignment
							// there is a group detail data record
							if (!_.isNumber(controllingGrpDetailFk) && _.isString(assignment) && !_.isEmpty(assignment)) {
								// TODO: add cache for code -> id (group detail)
								var controllingGrpDetailId = _.get(_.find(groupDetails, {Code: assignment}), 'Id');
								if (controllingGrpDetailId) {
									unit['ControllingGrpDetail' + no + 'Fk'] = controllingGrpDetailId;
								}
							}
						});
					});
				}
			};

			function getLookupDataByField(item, value, field){
				const assignment = service.getCurrentAssignment();
				let controllingGroupDetail = null;
				if (assignment) {
					const assignmentNo = parseInt(field.slice(-2));
					const controllingGroupFk = assignment['Controllinggroup' + assignmentNo + 'Fk'];

					let detailField = 'ControllingGrpDetail' + _.padStart(assignmentNo, 2, '0') + 'Fk';

					if(item && _.isInteger(item[detailField]) && item[detailField] > 0) {
						value = item[detailField];
					}

					let filter;
					if(_.isInteger(value)) {
						filter = {
							Id: value
						};
					}else{
						filter = {
							Code: value
						};
					}

					controllingGroupDetail = _.find(controllingStructureLookupService.getControllingUnitDetails(controllingGroupFk), filter);
				}

				return controllingGroupDetail;
			}

			service.onCellChangeCallBack = function(item, field){
				const assignmentGroupDetail = getLookupDataByField(item, item[field], field);

				if(assignmentGroupDetail){
					item[field] = assignmentGroupDetail.Code;
				}
			}

			service.setAssignmentOverloads = function setAssignmentOverloads(assignmentAttributes, overloads) {
				var assignment = service.getCurrentAssignment();
				// found a assignment?
				if (assignment) {
					_.each(assignmentAttributes, function (attribute) {
						var assignmentNo = parseInt(attribute.slice(-2));
						var controllingGroupFk = assignment['Controllinggroup' + assignmentNo + 'Fk'];

						if (controllingGroupFk !== null) {
							const confObj = {
								dataServiceName: 'controllingGroupDetailLookupDataService',
								filter: function (/* item */) {
									return controllingGroupFk || null;
								},
								enableCache: true,
								isTextEditable: true,
								events: [{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										const selectedItem = args.entity;
										const selectedLookupItem = args.selectedItem;

										const field = 'ControllingGrpDetail' + _.padStart(assignmentNo, 2, '0') + 'Fk';
										if (selectedLookupItem && selectedItem) {
											selectedItem[field] = selectedLookupItem.Id;
										}else {
											selectedItem[field] = null;
										}
									}
								}],
								columns: [
									{
										id: 'Code',
										field: 'Code',
										name: 'Code',
										formatter: 'code',
										name$tr$: 'cloud.common.entityCode'
									},
									{
										id: 'Description',
										field: 'DescriptionInfo',
										name: 'Description',
										formatter: 'translation',
										name$tr$: 'cloud.common.entityDescription'
									},
									{
										id: 'CommentText',
										field: 'CommentText',
										name: 'Comment',
										formatter: 'description',
										name$tr$: 'cloud.common.entityCommentText'
									}
								]
							};

							const addTo = {
								formatter: function(row, cell, value, m, item) {
									var lookupResult = getLookupDataByField(item, value, m.field);

									if (m.id && lookupResult) {
										if (m.id.toLowerCase().match('description')) {
											return lookupResult.DescriptionInfo.Translated;
										}
										else if(m.id.toLowerCase().match('commenttext')) {
											return lookupResult.CommentText;
										}
										else if(m.id.toLowerCase().match('code')){
											return lookupResult.Code;
										}
									}

									return value;
								}
							};

							const config = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(confObj, addTo);

							// to fix format defect, delete this field according to "formatterValue" function in platform-grid-domain-service.js.
							config.grid.formatterOptions.displayMember = null;

							overloads[attribute] = config;
						}
						else {
							// TODO: for controlling unit templates refactoring needed (=> ControltemplateUnitDto)
							var domain = platformSchemaService.getSchemaFromCache({
								typeName: 'ControllingUnitDto',
								moduleSubModule: 'Controlling.Structure'
							});
							if (domain.properties['Assignment' + attribute.slice(-2)]) {
								var maxlen = domain.properties['Assignment' + attribute.slice(-2)].maxlen || 32;
								overloads[attribute] = {
									grid: { maxLength: maxlen },
									detail: { maxLength: maxlen }
								};
							}
						}
					});
				}
			};

			return service;
		}]);
})();
