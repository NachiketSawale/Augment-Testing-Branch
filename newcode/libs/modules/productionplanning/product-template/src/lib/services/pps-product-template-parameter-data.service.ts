/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { get, isNull } from 'lodash';

import { PpsProductTemplateComplete, PpsSharedParameterDataService } from '@libs/productionplanning/shared';
import { IPpsParameterEntity, IPpsProductTemplateEntity } from '../model/models';
import { PpsProductTemplateDataService } from './pps-product-template-data.service';


@Injectable({
	providedIn: 'root'
})


export class PpsProductTemplateParameterDataService extends PpsSharedParameterDataService<IPpsParameterEntity, IPpsProductTemplateEntity, PpsProductTemplateComplete> {

	private static cacheMap: Map<string, PpsProductTemplateParameterDataService> = new Map();

	public static getInstance(moduleName: string, parentService: PpsProductTemplateDataService): PpsProductTemplateParameterDataService {
		let instance = this.cacheMap.get(moduleName);
		if (!instance) {
			instance = new PpsProductTemplateParameterDataService(parentService);
			this.cacheMap.set(moduleName, instance);
		}
		return instance;
	}

	public constructor(parentService: PpsProductTemplateDataService){
		super(parentService,
			{
				filter: 'Id',
				PKey1: '',
				PKey2: ''
			});
	}


	public override registerModificationsToParentUpdate(complete: PpsProductTemplateComplete, modified: IPpsParameterEntity[], deleted: IPpsParameterEntity[]): void {
		if (modified && modified.some(() => true)) {
			complete.PpsParameterToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			complete.PpsParameterToDelete = deleted;
		}
	}

	protected override onLoadSucceeded(loaded: object): IPpsParameterEntity[] {
		if (loaded) {
			return get(loaded, 'Main')! as IPpsParameterEntity[];
		}
		return [];
	}

	public override getSavedEntitiesFromUpdate(complete: PpsProductTemplateComplete): IPpsParameterEntity[] {
		if (complete && !isNull(complete.PpsParameterToSave)) {
			return complete.PpsParameterToSave;
		}
		return [];
	}

}

		
			





