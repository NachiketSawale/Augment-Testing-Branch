(function (angular){
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).filter('modelWdeViewerTrimFilter', [
		function (){
			return function (value, length) {
				if (!value) {
					return value;
				}

				if (!angular.isString(value)) {
					value = value.toString();
				}

				if (value.length > length) {
					value = value.substr(0, length) + '...';
				}

				return value;
			};
		}
	]);

})(angular);