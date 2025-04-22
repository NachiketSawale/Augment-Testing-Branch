/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { StandardDialogButtonId } from '@libs/ui/common';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BasicsSharedImportFileService, BasicsSharedVCardFileImportService, IBasicsSharedImportDataEntity, IImportVCardData, IVCardsValidateResult, IVCardTestResult } from '@libs/basics/shared';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';

@Injectable({
	providedIn: 'root',
})
export class ImportBusinesspartnerService extends BasicsSharedVCardFileImportService<IBasicsSharedImportDataEntity> {
	private readonly bpMainHeadDataService = inject(BusinesspartnerMainHeaderDataService);
	private readonly importFileService = inject(BasicsSharedImportFileService);

	public importBusinessPartner() {
		const context = this.importFileService.initImport(
			{
				internalModuleName: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName,
				importSectionType: 'Partner',
				dlgOptions: {
					fileFilter: 'text/x-vcard',
					header: 'businesspartner.main.importBusinessPartner.title',
				},
			},
			this,
		);
		this.importFileService.startImport(context).then();
	}

	protected override async validateVCards(vCards: IImportVCardData[], results: IVCardTestResult[], entity: IBasicsSharedImportDataEntity, formData?: FormData): Promise<IVCardsValidateResult> {
		const businessPartners: string[] = vCards.map((card) => card.ORG).filter((org) => org);
		if (businessPartners.length === 0) {
			const error = this.translate.instant('businesspartner.main.importBusinessPartner.bpNameIsEmpty').text;
			return { isValid: false, error: error };
		}

		const result: IVCardsValidateResult = { isValid: false, error: '' };
		try {
			const response = await this.bpMainHeadDataService.checkBusinessPartnerIsExists(businessPartners);
			formData?.set('saveByWarning', 'true');
			formData?.set('charSets', JSON.stringify(results));
			if (response && response.length > 0) {
				const head = this.translate.instant('businesspartner.main.importBusinessPartner.title').text;
				const body = this.translate.instant('businesspartner.main.importBusinessPartner.leaveSame').text;
				const dialogResult = await this.msgBoxSvc.showYesNoDialog(body, head);
				if (dialogResult?.closingButtonId === StandardDialogButtonId.Yes) {
					result.isValid = true;
				}
			} else {
				result.isValid = true;
			}
		} catch (error) {
			console.error('Error checking business partner existence:', error);
			result.error = error;
		}

		return result;
	}

	public override postImportProcess(entity?: IBasicsSharedImportDataEntity, formData?: FormData): Promise<void> {
		return this.bpMainHeadDataService.refreshAll();
	}
}
