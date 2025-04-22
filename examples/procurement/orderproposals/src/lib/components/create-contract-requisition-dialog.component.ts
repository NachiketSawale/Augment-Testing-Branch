/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, Inject, inject, OnInit } from '@angular/core';

import { ITranslated, PlatformTranslateService } from '@libs/platform/common';

import { ICreateContractRequisition, ProcurementOrderProposalsCreateContractRequisitionWizardService } from '../services/wizards/procurement-order-proposals-create-contract-requisition-wizard.service';

import { IOrderProposalEntity } from '../model/entities/order-proposal-entity.interface';

/**
 * Interface for the payload data required to create a contract or requisition
 */
export interface IOrderProposalParam {
	CreateType?: number | string | null;
	Ids?: number[] | null;
	IsDeleteItem?: boolean | null;
}

/**
 * Enum for CreateMethod
 */
enum CreateMethod {
	BasicData = '1',
	BusinessPartner = '2',
}

/**
 *  Component to handle the contract and requisition creation dialog
 */
@Component({
	selector: 'procurement-orderproposals-create-contract-requisition-dialog',
	templateUrl: './create-contract-requisition-dialog.component.html',
	styleUrl: './create-contract-requisition-dialog.component.scss',
})
export class CreateContractRequisitionDialogComponent implements OnInit {
	/**
	 * Injects PlatformTranslateService
	 */
	private readonly translateService = inject(PlatformTranslateService);

	/**
	 * Injects ProcurementOrderProposalsCreateContractRequisitionWizardService
	 */
	private readonly wizardService = inject(ProcurementOrderProposalsCreateContractRequisitionWizardService);

	/**
	 * The loading flag
	 */
	public loading!: boolean;

	/**
	 * To hold createmessage
	 */
	public createMessage: string = '';

	/**
	 * To hold deletemessage
	 */
	public deleteMessage: string = '';

	/**
	 * The createMehtod property of type CreateMethod
	 */
	public createMehtod: CreateMethod = CreateMethod.BasicData;

	/**
	 * The isDeleteItem flag
	 */
	public isDeleteItem: boolean = true;

	/**
	 * The isMultiItem flag
	 */
	public isMultiItem: boolean = false;

	/**
	 * To hold successMessage.
	 */
	public successMessage!: string;

	/**
	 * The createByBasicData property .
	 */
	public createByBasicData!: ITranslated;

	/**
	 * The createByBusinessPartner property .
	 */
	public createByBusinessPartner!: ITranslated;

	/**
	 * To hold orderProposal entity
	 */
	public orderProposalList: IOrderProposalEntity[];

	/**
	 * The property for orderProposalIds
	 */
	public orderProposalIds: number[] | null;

	/**
	 * The headerText of createContract/createRequistion dialog
	 */
	public headerText: string;

	/**
	 * To show/hide the alert
	 */
	public isAlert: boolean = true;

	/**
	 * The item text used to createMessage and deleteMessage
	 */
	public item: string;

	public constructor(
		@Inject('dialogData')
		private dialogData: {
			orderProposalList: IOrderProposalEntity[];
			orderProposalIds: number[];
			headerText: string;
			item: string;
		},
	) {
		this.orderProposalList = dialogData.orderProposalList;
		this.orderProposalIds = dialogData.orderProposalIds;
		this.headerText = dialogData.headerText;
		this.item = dialogData.item;

		this.isMultiItem = this.orderProposalList.length > 1;

		this.initializeMessages();
	}

	public ngOnInit(): void {
		this.generateMessages();
	}

	/**
	 * Initializes translated messages
	 */
	private initializeMessages(): void {
		this.createByBasicData = this.translateService.instant('procurement.stock.wizard.createByOrderProposal.basicData', {
			createType: this.headerText,
		});

		this.createByBusinessPartner = this.translateService.instant('procurement.stock.wizard.createByOrderProposal.businessPartner', {
			createType: this.headerText,
		});

		this.successMessage = this.translateService.instant('procurement.stock.wizard.createByOrderProposal.success', {
			createType: this.translateService.instant(this.headerText).text,
		}).text;
	}

	/**
	 * Triggers the contract/requisition creation process by sending the filter data
	 */
	public onOKBtnClicked(): void {
		this.loading = true;

		const filterData: IOrderProposalParam = {
			Ids: this.orderProposalIds,
			IsDeleteItem: this.isDeleteItem,
			CreateType: this.orderProposalList?.length > 1 ? this.createMehtod : 0,
		};

		this.wizardService.getCreationResult(filterData).subscribe({
			next: (result: ICreateContractRequisition) => {
				this.successMessage = `${this.successMessage} (${result.codes.join(', ')})`;
				const entityIds = result.ids;
				this.wizardService.showCreationSuccessDialog(this.successMessage, this.item, this.headerText, entityIds);
				this.loading = false;
			},
			error: (err) => {
				this.loading = false;
				throw new Error(err);
			},
		});
	}

	/**
	 * Triggers the recalculation of create and delete messages based on the selected creation method and order proposal list.
	 */
	public clickMehtod(): void {
		this.generateMessages();
	}

	/**
	 *Generates messages for creation and deletion based on order proposal list and method
	 */
	private generateMessages(): void {
		const tempIds: number[] = [];
		const ids: number[] = [];
		this.orderProposalList.forEach((item) => {
			if (item.Id != null && !ids.includes(item.Id)) {
				const list = this.orderProposalList.filter((orderProposal) => {
					if (this.createMehtod === CreateMethod.BasicData) {
						return orderProposal.PrcConfigurationFk === item.PrcConfigurationFk && orderProposal.PrcPackageFk === item.PrcPackageFk;
					} else if (this.createMehtod === CreateMethod.BusinessPartner) {
						return orderProposal.BusinessPartnerFk === item.BusinessPartnerFk && orderProposal.SupplierFk === item.SupplierFk;
					} else {
						return true;
					}
				});
				tempIds.push(item.Id);
				list.forEach((o) => {
					if (o.Id != null) {
						ids.push(o.Id);
					}
				});
			}
		});

		this.createMessage = this.translateService.instant('procurement.stock.wizard.createByOrderProposal.createMessage', {
			number: tempIds.length,
			item: this.item,
		}).text;

		this.deleteMessage = this.translateService.instant('procurement.stock.wizard.createByOrderProposal.deleteOrderProposal', {
			item: this.item,
		}).text;
	}

	/**
	 * To close the alert
	 */
	public closeAlert() {
		this.isAlert = false;
	}
}
