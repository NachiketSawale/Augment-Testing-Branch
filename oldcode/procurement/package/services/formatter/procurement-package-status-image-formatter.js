/**
 * Created by wwa on 9/18/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';
	angular.module(moduleName).factory('procurementPackageImageFormatter',
		['$injector','basicsLookupdataLookupDescriptorService', '_', function ($injector,lookupDescriptorService, _) {
			return function statusImageFormatter(row, cell, value, columnDef, dataContext) {
				var imageUrl = '';
				if (dataContext && value && value!=='*' ) {
					var options = columnDef.formatterOptions;

					var lookups = lookupDescriptorService.getData(options.lookupType);
					if(!lookups){// todo
						return value;
					}
					var lookupItem = lookups[_.get(dataContext,options.complexField)];
					if(!lookupItem){
						return value;
					}
					var lookupStatus = null;
					var lookupStatusItem = null;
					switch(options.lookupType.toLowerCase()){
						case 'reqheaderlookupview':
							lookupStatus = lookupDescriptorService.getData('ReqStatus');
							lookupStatusItem = lookupStatus[lookupItem.ReqStatusFk];
							break;
						case 'conheader':
							lookupStatus = lookupDescriptorService.getData('ConStatus');
							lookupStatusItem = lookupStatus[lookupItem.ConStatusFk];
							break;
						case 'rfqheader':
							lookupStatus = lookupDescriptorService.getData('RfqStatus');
							lookupStatusItem = lookupStatus[lookupItem.StatusFk];
							break;
					}

					var imageSelector = options.imageSelector;
					if (angular.isString(imageSelector)) {
						imageSelector = $injector.get(imageSelector);
					}
					imageUrl = imageSelector.select(lookupStatusItem);
					// eslint-disable-next-line no-prototype-builtins
					var isCss = imageSelector.hasOwnProperty('isCss') ? imageSelector.isCss() : false;

					return (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
										'<span class="pane-r">' + value + '</span>';
				}
				return value;

			};
		}]);
})(angular);