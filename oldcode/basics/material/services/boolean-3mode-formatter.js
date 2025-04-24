/**
 * Created by chi on 9/21/2017.
 */
(function(){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialBoolean3ModeFormatter', basicsMaterialBoolean3ModeFormatter);

	basicsMaterialBoolean3ModeFormatter.$inject = ['$timeout'];

	function basicsMaterialBoolean3ModeFormatter($timeout) {
		var service = {};
		service.formatter = formatter;
		return service;
		//////////////////////
		function formatter (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
			var html = '';

			if (value === true) {
				html = '<input type="checkbox" checked />';
			}
			else if (value === 'unknown') {
				$timeout(function () {
					angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
				});
				html = '<input type="checkbox" />';
			}
			else {
				html = '<input type="checkbox" unchecked />';
			}

			return '<div class="text-center">' + html + '</div>';
		}
	}
})();