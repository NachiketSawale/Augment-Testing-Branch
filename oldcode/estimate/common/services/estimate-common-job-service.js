/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {

    'use strict';

    let moduleName='estimate.common';
	angular.module(moduleName).service('estimateCommonJobService', ['$injector', function ($injector) {

        let service = {};

        service.getLgmJobFkForAssembly = function (isPrjPlantAssembly) {
            const prjResourceService = isPrjPlantAssembly ? $injector.get('projectPlantAssemblyResourceService') : $injector.get('projectAssemblyResourceService');
            const prjMainService = isPrjPlantAssembly ? $injector.get('projectPlantAssemblyMainService') : $injector.get('projectAssemblyMainService');
            const projectMainService = $injector.get('projectMainService');

            const resourceSelected = prjResourceService.getSelected();
            const selectedItem = prjMainService.getSelected();

            if (resourceSelected) {
                if (resourceSelected.LgmJobFk && resourceSelected.LgmJobFk !== 0) {
                    return resourceSelected.LgmJobFk;
                }

                if (resourceSelected.EstResourceFk > 0) {
                    const resourceParent = _.find(prjResourceService.getList(), { Id: resourceSelected.EstResourceFk });
                    if (resourceParent.LgmJobFk) return resourceParent.LgmJobFk;
                }
            }
        
            if (selectedItem.LgmJobFk && selectedItem.LgmJobFk !== 0) {
                return selectedItem.LgmJobFk;
            }

            return projectMainService.getSelected().LgmJobFk;
        };


        return service;

    }]);

})(angular);