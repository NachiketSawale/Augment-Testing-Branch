/**
 * Created by csalopek on 20.03.2018.
 */
(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name schedulingExtSysPrimaveraImageProcessor
	 * @function
	 *
	 * @description
	 * The schedulingExtSysPrimaveraImageProcessor adds path to images for EPS/Project items depending on there type.
	 */
	angular.module('scheduling.extsys').factory('schedulingExtSysPrimaveraImageProcessor', ['$log', function ($log) {

		var service = {};

		/* jshint -W074 */ // I don't see a high cyclomatic complexity
		service.processItem = function processItem(epsProjectItem) {
			if (!(epsProjectItem && angular.isDefined(epsProjectItem.Type))) {
				return '';
			}

			switch (epsProjectItem.Type) {
				case 1: // EPS Item
					epsProjectItem.image = 'ico-primavera-eps';
					break;
				case 2: // Project Item
					epsProjectItem.image = 'ico-primavera-project';
					break;
				default:
					$log.debug('schedulingExtSysPrimaveraImageProcessor; processItem -> not handled line type -> no image assigned yet :' + epsProjectItem.Type);
					break;
			}
		};

		return service;

	}]);
})();
