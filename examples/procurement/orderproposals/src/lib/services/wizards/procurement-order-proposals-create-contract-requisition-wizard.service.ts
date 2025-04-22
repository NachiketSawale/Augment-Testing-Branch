/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ICustomDialogOptions, StandardDialogButtonId } from '@libs/ui/common';

import { INavigationInfo,PlatformHttpService, PlatformModuleNavigationService } from '@libs/platform/common';

import { ProcurementCommonOrderProposalsWizardService } from '@libs/procurement/common';

import { ProcurementInternalModule } from '@libs/procurement/shared';

import { ProcurementOrderProposalsGridDataService } from '../procurement-order-proposals-grid-data.service';

import { CreateContractRequisitionDialogComponent, IOrderProposalParam } from '../../components/create-contract-requisition-dialog.component';

import { IOrderProposalEntity } from '../../model/entities/order-proposal-entity.interface';

/**
 * An interface representing the result of a contract/requisition creation 
 */
export interface ICreateContractRequisition {
	ids: number[];
	codes: string[];
}

/**
 * Enum representing the type of order proposal (contract or requisition)
 */
export enum OrderProposalType {
    Contract = 'contract',
    Requisition = 'requisition',
}

/**
 * Procurement OrderProposals Create Contract and Requisition Wizard Service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementOrderProposalsCreateContractRequisitionWizardService extends ProcurementCommonOrderProposalsWizardService {
	/**
	 * Injects PlatformHttpService
	 */
	private readonly httpService = inject(PlatformHttpService);

	/**
	 * To inject ProcurementOrderProposalsGridDataService
	 */
	private readonly dataService = inject(ProcurementOrderProposalsGridDataService);

	/**
	 * To hold item text
	 */
	public item: string = '';

	/**
	 * To hold headerText
	 */
	public headerText: string = '';

	/**
	 * To hold OrderProposalType
	 */
	private orderProposalType: OrderProposalType | null = null;

	/**
	 * Injects PlatformModuleNavigationService
	 */
	private readonly platformModuleNavigationService = inject(PlatformModuleNavigationService);

	public constructor() {
		super();
	}

	/**
	 * The method sets orderProposalType, item and headerText specific to contract creation
	 * @returns {Promise<void>}
	 */
	public async createContract(): Promise<void> {
		this.orderProposalType = OrderProposalType.Contract;
		this.item = this.translateService.instant('procurement.stock.wizard.createByOrderProposal.contract').text;

		this.headerText = this.translateService.instant('procurement.stock.wizard.createByOrderProposal.createContract').text;

		await this.createContractOrCreateRequisition(this.headerText, this.item);
	}

	/**
	 * The method sets orderProposalType, item and headerText specific to requisition creation
	 * @returns {Promise<void>}
	 */
	public async createRequisition(): Promise<void> {
		this.orderProposalType = OrderProposalType.Requisition;
		this.item = this.translateService.instant('procurement.stock.wizard.createByOrderProposal.requisition').text;

		this.headerText = this.translateService.instant('procurement.stock.wizard.createByOrderProposal.createRequisition').text;

		await this.createContractOrCreateRequisition(this.headerText, this.item);
	}

	/**
	 * A common overridden method that dynamically handles both contract and requisition creation using headerText and item parameters.
	 * @param headerText
	 * @param item
	 * @returns {Promise<void>}
	 */
	public override async createContractOrCreateRequisition(headerText: string, item: string): Promise<void> {
		const selOrderProposals = this.dataService.getSelection();
		const ids = this.getDistinctIds(selOrderProposals, 'Id');

		const dialogOption: ICustomDialogOptions<{ text: string }, CreateContractRequisitionDialogComponent> = {
			headerText: headerText,
			width: '620px',
			resizeable: true,
			showCloseButton: true,
			backdrop: false,
			bodyComponent: CreateContractRequisitionDialogComponent,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'ui.common.dialog.okBtn' },
					fn: (event, info) => {
						info.dialog.body.onOKBtnClicked();
					},
					autoClose: true,
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'ui.common.dialog.cancelBtn' },
				},
			],
			bodyProviders: [
				{
					provide: 'dialogData',
					useValue: {
						orderProposalList: selOrderProposals,
						orderProposalIds: ids,
						headerText: headerText,
						item: item,
					},
				},
			],
		};

		const result = await this.modalDialogService.show(dialogOption);
		if (result) {
			this.dataService.refreshAll();
		}
		return;
	}

	/**
	 * Overrides the goToModule method to dynamically determine the module name
	 * @param {number[]} entityIds
	 */
	public override goToModule(entityIds: number[]): void {
		if (!this.orderProposalType) {
			throw new Error('Order proposal type is not set');
		}
		const moduleName = this.getModuleNameByOrderProposalType(this.orderProposalType);
		
		this.genericGoToModule(moduleName, entityIds);
	}
	
	/**
	 * To get the internal module name based on the order proposal type
	 * @param { string } orderProposalType 
	 * @returns {ProcurementInternalModule} The internal module name
	 */
	private getModuleNameByOrderProposalType(orderProposalType: string): ProcurementInternalModule {
		switch (orderProposalType) {
			case 'contract':
				return ProcurementInternalModule.Contract;
			case 'requisition':
				return ProcurementInternalModule.Requisition;
			default:
				throw new Error(`Unsupported order proposal type: ${orderProposalType}`);
		}
	}
	
	/**
	 * Makes an API call to retrieve the result of contract/requisition creation.
	 * @param filterData The data to be sent in the POST request body.
	 * @returns { Observable<ICreateContractRequisition>} An Observable of the HTTP response containing the contract or requisition creation result
	 */
	public getCreationResult(filterData: IOrderProposalParam): Observable<ICreateContractRequisition> {
		if (!this.orderProposalType) {
			throw new Error('Order proposal type is not set');
		}
		const apiUrl = `procurement/orderproposals/header/create${this.orderProposalType}`;
		
		return this.httpService.post$<ICreateContractRequisition>(apiUrl, filterData);
	}

	/**
	 * Extracts distinct values from a specific field of an array of IOrderProposalEntity objects.
	 * @param { IOrderProposalEntity[] } data The array of IOrderProposalEntity objects
	 * @param { keyof IOrderProposalEntity } field The field of the IOrderProposalEntity objects
	 * @returns { (string | number | boolean | Date)[] } An array of distinct values
	 */
	protected getDistinctIds(data: IOrderProposalEntity[], field: keyof IOrderProposalEntity): (string | number | boolean | Date)[] {
		return Array.from(new Set(data.map((item) => item[field]).filter((value): value is string | number | boolean | Date => value != null)));
	}

	/**
	 * A common method for navigating to modules dynamically using associated entity IDs (entityIds).
	 * @param {ProcurementInternalModule} moduleName The internal module to navigate to (e.g. Contract or Requisition)
	 * @param {number[]} entityIds An array of entity IDs used for navigation
	 */
	public genericGoToModule(moduleName: ProcurementInternalModule, entityIds: number[]): void {
		if (!entityIds.length) {
			return;
		}

		this.dataService.refreshAll();

		const entityIdentifications = entityIds.map((id) => ({ id }));

		const navigator: INavigationInfo = {
			internalModuleName: moduleName,
			entityIdentifications: entityIdentifications,
			onNavigationDone: () => console.log(`Navigation to ${moduleName} completed`),
		};

		this.platformModuleNavigationService.navigate(navigator);
	}
}
