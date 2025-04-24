(function () {

	'use strict';

	angular.module('platform').service('platformPlanningBoardCollisionService', PlatformPlanningBoardCollisionService);

	PlatformPlanningBoardCollisionService.$inject = [];

	function PlatformPlanningBoardCollisionService() {

		const TAG_COMPONENT_HEIGHT = 10; // add from constants

		var self = this;

		var serviceDataMap = new Map();

		self.clearAll = function (service) {
			if (serviceDataMap.get(service)) {
				serviceDataMap.get(service).items = new Map();
				serviceDataMap.get(service).collisionMaxHeight = 0;
				serviceDataMap.get(service).collisionFixedAssignmentNumber = 0;
				serviceDataMap.get(service).collisionId = 0;
			}
		};

		self.setMapService = function (service) {
			if (!serviceDataMap.get(service)) {
				serviceDataMap.set(service, {
					items: new Map(),
					collisionMaxHeight: 0,
					collisionId: 0,
					collisionFixedAssignmentNumber: 0,
					collisionUseFixedAssignmentHeight: false,

					mappingService: service
				});
			}
		};

		self.setMaxHeight = function (mh, service) {
			if (serviceDataMap.get(service)) {
				serviceDataMap.get(service).collisionMaxHeight = mh;
			}
		};

		self.setAssignmentsNumberInRow = (count, service) => {
			if (serviceDataMap.get(service)) {
				serviceDataMap.get(service).collisionFixedAssignmentNumber = count;
			}
		};

		self.setUseFixedAssignmentHeight = (height, service) => {
			if (serviceDataMap.get(service)) {
				serviceDataMap.get(service).collisionUseFixedAssignmentHeight = height;
			}
		};

		function getCurrentMapService(service) {
			return serviceDataMap.get(service) ? serviceDataMap.get(service) : false;
		}

		self.setDefaultItemValues = (group, service) => {
			const currentMapService = getCurrentMapService(service);
			if (currentMapService) {
				group.filter(item => {
					item.scale = 1; // decimal factor, public, accessed in planning board components
					item.isVerticallyCollected = false; // public, accessed by other services
					item.collisionId = 0; // used to detect items in the same collisionFixedAssignmentNumber, public, used in tag items
					item.top = 0; // public, used in tag component and in assignment items component
					item.collisions = []; // public, used in tag component

					// TODO make those fields private - create object with meta data
					item._assignmentHeight = 0;
					item._rowId = 0;
					item._start = currentMapService.mappingService.from(item).toDate().getTime();
					item._end = currentMapService.mappingService.to(item).toDate().getTime();
					item._scalabelCollisionsCount = 1;
				});
			}
		}

		// #region new collision implementation

		self.addItems = (group, service) => {
			const currentMapService = getCurrentMapService(service);
			if (currentMapService) {
				calculateCollisions(group);
				calculateScalableCollisionsCount(group, currentMapService);

				group.forEach((item) => {
					updateMinScaleAndRow(item, currentMapService);
				});

				// correct the scale and row id after inital calculation
				group.forEach((item) => {
					if (item.scale === 1 && item.collisions.length > 1) {
						let collisionsOfCollisions = getDistinctArray(item.collisions.flatMap(x => x.collisions));
						item.scale = getMin(getDistinctArray(collisionsOfCollisions.map(x => x.scale)));
					}

					if (!currentMapService.items.has(item.Id)) {
						const intArray = [...Array(item.collisions.length).keys()];
						item._rowId = intArray.find(x => !item.collisions.filter(x => x.Id !== item.Id).map(y => y._rowId).includes(x));
					}
				});

				group.filter(item => {
					if (currentMapService.collisionUseFixedAssignmentHeight && item._rowId >= currentMapService.collisionFixedAssignmentNumber) {
						item.isVerticallyCollected = true;
					} else {
						updateHeight(item, currentMapService);
						updateTop(item, item._rowId);
					}

					// convert array of items to an array of ids of items - avoiding circural references!
					if (item.collisions.length > 0) {
						item.collisions = item.collisions.map((collision) => {
							return currentMapService.mappingService.id(collision) ? currentMapService.mappingService.id(collision) : -1;
						});
					} else {
						item.collisions = [];
					}
				});
			}
		};

		function calculateCollisions(group) {
			group.forEach(i => {
				i.collisions.push(i);
				group.forEach(item => {
					if (i.Id !== item.Id && areColliding(item, i)) {
						i.collisions.push(item);
						item.collisions.push(i);
					}
				});
			});

			group.filter(item => {
				item.collisions = [...new Map(item.collisions.map(x => [x.Id, x])).values()];
			});
		}

		function calculateScalableCollisionsCount(group, currentMapService) {
			if (!currentMapService.collisionUseFixedAssignmentHeight) {
				const unevenlyColliding = group.filter(item => getMax(item.collisions.map(x => x.collisions.length)) !== getMin(item.collisions.map(x => x.collisions.length)));
				unevenlyColliding.forEach(item => {
					item._scalabelCollisionsCount = getMin(item.collisions.map(x => x.collisions.length));
					item.collisions.forEach(col => col._scalabelCollisionsCount = item._scalabelCollisionsCount);
				});
			} else {
				group.forEach(item => item._scalabelCollisionsCount = currentMapService.collisionFixedAssignmentNumber + 1);
			}

		}

		function calculateScale(basis, collisionCount, currentMapService) {
			const maxAssignmentsInRow = currentMapService.collisionMaxHeight / TAG_COMPONENT_HEIGHT;
			let visibleColCount = maxAssignmentsInRow < collisionCount ? maxAssignmentsInRow : collisionCount;
			return basis / visibleColCount;
		}


		// #endregion

		/* item functions */

		function areColliding(i1, i2) {
			return !(i1._end <= i2._start || i1._start >= i2._end);
		}

		function updateHeight(item, currentMapService) {
			item._assignmentHeight = currentMapService.collisionMaxHeight * item.scale;
			if (currentMapService.collisionUseFixedAssignmentHeight && item.scale > 1 / currentMapService.collisionFixedAssignmentNumber) {
				item._assignmentHeight = currentMapService.collisionMaxHeight / currentMapService.collisionFixedAssignmentNumber;
			}
			if (!item.isVerticallyCollected &&
				item._assignmentHeight <= TAG_COMPONENT_HEIGHT
				&& (item._rowId + 1) > (currentMapService.collisionMaxHeight / TAG_COMPONENT_HEIGHT)) { // constant of tag component height in px
				item.isVerticallyCollected = true;
			}
		}

		function updateTop(item, row) {
			row = isNaN(row) ? 0 : row;
			item._rowId = row;
			item.top = row * item._assignmentHeight;
		}

		function getMaxCollidingItem(collisions) {
			const maxCollisionsCount = getMax(collisions.map(x => x.collisions.length));
			const maxCollidingItem = collisions.find(collidingItem => collidingItem.collisions.length === maxCollisionsCount);
			return maxCollidingItem;
		}

		function updateMinScaleAndRow(item, currentMapService) {
			if (!currentMapService.items.has(item.Id)) {
				// find item with most collisions
				let maxCollidingItem = getMaxCollidingItem(item.collisions);

				// start from the item with most collisions
				if (maxCollidingItem === item) {
					let scale = currentMapService.collisionUseFixedAssignmentHeight ? calculateScale(1, currentMapService.collisionFixedAssignmentNumber, currentMapService) : 1;
					let row = 0;

					if (item.collisions.length > 1) {
						let _scalabelCollisionsCount = getMax(item.collisions.map(x => x._scalabelCollisionsCount));
						if (currentMapService.collisionUseFixedAssignmentHeight) {
							_scalabelCollisionsCount = currentMapService.collisionFixedAssignmentNumber;
						}
						scale = calculateScale(1, _scalabelCollisionsCount, currentMapService);

						let minScale = getMin(item.collisions.map(x => x.scale));

						if (minScale < scale) {
							scale = minScale;
						}

						const intArray = [...Array(item.collisions.length).keys()];

						let otherCollisions = item.collisions.filter(x => x.Id !== item.Id);
						// sort items by collisions count desc
						otherCollisions = otherCollisions.sort((a, b) => b.collisions.length - a.collisions.length);
						otherCollisions
							.forEach(otherItem => {
								if (otherItem.Id !== item.Id && !currentMapService.items.has(otherItem.Id)) {
									otherItem._rowId = 0;
									let rowIdAlreadySet = new Map(otherItem.collisions.map(y => [y._rowId, y._rowId]));

									// find not yet assigned row id we can use
									let isAlreadySet = false;
									for (let i = 0;!isAlreadySet && i < intArray.length; i++) {
										if (!rowIdAlreadySet.has(intArray[i])) {
											otherItem._rowId = intArray[i];
											isAlreadySet = true;
										}
									}

									if (otherItem._rowId >= _scalabelCollisionsCount && !currentMapService.collisionUseFixedAssignmentHeight) {
										scale = calculateScale(1, otherItem._rowId + 1, currentMapService);
									}
									otherItem.collisions.forEach(x => x.scale = scale);
									currentMapService.items.set(otherItem.Id, otherItem);
								}
							});
					}
					// scale for the items with max collision count
					item.scale = scale;
					item._rowId = row;
					currentMapService.items.set(item.Id, item);
				}
			}
		}

		function getDistinctArray(data) {
			return [...new Set(data).values()];
		}

		function getMin(data) {
			return data.reduce((a, c) => a < c ? a : c, data[0]);
		}


		function getMax(data) {
			return data.reduce((a, c) => a > c ? a : c, data[0]);
		}

	}
})(angular);