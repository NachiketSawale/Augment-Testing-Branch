/**
 * Created by zwz on 9/24/2019.
 */

(function (angular) {
	'use strict';
	/* globals moment*/
	var moduleName = 'productionplanning.common';
	/**
	 * @ngdoc service
	 * @name productionplanningCommonDerivedEventEntityPropertychangedExtension
	 * @function
	 * @requires
	 *
	 * @description
	 * productionplanningCommonDerivedEventEntityPropertychangedExtension provides entity property-changed functionality for derived-event(activity/engtask/route/productionset) data service
	 *
	 */
	angular.module(moduleName).service('productionplanningCommonDerivedEventEntityPropertychangedExtension', Extension);

	Extension.$inject = ['$http'];

	function Extension($http) {
		this.onEventTypeFkChanged = function (entity, field, dataService, validationService, rubricId) {
			if (entity.Version === 0 && !_.isNil(entity.EventTypeFk)) {
				if(_.isNil(rubricId)){
					rubricId = 0;
				}
				$http.get(globals.webApiBaseUrl + 'productionplanning/common/event/getderivedeventbyeventtype?eventTypeId=' + entity.EventTypeFk + '&&rubricId=' + rubricId).then(function (respond) {
					if (respond.data !== '') {
						var derivedEvent = respond.data;
						if(!_.isEmpty(derivedEvent.Code)){
							entity.Code = derivedEvent.Code;
						}
						entity.PlannedStart = derivedEvent.PlannedStart? moment.utc(derivedEvent.PlannedStart) : derivedEvent.PlannedStart;
						entity.PlannedFinish = derivedEvent.PlannedFinish? moment.utc(derivedEvent.PlannedFinish) : derivedEvent.PlannedFinish;
						entity.EarliestStart = derivedEvent.EarliestStart? moment.utc(derivedEvent.EarliestStart) : derivedEvent.EarliestStart;
						entity.EarliestFinish = derivedEvent.EarliestFinish? moment.utc(derivedEvent.EarliestFinish) : derivedEvent.EarliestFinish;
						entity.LatestStart = derivedEvent.LatestStart? moment.utc(derivedEvent.LatestStart) : derivedEvent.LatestStart;
						entity.LatestFinish = derivedEvent.LatestFinish? moment.utc(derivedEvent.LatestFinish) : derivedEvent.LatestFinish;

						entity.DateshiftMode = derivedEvent.DateshiftMode;
						if(validationService.validateEntity){
							validationService.validateEntity(entity);
						}
						dataService.markItemAsModified(entity);
					}
				});
			}
		};

	}
})(angular);