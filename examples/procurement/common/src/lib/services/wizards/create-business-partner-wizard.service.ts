import {
	CompleteIdentification,
	IEntityIdentification,
	PlatformConfigurationService,
	PlatformLazyInjectorService,
	ServiceLocator,
	Translatable
} from '@libs/platform/common';
import { Router } from '@angular/router';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import { MODULE_INFO_PROCUREMENT } from '../../model/entity-info/module-info-common.model';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { ICreateBusinessPartnerWizardOptions } from '../../model/interfaces/wizard/create-business-partner-wizard.interface';
import { BUSINESSPARTNER_DATA_PROVIDER } from '@libs/businesspartner/interfaces';

export class ProcurementCommonCreateBusinessPartnerWizardService<T extends IPrcSuggestedBidderEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>, RT extends IEntityIdentification, RU extends CompleteIdentification<RT>> {
	private readonly configService = ServiceLocator.injector.get(PlatformConfigurationService);
	private readonly router = ServiceLocator.injector.get(Router);
	private readonly messageBoxService = ServiceLocator.injector.get(UiCommonMessageBoxService);
	private readonly http = ServiceLocator.injector.get(HttpClient);
	private readonly lazyInjector = ServiceLocator.injector.get(PlatformLazyInjectorService);
	private bpIds: number[] = [];

	public constructor(public options: ICreateBusinessPartnerWizardOptions<T, PT, PU, RT, RU>) {}

	protected onCreatedSuccess() {}

	protected getPrcHeaderFk(entity: PT | RT): number {
		throw new Error('Should be implemented.');
	}

	private async goTo() {
		const url = this.configService.defaultState + '/businesspartner/main';
		await this.router.navigate([url]);
		const bpService = await this.getBusinessPartnerDataService();
		const tempBpIds: IEntityIdentification[] = [];
		this.bpIds.forEach((id) => {
			tempBpIds.push({
				Id: id,
			});
		});
		this.bpIds = [];
		bpService.refreshOnlySelected(tempBpIds);
	}

	public async createBusinessPartner() {
		const moduleName = this.options.moduleName;

		if (!moduleName) {
			return;
		}

		const rootService = this.options.rootService;
		const suggestedBidderService = this.options.suggestedBidderService;
		const parentService = this.options.parentService || this.options.rootService;
		const leadingSelected = rootService.getSelectedEntity();
		const parentEntity = parentService.getSelectedEntity(); // get it's prcHeaderFk;

		// it is better compare with full module name.
		if (!leadingSelected) {
			let message: Translatable | null = null;
			if (moduleName === MODULE_INFO_PROCUREMENT.ProcurementPackageModuleName) {
				message = 'procurement.common.wizard.createBusinessPartner.errorNoSelectOnePackage';
			} else if (moduleName === MODULE_INFO_PROCUREMENT.ProcurementRequisitionModuleName) {
				message = 'procurement.common.wizard.createBusinessPartner.errorNoSelectOneREQ';
			} else if (moduleName === MODULE_INFO_PROCUREMENT.ProcurementRfqModuleName) {
				message = 'procurement.common.wizard.createBusinessPartner.errorNoSelectOneRfq';
			}

			if (message) {
				await this.messageBoxService.showMsgBox({
					bodyText: message,
					buttons: [{ id: StandardDialogButtonId.Ok }],
					iconClass: 'ico-info',
				});
			}
			return;
		}

		if (!parentEntity) {
			return;
		}

		await rootService.update(leadingSelected);

		const bidderList = suggestedBidderService.getList();
		const data: IPrcSuggestedBidderEntity[] = [];
		let isHasNullBpName = false;
		bidderList.forEach((item) => {
			if (!item.BusinessPartnerFk) {
				const temp = { ...item };
				data.push(temp);
			}

			if (!item.BpName1) {
				isHasNullBpName = true;
			}
		});

		if (!data || data.length === 0) {
			await this.messageBoxService.showMsgBox({
				bodyText: 'procurement.common.wizard.createBusinessPartner.errorNoSBWithouBP',
				buttons: [{ id: StandardDialogButtonId.Ok }],
				iconClass: 'ico-info',
			});
			return;
		}

		if (isHasNullBpName) {
			await this.messageBoxService.showMsgBox({
				bodyText: 'procurement.common.wizard.createBusinessPartner.bidderHasNoBpName',
				buttons: [{ id: StandardDialogButtonId.Ok }],
				iconClass: 'ico-info',
			});
			return;
		}

		const prcHeaderFk = this.getPrcHeaderFk(parentEntity);

		let rfqHeaderFk = -1;
		if (moduleName === MODULE_INFO_PROCUREMENT.ProcurementRfqModuleName) {
			rfqHeaderFk = leadingSelected.Id;
		}
		this.http
			.post<IPrcSuggestedBidderEntity[]>(this.configService.webApiBaseUrl + 'procurement/common/wizard/createwithparams', {
				params: {
					prcHeaderFk: prcHeaderFk,
					rfqHeaderFk: rfqHeaderFk,
				},
			})
			.subscribe({
				next: (result) => {
					if (result.length === 0) {
						this.messageBoxService.showMsgBox({
							bodyText: 'procurement.common.wizard.createBusinessPartner.errorNoSBWithouBPReload',
							buttons: [{ id: StandardDialogButtonId.Ok }],
							iconClass: 'ico-info',
						});
						suggestedBidderService.load({ id: parentEntity?.Id || -1 });
					} else {
						result.forEach((bidder) => {
							if (bidder.BusinessPartnerFk) {
								this.bpIds.push(bidder.BusinessPartnerFk);
							}
						});

						this.messageBoxService.showMsgBox({
							headerText: 'procurement.common.wizard.createBusinessPartner.headerText',
							bodyText:
								result.length > 1
									? {
										key: 'procurement.common.wizard.createBusinessPartner.bodyTextMulti',
										params: {length: result.length},
									}
									: 'procurement.common.wizard.createBusinessPartner.bodyText',
							buttons: [
								{
									id: 'goto',
									caption: 'Go To BusinessPartner',
									fn: (event, info) => {
										this.goTo();
										info.dialog.close(StandardDialogButtonId.Ok);
									},
								},
								{
									id: StandardDialogButtonId.Ok,
									fn: (event, info) => {
										this.bpIds = [];
										info.dialog.close(StandardDialogButtonId.Ok);
									},
								},
							],
						})?.then(() => {
							this.onCreatedSuccess();
						});
					}
				},
				error: () => {
					this.messageBoxService.showMsgBox({
						bodyText: 'procurement.common.wizard.createBusinessPartner.failToCreate',
						buttons: [{ id: StandardDialogButtonId.Ok }],
						iconClass: 'ico-info',
					});
				},
			});
	}

	private async getBusinessPartnerDataService() {
		return await this.lazyInjector.inject(BUSINESSPARTNER_DATA_PROVIDER);
	}
}