/**
 * Created by baf on 2018-08-30.
 */
(function (angular) {
	'use strict';
	var moduleName = 'platform';

	angular.module(moduleName).service('platformSourceWindowGridDragService', PlatformSourceWindowGridDragService);

	PlatformSourceWindowGridDragService.$inject = ['_'];

	function PlatformSourceWindowGridDragService(_) {
		this.canDrag = function () {
			return true;
		};
		this.doCanPaste = function () {
			return false;
		};
		this.doPaste = _.noop;
	}
})(angular);