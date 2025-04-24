(function () {
	'use strict';

	var moduleName = 'productionplanning.productionplace';

	angular.module(moduleName).service('ppsProductionPlacePlanningBoardSupplierMappingService', MappingService);

	MappingService.$inject = [];

	function MappingService() {
		// id for referencing this entity DTO by assignment (and demand)
		this.id = function (place) {
			return place.BasSiteFk;
		};

		// acutal id property of the entity
		this.actualId = function (place) {
			return place.Id;
		};

		this.validateWith = function () {
			return [];
		};

		this.calendar = (supplier, calendarId) => {
			let result = 0;

			if (calendarId) {
				supplier.CalCalendarFk = calendarId;
			}

			result = supplier.CalCalendarFk;
			return result;
		};
	}
})();
