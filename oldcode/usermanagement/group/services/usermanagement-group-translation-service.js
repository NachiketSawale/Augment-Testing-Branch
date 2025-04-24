/**
 * Created by sandu on 29.09.2015.
 */
(function (angular) {
	'use strict';

	var usermanagementGroupModule = 'usermanagement.group';
	var cloudCommonModule = 'cloud.common';

	/**
     * @ngdoc service
     * @name usermanagementGroupFinalTranslationService
     * @description provides translation for usermanagement group module
     */
	angular.module('usermanagement.group').factory('usermanagementGroupFinalTranslationService', ['platformTranslationUtilitiesService',
		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [usermanagementGroupModule, cloudCommonModule]
			};

			data.words = {
				'basicData': {location: usermanagementGroupModule, identifier: 'basicData', initial: 'Basic Data'},
				'basicDataUserXGroup': {location: usermanagementGroupModule, identifier: 'basicData', initial: 'Basic Data'},
				'basicDataGroupXRole': {location: usermanagementGroupModule, identifier: 'basicData', initial: 'Basic Data'},
				'ClientFk': {location: usermanagementGroupModule, identifier: 'clientFK', initial: 'Company'},
				'AccessRoleFk': {
					location: usermanagementGroupModule,
					identifier: 'accessRoleFK',
					initial: 'Role'
				},

				'GUID': {location: usermanagementGroupModule, identifier: 'groupGUID', initial: 'GUID'},
				'Name': {location: usermanagementGroupModule, identifier: 'groupName', initial: 'Name'},
				'Description':{location: usermanagementGroupModule, identifier: 'groupDescription', initial: 'Description'},
				'DomainSID': {location: usermanagementGroupModule, identifier: 'groupDomainSID', initial: 'DomainSID'},
				'SynchronizeDate': {
					location: usermanagementGroupModule,
					identifier: 'groupSynchronizeDate',
					initial: 'Synchronize Date'},
				'Email': {location: usermanagementGroupModule, identifier: 'groupEmail', initial: 'Email'},

				'UserFk': {location: usermanagementGroupModule, identifier: 'userFK', initial: 'Group'},

	            'JobState': {location: usermanagementGroupModule, identifier: 'logContainer.jobstate', initial: 'Job State'},
	            'StartTime': {location: usermanagementGroupModule, identifier: 'logContainer.starttime', initial: 'Start Time'},
	            'ExecutionStartTime': {location: usermanagementGroupModule, identifier: 'logContainer.exstarttime', initial: 'Execution Start Time'},
	            'ExecutionEndTime': {location: usermanagementGroupModule, identifier: 'logContainer.exendtime', initial: 'Execution End Time'},
	            'Log': {location: usermanagementGroupModule, identifier: 'logContainer.log', initial: 'Logging Message'},
				'IdentityProvider':{location: usermanagementGroupModule, identifier: 'identityProvider', initial: 'Identity Provider'}


			};

			//Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			//Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			//Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}

	]);

})(angular);