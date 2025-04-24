/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.measurements').constant('modelMeasurementTypes',
		(function createMeasurementTypes() {
			function addItem(id, code) {
				result.byId[id] = code;
				result.byCode[code] = id;
			}

			const result = {
				byId: {},
				byCode: {}
			};

			addItem(10, 'StraightDistance');
			addItem(20, 'Perimeter');
			addItem(30, 'Area');
			addItem(40, 'Volume');

			return result;
		})());
})(angular);