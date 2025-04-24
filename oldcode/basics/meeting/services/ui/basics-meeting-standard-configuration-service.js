/**
 * Created by zjo on 6/1/2022.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.meeting';

	angular.module(moduleName).factory('basicsMeetingStandardConfigurationService', ['platformUIStandardConfigService', 'basicsMeetingTranslationService', 'platformSchemaService', 'basicsMeetingContainerInformationService',

		function (platformUIStandardConfigService, basicsMeetingTranslationService, platformSchemaService, basicsMeetingContainerInformationService) {

			function getLayout(){
				return basicsMeetingContainerInformationService.getBasicsMeetingLayout();
			}
			var BaseService = platformUIStandardConfigService;
			var meetingDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'MtgHeaderDto', moduleSubModule: 'Basics.Meeting'} );

			if(meetingDomainSchema) {
				meetingDomainSchema = meetingDomainSchema.properties;
				meetingDomainSchema.Action={ domain : 'action'};
				meetingDomainSchema.Info ={ domain : 'image'};
				meetingDomainSchema.Rule ={ domain : 'imageselect'};
				meetingDomainSchema.Param ={ domain : 'imageselect'};
			}

			function BasicsMeetingUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			BasicsMeetingUIStandardService.prototype = Object.create(BaseService.prototype);
			BasicsMeetingUIStandardService.prototype.constructor = BasicsMeetingUIStandardService;

			return new BaseService( getLayout(), meetingDomainSchema, basicsMeetingTranslationService);
		}
	]);
})(angular);