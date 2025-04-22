import { Component, inject, OnInit } from '@angular/core';
import { PlatformTranslateService, PlatformModuleNavigationService } from '@libs/platform/common';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';
import { Package2HeaderDataService } from '../../services/package-2header-data.service';
import { ProcurementPackageCreateRequisitionWizardService } from '../../wizards/procurement-package-create-requisition-wizard.service';
import { CREATE_REQUISITION_DATA_TOKEN } from '../../model/entity-info/create-requisition-data.model';
import { IProjectChangeEntity } from '@libs/procurement/shared';
import { IError } from '../../model/requests/create-requisition-scope.interface';
import { ChangeItemType } from '../../model/enums/change-item-type.enum';
import { CellChangeEvent, ColumnDef, createLookup, FieldType, getCustomDialogDataToken, IGridConfiguration, StandardDialogButtonId } from '@libs/ui/common';
import { IReqHeaderEntity } from '@libs/procurement/common';
import { IChangedReqItemsEntity } from '../../model/entities/create-requisition/changed-req-items-entity.interface';
import { BasicsSharedClerkRoleLookupService, BasicsSharedReqStatusLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { ICreateRequisitionModalOptions } from '../../model/requests/create-requisition-modal-options.interface';
import { IExistedValidBaseRequisitionEntity } from '../../model/entities/create-requisition/existed-valid-base-requisition-entity.interface';
import { PlatformHttpService } from '@libs/platform/common';
import { isEmpty } from 'lodash';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { INewBaseRequisitionResult } from '../../model/entities/create-requisition/new-base-requisition-result.interface';
import { IYesNoDialogOptions, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementShareProjectChangeLookupService } from '@libs/procurement/shared';
import { RequisitionType } from '../../model/enums/requisition-type.enum';

@Component({
	selector: 'procurement-package-create-requisition-dialog',
	templateUrl: './create-requisition.component.html',
	styleUrls: ['./create-requisition.component.scss'],
})
export class ProcurementPackageCreateRequisitionComponent implements OnInit {
	private readonly dialogWrapper = inject(getCustomDialogDataToken<string, ProcurementPackageCreateRequisitionComponent>());
	private readonly translateService = inject(PlatformTranslateService);
	private readonly packageDataService = inject(ProcurementPackageHeaderDataService);
	private readonly package2DataService = inject(Package2HeaderDataService);
	private readonly createRequisitionData = inject(CREATE_REQUISITION_DATA_TOKEN);
	private readonly createRequisitionWizardService = inject(ProcurementPackageCreateRequisitionWizardService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly sanitizer = inject(DomSanitizer);
	private readonly httpService = inject(PlatformHttpService);
	private readonly platformModuleNavigationService = inject(PlatformModuleNavigationService);
	private translatePrefix = 'procurement.package.wizard.createRequisition.';
	private defaultChange: IProjectChangeEntity | null;
	private hasContractItem: boolean;
	private changedReqItemsColumn: ColumnDef<IChangedReqItemsEntity>[];
	private existedValidBaseReqItems: IExistedValidBaseRequisitionEntity[];
	private existedValidBaseReqColumns: ColumnDef<IExistedValidBaseRequisitionEntity>[];
	public RequisitionType = RequisitionType;
	public error!: IError;
	public hasContractMessage: boolean = false;
	public projectChange!: IProjectChangeEntity;
	public lookupOptions: unknown;
	public modalOptions: ICreateRequisitionModalOptions;
	public selectedSubPackage!: IPackage2HeaderEntity;
	public requisitionGridConfig!: IGridConfiguration<IReqHeaderEntity>;
	private requisitionItem: IReqHeaderEntity[];
	public requisitionChangedItemGridConfig!: IGridConfiguration<IChangedReqItemsEntity>;
	private requisitionChangedItem: IChangedReqItemsEntity[];
	public contractChangedItemGridConfig!: IGridConfiguration<IChangedReqItemsEntity>;
	public contractChangedItem!: IChangedReqItemsEntity[];
	public existedValidBaseRequisitionGridConfig!: IGridConfiguration<IExistedValidBaseRequisitionEntity>;

	//todo lookupOptions
	/*const lookupOptions = {
		events: [
			{
				name: 'onSelectedItemChanged',
				handler: function selectedBoqHeaderChanged(e, args) {
					if (args.selectedItem) {
						this.projectChange = args.selectedItem;
					}
				},
			},
		],
		showClearButton: false,
		createOptions: {
			initCreateData: function (createData) {
				const packageItem = this.packageDataService.getSelectedEntity();
				createData.PKey1 = packageItem?.ProjectFk;
				return createData;
			},
			typeOptions: {
				isProcurement: true,
				isChangeOrder: true,
			},
		},
		filterOptions: {
			serverKey: 'project-change-lookup-for-procurement-common-filter',
			serverSide: true,
			fn: function () {
				const packageItem = this.packageDataService.getSelectedEntity();
				return {
					ProjectFk: packageItem?.ProjectFk || 0,
					IsProcurement: true,
				};
			},
		},
	};*/
	//TODO: should use the change module lookup. Temporary implement here.
	public readonly prjChangeLookupService = inject(ProcurementShareProjectChangeLookupService);

	public constructor() {
		this.defaultChange = this.createRequisitionData.defaultChange;
		this.hasContractItem = this.createRequisitionData.hasContractItem;
		this.changedReqItemsColumn = [
			{
				id: 'StatusFk',
				type: FieldType.Lookup,
				width: 100,
				model: 'StatusFk',
				label: {
					text: 'Status',
					key: 'cloud.common.entityState',
				},
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedReqStatusLookupService,
				}),
				visible: true,
				sortable: true,
			},
			{
				id: 'Code',
				type: FieldType.Text,
				width: 100,
				model: 'Code',
				label: {
					text: 'Code',
					key: 'cloud.common.entityCode',
				},
				visible: true,
				sortable: true,
			},
			{
				id: 'Description',
				type: FieldType.Description,
				width: 100,
				model: 'Description',
				label: {
					text: 'Description',
					key: 'cloud.common.entityDescription',
				},
				visible: true,
				sortable: true,
			},
			{
				id: 'PackageQuantity',
				type: FieldType.Quantity,
				width: 100,
				model: 'PackageQuantity',
				label: {
					text: 'Package Quantity',
					key: 'procurement.package.wizard.packageQuantity',
				},
				visible: true,
				sortable: true,
			},
			{
				id: 'contractQuantity',
				type: FieldType.Quantity,
				width: 100,
				model: 'ContractQuantity',
				label: {
					text: 'Contracted Quantity',
					key: 'procurement.package.wizard.requisitionQuantity',
				},
				visible: true,
				sortable: true,
			},
			{
				id: 'varianceQuantity',
				type: FieldType.Quantity,
				width: 100,
				model: 'VarianceQuantity',
				label: {
					text: 'Variance Quantity',
					key: 'procurement.package.wizard.varianceQuantity',
				},
				visible: true,
				sortable: true,
			},
			{
				id: 'UomFk',
				type: FieldType.Lookup,
				width: 100,
				model: 'UomFk',
				label: {
					text: 'UoM',
					key: 'cloud.common.entityUoM',
				},
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedUomLookupService,
				}),
				readonly: true,
				visible: true,
				sortable: true,
			},
		];
		this.modalOptions = {
			reqType: this.RequisitionType.None,
			headerText: this.translateService.instant(this.translatePrefix + 'caption').text,
			headerTitle: this.translateService.instant(this.translatePrefix + 'caption').text,
			selectSubPackageTitle: this.translateService.instant(this.translatePrefix + 'selectPackageMessage').text,
			createRequisitionTitle: this.translateService.instant(this.translatePrefix + 'chooseMessage').text,
			basedOnExistedRequisitionTitle: this.translateService.instant(this.translatePrefix + 'basedOnExistedRequisition').text,
			basedOnExistedContractTitle: this.translateService.instant(this.translatePrefix + 'basedOnExistedContract').text,
			overwriteRequisitionText: this.translateService.instant(this.translatePrefix + 'overwriteRequisition').text,
			changeOrderRequisitionText: this.translateService.instant(this.translatePrefix + 'changeRequisition').text,
			changeRequestText: this.translateService.instant(this.translatePrefix + 'changeRequest').text,
			btnOkText: this.translateService.instant('cloud.common.ok').text,
			btnCloseText: this.translateService.instant('cloud.common.cancel').text,
			btnPreviousText: this.translateService.instant('cloud.common.previousStep').text,
			btnNextText: this.translateService.instant('cloud.common.nextStep').text,
			//todo Waiting for platformModuleInfoService
			//navigateTitle: platformModuleInfoService.getNavigatorTitle('procurement.requisition').text,
			navigateTitle: '',
			doesCopyHeaderTextFromPackage: false,
			isBtnNextDisabled: true,
			isBtnOKDisabled: false,
			isBtnNavigateDisabled: true,
			changeOrder: {
				changeItemEnum: {
					req: 1,
					changeReq: 2,
					contract: 3,
				},
				isChangeItem: null,
				overwriteDisabled: false,
				showBtnPrevious: false,
				selectedBtnRadioValue: 'overwriteRequisition',
				isOrderStatus: false,
			},
			step: '',
			dialogLoading: true,
			requisitionId: -1,
			setChangeItem: function (value: boolean | ChangeItemType) {
				this.changeOrder.isChangeItem = value;
			},
		};
		this.modalOptions.doesCopyHeaderTextFromPackage = this.modalOptions.reqType === this.RequisitionType.createNewBase;
		this.error = {
			show: false,
			messageCol: 1,
			message: '',
			type: 0,
			showReq: false,
		};
		this.requisitionItem = [];
		this.requisitionChangedItem = [];
		this.contractChangedItem = [];
		this.existedValidBaseReqItems = [];
		this.existedValidBaseReqColumns = [
			{
				id: 'Selected',
				model: 'Selected',
				type: FieldType.Boolean,
				label: {
					text: 'Selected',
					key: 'cloud.common.entitySelected',
				},
				width: 50,
				visible: true,
				sortable: false,
				readonly: true,
			},
			{
				id: 'ReqStatusFk',
				type: FieldType.Lookup,
				width: 100,
				model: 'ReqStatusFk',
				label: {
					text: 'Status',
					key: 'cloud.common.entityState',
				},
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedReqStatusLookupService,
				}),
				visible: true,
				sortable: true,
			},
			{
				id: 'Code',
				type: FieldType.Text,
				width: 100,
				model: 'Code',
				label: {
					text: 'Code',
					key: 'cloud.common.entityCode',
				},
				visible: true,
				sortable: true,
			},
			{
				id: 'Description',
				type: FieldType.Description,
				width: 100,
				model: 'Description',
				label: {
					text: 'Requisition Description',
					key: 'cloud.common.entityDescription',
				},
				visible: true,
				sortable: true,
			},
			{
				id: 'TotalQuantity',
				type: FieldType.Quantity,
				width: 100,
				model: 'TotalQuantity',
				label: {
					text: 'total',
					key: 'procurement.package.wizard.total',
				},
				visible: true,
				sortable: true,
			},
		];
		this.updateRequisitionGridConfig();
		this.updateContractChangedItemGridConfig();
		this.updateRequisitionChangedItemGridConfig();
		this.updateExistedValidBaseRequisitionGridConfig();
	}

	public updateRequisitionGridConfig() {
		this.requisitionGridConfig = {
			uuid: 'e571571c85384ef2925013a2d9124383',
			columns: [
				{
					id: 'Code',
					type: FieldType.Text,
					width: 50,
					model: 'Code',
					label: {
						text: 'Code',
						key: 'cloud.common.entityCode',
					},
					visible: true,
					sortable: true,
				},
				{
					id: 'Description',
					type: FieldType.Description,
					width: 100,
					model: 'Description',
					label: {
						text: 'Reference Name',
						key: 'cloud.common.entityReferenceName',
					},
					visible: true,
					sortable: true,
				},
				{
					id: 'DateRequired',
					type: FieldType.Date,
					width: 100,
					model: 'DateRequired',
					label: {
						text: 'DateRequired',
						key: 'cloud.common.entityRequired',
					},
					visible: true,
					sortable: true,
				},
				{
					id: 'ReqStatusFk',
					type: FieldType.Lookup,
					width: 100,
					model: 'ReqStatusFk',
					label: {
						text: 'Status',
						key: 'cloud.common.entityState',
					},
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedReqStatusLookupService,
					}),
					visible: true,
					sortable: true,
				},
				{
					id: 'ClerkReqFk',
					type: FieldType.Lookup,
					width: 100,
					model: 'ClerkReqFk',
					label: {
						text: 'Requisition Owner',
						key: 'cloud.common.entityRequisitionOwner',
					},
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkRoleLookupService,
						showClearButton: true,
					}),
					visible: true,
					sortable: true,
				},
			],
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			idProperty: 'Id',
			items: [...this.requisitionItem],
		};
	}

	public updateRequisitionChangedItemGridConfig() {
		this.requisitionChangedItemGridConfig = {
			uuid: 'ad4ef8d064b7466a8be763631fb3f2c6',
			columns: this.changedReqItemsColumn,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			idProperty: 'Id',
			items: [...this.requisitionChangedItem],
		};
	}

	public updateContractChangedItemGridConfig() {
		this.contractChangedItemGridConfig = {
			uuid: 'e28c898b272940928e58d34a1279b39d',
			columns: this.changedReqItemsColumn,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			idProperty: 'Id',
			items: [...this.contractChangedItem],
		};
	}

	public updateExistedValidBaseRequisitionGridConfig() {
		this.existedValidBaseRequisitionGridConfig = {
			uuid: 'ad4ef8d064b7466a8be763631fb3f2c8',
			columns: this.existedValidBaseReqColumns,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			items: [...this.existedValidBaseReqItems],
		};
	}

	private onClose() {
		this.dialogWrapper.close();
	}

	public onNext() {
		this.showCreateRequisitionInfoDialog(this.hasContractItem, false);
	}

	public async createRequisition() {
		await this.httpService
			.get<INewBaseRequisitionResult>('procurement/package/wizard/createrequisition?package2HeaderId=' + this.selectedSubPackage?.Id)
			.then((responses) => {
				this.packageDataService.refreshAllLoaded();
				this.modalOptions.requisitionId = responses.RequsitionId;
				this.showNavigationPage(responses.RequsitionId, false);
				this.modalOptions.isBtnNavigateDisabled = false;
				this.modalOptions.isBtnNextDisabled = true;
				this.modalOptions.dialogLoading = false;
			})
			.catch((error) => {
				this.modalOptions.dialogLoading = false;
				this.requestDataFail();
			});
	}

	public async showCreateRequisitionInfoDialog(hasContractItem: boolean, needJudgeContractedItem: boolean) {
		const response = await this.createRequisitionWizardService.getCreateReqType(this.selectedSubPackage?.Id);
		if (response.type === 'FirstTime') {
			if (needJudgeContractedItem && hasContractItem) {
				this.messageBoxService
					.showYesNoDialog({
						headerText: this.translateService.instant('procurement.package.wizard.createRequisition.caption').text,
						bodyText: this.translateService.instant('procurement.common.updateIncotermToItem').text,
						dontShowAgain: true,
					})
					?.then((response) => {
						if (response.closingButtonId === StandardDialogButtonId.Ok) {
							this.createRequisition();
						}
					})
					.catch((e) => {
						this.modalOptions.dialogLoading = false;
						//this.onClose();
					});
			} else {
				await this.createRequisition();
			}
		} else {
			this.modalOptions.reqType = this.convertRequisitionType(response.type);
			this.modalOptions.step = 'step2';

			// get and set data for requisition dialog grid
			await this.loadRequisition();
			this.modalOptions.overwriteReq = true;
			this.modalOptions.setChangeItem(this.modalOptions.changeOrder.changeItemEnum.changeReq);
			this.modalOptions.changeOrder.overwriteDisabled = true;
			await this.loadRequisitionChangedItem();
			this.modalOptions.changeOrder.selectedBtnRadioValue = 'changeOrderRequisition';
			this.modalOptions.dialogLoading = false;
		}
	}

	public async setDataForCreateRequisition(subPackageId: number | undefined, hasContractItem: boolean, pkg: IPrcPackageEntity | null) {
		const responses = await Promise.all([this.createRequisitionWizardService.hasData(subPackageId), this.createRequisitionWizardService.baseContract(subPackageId), this.createRequisitionWizardService.checkBoqInOtherPkg(pkg?.Id, pkg?.Code)]);
		if (responses) {
			// show warning when sub-package has no prcItems and Boqs
			const hsaData = responses[0];
			const contract = responses[1];
			const checkBoqInOtherPkg = responses[2];
			if (!hsaData || checkBoqInOtherPkg) {
				this.modalOptions.step = 'step1';
				this.showInfo(true, this.translateService.instant('procurement.package.wizard.noDataInSubPackage').text, 2);
				this.modalOptions.isBtnNavigateDisabled = true;
				this.modalOptions.isBtnOKDisabled = false;
				this.modalOptions.dialogLoading = false;
			}
			// can't allow to create requisition if subPackage has contracts.
			if (contract) {
				this.modalOptions.dialogLoading = false;
				if (contract.ConStatus) {
					if (!contract.ConStatus.IsOrdered) {
						this.modalOptions.step = 'step4';
						this.showInfo(true, this.translateService.instant('procurement.package.wizard.hasExistingContractInfo').text, 4);
					} else {
						const responseData = await this.loadContractChangedItem();
						if (responseData === null || responseData.length === 0) {
							this.modalOptions.step = 'step1';
							this.modalOptions.dialogLoading = true;
							let msg = this.translateService.instant('procurement.package.wizard.createRequisition.noDifferenceFound').text;
							if (hasContractItem) {
								const isContractItemMsg = this.translateService.instant('procurement.common.wizard.IsContractNote').text;
								msg = msg + '<br/>' + isContractItemMsg;
							}
							this.showInfo(true, msg, 1);
							this.modalOptions.isBtnNextDisabled = false;
							this.modalOptions.dialogLoading = false;
						} else {
							this.modalOptions.reqType = this.RequisitionType.createNewBase;
							this.modalOptions.step = 'step2';
							this.modalOptions.setChangeItem(this.modalOptions.changeOrder.changeItemEnum.contract);
							this.modalOptions.changeOrder.overwriteDisabled = true;
							this.modalOptions.changeOrder.selectedBtnRadioValue = 'changeOrderRequisition';
							this.modalOptions.changeOrder.isOrderStatus = true;
						}
					}
				}
			} else {
				this.modalOptions.isBtnNextDisabled = false;
				if (hsaData) {
					await this.showCreateRequisitionInfoDialog(hasContractItem, true);
				}
			}
		}
	}

	public async showNavigationPage(requisitionId: number, isChangeOrder: boolean) {
		let successMessage: string;
		let code: string;
		if (requisitionId > -1) {
			if (!isChangeOrder) {
				await this.package2DataService.load({ id: 0 }); // update subpackage container data (ReqHeaderFk).
			}
			successMessage = this.translateService.instant(this.translatePrefix + 'createReqSucceed').text;
			if (isChangeOrder) {
				successMessage =
					this.modalOptions.reqType === this.RequisitionType.createNewBase
						? this.translateService.instant(this.translatePrefix + 'changeNewBaseSuccessfully').text
						: this.translateService.instant(this.translatePrefix + 'createChangeReqSuccessfully').text;
			}
			const response = await this.createRequisitionWizardService.getCreatedRequisition(requisitionId);
			if (response) {
				code = this.translateService.instant(this.translatePrefix + 'newCode', { newCode: response.Code }).text;
				//todo $($('#requisitionDIV')
				//$($('#requisitionDIV').parent()).css('margin', '0 auto').css('width', '600px');
				this.showInfo(true, successMessage + '<br />' + code, 0, true);
			}

			this.modalOptions.isBtnOKDisabled = true;
			this.modalOptions.step = 'step3';
			this.modalOptions.changeOrder.showBtnNext = false;

			/* Throw workflow event that is needed to execute a workflow
			after the running of the createRequisitionWizard.
				The Definition of the event can be found in the workflow module in the
			file: basics-workflow-module.js.
				This solution is temporary!
			*/
			//todo $rootScope.$emit
			//$rootScope.$emit('28CDA93065E341D6BB793F282C2A62DF', { requisitionId: requisitionId });
		} else {
			successMessage = '<p>' + this.translateService.instant(this.translatePrefix + 'noDifferenceFound').text + '</p>';
			const projectChangeId = this.projectChange ? this.projectChange.Id : 0;

			// keep subPackageId when dialog closed.
			const subPackageId = this.selectedSubPackage?.Id;
			this.onClose();
			const options: IYesNoDialogOptions = {
				headerText: this.translateService.instant('cloud.common.informationDialogHeader').text,
				bodyText: successMessage,
				showCancelButton: true, // should close the previous dialog when click 'cancel'.
			};
			this.messageBoxService.showYesNoDialog(options)?.then(() => {
				this.createRequisitionWizardService.createChangeOrderRequisition(subPackageId, 0, projectChangeId, true, false).subscribe({
					next: (response: number) => {
						this.showNavigationPage(response, true);
					},
					error: (): void => {
						this.requestDataFail();
					},
				});
			});
		}

		/* Throw workflow event that is needed to execute a workflow
		after the running of the createRequisitionWizard.
			The Definition of the event can be found in the workflow module in the
		file: basics-workflow-module.js.
			This solution is temporary!
		*/
		//todo  $rootScope
		// $rootScope.$emit('28CDA93065E341D6BB793F282C2A62DF', {requisitionId: requisitionId});
	}

	/**
	 * @ngdoc function
	 * @param {bool} isShow (true: show, false: hidden)
	 * @param {string} message
	 * @param {number} type (0: success; 1: info; 2: warning; 3: error)
	 * @param req
	 */
	public showInfo(isShow: boolean, message: string, type: number, req = false) {
		const trustedHtml = this.sanitizer.bypassSecurityTrustHtml(message);
		this.error = {
			show: isShow,
			messageCol: 1,
			message: trustedHtml,
			type: type,
			showReq: req,
		};
	}

	public requestDataFail() {
		const message = this.translateService.instant(this.translatePrefix + 'createFailed').text;
		this.showInfo(true, message, 3);
		this.modalOptions.dialogLoading = false;
		//this.onClose();
	}

	public async onOK() {
		this.modalOptions.isBtnOKDisabled = true;
		// overwrite the existing requisition
		if (this.modalOptions.reqType === this.RequisitionType.overwriteReq) {
			this.createRequisitionWizardService.overwriteRequisition(this.selectedSubPackage?.Id, this.modalOptions.doesCopyHeaderTextFromPackage).subscribe({
				next: async (response) => {
					await this.packageDataService.refreshAllLoaded();
					this.modalOptions.requisitionId = response.RequsitionId;
					await this.showNavigationPage(response.RequsitionId, false);
					this.modalOptions.isBtnNavigateDisabled = false;
				},
				error: (error): void => {
					this.requestDataFail();
				},
			});
		} else if (this.modalOptions.changeOrder.isOrderStatus) {
			// create a change order requisition
			this.createRequisitionWizardService.baseContract(this.selectedSubPackage?.Id).then((responseData) => {
				if (responseData) {
					const changeId = this.projectChange ? this.projectChange.Id : 0;
					const baseReqId = this.modalOptions.selectedBaseReq ? this.modalOptions.selectedBaseReq.Id : 0;
					this.createRequisitionWizardService.createChangeOrderFromContract(this.selectedSubPackage.Id, changeId, responseData.Id, baseReqId).subscribe({
						next: (response): void => {
							// when create change order, if items/boq's quantity has not changed (no difference: response.data == -1),
							// show a message dialog for user to choose 'continue create' or 'cancel'.
							this.modalOptions.requisitionId = response;
							this.showNavigationPage(response, true);
							this.modalOptions.isBtnNavigateDisabled = false;
						},
						error: (error) => {
							this.requestDataFail();
						},
					});
				}
			});
		} else if (this.modalOptions.reqType === this.RequisitionType.createNewBase) {
			this.createRequisitionWizardService.createNewBaseRequisition(this.selectedSubPackage?.Id).subscribe({
				next: (response) => {
					// when create change order, if items/boq's quantity has not changed (no difference: response.data == -1),
					// show a message dialog for user to choose 'continue create' or 'cancel'.
					this.packageDataService.refreshAllLoaded();
					this.modalOptions.requisitionId = response.RequsitionId;
					this.showNavigationPage(response.RequsitionId, true);
					this.modalOptions.isBtnNavigateDisabled = false;
				},
				error: (error) => {
					this.requestDataFail();
				},
			});
		} else {
			const reqHeaderId = this.modalOptions.selectedBaseReq ? this.modalOptions.selectedBaseReq.Id : 0;
			const projectChangeId = this.projectChange ? this.projectChange.Id : 0;
			this.createRequisitionWizardService.createChangeOrderRequisition(this.selectedSubPackage.Id, reqHeaderId, projectChangeId, false, this.modalOptions.doesCopyHeaderTextFromPackage).subscribe({
				next: (response) => {
					// when create change order, if items/boq's quantity has not changed (no difference: response.data == -1),
					// show a message dialog for user to choose 'continue create' or 'cancel'.
					this.modalOptions.requisitionId = response;
					this.showNavigationPage(response, true);
					this.modalOptions.isBtnNavigateDisabled = false;
				},
				error: (error) => {
					this.requestDataFail();
				},
			});
		}
	}

	public onNavigate() {
		this.onClose();
		this.platformModuleNavigationService.navigate({ internalModuleName: 'procurement.requisition', entityIdentifications: [{ id: this.modalOptions.requisitionId }] });
	}

	public async loadRequisition() {
		const data = await this.createRequisitionWizardService.getCreateReqType(this.selectedSubPackage?.Id);
		if (data && data.list.length > 0) {
			this.requisitionItem = data.list;
			this.updateRequisitionGridConfig();
		}
	}

	public async loadRequisitionChangedItem() {
		const res = await this.httpService.get<IChangedReqItemsEntity[]>('requisition/requisition/wizard/getpackagechangeditems?package2HeaderId=' + this.getIfSelectedIdElse(-1));
		if (isEmpty(res)) {
			const msg = this.translateService.instant('procurement.package.wizard.createRequisition.noDifferenceFound').text;
			this.showInfo(true, msg, 1);
		}
		this.requisitionChangedItem = res;
		this.updateRequisitionChangedItemGridConfig();
	}

	public async loadContractChangedItem() {
		const res = await this.httpService.get<IChangedReqItemsEntity[]>('procurement/contract/wizard/getpackagechangeditems?subPackageId=' + this.getIfSelectedIdElse(-1));
		if (this.modalOptions.changeOrder.overwriteDisabled && isEmpty(res)) {
			const msg = this.translateService.instant('procurement.package.wizard.createRequisition.noDifferenceFound').text;
			this.showInfo(true, msg, 1);
		} else {
			this.contractChangedItem = res;
			this.updateContractChangedItemGridConfig();
		}
		return res;
	}

	public async loadExistedValidBaseRequisition() {
		if (this.modalOptions.changeOrder.overwriteDisabled) {
			const dataList = await this.httpService.get<IExistedValidBaseRequisitionEntity[]>('procurement/requisition/requisition/getbasereqs?subPackageId=' + this.getIfSelectedIdElse(-1));
			if (dataList && dataList.length > 0) {
				dataList[0].Selected = true;
			}
			this.existedValidBaseReqColumns?.forEach((column) => {
				//platformRuntimeDataService.readonly(item, [{field: 'Selected', readonly: true}]);
				if (column.id === 'Selected') {
					column.readonly = true;
				}
			});
			this.existedValidBaseReqItems = dataList;
			this.updateExistedValidBaseRequisitionGridConfig();
		}

		//todo
		/*	$scope.$watch(createRequisitionService.selectedButtonReadonly, function (newValue, oldValve) {
				var readonly = newValue || newValue === oldValve;
				var dataList = dataService.getList();
				_.forEach(dataList, function (item) {
					item.Selected = false;
					platformRuntimeDataService.readonly(item, [{field: 'Selected', readonly: readonly}]);
				});
				createRequisitionService.scope.modalOptions.isSelectedBase = readonly;
				if (readonly) {
					createRequisitionService.scope.projectChange = null;
					$scope.modalOptions.selectedBaseReq = null;
				} else {
					if (!!dataList && dataList.length === 1) {
						dataList[0].Selected = true;
						createRequisitionService.scope.modalOptions.isSelectedBase = true;
						createRequisitionService.scope.modalOptions.selectedBaseReq = dataList[0];
					}
					createRequisitionService.scope.projectChange = createRequisitionService.scope.defaultChange;
				}
				$scope.modalOptions.doesCopyHeaderTextFromPackage = $scope.modalOptions.reqType === this.RequisitionType.createNewBase;
				dataService.gridRefresh();
			});*/
	}

	public onCellChanged(event: CellChangeEvent<IExistedValidBaseRequisitionEntity>): void {
		if (event.column.id === 'Selected') {
			if (event.item.Selected) {
				const list = this.existedValidBaseRequisitionGridConfig.items;
				if (list) {
					list.forEach((item) => {
						if (item.Id !== event.item.Id) {
							item.Selected = false;
						}
					});
				}
			}
			this.modalOptions.isSelectedBase = event.item.Selected;
			this.modalOptions.selectedBaseReq = event.item;
		}
	}

	/**
	 * Function to get id of the line item
	 * @returns line item id
	 */
	private getIfSelectedIdElse(elseValue: number): number {
		const sel = this.package2DataService.getSelectedEntity();
		return sel?.Id ?? elseValue;
	}

	private convertRequisitionType(reqType: string): RequisitionType {
		let type = this.RequisitionType.None;
		switch (reqType) {
			case 'createNewBase':
				type = this.RequisitionType.createNewBase;
				break;
			case 'overwriteReq':
				type = this.RequisitionType.overwriteReq;
				break;
			case 'createChangeOrder':
				type = this.RequisitionType.createChangeOrder;
				break;
		}
		return type;
	}

	public async ngOnInit(): Promise<void> {
		this.hasContractMessage = !!this.hasContractItem;
		this.modalOptions.selectedButtonReadonly = () => {
			return this.modalOptions.reqType !== this.RequisitionType.createChangeOrder;
		};

		// cache controller scope
		const selectedSubpackage = this.package2DataService.getSelectedEntity();
		if (selectedSubpackage) {
			this.selectedSubPackage = selectedSubpackage;
		}
		await this.setDataForCreateRequisition(this.selectedSubPackage.Id, this.hasContractItem, this.packageDataService.getSelectedEntity());
		await this.loadExistedValidBaseRequisition();
	}
}
