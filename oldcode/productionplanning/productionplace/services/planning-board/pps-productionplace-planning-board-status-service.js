(function () {
	'use strict';

	var moduleName = 'productionplanning.productionplace';

	angular.module(moduleName).service('ppsProductionPlacePlanningBoardStatusService', PpsProductionPlacePlanningBoardStatusService);

	PpsProductionPlacePlanningBoardStatusService.$inject = ['_', 'productionplanningCommonProductStatusLookupService'];

	function PpsProductionPlacePlanningBoardStatusService(_, productionplanningCommonProductStatusLookupService) {
		this.getAssignmentStatus = function getAssignmentStatus() {
			return productionplanningCommonProductStatusLookupService.load().then(() => {
				let status = productionplanningCommonProductStatusLookupService.getList();
				return Object.keys(status).map((prop) => {
					let st = status[prop];
					return {
						Id: st.Id,
						Description: st.DescriptionInfo.Translated,
						BackgroundColor: st.BackgroundColor,
						icon: st.Icon,
						isDefault: st.IsDefault,
						isLive: st.IsLive,
						sorting: st.Sorting
					};
				}).sort((a, b) => a.sorting - b.sorting);
			});
		};

		this.getAssignmentStatusIcons = function getAssignmentStatusIcons(states) {
			var statusIcons = [];

			_.forEach(states, function (state) {
				statusIcons.push('ico-status' + _.padStart(state.icon, 2, '0'));
			});

			return statusIcons;
		};
	}
})();
