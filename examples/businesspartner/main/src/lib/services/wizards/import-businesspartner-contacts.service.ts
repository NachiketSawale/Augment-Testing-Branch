/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import { StandardDialogButtonId } from '@libs/ui/common';
import { BasicsSharedImportFileService, BasicsSharedVCardFileImportService, IBasicsSharedImportDataEntity, IImportVCardData, IVCardsValidateResult, IVCardTestResult } from '@libs/basics/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';

@Injectable({
	providedIn: 'root',
})
export class ImportBusinessPartnerContactsService extends BasicsSharedVCardFileImportService<IBasicsSharedImportDataEntity> {
	private readonly bpMainHeadDataService = inject(BusinesspartnerMainHeaderDataService);
	private readonly importFileService = inject(BasicsSharedImportFileService);

	public async importBusinessPartnerContacts() {
		const selectedPartner = this.bpMainHeadDataService.getSelectedEntity();
		if (!selectedPartner) {
			this.msgBoxSvc.showMsgBox('businesspartner.main.importContact.mustSelectBp', 'businesspartner.main.importContact.title', 'ico-info');
			return;
		}

		const context = this.importFileService.initImport(
			{
				internalModuleName: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName,
				importSectionType: 'Contact',
				dlgOptions: {
					fileFilter: 'text/x-vcard',
					header: 'businesspartner.main.importContact.title',
					multiSelect: true,
				},
			},
			this,
		);
		this.importFileService.startImport(context).then();
	}

	protected override async validateVCards(vCards: IImportVCardData[], results: IVCardTestResult[], entity: IBasicsSharedImportDataEntity, formData?: FormData): Promise<IVCardsValidateResult> {
		const selectedPartner = this.bpMainHeadDataService.getSelectedEntity();
		if (!selectedPartner) {
			return { isValid: false, error: '' };
		}
		const businessPartnerName1 = selectedPartner?.BusinessPartnerName1;
		let notMatchCount = 0;
		for (let i = vCards.length; i > 0; i--) {
			if (vCards[i - 1].ORG !== businessPartnerName1) {
				notMatchCount++;
			}
		}

		formData?.set('businessPartnerId', JSON.stringify(selectedPartner.Id));
		formData?.set('businessPartnerName1', businessPartnerName1 ?? '');
		formData?.set('saveByWarning', 'true');
		formData?.set('charSets', JSON.stringify(results));

		const result: IVCardsValidateResult = { isValid: false, error: '' };
		if (notMatchCount === 0) {
			result.isValid = true;
		} else {
			const head = 'businesspartner.main.importContact.title';
			const body = 'businesspartner.main.importContact.orgNotMatch';
			const dialogResult = await this.msgBoxSvc.showYesNoDialog({ showCancelButton: true, bodyText: body, headerText: head });
			if (dialogResult?.closingButtonId === StandardDialogButtonId.Yes) {
				result.isValid = true;
			} else if (dialogResult?.closingButtonId === StandardDialogButtonId.No) {
				const filesCount = Array.isArray(entity.file) ? entity.file.length : [entity.file].length;
				if (filesCount > notMatchCount) {
					formData?.set('saveByWarning', 'false');
					result.isValid = true;
				}
			}
		}
		return result;
	}

	public override async postImportProcess(entity?: IBasicsSharedImportDataEntity, formData?: FormData): Promise<void> {
		const selectedPartner = this.bpMainHeadDataService.getSelectedEntity();
		if (selectedPartner) {
			await this.bpMainHeadDataService.loadChildEntities(selectedPartner);
		}
	}
}
