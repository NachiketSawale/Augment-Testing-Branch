/**
 * Created by chk on 12/19/2016.
 */
(function () {
	'use strict';

	var moduleName = 'basics.import';
	/* jshint -W072 */
	angular.module(moduleName).factory('basicsImportLookupHelperService', ['$q', 'basicsLookupdataLookupDescriptorService',
		function ($q, basicsLookupdataLookupDescriptorService) {
			return {
				getItemById: getItemById,
				getItemByIdAsync: getItemByIdAsync
			};
			function getItemById() {
				return null;
			}

			function getItemByIdAsync(value,options) {
				var data = {},noMapping = '(not mapped)';
				if(_.isString(value)){
					// data = {
					// 	'Code':value,
					// 	'Description':value
					// };
					if(value === '-1'){
						value = noMapping;
					}
					data[options.displayMember] = value;
					data['Description'] = value;
					return $q.when(data);
				}else if(_.isNumber(value) && value === -1){
					// data = {
					// 	'Code':res,
					// 	'Description':res
					// };
					data[options.displayMember] = noMapping;
					data['Description'] = noMapping;
					return $q.when(data);
				}else{
					data = basicsLookupdataLookupDescriptorService.getItemByIdSync(value,options);
				}
				return $q.when(data);
			}
		}]);
})(angular);