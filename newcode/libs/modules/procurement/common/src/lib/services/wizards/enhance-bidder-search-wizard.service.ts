/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IDialogErrorInfo, IEditorDialogResult, StandardDialogButtonId, } from '@libs/ui/common';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementCommonBusinessPartnerSearchWizardBaseService } from './business-partner-search-wizard-base.service';
import { BUSINESSPARTNER_LOOKUP_WIZARD_TOKEN, BUSINESSPARTNER_WIZARD_INITIAL_VALUE_TOKEN, BusinessPartnerWizardComponent, IBusinessPartner2EnhanceBidderSearchWizardResult } from '@libs/businesspartner/shared';
import { ICommonWizard } from '../../model/interfaces/wizard/common-wizard.interface';

/**Keywords in angularjs
 *   IsWizardForFindBidder
 *   isPrcCommonSuggestedBidder =true(package/requisition) false=>(rfq)
 */

export class ProcurementCommonEnhanceBidderSearchWizardService<T extends IEntityIdentification, U extends CompleteIdentification<T>, PT extends object, PU extends CompleteIdentification<PT>>
	extends ProcurementCommonBusinessPartnerSearchWizardBaseService<T, U, PT, PU, IBusinessPartner2EnhanceBidderSearchWizardResult>
	implements ICommonWizard {


	protected override async doExecuteWizard(dialogResult: IBusinessPartner2EnhanceBidderSearchWizardResult): Promise<boolean> {
		const selEntity = this.config.rootDataService.getSelectedEntity() as T;
		if (selEntity) {
			await this.config.rootDataService.update(selEntity);
			const CreateBpWizardResult = {
				NoBpSearchOut: 0,
				NoMatchBpSearchOut: 1,
				MatchAndSaveSuccess: 2,
				NotNeedSelectFindSupplier: 3
			};
			const params = {
				MainItemId: dialogResult.headerId,
				businessPartnerList: dialogResult.businessPartnerList,
				bpMapContactDic: dialogResult.bpMapContactDic,
				bpMapSubsidiaryDic: dialogResult.bpMapSubsidiaryDic
			};
			const url = this.config.url || 'procurement/common/suggestedbidder/creatersuggestedbidders';
			const response = await this.http.post<{ Entity: IPrcHeaderEntity, Message: number, NewResultCount: number, OldResultCount: number, resultCount: number }>(url, params);

			switch (response.Message) {
				case CreateBpWizardResult.NotNeedSelectFindSupplier:
					await this.showError('procurement.common.enhancedBidderSearch.notNeedSelectFindSupplier');
					break;
				case CreateBpWizardResult.NoBpSearchOut:
					await this.showError('procurement.common.enhancedBidderSearch.responseNoData');
					break;
				case CreateBpWizardResult.NoMatchBpSearchOut:
				case CreateBpWizardResult.MatchAndSaveSuccess:
					await this.messageBoxService.showMsgBox(
						this.translateService.instant('procurement.common.enhancedBidderSearch.oldSupplierCount').text + ':' + response.OldResultCount +
						this.translateService.instant('procurement.common.enhancedBidderSearch.resultSaveCount').text + ':' + response.resultCount,
						'cloud.common.informationDialogHeader',
						'ico-info'
					);
					break;
				default:
					break;
			}

			//todo  stateGo
			// platformModalService.showDialog(modalOptions).then(function () {
			// 	if(!isPrcCommonSuggestedBidder){
			// 		stateGo(response.Entity);
			// 	}
			// 	refreshBidder();
			// });
			return true;
		}
		return false;
	}

	protected override async dialogShow(): Promise<IEditorDialogResult<IBusinessPartner2EnhanceBidderSearchWizardResult> | undefined> {
		return this.dialogService.show({
			headerText: 'procurement.common.enhancedBidderSearch.wizard',
			id: 'enhance-bidder-search-wizard',
			showCloseButton: true,
			bodyComponent: BusinessPartnerWizardComponent,
			bodyProviders: [{
				provide: BUSINESSPARTNER_LOOKUP_WIZARD_TOKEN,
				useValue: {
					showContacts: true,
					isEnhanceBidder: true
				}
			}, {
				provide: BUSINESSPARTNER_WIZARD_INITIAL_VALUE_TOKEN,
				useValue: {
					execute: () => {
						return {
							...this.wizardInitialEntity
						};
					}
				}
			}
			],
			buttons: [
				{
					id: StandardDialogButtonId.Ok, caption: {key: 'ui.common.dialog.okBtn'},
					fn(evt, info) {
						info.dialog.body.handleEnhanceBidderSearchWizardOkButtonClick();
					},
					isDisabled: info => !info.dialog.body.handleEnhanceBidderSearchWizardOkButtonEnable()
				},
				{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}},
			]
		});
	}

	private async showError(message: string) {
		const errorInfo: IDialogErrorInfo = {
			errorCode: 0,
			errorVersion: '',
			errorMessage: this.translateService.instant(message).text,
			detailMethod: null,
			detailMessage: '',
			detailStackTrace: '',
			errorDetail: '',
		};
		await this.messageBoxService.showErrorDialog(errorInfo);
		return;
	}

	public async execute(context: IInitializationContext): Promise<void> {
		return this.onStartWizard();
	}
}