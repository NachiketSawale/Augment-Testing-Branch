/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification, } from '@libs/platform/common';
import { IEditorDialogResult, StandardDialogButtonId, } from '@libs/ui/common';
import { BUSINESSPARTNER_LOOKUP_WIZARD_TOKEN, BUSINESSPARTNER_WIZARD_INITIAL_VALUE_TOKEN, BusinessPartnerWizardComponent, IBusinessPartner2CreateRfqWizardResult } from '@libs/businesspartner/shared';
import { ProcurementCommonBusinessPartnerSearchWizardBaseService } from './business-partner-search-wizard-base.service';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';


/**Keywords in angularjs
 *  create_rfq_from_package:
 * 	wizardForCreateRfQFromPackage: true,  ==>IsShowContracts= true;
 *     mainData: selectedPackage,
 * 	Bidderdataes: suggestedBidders,
 *
 * 	create_rfq_from_requisition:
 *     IsWizardForCreateReq: true, ==>IsShowContracts= true;
 *     mainData: header,
 * 	Bidderdataes: Bidderdataes,
 **/


export abstract class ProcurementCommonCreateRfqWizardService<T extends IEntityIdentification, U extends CompleteIdentification<T>, PT extends object, PU extends CompleteIdentification<PT>>
	extends ProcurementCommonBusinessPartnerSearchWizardBaseService<T, U, PT, PU, IBusinessPartner2CreateRfqWizardResult> {


	protected override async doExecuteWizard(dialogResult: IBusinessPartner2CreateRfqWizardResult): Promise<boolean> {
		const selEntity = this.config.rootDataService.getSelectedEntity() as T;
		if (selEntity) {
			await this.config.rootDataService.update(selEntity);

			this.processExecuteWizard(dialogResult);

			if(this.config.url){
				await this.http.post(this.config.url, dialogResult);
			}

			return true;
		}
		return false;
	}

	protected override async dialogShow(): Promise<IEditorDialogResult<IBusinessPartner2CreateRfqWizardResult> | undefined> {
		const suggestedBidders = await this.getSuggestedBidders();
		return this.dialogService.show({
			headerText: 'procurement.common.createRfq.wizard',
			id: 'business-partner-create-rfq-wizard',
			showCloseButton: true,
			bodyComponent: BusinessPartnerWizardComponent,
			bodyProviders: [{
				provide: BUSINESSPARTNER_LOOKUP_WIZARD_TOKEN,
				useValue: {
					showContacts: true,
					showCopyBidder: true
				}
			}, {
				provide: BUSINESSPARTNER_WIZARD_INITIAL_VALUE_TOKEN,
				useValue: {
					execute: () => {
						return {
							...this.wizardInitialEntity,
							suggestedBidders: suggestedBidders
						};
					}
				}
			}
			],
			buttons: [
				{
					id: 'skipSearch', caption: {key: 'procurement.common.createRfq.skipSearch'},
					fn(evt, info) {
						info.dialog.body.handleCreateRfqWizardOkButtonClick(true);
					},
					isDisabled: false
				},
				{
					id: StandardDialogButtonId.Ok, caption: {key: 'ui.common.dialog.okBtn'},
					fn(evt, info) {
						info.dialog.body.handleCreateRfqWizardOkButtonClick();
					},
					isDisabled: info => !info.dialog.body.handleCreateRfqWizardOkButtonEnable()
				},
				{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}},
			]
		});
	}

	protected abstract processExecuteWizard(dialogResult: IBusinessPartner2CreateRfqWizardResult): void

	private async getSuggestedBidders() {
		if (this.wizardInitialEntity?.prcHeaderFk) {
			return await this.http.get<IPrcSuggestedBidderEntity[]>('procurement/common/wizard/getbidder', {
				params: {
					prcHeaderFk: this.wizardInitialEntity.prcHeaderFk
				}
			});
		}
		return undefined;
	}
}