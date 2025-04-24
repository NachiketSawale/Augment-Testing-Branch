(function () {

	'use strict';

	var moduleName = 'basics.characteristic';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCharacteristicUsedInCompanyLayoutService', [

		function () {

			var layout = {

				'fid': 'basics.characteristic.usedincompany.layout',
				'version': '1.0.0',
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['id', 'code', 'companyname', 'checked']
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						Code: {location: moduleName, identifier: 'entityCode', initial: 'Code'},
						CompanyName: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'}
					}
				},
				'overloads': {
					'code': {
						readonly: true
					},
					'companyname': {
						readonly: true
					},
					'id': {
						readonly: true
					},
					'checked': {

						'grid': {
							// editor: 'tristatecheckbox'
							// formatter: tristateFormatter, --> does not automatically open the editor
						}
					}
				}
			};

			//function tristateFormatter(row, cell, value, columnDef, dataContext) {
			//
			//	var found = false;
			//	function checkForSubCompanies(company) {
			//
			//		if (found || company.Checked) {
			//			found = true;
			//			return;
			//		}
			//		var len = company.Companies ? company.Companies.length : 0;
			//		for (var i = 0; i < len; i++){
			//			checkForSubCompanies(company.Companies[i]);
			//		}
			//	}
			//
			//	var imageName = 'ico-ca-notset';
			//	if (value === true) {
			//		imageName = 'ico-ca-access';
			//	}
			//	else {
			//		checkForSubCompanies(dataContext);
			//		if (found) {
			//			imageName = 'ico-ca-inherit-access';
			//		}
			//	}
			//
			//	var html = '<img src="' + globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#' + imageName + '">';
			//	return html;
			//}

			return {
				getLayout: function () {
					return layout;
				}
			};

		}]);

})(angular);

