/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { Package2HeaderDataService } from '../services/package-2header-data.service';
import { ICustomDialogOptions, ILookupSearchRequest, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { isEmpty } from 'lodash';
import { IProjectChangeEntity, ProcurementShareProjectChangeLookupService } from '@libs/procurement/shared';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { ProcurementPackageCreateRequisitionComponent } from '../components/create-requisition/create-requisition.component';
import { CREATE_REQUISITION_DATA_TOKEN } from '../model/entity-info/create-requisition-data.model';
import { IReqHeaderEntity } from '@libs/procurement/common';
import { IConHeaderEntity } from '@libs/procurement/common';
import { INewBaseRequisitionResult } from '../model/entities/create-requisition/new-base-requisition-result.interface';
import { ICreateReqTypeResult } from '../model/entities/create-requisition/create-req-type-result.interface';
import { PlatformHttpService } from '@libs/platform/common';
import { RequisitionType } from '../model/enums/requisition-type.enum';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageCreateRequisitionWizardService {
	private readonly http = inject(HttpClient);
	private readonly httpService = inject(PlatformHttpService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly packageHeaderDataService = inject(ProcurementPackageHeaderDataService);
	private readonly package2HeaderDataService = inject(Package2HeaderDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly projectChangeLookupService = inject(ProcurementShareProjectChangeLookupService);
	private readonly dialog = inject(UiCommonDialogService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly webApiBaseUrl: string;

	public constructor() {
		this.webApiBaseUrl = this.configService.webApiBaseUrl;
	}

	public onStartWizard(): void {
		this.packageHeaderDataService.updateAndExecute(function () {
			//todo young, this function depend on boq service, need wait the boq service ready.
			/*const boqMainService = prcBoqMainService.getService(Package2HeaderDataService);
			const updateBoqPromiss = procurementCommonPrcBoqService.getService(Package2HeaderDataService, boqMainService).update();
			updateBoqPromiss.then(
				function () {
					wizardCreateRequisitionService.execute();
				},
				function () {
					wizardCreateRequisitionService.execute();
				},
			);*/
		});
		this.execute();
	}

	public async execute() {
		const headerText = this.translateService.instant('cloud.common.informationDialogHeader').text;
		if (!this.packageHeaderDataService?.hasSelection()) {
			const packageBodyText = this.translateService.instant('procurement.package.wizard.createRequisition.noPackageHeader').text;
			await this.messageBoxService.showMsgBox(packageBodyText, headerText, 'info');
			return;
		}
		const subPackages = this.package2HeaderDataService.getSelectedEntity();
		if (isEmpty(subPackages)) {
			const package2BodyText = this.translateService.instant('procurement.package.wizard.createRequisition.noPackage2Header').text;
			await this.messageBoxService.showMsgBox(package2BodyText, headerText, 'info');
			return;
		}

		const selectedPackage = this.packageHeaderDataService.getSelectedEntity();
		const pageState = {
			pageNumber: 0,
			pageSize: 1000,
		};
		const prjChangeRequest: ILookupSearchRequest = {
			searchFields: [],
			searchText: '',
			additionalParameters: {
				ProjectFk: selectedPackage?.ProjectFk,
				IsProcurement: true,
			},
			filterKey: 'project-change-lookup-for-procurement-common-filter',
			pageState: pageState,
			treeState: {},
		};

		this.projectChangeLookupService.getSearchList(prjChangeRequest).subscribe({
			next: (response) => {
				const data = response && response.items;
				let defaultChange: IProjectChangeEntity;
				if (!!data && data.length === 1) {
					defaultChange = data[0];
				}
				const selectedSubPackage = this.package2HeaderDataService.getSelectedEntity();
				const request = {
					MainItemIds: selectedSubPackage ? [selectedSubPackage.PrcHeaderFk] : [],
					ModuleName: 'procurement.package',
				};
				this.http.post(this.webApiBaseUrl + 'procurement/common/wizard/hascontracteddata', request).subscribe((res) => {
					const hasContractItem = res as boolean;
					const modalOption: ICustomDialogOptions<StandardDialogButtonId, ProcurementPackageCreateRequisitionComponent> = {
						headerText: this.translateService.instant('procurement.package.wizard.createRequisition').text,
						resizeable: true,
						maxWidth: '1200px',
						width: '960px',
						buttons: [
							{
								id: 'Navigator',
								caption: { key: 'cloud.common.Navigator.goTo' },
								isVisible: (info) => {
									const step = info.dialog.body.modalOptions.step;
									return step === 'step1' || step === 'step3';
								},
								isDisabled: (info) => {
									const component = info.dialog.body as ProcurementPackageCreateRequisitionComponent;
									return component.modalOptions.isBtnNavigateDisabled;
								},
								fn: (event, info) => {
									const component = info.dialog.body as ProcurementPackageCreateRequisitionComponent;
									component.onNavigate();
								},
							},
							{
								id: StandardDialogButtonId.Ok,
								caption: { key: 'cloud.common.ok' },
								isVisible: (info) => {
									return info.dialog.body.modalOptions.step === 'step2';
								},
								isDisabled: (info) => {
									const component = info.dialog.body as ProcurementPackageCreateRequisitionComponent;
									return component.modalOptions.isBtnOKDisabled || (component.modalOptions.reqType == RequisitionType.createChangeOrder && (!component.modalOptions.isSelectedBase || !component.projectChange));
								},
								fn: async (event, info) => {
									const component = info.dialog.body as ProcurementPackageCreateRequisitionComponent;
									await component.onOK();
								},
							},
							{
								id: StandardDialogButtonId.Cancel,
								caption: { key: 'cloud.common.cancel' },
							},
							{
								id: 'Next',
								caption: { key: 'cloud.common.nextStep' },
								isVisible: (info) => {
									return info.dialog.body.modalOptions.step === 'step1';
								},
								isDisabled: (info) => {
									const component = info.dialog.body as ProcurementPackageCreateRequisitionComponent;
									return component.modalOptions.isBtnNextDisabled;
								},
								fn: (event, info) => {
									const component = info.dialog.body as ProcurementPackageCreateRequisitionComponent;
									component.onNext();
								},
							},
						],
						bodyComponent: ProcurementPackageCreateRequisitionComponent,
						bodyProviders: [
							{
								provide: CREATE_REQUISITION_DATA_TOKEN,
								useValue: {
									hasContractItem: hasContractItem,
									defaultChange: defaultChange,
								},
							},
						],
					};
					this.dialog.show(modalOption);
				});
			},
		});
	}

	public hasData(subPackageId: number | undefined) {
		return this.httpService.post<boolean>('procurement/package/wizard/hasdata', { subPackageId: subPackageId });
	}

	public hasContract(subPackageId: number) {
		return this.httpService.get<boolean>('procurement/contract/header/hascontract?subPackageId=' + subPackageId);
	}

	public baseContract(subPackageId: number | undefined) {
		return this.httpService.get<IConHeaderEntity>('procurement/contract/header/basecontract?subPackageId=' + subPackageId);
	}

	public checkBoqInOtherPkg(pkgId: number | undefined, pkgCode: string | undefined) {
		return this.httpService.get<boolean>('procurement/contract/header/checkboqinotherpkg?packageid=' + pkgId + '&packagecode=' + pkgCode);
	}

	public overwriteRequisition(subPackageId: number | undefined, doesCopyHeaderTextFromPackage: boolean) {
		const param = 'package2HeaderId=' + subPackageId + '&doesCopyHeaderTextFromPackage=' + doesCopyHeaderTextFromPackage;
		return this.http.get<INewBaseRequisitionResult>(this.webApiBaseUrl + 'procurement/package/wizard/overwriterequisition?' + param);
	}

	public createChangeOrderRequisition(subPackageId: number, reqHeaderId: number, projectChangeId: number, isCreateWithNoDifference: boolean, doesCopyHeaderTextFromPackage: boolean) {
		const params = {
			package2HeaderId: subPackageId,
			reqHeaderId: reqHeaderId,
			projectChangeId: projectChangeId,
			doesCopyHeaderTextFromPackage: doesCopyHeaderTextFromPackage,
			isCreateWithNoDifference: isCreateWithNoDifference,
		};
		return this.http.get<number>(this.webApiBaseUrl + 'procurement/package/wizard/changeorderrequisition', { params: params });
	}

	public createNewBaseRequisition(subPackageId: number | undefined) {
		const param = 'package2HeaderId=' + subPackageId;
		return this.http.get<INewBaseRequisitionResult>(this.webApiBaseUrl + 'procurement/package/wizard/newbaserequisition?' + param);
	}

	public createChangeOrderFromContract(subPackageId: number, projectChangeId: number, contractId: number, baseReqId: number) {
		const requisitionId = !baseReqId || baseReqId <= 0 ? 0 : baseReqId;
		const params = {
			package2HeaderId: subPackageId,
			projectChangeId: projectChangeId,
			contractId: contractId,
			baseReqId: requisitionId,
		};
		return this.http.get<number>(this.webApiBaseUrl + 'procurement/package/wizard/changeorderFromContract', { params: params });
	}

	public getCreatedRequisition(requisitionId: number) {
		return this.httpService.get<IReqHeaderEntity>('procurement/requisition/requisition/getitembyId?id=' + requisitionId);
	}

	public getCreateReqType(subPackageId: number | undefined) {
		return this.httpService.get<ICreateReqTypeResult>('procurement/requisition/requisition/getcreatereqtype?subPackageId=' + subPackageId);
	}
}
