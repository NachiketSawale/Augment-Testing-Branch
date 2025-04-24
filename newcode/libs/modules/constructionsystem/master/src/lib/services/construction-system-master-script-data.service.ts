/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { get } from 'lodash';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ICosScriptEntity } from '../model/entities/cos-script-entity.interface';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { CosMasterComplete } from '../model/entities/cos-master-complete.class';
import { ConstructionSystemMasterHeaderDataService } from './construction-system-master-header-data.service';
import { IScriptResponseEntity } from '../model/entities/script-response-entity.interface';
import { IConstructionSystemCommonScriptErrorEntity } from '@libs/constructionsystem/common';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterScriptDataService extends DataServiceFlatLeaf<ICosScriptEntity, ICosHeaderEntity, CosMasterComplete> {
	public constructor() {
		const parentService = inject(ConstructionSystemMasterHeaderDataService);
		const dataServiceOptions: IDataServiceOptions<ICosScriptEntity> = {
			apiUrl: '',
			roleInfo: <IDataServiceChildRoleOptions<ICosScriptEntity, ICosHeaderEntity, CosMasterComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosScript',
				parent: parentService,
			},
		};
		super(dataServiceOptions);
	}

	public currentItem: ICosScriptEntity = {
		CosHeaderFk: 0,
		Id: 0,
		ScriptData: '',
		ValidateScriptData: '',
		TestInput: '',
	};

	public readonly onScriptResultUpdated = new Subject<IConstructionSystemCommonScriptErrorEntity[]>();

	private executionResult?: IScriptResponseEntity;

	/**
	 * to set ICosScriptEntity to save
	 * @param item
	 */
	public setItemAsModified(item: ICosScriptEntity) {
		this.setModified(item);
	}

	/**
	 * get construction system master script request body
	 * @param parentItem
	 * @param mainItemIdField
	 */
	public getPostRequestBody(parentItem: ICosHeaderEntity, mainItemIdField: string): object {
		return { CosHeaderFk: get(parentItem, mainItemIdField) };
	}

	public setExecutionResult(value: IScriptResponseEntity) {
		this.executionResult = value;
		this.onScriptResultUpdated.next(value.ErrorList ?? []);
	}

	public getExecutionResult() {
		return this.executionResult;
	}
}
