/**
 * Created by reimer on 05.08.2015.
 */

(function () {

	'use strict';

	var moduleName = 'basics.import';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsImportHeaderService', [function () {

		var service = {};

		var _data = null;

		/**
		 * @ngdoc
		 * @name
		 * @function
		 *
		 * @description
		 *
		 */
		service.getList = function() {
			return _data;
		};

		/**
		 * @ngdoc
		 * @name
		 * @function
		 *
		 * @description
		 *
		 */
		service.setList = function(headers) {
			_data = [];
			_data.push({ id: -1, description: ''});  // not mapped item
			for (var i = 0, len = headers.length; i < len; i++ )  {
				_data.push({ id: i+1, description: headers[i]});
			}
		};

		/**
		 * @ngdoc
		 * @name
		 * @function
		 *
		 * @description
		 *
		 */
		service.getItemByDescription = function (value) {

			if (!_data || _data.length === 0)
			{
				return null;
			}

			// var item = _data[0]; // default: not mapped
			var item = null; // default: null
			for (var i = 0; i < _data.length; i++) {
				if (_data[i].description === value) {
					item = _data[i];
					break;
				}
			}
			return item;
		};

		return service;

	}
	]);
})(angular);
