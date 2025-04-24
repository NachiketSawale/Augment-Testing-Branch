(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionsystemMainCompareflagImageProcessor
	 * @function
	 * @description
	 * #
	 * image processor for constructionsystem main Line Item/Resource (field 'CompareFlag') container.
	 */
	angular.module(moduleName).factory('constructionsystemMainCompareflagImageProcessor', ['constructionsystemMainCompareFlags',
		function (compareFlags) {
			var service = {};

			service.select = function (item) {
				var image = 'cloud.style/content/images/status-icons.svg#';
				switch (item.CompareFlag) {
					case compareFlags.unmodified:
						image += 'ico-status23';
						break;
					case compareFlags.new:
						image += 'ico-status04';
						break;
					case compareFlags.delete:
						image += 'ico-status01';
						break;
					case compareFlags.modified:
						image += 'ico-status25';
						break;
					default:
						image += 'ico-status33'; // no comparsion: configed by user in table 'Bas_SystemOption'
						break;
				}
				return image;
			};

			return service;
		}
	]);
})(angular);