/**
 * Created by mik on 09/07/2020.
 */

(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemMultishiftWizardConfigService', ConfigService);

	ConfigService.$inject = ['_', 'moment', '$translate', '$http','$injector','$timeout',
		'platformLayoutHelperService',
		'basicsLookupdataConfigGenerator',
		'productionplanningItemMultishiftDataService',
		'platformRuntimeDataService',
		'ppsVirtualDataServiceFactory','platformGridAPI',
		'platformDateshiftCalendarService', 'platformDateshiftHelperService'];

	function ConfigService(_, moment, $translate, $http, $injector,$timeout,
						   platformLayoutHelperService,
						   basicsLookupdataConfigGenerator,
						   productionplanningItemMultishiftDataService,
						   platformRuntimeDataService,
						        ppsVirtualDataServiceFactory,platformGridAPI,
		platformDateshiftCalendarService, platformDateshiftHelperService) {
		let service = this;

		let vdsService = ppsVirtualDataServiceFactory.getVirtualDataService('productionplanning.common');
		service.multiShiftGridId = '60882534a3a54ea09d80e5d7de396418';
		service.projectLocationGridId = '86de471e296f4b158013ab88ffbe853a';
		service.resultGridId = '17e8352cf06d4b56beb667365dc9a526';

		service.wzConfig = {
			title: $translate.instant('productionplanning.item.wizard.multishift.dialogTitle'),
			steps: [{
				id: 'shiftDistance',
				title: $translate.instant('productionplanning.item.wizard.multishift.setShiftDistance'),
				disallowNext: true,
				watches: [{
					expression: 'shiftDays',
					fn: function (info) {
						_.find(info.wizard.steps, {id: 'shiftDistance'}).disallowNext = checkDisallowNext('shiftDays', info.newValue);// info.newValue <= 0;
					}
				},{
					expression: 'selectedType',
					fn: function (info) {
						productionplanningItemMultishiftDataService.lastSelectType = info.newValue;
						_.find(info.wizard.steps, {id: 'shiftDistance'}).disallowNext = checkDisallowNext('selectedType', info.newValue);// info.newValue === undefined;
					}
				}]
			}, {
				id: 'loading',
				title: $translate.instant('productionplanning.item.wizard.multishift.loading'),
				canFinish: false,
				disallowNext: true,
				loadingMessage: $translate.instant('productionplanning.item.wizard.multishift.calculating'),
				prepareStep: function (info){
					info.step.canFinish = false;
					info.step.disallowNext = info.step.disallowBack = true;

					const flattenSelectedGrid = productionplanningItemMultishiftDataService.getSelectedItems(service.multiShiftGridId, true);
					// back to first step
					if (info.previousStepIndex === 2) {
						return $timeout(function () {
							vdsService.removeVirtualEntities(productionplanningItemMultishiftDataService.additionalEvents);
							vdsService.removeRelations(productionplanningItemMultishiftDataService.additionalRelations);
							// set original events
							productionplanningItemMultishiftDataService.setOriginalEvents();
							platformDateshiftHelperService.resetDateshift(vdsService.getServiceName());
							_.forEach(flattenSelectedGrid, (item) =>{
								delete item.PlannedStartShifted;
								delete item.PlannedFinishShifted;
							});
							info.step.disallowNext = info.step.disallowBack = false;
							info.commands.goToPrevious();
						});
					}

					return $http.post(globals.webApiBaseUrl + 'productionplanning/item/prepareMultishift', _.map(flattenSelectedGrid, 'Id')).then(function (reponse){
						return  platformDateshiftCalendarService.getCalendarsByIds([reponse.data.projectCalendarId]).then(function(calendarData){
							productionplanningItemMultishiftDataService.setData(reponse.data.eventList, reponse.data.relationList, calendarData);

							let vdsService = ppsVirtualDataServiceFactory.getVirtualDataService('productionplanning.common');
							let realEventEntities = _.filter(productionplanningItemMultishiftDataService.getList(), (e) => { return _.isNil(e.MultishiftType); });
							const mainItemIds = _.map(realEventEntities, 'Id');
							const dateshiftFilter = {
								mainItemIds,
								entity: 'Event',
								foreignKey: 'Id'
							};
							vdsService.loadVirtualEntities(dateshiftFilter).then(() => {

								// region Prepare Shift Data

								var triggerEvents = _.cloneDeep(_.filter(productionplanningItemMultishiftDataService.getList(), (e) => {
									return !_.isNil(e.MultishiftType);
								}));

								productionplanningItemMultishiftDataService.additionalEvents = {Event: productionplanningItemMultishiftDataService.getList()};
								vdsService.addVirtualEntities(productionplanningItemMultishiftDataService.additionalEvents);


								let additionalEventIds = _.map(triggerEvents, 'Id');
								productionplanningItemMultishiftDataService.additionalRelations = _.cloneDeep(_.filter(productionplanningItemMultishiftDataService.getRelations(), (r) => {
									return _.includes(additionalEventIds, r.PredecessorFk) || _.includes(additionalEventIds, r.SuccessorFk);
								}));
								_.forEach(productionplanningItemMultishiftDataService.additionalRelations, (r) => {
									r.PredecessorFk = `E${r.PredecessorFk}`;
									r.SuccessorFk = `E${r.SuccessorFk}`;
								});
								vdsService.addRelations(productionplanningItemMultishiftDataService.additionalRelations);
								platformDateshiftHelperService.resetDateshift(vdsService.getServiceName());
								// endregion

								// shift events
								shiftDays(info.model.selectedType, info.model.shiftDays);

								info.model.tolerance = _.isNil(info.model.tolerance)? 2 : info.model.tolerance;
								resetIndicator(info.model);

								info.step.disallowNext = info.step.disallowBack = false;
								info.commands.goToNext();
							});
						});

					});
				},
			}, {
				id: 'shiftResult',
				title: $translate.instant('productionplanning.item.wizard.multishift.confirmResult'),
				canFinish: true,
				disallowNext: true
			}],
			onChangeStep: function (info) {
				resizeAllGrids();
			}
		};

		function resetIndicator(infoModel){
			const flattenSelectedGrid = productionplanningItemMultishiftDataService.getSelectedItems(service.multiShiftGridId, true);
			let eventsFromSelectedItem = productionplanningItemMultishiftDataService.getEventsFromSelectedItems(service.multiShiftGridId);
			let shiftedEntities = vdsService.findVirtualEntities(eventsFromSelectedItem, 'Event');

			_.forEach(shiftedEntities, function (shiftedEvent) {
				_.forEach(flattenSelectedGrid, function (event) {
					if (event.OriginalId === shiftedEvent.Id) {
						event.PlannedStartShifted = moment(shiftedEvent.PlannedStart);
						event.PlannedFinishShifted = moment(shiftedEvent.PlannedFinish);
						let startDiff = Math.abs(moment(event.PlannedStartShifted).diff(moment(event.PlannedStart).add(infoModel.shiftDays, 'days'), 'days'));
						let endDiff = Math.abs(moment(event.PlannedFinishShifted).diff(moment(event.PlannedFinish).add(infoModel.shiftDays, 'days'), 'days'));
						if (startDiff > infoModel.tolerance) {
							platformRuntimeDataService.colorInfo(event, 'PlannedStartShifted', 'bg-orange-4');
							event.indicatorStartShifted = 'orange';
						} else {
							platformRuntimeDataService.colorInfo(event, 'PlannedStartShifted', 'bg-green-4');
							event.indicatorStartShifted = 'green';
						}
						if (endDiff > infoModel.tolerance) {
							platformRuntimeDataService.colorInfo(event, 'PlannedFinishShifted', 'bg-orange-4');
							event.indicatorFinishShifted = 'orange';
						} else {
							platformRuntimeDataService.colorInfo(event, 'PlannedFinishShifted', 'bg-green-4');
							event.indicatorFinishShifted = 'green';
						}
					}
				});
			});

			const parentNodes = _.filter(flattenSelectedGrid, (item) => {
				return item.Id.indexOf('E') < 0;
			});

			_.forEach(parentNodes, (parentNode) => {
				const childrenNodes = _.filter(flattenSelectedGrid, (child) => {
					return _.includes(child.Id, parentNode.Id) && child.Id.indexOf('E') > -1;
				});
				if(childrenNodes.length > 0){
					parentNode.PlannedStartShifted = parentNode.PlannedStartShifted || _.minBy(childrenNodes, 'PlannedStartShifted').PlannedStartShifted;
					parentNode.PlannedFinishShifted = parentNode.PlannedFinishShifted || _.maxBy(childrenNodes, 'PlannedFinishShifted').PlannedFinishShifted;
					var orangeStartShifted = _.find(childrenNodes, (child) => {
						return child.indicatorStartShifted === 'orange';
					});
					var orangeFinishChild = _.find(childrenNodes, (child) => {
						return child.indicatorFinishShifted === 'orange';
					});
					if(orangeStartShifted){
						platformRuntimeDataService.colorInfo(parentNode, 'PlannedStartShifted', 'bg-orange-4');
					} else {
						platformRuntimeDataService.colorInfo(parentNode, 'PlannedStartShifted', 'bg-green-4');
					}
					if(orangeFinishChild){
						platformRuntimeDataService.colorInfo(parentNode, 'PlannedFinishShifted', 'bg-orange-4');
					} else {
						platformRuntimeDataService.colorInfo(parentNode, 'PlannedFinishShifted', 'bg-green-4');
					}
				}
			});
		}

		function resizeAllGrids(){
			setTimeout(function () {
				platformGridAPI.grids.resize(service.resultGridId);
				platformGridAPI.grids.refresh(service.resultGridId);
				platformGridAPI.grids.resize(service.multiShiftGridId);
				platformGridAPI.grids.resize(service.projectLocationGridId);
			}, 200);
		}

		let disallowNextShiftDays = true;
		function checkDisallowNext(type, value) {
			switch (type) {
				case 'shiftDays':
					disallowNextShiftDays = !(_.isNumber(value) && value !== 0);
					break;
			}
			return !(!disallowNextShiftDays);
		}

		function shiftDays(shiftType, days) {
			let triggerEvents = _.cloneDeep(productionplanningItemMultishiftDataService.getTriggerEventsByMultishiftType(shiftType, service.multiShiftGridId));

			// add time to trigger events
			_.forEach(triggerEvents, (triggerEvent) => {
				triggerEvent.PlannedStart = moment.utc(triggerEvent.PlannedStart).add(days, 'days');
				triggerEvent.PlannedFinish = moment.utc(triggerEvent.PlannedFinish).add(days, 'days');
				// Shift data
				vdsService.shiftVirtualEntity(triggerEvent, 'Event');
			});
		}

		service.CommonColumns = [{
			id: 'Code',
			field: 'Code',
			name: 'Code',
			formatter: 'code',
			width: 100,
			name$tr$: 'cloud.common.entityCode'
		}, {
			id: 'Description',
			field: 'DescriptionInfo.Description',
			name: 'Description',
			formatter: 'description',
			width: 200,
			name$tr$: 'cloud.common.entityDescription'
		}, {
			id: 'engdrawingfk',
			field: 'Drawing.Code',
			name: 'Drawing',
			name$tr$: 'productionplanning.producttemplate.entityEngDrawingFk',
			formatter: 'code',
			width: 50,
			readonly: true,
			sortOrder: 4
		}, {
			id: 'prjlocationfk',
			field: 'PrjLocationFk',
			name: '*Location',
			name$tr$: 'productionplanning.common.prjLocationFk',
			formatter: 'lookup',
			formatterOptions: {
				lookupType: 'ProjectLocation',
				displayMember: 'Code'
			}
		}, {
			id: 'branchpath',
			field: 'PrjLocationFk',
			name: '*Location Full Description',
			name$tr$: 'productionplanning.common.branchPath',
			formatter: 'select',
			formatterOptions: {
				serviceName: 'productionplanningCommonLocationInfoService',
				valueMember: 'Id',
				displayMember: 'BranchPath'
			},
			readonly: true
		},
			{
			id: 'Locked',
			field: 'IsLocked',
			name: 'Locked',
			formatter: 'boolean',
			width: 50,
			name$tr$: 'productionplanning.common.event.isLocked'
		}, {
			id: 'plannedStart',
			name: 'Planned Start',
			name$tr$: 'productionplanning.common.event.plannedStart',
			formatter: 'datetimeutc',
			field: 'PlannedStart',
			sortOrder: 5
		}, {
			id: 'plannedFinish',
			name: 'Planned Finish',
			name$tr$: 'productionplanning.common.event.plannedFinish',
			formatter: 'datetimeutc',
			field: 'PlannedFinish',
			sortOrder: 6
		}];

		service.formOptions = {
			fid: 'multishift',
			version: '1.0.0',
			showGrouping: false,
			skipPermissionsCheck: true,
			groups: [{
				gid: 'default'
			}],
			rows: [
				{
					gid: 'default',
					rid: 'shiftDays',
					type: 'integer',
					model: 'shiftDays',
					placeholder: $translate.instant('productionplanning.item.wizard.multishift.daysToShift'),
					label: $translate.instant('productionplanning.item.wizard.multishift.shiftDays'),
					visible: true,
					sortOrder: 4
				}, {
					gid: 'default',
					rid: 'selectedType',
					label: $translate.instant('productionplanning.item.wizard.multishift.type'),
					type: 'select',
					model: 'selectedType',
					sortOrder: 5,
					options: {
						displayMember: 'Description',
						valueMember: 'Value',
						items: [
							{
								Id: 1,
								Description: $translate.instant('productionplanning.item.wizard.multishift.push'),
								Value: 'Push'
							},
							{
								Id: 2,
								Description: $translate.instant('productionplanning.item.wizard.multishift.pull'),
								Value: 'Pull'
							}
						]
					}
				}]
		};

		service.resultFormOptions = {
			fid: 'multishiftresult',
			version: '1.0.0',
			showGrouping: false,
			skipPermissionsCheck: true,
			groups: [{
			gid: 'default'
			}],
			rows: [{
				gid: 'default',
				rid: 'tolerance',
				type: 'integer',
				model: 'tolerance',
				placeholder: $translate.instant('productionplanning.item.wizard.multishift.toleranceInDays'),
				label: $translate.instant('productionplanning.item.wizard.multishift.tolerance'),
				visible: true,
				sortOrder: 1,
				change: function (entity, model, row){
					resetIndicator(entity);
					platformGridAPI.grids.refresh(service.resultGridId);
				}
			}]
		};

		return service;
	}
})(angular);
