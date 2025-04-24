/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {
	ControllingCommonPesBehaviorService,
	IControllingCommonPesEntity
} from '@libs/controlling/common';
import {IGccCostControlDataEntity} from '../model/entities/gcc-cost-control-data-entity.interface';
import {
	ControllingGeneralContractorCostHeaderComplete
} from '../model/controlling-general-contractor-cost-header-complete.class';
import {
	ControllingGeneralContractorPesHeaderDataService
} from '../services/controlling-general-contractor-pes-header-data.service';
export const CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_BEHAVIOR_TOKEN = new InjectionToken<ControllingGeneralContractorPesHeaderBehavior>('controllingGeneralContractorPesHeaderBehavior');

@Injectable({
	providedIn: 'root'
})
export class ControllingGeneralContractorPesHeaderBehavior extends ControllingCommonPesBehaviorService<IControllingCommonPesEntity,IGccCostControlDataEntity,ControllingGeneralContractorCostHeaderComplete>{
	public constructor() {
		super(inject(ControllingGeneralContractorPesHeaderDataService));
		this.dataService.refreshData();
	}

	// TODO: DEV-12305
	// let controllerFeaturesServiceProvider = $injector.get('controllingGeneralcontractorControllerFeaturesServiceProvider');
	// controllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);
	//
	// $injector.get('controllingGeneralcontractorCostControlDataService').onDueDatesChanged.register(dataService.load);
	//
	// $scope.$on ('$destroy', function () {
	// 	$injector.get('controllingGeneralcontractorCostControlDataService').onDueDatesChanged.unregister(dataService.load);
	// });
}