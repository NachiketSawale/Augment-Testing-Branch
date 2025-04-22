/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceHierarchicalLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { IRfqRequisitionEntity } from '../model/entities/rfq-requisition-entity.interface';
import { RfqRequisitionEntityComplete } from '../model/entities/rfq-requisition-complete.class';
import { ProcurementRfqHeaderMainDataService } from './procurement-rfq-header-main-data.service';
import { ISearchPayload } from '@libs/platform/common';

/**
 * Represents the data service to handle rfq requisition field.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqRequisitionDataService extends DataServiceHierarchicalLeaf<IRfqRequisitionEntity, IRfqHeaderEntity, RfqRequisitionEntityComplete> {

	public constructor(procurementRfqHeaderMainDataService: ProcurementRfqHeaderMainDataService) {
		const options: IDataServiceOptions<IRfqRequisitionEntity> = {
			apiUrl: 'procurement/rfq/requisition',
			readInfo: {
				endPoint: 'tree',
				usePost: true
			},
			createInfo: {
				endPoint: 'createnew',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IRfqRequisitionEntity, IRfqHeaderEntity, RfqRequisitionEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'RfqRequisition',
				parent: procurementRfqHeaderMainDataService
			}
		};
		super(options);
	}

	private readonly searchPayload: ISearchPayload = {
		executionHints: false,
		filter: '',
		includeNonActiveItems: false,

		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pattern: '',
		pinningContext: [],
		projectContextId: null,
		useCurrentClient: true,
	};

	protected override onLoadSucceeded(loaded: object): IRfqRequisitionEntity[] {
		if ('Main' in loaded) {
			return loaded.Main as unknown as IRfqRequisitionEntity[];
		}
		return [];
	}

	public override childrenOf(element: IRfqRequisitionEntity): IRfqRequisitionEntity[] {
		return element.ChildItems || [];
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				Value: parentSelection.Id,
				filter: this.searchPayload.filter
			};
		}

		return {
			mainItemId: -1
		};
	}
}
