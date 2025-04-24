/* eslint-disable func-names */
/**
 * Created by anl on 7/1/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemSplitConfigurationService', ConfigService);

	ConfigService.$inject = [
		'$http', '$q', '_',
		'productionplanningItemSplitUIService',
		'platformTranslateService',
		'productionplanningItemSplitLocationAssignService',
		'basicsLookupdataLookupFilterService',
		'platformRuntimeDataService',
		'PlatformMessenger',
		'platformDateshiftCalendarService'];

	function ConfigService(
		$http, $q, _,
		itemSplitUIService,
		platformTranslateService,
		itemSplitLocationAssignService,
		basicsLookupdataLookupFilterService,
		platformRuntimeDataService,
		PlatformMessenger,
		platformDateshiftCalendarService) {

		var service = {};
		var scope = {};
		var config = {};
		var firstTime = true;

		service.eventTypesFrom = [];
		service.eventTypesTo = [];
		service.eventTypes = [];

		service.init = function ($scope) {
			scope = $scope;

			service.eventTypes = service.eventTypesFrom = service.eventTypesTo = scope.context.eventTypes;
			var formConfig = itemSplitUIService.getConfigurationFormUI();

			initForm(formConfig.rows, scope.context.splitMode);

			scope.formOptions = {
				configure: platformTranslateService.translateFormConfig(formConfig)
			};
			scope.formOptions.entity = {
				Id: 1,
				SplitFactor: 2,
				SplitFrom: scope.context.fromTo ? scope.context.fromTo.SplitFrom : null,
				SplitTo: scope.context.fromTo ? scope.context.fromTo.SplitTo : null,
				IntervalDay: 0,
				ChildItem: scope.context.splitMode,
				Updated: true
			};
			scope.context.config = scope.formOptions.entity;
			firstTime = false;
		};

		service.getModule = function () {//for validation
			return 'productionplanningItemSplitLocationAssignService';
		};

		service.isValid = function () {
			if (!scope.isBusy && !firstTime && angular.isDefined(scope.formOptions.entity)) {
				if (!scope.formOptions.entity.ChildItem) {
					return scope.formOptions.entity.SplitFactor >= 1;
				} else {
					return scope.formOptions.entity.SplitFactor >= 1 &&
						scope.formOptions.entity.SplitFrom > 0 && scope.formOptions.entity.SplitTo > 0;
				}
			}
		};

		service.unActive = function () {
			//set config
			if (scope.isNew || !validateConfig(config, scope.context.config)) {
				scope.isNew = false;
				config = angular.copy(scope.context.config);
				scope.context.config.Updated = true;

				var postData = {parentItem: scope.context.parentItem, config: scope.context.config};
				scope.isBusy = true;
				return $http.post(globals.webApiBaseUrl + 'productionplanning/item/splitItem?split=' + scope.context.splitMode, postData).then(function (response) {

					//future implementation!
					//var calendarIdList = _.map(response.data.allEvents, 'CalCalendarFk');
					return platformDateshiftCalendarService.getCalendarsByIds([response.data.ProjectCalendarId]).then(function(calendarData) {
						response.data.CalendarData = calendarData;
						itemSplitLocationAssignService.initCache(scope.context.parentItem, scope.context.config, response);
						scope.isBusy = false;
					});
				});
			}

			var defer = $q.defer();
			defer.resolve(true);
			return defer.promise;
		};

		service.active = function () {
		};

		service.getResult = function () {
		};

		var filters = [
			{
				key: 'pps-itemsplit-eventtype-from-filter',
				fn: function (eventType) {
					return _.find(service.eventTypesFrom, {Id: eventType.Id});
				}
			},
			{
				key: 'pps-itemsplit-eventtype-to-filter',
				fn: function (eventType) {
					return _.find(service.eventTypesTo, {Id: eventType.Id});
				}
			}];

		service.updateSplitFromTo = new PlatformMessenger();

		service.registerFilters = function () {
			basicsLookupdataLookupFilterService.registerFilter(filters);
			service.updateSplitFromTo.register(updateFromTo);
		};

		service.unregisterFilters = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};

		function updateFromTo(entity, field) {
			var pushEventType = false;
			switch (field) {
				case 'SplitFrom':
					var spilitTos = [];

					_.forEach(service.eventTypes, function (eventType) {
						if (eventType.Id === entity.SplitFrom) {
							pushEventType = true;
							spilitTos.push(eventType);
						}
						if (pushEventType) {
							spilitTos.push(eventType);
						}
					});
					service.eventTypesTo = spilitTos;
					break;

				case 'SplitTo':
					var spilitFroms = [];
					pushEventType = true;

					_.forEach(service.eventTypes, function (eventType) {
						if (eventType.Id === entity.SplitTo) {
							spilitFroms.push(eventType);
							pushEventType = false;
						}
						if (pushEventType) {
							spilitFroms.push(eventType);
						}
					});
					service.eventTypesFrom = spilitFroms;
					break;
				default:
					return;
			}
		}

		function validateConfig(contextConfig, entity) {
			return contextConfig.SplitFactor === entity.SplitFactor &&
				contextConfig.SplitFrom === entity.SplitFrom &&
				contextConfig.SplitTo === entity.SplitTo &&
				contextConfig.IntervalDay === entity.IntervalDay &&
				contextConfig.ChildItem === entity.ChildItem;
		}

		function initForm(rows, splitMode) {
			if (!splitMode) {
				rows.filter(function (row) {
					return row.model === 'SplitFactor';
				}).forEach(function (row) {
					row.label = '*Number of Copies';
					row.label$tr$ = 'productionplanning.item.wizard.itemSplit.copyNumber';
				});

				rows.filter(function (row) {
					return row.model !== 'SplitFactor' && row.model !== 'IntervalDay';
				}).forEach(function (row) {
					row.visible = false;
				});
			}
		}

		return service;
	}
})(angular);