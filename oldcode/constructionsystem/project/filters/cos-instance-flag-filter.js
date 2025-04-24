/**
 * Created by wui on 3/1/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.project';

	angular.module(moduleName).filter('CosFlagFilter', [
		function () {
			return function (value) {
				var text = '';

				switch (value){
					case 1: text= 'Update';
						break;
					case 2: text= 'Delete';
						break;
					case 3: text= 'Keep';
						break;
					case 4: text= 'New';
						break;
					case 7: text= 'Change';
						break;
					case 8: text= 'No Change';
						break;
				}

				return text;
			};
		}
	]);

})(angular);