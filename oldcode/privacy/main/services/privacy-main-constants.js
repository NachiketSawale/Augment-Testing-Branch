((angular)  => {
	'use strict';
	var moduleName = 'privacy.main';

	/**
	 * @ngdoc service
	 * @name privacyMainConstantValues
	 * @function
	 *
	 * @description
	 * privacyMainConstantValues provides definitions and constants frequently used in privacy main module
	 */
	angular.module(moduleName).value('privacyMainConstantValues', {
		schemes: {
			request: {typeName: 'PrivacyRequestDto', moduleSubModule: 'Privacy.Main'}
		},
		uuid: {
			container: {
				requestList: 'f955c58a87c94fdbb6bbad703a7b9f58',
				requestDetail: '4ffc67d562c8495f931006e8d9974026'
			}
		},
		grade:{
			withBackup : 3,
			withoutBackup : 4,
			anonymizedWithBackup: 1,
			anonymizedWithoutBackup: 2
		},
		handledType: {
			clerk: 1,
			businessPartner: 2,
			contact: 3,
			user: 4
		},
		requestedBy:{
			client : 1
		}
	});
})(angular);
