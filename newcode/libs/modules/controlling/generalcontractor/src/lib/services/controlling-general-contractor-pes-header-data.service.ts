/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import {ControllingCommonPesDataService, IControllingCommonPesEntity} from '@libs/controlling/common';
import {IGccCostControlDataEntity} from '../model/entities/gcc-cost-control-data-entity.interface';
import {
	ControllingGeneralContractorCostHeaderComplete
} from '../model/controlling-general-contractor-cost-header-complete.class';
import {
	ControllingGeneralContractorCostHeaderDataService
} from './controlling-general-contractor-cost-header-data.service';

export const CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_DATA_TOKEN = new InjectionToken<ControllingGeneralContractorPesHeaderDataService>('controllingGeneralContractorPesHeaderDataToken');

@Injectable({
	providedIn: 'root'
})
export class ControllingGeneralContractorPesHeaderDataService extends ControllingCommonPesDataService<IControllingCommonPesEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete>{
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ControllingGeneralContractorCostHeaderDataService), {
			apiUrl: '',
			readEndPoint: '',
			itemName: ''
		});

		// TODO: DEV-12305
		// basicsLookupdataLookupDescriptorService.loadData('PesStatus');
	}

	public override refreshData(){
		if(!this.parentService.getSelectedEntity()){
			this.setList([]);
			// TODO: DEV-12305 to be check again
			// serviceContainer.data.itemList =[];
			// serviceContainer.service.gridRefresh();
		}
	}

	protected override provideLoadPayload(): object{
		// TODO: DEV-12305 wait cloudDesktopPinningContextService and ControllingGeneralContractorCostHeaderDataService
		// initReadData: function (readData) {
		//
		// 	let projectContext = _.find (cloudDesktopPinningContextService.getContext (), {token: 'project.main'});
		// 	if (projectContext) {
		// 		readData.ProjectId = projectContext.id;
		// 	} else {
		// 		readData.ProjectId = -1;
		// 	}
		// 	readData.MdcControllingUnitFks = parentService.getMdcIds();
		// 	readData.DueDate = parentService.getSelectedDueDate()? parentService.getSelectedDueDate():null;
		// 	return readData;
		// }
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				MdcControllingUnitFks: parent.Id
			};
		} else {
			throw new Error('should be a selected parent.');
		}
	}
}
	



