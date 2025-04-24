(function (angular) {
	'use strict';

	var moduleName = 'platform';

	angular.module(moduleName).service('platformPlanningBoardLevelOfDetailService', PlatformPlanningBoardLevelOfDetailService);

	PlatformPlanningBoardLevelOfDetailService.$inject = ['_'];

	function PlatformPlanningBoardLevelOfDetailService(_) {
		const serviceDataMap = new Map();

		var service = {
			isCollected: isCollected,
			getAssignmentCollections: getAssignmentCollections,
			clearAssignmentCollections: clearAssignmentCollections,
			setMapService: setMapService,
		};


		function isCollected(element, diff, assignmentTickStart, panelWidth, service) {
			if (serviceDataMap.get(service)) {
				const currentMapService = serviceDataMap.get(service);
				var assignment = checkAssignmentLevelOfDetail(element, diff, assignmentTickStart, panelWidth, currentMapService);
				if (assignment !== false) {
					var supplier = currentMapService.mappingService.supplier(assignment);
					var collectionStart = assignment.collectionStart.valueOf();

					if (!currentMapService.assignmentCollections.has(supplier + collectionStart)) {
						currentMapService.assignmentCollections.set(supplier + collectionStart, []);
					}
					currentMapService.assignmentCollections.get(supplier + collectionStart).push(element);
					return true;
				} else {
					return false;
				}
			}
			return false;
		}

		function getAssignmentCollections(service) {
			return serviceDataMap.get(service) ? [...serviceDataMap.get(service).assignmentCollections.values()] : {};
		}

		function clearAssignmentCollections(service) {
			if (serviceDataMap.get(service)) {
				serviceDataMap.get(service).assignmentCollections = new Map();
			}
		}

		function setMapService(service) {
			if (!serviceDataMap.get(service)) {
				serviceDataMap.set(service, {
					assignmentCollections: {},
					collectPixelLimit: 15,
					mappingService: service
				});
			}
		}

		// private functions
		function checkAssignmentLevelOfDetail(assignment, calendarDiffSeconds, assignmentTickStart, panelWidth, currentMapService) {
			var onePixelRatio = panelWidth / calendarDiffSeconds;
			var assignmentDuration = (currentMapService.mappingService.to(assignment).toDate().getTime() - currentMapService.mappingService.from(assignment).toDate().getTime()) / 1000;
			var assignmentPixel = assignmentDuration * onePixelRatio;

			if (assignmentPixel < currentMapService.collectPixelLimit || assignment.isVerticallyCollected) {
				assignment.collectionStart = assignmentTickStart; // does not have to be a moment! Moment is causing huge performance issues. Delete everywhere where not neccessary!
				return assignment;
			} else {
				return false;
			}
		}

		return service;
	}
})(angular);