(function (angular) {
	'use strict';

	const moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).factory('controllingProjectcontrolsPackageImageFormatter',
		['$injector','basicsLookupdataLookupDescriptorService', '_', function ($injector,lookupDescriptorService, _) {
			return function statusImageFormatter(row, cell, value, columnDef, dataContext) {
				const desc = value ? ( value.Translated ? value.Translated : value.Description) : null;

				if (dataContext && desc) {
					const lookupStatus = lookupDescriptorService.getData('ConStatus');
					const lookupStatusItem = lookupStatus[_.get(dataContext, 'ConStatusFk')];

					const imageSelector = $injector.get('platformStatusIconService');
					const imageUrl = imageSelector.select(lookupStatusItem);
					const isCss = _.isFunction(imageSelector.isCss) ? imageSelector.isCss() : false;

					return (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
										'<span class="pane-r">' + desc + '</span>';
				}

				return '';

			};
		}]);
})(angular);