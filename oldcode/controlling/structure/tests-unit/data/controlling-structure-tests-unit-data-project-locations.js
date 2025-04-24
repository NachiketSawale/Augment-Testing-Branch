(function (angular) {
	'use strict';

	var nextId = 0;
	function createLocationTree(locationsStructure, parentId) {
		parentId = parentId || null;
		var locations = locationsStructure !== null ? [] : null;

		_.each(locationsStructure, function (locationArr) {
			// locationArr: ['LOCA', 'Location A', [...]] // code, description, array of locations
			var location = {
				Id : ++nextId,
				LocationParentFk : parentId,
				Code : locationArr[0],
				DescriptionInfo : {'Translated': locationArr[1]},
				Version : 1
			};
			// inner locations? -> recursive...
			location.Locations = createLocationTree(locationArr[2], location.Id);

			locations.push(location);
		});

		return locations;
	}

	var moduleName = 'controlling.structure';
	var projectLocationsData = createLocationTree([
		['LOCA', 'Location A', [
			['LOCA1', 'Location A - 1'],
			['LOCA2', 'Location A - 2']
		]],
		['LOCB', 'Location B', [
			['LOCB1', 'Location B - 1'],
			['LOCB2', 'Location B - 2']
		]],
		['LOCC', 'Location C']
	]);
	angular.module(moduleName).constant('projectLocationsData', projectLocationsData);

})(angular);