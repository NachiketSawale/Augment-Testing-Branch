import { inject, Injectable } from '@angular/core';
import {
	createLookup,
	FieldType,
	GridStep,
	IGridConfiguration,
	MultistepDialog,
	MultistepTitleFormat,
	StandardDialogButtonId,
	UiCommonMessageBoxService,
	UiCommonMultistepDialogService
} from '@libs/ui/common';
import { BusinesspartnerSharedStatus2LookupService, BusinesspartnerSharedStatusLookupService } from '@libs/businesspartner/shared';
import { ProcurementCommonCompanyContextService } from '../../services/procurement-common-company-context.service';
import {
	PlatformConfigurationService,
	PlatformHttpService,
	ServiceLocator
} from '@libs/platform/common';
import { interval, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isArray, forEach, find } from 'lodash';
import { IBusinessPartnerPortalEntity } from '@libs/businesspartner/interfaces';

export interface IBidderSearchWizardOptions {
	/*
	 * url of saving bidders
	 */
	savePortalBizPartnerUrl: string;
	/*
	 * bidder list of current entity selected
	 */
	currentBidderList: { BusinessPartnerFk: number }[];
	/*
	 * is parent entity selected
	 */
	isParentSelected: boolean;
	/*
	 * main item id: like PrcHeaderFk or RfqHeaderFk
	 */
	mainItemId?: number;
	/*
	 * callback function after bidders created
	 */
	onCreatedSucceeded?: (data: object) => void;
	/**
	 * additional parameters for inquiry business partner
	 * default inquiry url: '#/api?navigate&operation=inquiry&selection=multiple&confirm=1&module=businesspartner.main&requestid=0a862aa7e875442d447359dd500616ff68c10203&company=904&roleid=1';
	 * if additional parameters are needed, please do as follows:
	 * {
	 * rfqProjectFk: 277,
	 * rfqCompanyFk: 124
	 * }
	 */
	additionalInquiryParams?: Record<string, number | undefined>;
}

export interface IBidderSearchWizardCreateRequest {
	Id: number;
	BpId: number;
	SubsidiaryId: number;
	SupplierId?: number | null;
}

@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonBidderSearchWizardService {
	private readonly companyContext = inject(ProcurementCommonCompanyContextService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);
	private readonly httpService = inject(PlatformHttpService);
	private readonly messageBoxService = ServiceLocator.injector.get(UiCommonMessageBoxService);
	private requestDataSubscription: Subscription | null = null;

	public async execute(options: IBidderSearchWizardOptions) {
		this.unsubscribeRequestData();
		if (!options.isParentSelected) {
			await this.messageBoxService.showMsgBox({
				bodyText: 'No parent entity is selected.',
				buttons: [{ id: StandardDialogButtonId.Ok }],
				iconClass: 'ico-info',
			});
			return;
		}
		await this.companyContext.prepareLoginCompany();
		const multiStepService = ServiceLocator.injector.get(UiCommonMultistepDialogService);
		const gridData = {
			items: <IBusinessPartnerPortalEntity[]>[],
		};
		const gridConfig: IGridConfiguration<IBusinessPartnerPortalEntity> = {
			uuid: 'f1b9c24970d7414fbaa7535baf15d6cd',
			skipPermissionCheck: true,
			columns: [
				{
					id: 'BusinessPartnerStatus',
					model: 'BusinessPartnerStatus',
					label: 'procurement.rfq.businessPartnerStatus',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedStatusLookupService,
					}),
					readonly: true,
					width: 100,
					sortable: true,
					visible: true,
				},
				{
					id: 'BusinessPartnerStatus2',
					model: 'BusinessPartnerStatus2',
					label: 'procurement.rfq.uniformBusinessPartnerStatus2',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedStatus2LookupService,
					}),
					width: 100,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'matchCode',
					model: 'MatchCode',
					label: 'businesspartner.main.matchCode',
					type: FieldType.Description,
					width: 100,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'bpName1',
					model: 'BusinessPartnerName1',
					label: 'cloud.common.entityName',
					type: FieldType.Description,
					width: 100,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'zipCode',
					model: 'ZipCode',
					label: 'procurement.rfq.uniformBusinessPartnerNZip',
					type: FieldType.Description,
					width: 100,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'city',
					model: 'City',
					label: 'cloud.common.entityCity',
					type: FieldType.Description,
					width: 100,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'street',
					model: 'Street',
					label: 'cloud.common.entityStreet',
					type: FieldType.Description,
					width: 100,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'userdefined1',
					model: 'Userdefined1',
					label: 'businesspartner.main.import.entityUserDefined1',
					type: FieldType.Description,
					width: 100,
					sortable: true,
					visible: true,
					readonly: true,
				},
			],
		};

		const bidderPageConfig = new GridStep('showData', 'basics.common.wizardDialog.title.businesspartnerPortal', gridConfig, 'items');
		const multiStepDialog = new MultistepDialog(gridData, [bidderPageConfig]);
		multiStepDialog.dialogOptions.width = '50%';
		multiStepDialog.titleFormat = MultistepTitleFormat.StepTitle;
		multiStepDialog.hideDisplayOfNextStep = true;
		multiStepDialog.hideIndicators = true;
		multiStepDialog.dialogOptions.buttons = [
			{
				id: 'create',
				caption: 'cloud.common.ok',
				isDisabled: () => {
					return bidderPageConfig.gridConfiguration.items ? bidderPageConfig.gridConfiguration.items.length === 0 : true;
				},
				fn: (event, info) => {
					info.dialog.close(StandardDialogButtonId.Ok);
				},
			},
			{
				id: StandardDialogButtonId.Cancel,
			},
		];

		setTimeout(() => {
			this.startInquiryData(options, bidderPageConfig);
		}, 500);

		const result = await multiStepService.showDialog(multiStepDialog);
		if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
			await this.createData(options, result.value.items);
		}
		this.unsubscribeRequestData();
	}

	private unsubscribeRequestData() {
		if (this.requestDataSubscription) {
			this.requestDataSubscription.unsubscribe();
			this.requestDataSubscription = null;
		}
	}

	private startInquiryData(options: IBidderSearchWizardOptions, page: GridStep<IBusinessPartnerPortalEntity>) {
		const requestId = this.uuidGenerator();
		this.inquiryData(requestId, options.additionalInquiryParams);

		if (!this.requestDataSubscription) {
			// request data every 5 second until user saved the selected items from bizPartner portal.
			this.requestDataSubscription = interval(5000).subscribe(() => {
				this.requestData(requestId).subscribe({
					next: (portalBidders) => {
						if (isArray(portalBidders) && portalBidders.length > 0) {
							this.stopRequestData();
							page.gridConfiguration.items = portalBidders;
							page.refreshGrid();
						}
					},
				});
			});
		}
	}

	private requestData(requestId: string) {
		return this.http.post<IBusinessPartnerPortalEntity[]>(this.configService.webApiBaseUrl + 'businesspartner/main/businesspartner/requestportalbizpartner', { Value: requestId });
	}

	private inquiryData(requestId: string, additionalParams?: Record<string, number | undefined>) {
		const companyCode = this.companyContext.loginCompanyEntity.Code;
		const roleId = this.configService.permissionRoleId;
		let api = '#/api?navigate&operation=inquiry&selection=multiple&confirm=1&module=businesspartner.main&requestid=' + requestId + '&company=' + companyCode + '&roleid=' + roleId;
		if (additionalParams && Object.keys(additionalParams).length > 0) {
			for (const key in additionalParams) {
				// todo chi: right
				const value = additionalParams[key];
				api = api + '&' + key + '=' + value;
			}
		}

		const url = window.location.origin + this.configService.appBaseUrl + api;
		const win = window.open(url);

		if (win) {
			win.focus();
		}
	}

	private async createData(options: IBidderSearchWizardOptions, portBpList: IBusinessPartnerPortalEntity[]) {
		const mainItemId = options.mainItemId;
		const currentBidderList = options.currentBidderList;
		const data: IBidderSearchWizardCreateRequest[] = [];
		if (!mainItemId) {
			return;
		}
		// exclude the duplicated items
		forEach(portBpList, function (newItem) {
			const item = find(currentBidderList, (existedItem) => {
				return newItem.Id === existedItem.BusinessPartnerFk;
			});
			if (!item) {
				// if not existed, add it.
				data.push({
					Id: mainItemId,
					BpId: newItem.Id,
					SubsidiaryId: newItem.SubsidiaryFk || 0,
					SupplierId: newItem.SupplierId,
				});
			}
		});

		if (data.length > 0) {
			const dataCreated = await this.httpService.post<object>(options.savePortalBizPartnerUrl, data);
			if (options.onCreatedSucceeded) {
				options.onCreatedSucceeded(dataCreated);
			}
		}
	}

	private stopRequestData() {
		this.unsubscribeRequestData();
	}

	private uuidGenerator(long?: boolean) {
		if (long) {
			return this._p8() + this._p8(true) + this._p8(true) + this._p8();
		} else {
			return this._p8() + this._p8() + this._p8() + this._p8();
		}
	}

	private _p8(s?: boolean) {
		const p = (Math.random().toString(16) + '000000000').substring(2, 8);

		return s ? '-' + p.substring(0, 4) + '-' + p.substring(4, 4) : p;
	}
}