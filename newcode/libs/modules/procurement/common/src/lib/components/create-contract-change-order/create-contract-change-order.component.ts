import { Component, inject, OnInit } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ColumnDef, createLookup, FieldType, IFieldValueChangeInfo, IFormConfig, IGridConfiguration } from '@libs/ui/common';
import { BasicsSharedContractStatusLookupService, BasicsSharedReqStatusLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { IChangedItem } from '../../model/interfaces/change-item.interface';
import { procurementCreateContractChangeOrderMode } from '../../model/enums/procurement-create-contract-change-order-mode.enum';
import { ICreateContractProjectChangeFormEntity } from '../../model/interfaces/wizard/create-contract-change-order-project-from-entity.interface';


import { IPackageCreateContractRequest } from '../../model/interfaces/requests/package-create-contract-request.interface';
import { ProcurementCommonCreateContractWizardHelperService } from '../../services/wizards/create-contract/procurement-common-create-contract-wizard-helper.service';
import { IConHeaderCreateParameterRequest } from '../../model/interfaces/requests/con-header-create-parameter-request';

import { IOverWriteContractRequest } from '../../model/interfaces/requests/over-write-contract-request';
import { ICreateContractChangeOrderComponentConfig } from '../../model/entities/wizard/create-contract-change-order-component-config.interface';
import { ProcurementCreateContractUpdateReadonlyMode } from '../../model/enums/procurement-create-contract-update-readonly-mode.enum';
import { ICreateContractWizardForm } from '../../model/interfaces/wizard/create-contract-wizard-form.interface';
import { ProcurementCreateContractMode } from '../../model/enums';
import { CREATE_CONTRACT_WIZARD_OPTIONS_TOKEN } from '../../model/interfaces/wizard/create-contract-wizard-provider.interface';
import { ProcurementShareProjectChangeLookupService } from '@libs/procurement/shared';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { IConHeaderEntity } from '@libs/procurement/interfaces';


@Component({
	selector: 'procurement-common-create-contract-change-order-dialog',
	templateUrl: './create-contract-change-order.component.html',
	styleUrls: ['./create-contract-change-order.component.scss'],
})
export class ProcurementPackageCreateContractChangeOrderComponent implements OnInit {
	protected readonly FieldType = FieldType;
	private readonly http = inject(PlatformHttpService);
	private readonly translateService = inject(PlatformTranslateService);
	public readonly initCreateContractData = inject(CREATE_CONTRACT_WIZARD_OPTIONS_TOKEN);
	private readonly createContractWizardHelperService = inject(ProcurementCommonCreateContractWizardHelperService);
	// region config
	public changeModeConfig = {
		isOverWrite: true,
		isChangeOrderShow: true,
	};

	public componentConfig: ICreateContractChangeOrderComponentConfig = {
		chooseToDealWithChangesText: this.translateService.instant('procurement.package.wizard.contract.chooseHowToDealWithChanges').text,
		isContractNoteText: this.translateService.instant('procurement.common.wizard.IsContractNote').text,
		changesFoundText: this.translateService.instant('procurement.package.wizard.contract.changeFound').text,
		oKButtonDisable: true,
		isLoading: false,
		cancelButtonDisable: false,
		mode:ProcurementCreateContractMode.Package
	};
	public changeOrderMode: procurementCreateContractChangeOrderMode = procurementCreateContractChangeOrderMode.OverWrite;
	public copyHeaderTextFromPackage = false;
	public copyHeaderSelectText = this.translateService.instant('procurement.package.wizard.contract.copyHeaderTextFromPackage').text;
	// endregion
	// region change Found Grid
	public changeFoundGridConfig: IGridConfiguration<IChangedItem> = {
		uuid: '2b83b2c77ee048000ef5fc2550c1f816',
		columns: [
			{
				id: 'status',
				type: FieldType.Lookup,
				width: 100,
				model: 'StatusFk',
				label: {
					key: 'cloud.common.entityState',
				},
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedReqStatusLookupService,
				}),
				visible: true,
				sortable: true,
				readonly: true,
			},
			{
				id: 'contractQuantity',
				type: FieldType.Quantity,
				width: 85,
				model: 'ContractQuantity',
				label: {
					key: 'procurement.package.wizard.contractedQuantity',
				},
				visible: true,
				sortable: true,
				readonly: true,
			},
			{
				id: 'code',
				type: FieldType.Code,
				width: 125,
				model: 'Code',
				label: {
					key: 'cloud.common.entityCode',
				},
				visible: true,
				sortable: true,
				readonly: true,
			},
			{
				id: 'packageQuantity',
				type: FieldType.Quantity,
				width: 85,
				model: 'PackageQuantity',
				label: {
					key: 'procurement.package.wizard.packageQuantity',
				},
				visible: true,
				sortable: true,
				readonly: true,
			},
			{
				id: 'description',
				type: FieldType.Description,
				width: 125,
				model: 'Description',
				label: {
					key: 'cloud.common.entityDescription',
				},
				visible: true,
				sortable: true,
				readonly: true,
			},
			{
				id: 'varianceQuantity',
				type: FieldType.Quantity,
				width: 85,
				model: 'VarianceQuantity',
				label: {
					key: 'procurement.package.wizard.varianceQuantity',
				},
				visible: true,
				sortable: true,
				readonly: true,
			},
			{
				id: 'uom',
				type: FieldType.Lookup,
				width: 100,
				model: 'UomFk',
				label: {
					key: 'cloud.common.entityUoM',
				},
				visible: true,
				sortable: true,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedUomLookupService,
				}),
			},
		],
		showColumnSearchPanel: false,
		showSearchPanel: false,
		skipPermissionCheck: true,
		enableColumnReorder: true,
		enableCopyPasteExcel: false,
		idProperty: 'Id',
	};
	// endregion

	// region init
	public ngOnInit(): void {
		this.initChangeFoundGrid();
		this.initChangeOrderContractGrid();
		setTimeout(() => {
			this.paneBaseContractConfig.isShow = false;
		}, 100);
	}

	private initChangeFoundGrid() {
		if (this.initCreateContractData.changeOrderData?.changeItems) {
			this.changeFoundGridConfig.items = [...this.initCreateContractData.changeOrderData.changeItems];
		}
	}

	public initChangeOrderContractGrid() {
		if (this.initCreateContractData.changeOrderContract) {
			this.baseContractGridConfig = {
				...this.baseContractGridConfig,
				columns: this.baseContractGridColumns,
				items: [...this.initCreateContractData.changeOrderContract],
			};
		}
	}

	// endregion
	// region radio button
	protected readonly changeActionOptions = {
		itemsSource: {
			items: [
				{
					//todo readonly in overwrite process
					// var validChangeOrderContracts = data.validChangeOrderContracts;
					// if (contracts.length === 1 && !contracts[0].ConStatus.IsOrdered &&
					// !contracts[0].ConStatus.IsReadonly && (!validChangeOrderContracts || validChangeOrderContracts.length === 0)) {
					// isOverWrite=true;
					// isChangeOrderShow=true;
					// packageWizardCreateContractService.baseContractId = contracts[0].Id;
					id: procurementCreateContractChangeOrderMode.OverWrite,
					displayName: { key: 'procurement.package.wizard.contract.overwriteContractText' },
				},
				{
					id: procurementCreateContractChangeOrderMode.CreateContract,
					displayName: { key: 'procurement.package.wizard.contract.creaNewBaseContractWithBp' },
					// disable:this.radioButtonConfig.isChangeOrderShow
				},
				{
					id: procurementCreateContractChangeOrderMode.ChangeOrderContract,
					displayName: { key: 'procurement.package.wizard.contract.changeOrderContractText' },
					// disable:this.radioButtonConfig.isChangeOrderShow
				},
			],
		},
	};

	public onChangeActionChange() {
		this.componentConfig.oKButtonDisable = true;
		switch (this.changeOrderMode) {
			case procurementCreateContractChangeOrderMode.OverWrite:
				{
					this.closePaneProjectChange();
					this.closePaneBaseContract();
					this.closePaneBusinessPartner();
					//todo need to remove
					this.componentConfig.oKButtonDisable = false;
				}
				break;
			case procurementCreateContractChangeOrderMode.ChangeOrderContract: {
				this.closePaneBusinessPartner();
				this.reOpenPaneProject();
				this.reOpenPaneChangeOrderContract();

				break;
			}
			case procurementCreateContractChangeOrderMode.CreateContract: {
				this.closePaneBusinessPartner();
				this.closePaneProjectChange();
				this.closePaneBaseContract();
				this.reOpenPaneBusinessPartner();
				break;
			}
		}
	}

	// endregion
	// region pane project
	public projectChangedEntity: ICreateContractProjectChangeFormEntity = {
		ProjectId: null,
	};
	public paneProjectChangeConfig = {
		projectText: this.translateService.instant('procurement.package.wizard.contract.changeProject').text,
		isShowPane: false,
		isReadonlyProject: true,
	};

	private closePaneProjectChange() {
		this.paneProjectChangeConfig.isShowPane = false;
		this.projectChangedEntity.ProjectId = null;
		this.projectChangeConfig.rows.forEach((row) => {
			if (row.id === 'ProjectId') {
				row.readonly = true;
			}
		});
	}

	private reOpenPaneProject() {
		this.paneProjectChangeConfig.isShowPane = true;
		this.projectChangedEntity.ProjectId = null;
		this.projectChangeConfig.rows.forEach((row) => {
			if (row.id === 'ProjectId') {
				row.readonly = false;
			}
		});
	}

	public readonly projectChangeConfig: IFormConfig<ICreateContractProjectChangeFormEntity> = {
		formId: 'create-contract-change-order-project-from',
		showGrouping: false,
		rows: [
			{
				change: (changeInfo: IFieldValueChangeInfo<ICreateContractProjectChangeFormEntity>) => {
					if (changeInfo.newValue !== null && changeInfo.newValue !== undefined) {
						const selectContract = this.getSelectedChangeOrderContracts();
						if (selectContract && selectContract.length > 0) {
							this.componentConfig.oKButtonDisable = false;
						}
					}
				},
				id: 'ProjectId',
				label: {
					text: this.translateService.instant('procurement.package.wizard.contract.changeProject').text,
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementShareProjectChangeLookupService,
					showDescription: true,
					descriptionMember: 'Description',
				}),
				model: 'ProjectId',
				readonly: this.paneProjectChangeConfig.isReadonlyProject,
			},
		],
	};

	public showProjectPanel(): boolean {
		this.paneProjectChangeConfig.isShowPane = !this.paneProjectChangeConfig.isShowPane;
		return this.paneProjectChangeConfig.isShowPane;
	}

	// endregion
	// region pane changeOrder contract

	public paneBaseContractConfig = {
		existedContractText: this.translateService.instant('procurement.package.wizard.contract.baseContractsUnderSubPackage').text,
		isShow: true,
		isReadOnly: true,
		isReadOnlySelect: true,
	};
	public baseContractGridColumns: ColumnDef<IConHeaderEntity>[] = [
		{
			id: 'Selected',
			model: 'Selected',
			type: FieldType.Boolean,
			label: {
				text: 'Selected',
				key: 'basics.common.fieldSelector.checkbox.select',
			},
			visible: true,
			sortable: false,
			readonly: this.paneBaseContractConfig.isReadOnlySelect,
			change: (changeInfo: IFieldValueChangeInfo<IConHeaderEntity>) => {
				if (changeInfo.newValue === true && this.projectChangedEntity.ProjectId !== null && this.projectChangedEntity.ProjectId !== undefined) {
					this.componentConfig.oKButtonDisable = false;
				} else if (changeInfo.newValue === false && this.projectChangedEntity.ProjectId !== null && this.projectChangedEntity.ProjectId !== undefined) {
					const selectContract = this.getSelectedChangeOrderContracts();
					if (selectContract && selectContract.length < 1) {
						this.componentConfig.oKButtonDisable = true;
					}
				}
			},
		},
		{
			id: 'status',
			type: FieldType.Lookup,
			model: 'ConStatusFk',
			label: {
				key: 'cloud.common.entityState',
			},
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedContractStatusLookupService,
			}),
			visible: true,
			sortable: true,
			readonly: this.paneBaseContractConfig.isReadOnly,
		},
		{
			id: 'contractCode',
			type: FieldType.Code,
			model: 'Code',
			label: {
				key: 'cloud.common.entityCode',
			},
			visible: true,
			sortable: true,
			readonly: this.paneBaseContractConfig.isReadOnly,
		},
		{
			id: 'contractDescription',
			type: FieldType.Description,
			model: 'Description',
			label: {
				key: 'cloud.common.entityDescription',
			},
			visible: true,
			sortable: true,
			readonly: this.paneBaseContractConfig.isReadOnly,
		},
		{
			id: 'businessPartner',
			type: FieldType.Lookup,
			model: 'BusinessPartnerFk',
			label: {
				key: 'cloud.common.entityBusinessPartner',
			},
			lookupOptions: createLookup({
				dataServiceToken: BusinessPartnerLookupService,
			}),
			visible: true,
			sortable: true,
			readonly: this.paneBaseContractConfig.isReadOnly,
		},
		{
			id: 'TotalQuantity',
			type: FieldType.Quantity,
			model: 'ConTotalValueNet',
			label: {
				key: 'cloud.common.entityTotal',
			},
			visible: true,
			sortable: true,
			readonly: this.paneBaseContractConfig.isReadOnly,
		},
	];
	public baseContractGridConfig: IGridConfiguration<IConHeaderEntity> = {
		uuid: 'c6709dd7a46542bd984950d56d084bef',
		showColumnSearchPanel: false,
		showSearchPanel: false,
		skipPermissionCheck: true,
		enableColumnReorder: true,
		enableCopyPasteExcel: false,
		idProperty: 'Id',
		columns: this.baseContractGridColumns,
	};

	private closePaneBaseContract() {
		if (this.initCreateContractData.changeOrderContract) {
			this.baseContractGridColumns[0].readonly = true;
			this.initCreateContractData.changeOrderContract.forEach((item) => {
				item.Selected = false;
			});
			this.baseContractGridConfig = {
				...this.baseContractGridConfig,
				columns: [...this.baseContractGridColumns],
				items: this.initCreateContractData.changeOrderContract,
			};
			setTimeout(() => {
				this.paneBaseContractConfig.isShow = false;
			}, 100);
		}
	}

	private reOpenPaneChangeOrderContract() {
		this.paneBaseContractConfig.isShow = true;
		setTimeout(() => {
			if (this.initCreateContractData.changeOrderContract) {
				this.initCreateContractData.changeOrderContract.forEach((item) => {
					item.Selected = false;
				});
				this.baseContractGridColumns[0].readonly = false;
				this.baseContractGridConfig = {
					...this.baseContractGridConfig,
					columns: [...this.baseContractGridColumns],
					items: this.initCreateContractData.changeOrderContract,
				};
			}
		}, 100);
	}

	public showExistedContractPanel(): boolean {
		this.paneBaseContractConfig.isShow = !this.paneBaseContractConfig.isShow;
		return this.paneBaseContractConfig.isShow;
	}

	// endregion
	// region pane create contract

	public createContractWizardForm: ICreateContractWizardForm = {
		bpFK: 0,
		subsidiaryFk: null,
		supplierFk: null,
		contactFk: null,
	};
	public paneCrateContractConfig = {
		text: this.translateService.instant('procurement.package.wizard.contract.contractWidthBusinessPartner').text,
		isShowPane: false,
		gridReadOnly: true,
	};

	private closePaneBusinessPartner() {
		this.paneCrateContractConfig.isShowPane = false;
		this.createContractWizardForm.bpFK = 0;
		this.createContractWizardForm.subsidiaryFk = null;
		this.createContractWizardForm.supplierFk = null;
		this.createContractWizardForm.contactFk = null;
		this.paneCrateContractConfig.gridReadOnly = true;
		this.createContractWizardHelperService.updateReadonly(true, this.createContractFormConfiguration, ProcurementCreateContractUpdateReadonlyMode.AllReadonly);
	}

	private reOpenPaneBusinessPartner() {
		this.paneCrateContractConfig.isShowPane = true;
		this.paneCrateContractConfig.gridReadOnly = false;
		this.createContractWizardHelperService.updateReadonly(false, this.createContractFormConfiguration, ProcurementCreateContractUpdateReadonlyMode.OnlyBP);
	}

	public readonly createContractFormConfiguration: IFormConfig<ICreateContractWizardForm> = this.createContractWizardHelperService.createFromConfiguration(
		this.createContractWizardForm,
		this.paneCrateContractConfig.gridReadOnly,
		this.componentConfig,
	);

	protected readonly fieldType = FieldType;

	public showCreateContractPanel(): boolean {
		this.paneCrateContractConfig.isShowPane = !this.paneCrateContractConfig.isShowPane;
		return this.paneCrateContractConfig.isShowPane;
	}

	// endregion
	// region button
	public async onOk() {
		this.createContractWizardHelperService.loadingControl(this.componentConfig, true);
		switch (this.changeOrderMode) {
			case procurementCreateContractChangeOrderMode.OverWrite:
				{
					await this.OverWriteContract(this.componentConfig);
				}
				break;
			case procurementCreateContractChangeOrderMode.ChangeOrderContract: {
				await this.ChangeContractByExistedContract(this.componentConfig);
				break;
			}
			case procurementCreateContractChangeOrderMode.CreateContract: {
				await this.CreateContract(this.componentConfig);
				break;
			}
		}
	}

	// endregion

	// region process-ChangeContractByExistedContract
	private async ChangeContractByExistedContract(componentConfig: ICreateContractChangeOrderComponentConfig) {
		const selectContract = this.getSelectedChangeOrderContracts();
		const param: IConHeaderCreateParameterRequest = {
			mainItemId: this.initCreateContractData.subPackage?.Id,
			ProjectFk: this.projectChangedEntity?.ProjectId,
			ConHeaders: selectContract,
			DoesCopyHeaderTextFromPackage: this.copyHeaderTextFromPackage,
		};
		const response = await this.http.post<IConHeaderEntity[]>('procurement/contract/wizard/createchangeordercontracts', param);
		if (response && response.length > 0) {
			this.createContractWizardHelperService.loadingControl(componentConfig, false);
			await this.createContractWizardHelperService.showCreateSuccessfully(response[0]);
		} else {
			this.createContractWizardHelperService.loadingControl(componentConfig, false);
			await this.createContractWizardHelperService.showError();
		}
	}

	private getSelectedChangeOrderContracts() {
		const selectedBaseContracts: IConHeaderEntity[] = [];
		if (this.baseContractGridConfig && this.baseContractGridConfig.items) {
			this.baseContractGridConfig.items.forEach((item) => {
				if (item.Selected) {
					selectedBaseContracts.push(item);
				}
			});
		}
		return selectedBaseContracts;
	}

	// endregion
	// region process-OverWriteContract
	private async OverWriteContract(componentConfig: ICreateContractChangeOrderComponentConfig) {
		if (this.initCreateContractData.changeOrderData && this.initCreateContractData.changeOrderData.contracts && this.initCreateContractData.changeOrderData && this.initCreateContractData.changeOrderData.contracts[0]) {
			const param: IOverWriteContractRequest = {
				ContractId: this.initCreateContractData.changeOrderData.contracts[0].Id,
				DoesCopyHeaderTextFromPackage: this.copyHeaderTextFromPackage,
			};
			const response = await this.http.post<boolean>('procurement/package/wizard/overwritecontract', param);
			if (response) {
				this.createContractWizardHelperService.loadingControl(componentConfig, false);
				await this.createContractWizardHelperService.showCreateSuccessfully(this.initCreateContractData.changeOrderData.contracts[0]);
			} else {
				this.createContractWizardHelperService.loadingControl(componentConfig, false);
				await this.createContractWizardHelperService.showError();
			}
		}
	}

	// region process-CreateContract

	private async CreateContract(componentConfig: ICreateContractChangeOrderComponentConfig) {
		const packageCreateContractRequests: IPackageCreateContractRequest = {
			SubPackageId: this.initCreateContractData.subPackage?.Id ?? 0,
			BpFK: this.createContractWizardForm.bpFK,
			SubsidiaryFk: this.createContractWizardForm.subsidiaryFk,
			SupplierFk: this.createContractWizardForm.supplierFk,
			ContactFk: this.createContractWizardForm.contactFk,
		};
		const response = await this.http.post<number[]>('procurement/package/wizard/createcontract', packageCreateContractRequests);
		if (response && response.length > 0) {
			const dataContract = await this.http.get<IConHeaderEntity>('procurement/contract/header/getitembyId?id=' + response[0]);
			if (dataContract) {
				this.createContractWizardHelperService.loadingControl(componentConfig, false);
				await this.createContractWizardHelperService.showCreateSuccessfully(dataContract);
			} else {
				this.createContractWizardHelperService.loadingControl(componentConfig, false);
				await this.createContractWizardHelperService.showError();
			}
		} else {
			this.createContractWizardHelperService.loadingControl(componentConfig, false);
			await this.createContractWizardHelperService.showError();
		}
	}

	// endregion
}
