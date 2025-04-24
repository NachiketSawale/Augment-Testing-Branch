/**
 * Created by jie on 04/09/2024.
 */
(function (angular) {
    'use strict';
    var moduleName = 'procurement.common';
    angular.module(moduleName).factory('procurementCommonOverrideHeaderInfoService',
        ['basicsLookupdataLookupDescriptorService', 'platformHeaderDataInformationService','cloudDesktopInfoService',
            function (basicsLookupdataLookupDescriptorService, platformHeaderDataInformationService,cloudDesktopInfoService) {
                let service = {};
                function getProject(entity) {
                    if (!entity || !entity.ProjectFk) {
                        return null;
                    }
                    return basicsLookupdataLookupDescriptorService.getLookupItem('Project', entity.ProjectFk);
                }

                service.updateModuleHeaderInfo = function (leadingService,moduleDisplayName) {
	                let headerObject = {};
						 let entity = leadingService.getSelected();
	                headerObject.project = platformHeaderDataInformationService.prepareMainEntityHeaderInfo(getProject(entity), {
                            codeField: 'ProjectLongNo',
                            descField: 'ProjectName'
                        }, 'object'
                    ) || '';

	                headerObject.module = platformHeaderDataInformationService.prepareMainEntityHeaderInfo(entity, {
                        codeField: 'Code',
                        descField: 'Description'
                    }, 'object');

                    cloudDesktopInfoService.updateModuleInfo(moduleDisplayName, headerObject, '');
                };

                return service;
            }]);
})(angular);
