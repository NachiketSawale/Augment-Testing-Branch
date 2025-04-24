/**
 * Created by anl on 3/12/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	var masterModule = angular.module(moduleName);
	var serviceName = 'activityReservationService';
	masterModule.factory(serviceName, ActivityReservationService);
	ActivityReservationService.$inject = ['resourceReservationPlanningBoardServiceFactory', 'activityResourceService',
		'productionplanningActivityActivityDataService',
		'PlatformMessenger',
		'$http', 'productionplanningCommonResReservationProcessor'];

	function ActivityReservationService(resourceReservationPlanningBoardServiceFactory, activityResourceService,
										activityDataService,
										PlatformMessenger,
										$http, productionplanningCommonResReservationProcessor) {

		var eventIds = {};
		var activityMap = new Map(); //Key: EventId, Value: Activity

		var container = resourceReservationPlanningBoardServiceFactory.createReservationService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.ResourceIdList = activityResourceService.getIdList();
				readData.ModuleName = moduleName; // not really necessary - unevaluated here - just to be kept in mind

			},
			moduleName: moduleName,
			// this service will be overridden with the created instance
			serviceName: serviceName,
			itemName: 'PBResReservation',
			parentService: activityDataService,
			dataProcessor: [{
				processItem: function processItem(item) {
					item.InfoField1 = setInfoField1(item);
					item.InfoField2 = setInfoField2(item);
					item.InfoField3 = setInfoField3(item);
				}
			}, productionplanningCommonResReservationProcessor]
		});

		container.service.fireSelectionChanged = container.data.selectionChanged.fire;

		container.service.statusChanged = new PlatformMessenger();

		container.service.fireStatusChanged = function () {
			container.service.statusChanged.fire();
		};

		function setInfoField1(item) {
			//InfoField1: <Project-Code> - <Project-Name>
			if (_.isNil(item.Requisition.Project)) {
				return '';
			}
			else {
				var prName = _.isNil(item.Requisition.Project.ProjectName) ? '' : item.Requisition.Project.ProjectName;
				var prNumber = item.Requisition.Project.ProjectNo;
				return prNumber + ' - ' + prName;
			}
		}

		function setInfoField2(item) {
			//InfoField2: <Project-Location of the mounting-activity>
			var activity = activityMap.get(item.Requisition.PpsEventFk);
			if (_.isNil(activity) || activity.PrjLocationFk === null) {
				return '';
			}
			var PrjLocationInfo = activity.PrjLocationInfo;
			return PrjLocationInfo.Code + ' - ' + PrjLocationInfo.DescriptionInfo.Translated;
		}

		function setInfoField3(item) {
			//InfoField3: <MNT_ACTIVITY.CODE> - <MNT_ACTIVITY.DESCRIPTION>
			var activity = activityMap.get(item.Requisition.PpsEventFk);
			if (_.isNil(activity)) {
				return '';
			}
			return activity.Code + ' - ' + activity.DescriptionInfo.Translated;
		}

		//data.listLoaded.fire(items);
		container.data.listLoaded.register(function () {
			var list = container.service.getList();
			if (list.length > 0) {
				var requisitions = _.filter(_.map(list, 'Requisition'), function (requisition) {
					return requisition.PpsEventFk !== null;
				});
				eventIds = _.uniq(_.map(requisitions, 'PpsEventFk'));


				// //filter eventIds, remove those are already in activityMap
				// eventIds = _.filter(eventIds, function (eventId) {
				// 	var result = true;
				// 	if (activityMap.size > 0) {
				// 		activityMap.forEach(function (value, key) {
				// 			if (key === eventId) {
				// 				result = false;
				// 			}
				// 		});
				// 	}
				// 	return result;
				// });

				if (eventIds.length > 0) {
					$http.post(globals.webApiBaseUrl + 'productionplanning/activity/activity/getbyresrequisitions',
						eventIds).then(function (response) {
						var dic = response.data;
						activityMap.clear();
						_.forEach(eventIds, function (eventId) {
							//if (_.isNil(activityMap.get(eventId))) {
								activityMap.set(eventId, dic[eventId]);
							//}
						});
					});
				}
			}
		});

		return container.service;
	}
})(angular);