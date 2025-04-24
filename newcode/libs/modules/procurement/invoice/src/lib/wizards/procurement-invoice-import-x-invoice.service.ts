/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { IInvHeaderEntity } from '../model';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceImportXInvoiceWizardService {
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly formDialogService = inject(UiCommonFormDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly http = inject(PlatformHttpService);
	protected readonly dataService = inject(ProcurementInvoiceHeaderDataService);

	public async onStartWizard() {
		return await this.dataService.updateAndExecute(() => {
			const fileElement = document.createElement('input');
			fileElement.type = 'file';
			fileElement.accept = '.xml';
			fileElement.onchange = () => {
				if (fileElement.files && fileElement.files.length > 0) {
					this.startImport(fileElement.files[0]);
				}
			};
			fileElement.click();
		});
	}

	private startImport(file: File): void {
		const fileReader = new FileReader();
		fileReader.onload = (e: ProgressEvent<FileReader>) => {
			this.importXInvoice(file.name, (e.target!.result as string).split(',')[1]);
		};
		fileReader.readAsDataURL(file);
	}

	private async importXInvoice(fileName: string, content: string) {
		const request = {
			FileName: fileName,
			FileContent: { Content: content },
		};
		const response = await this.http.post<{ InvHeader: IInvHeaderEntity; Warnings: string[]; ErrorLogPath: string; ErrorMessage: string }>('procurement/invoice/importxinvoice', request);

		if (response) {
			if (response.InvHeader) {
				await this.dataService.refreshAll();
				const infoText = `${response.InvHeader.Code}, ${this.translateService.instant('procurement.invoice.wizard.invoice.import.xInvoiceImportSucceeded').text}`;
				if (response.Warnings?.length) {
					await this.messageBoxService.showMsgBox({
						bodyText: response.Warnings.join('\n'),
						headerText: infoText,
					});
				} else {
					await this.messageBoxService.showMsgBox({
						headerText: 'cloud.common.infoBoxHeader',
						iconClass: 'info',
						bodyText: infoText,
					});
				}
			} else if (response.ErrorMessage) {
				await this.messageBoxService.showErrorDialog(response.ErrorMessage);
			} else if (response.ErrorLogPath) {
				window.open(response.ErrorLogPath);
			}
		}
	}
}
