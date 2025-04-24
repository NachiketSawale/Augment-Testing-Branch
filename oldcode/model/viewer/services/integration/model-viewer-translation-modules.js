/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc constant
	 * @name modelViewerTranslationModules
	 * @description
	 * List of module names that contain translations relevant for the 3D viewer and related containers.
	 */
	angular.module('model.viewer').constant('modelViewerTranslationModules', [
		'model.administration',
		'model.annotation',
		'model.evaluation',
		'model.main',
		'model.measurements',
		'model.project',
		'model.simulation',
		'model.viewer'
	]);
})(angular);
