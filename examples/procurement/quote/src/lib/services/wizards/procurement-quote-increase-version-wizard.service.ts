/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementQuoteHeaderDataService } from '../quote-header-data.service';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';

/**
 * Service responsible for increasing the version of selected procurement quote headers.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteIncreaseVersionWizardService {
	/**
	 * Used to inject ProcurementQuoteHeaderDataService
	 */
	private readonly procurementQuoteHeaderDataService = inject(ProcurementQuoteHeaderDataService);
	/**
	 * Used to inject PlatformTranslateService
	 */
	private readonly translate = inject(PlatformTranslateService);
	/**
	 * Used to inject Message Box Service
	 */
	private readonly dialogService = inject(UiCommonMessageBoxService);
	/**
	 * Used to inject PlatformHttpService
	 */
	private readonly http = inject(PlatformHttpService);

	/**
	 * Increases the version of selected procurement quote headers.
	 */
	public increaseVersion(): void {
		const headers = this.procurementQuoteHeaderDataService.getSelection();
		if (headers.length === 0) {
			return;
		}
		const newHeaders: IQuoteHeaderEntity[] = [];
		const invalidHeaders: IQuoteHeaderEntity[] = [];
		headers.forEach((header) => {
			if (header.IsIdealBidder) {
				invalidHeaders.push(header);
			} else if (!newHeaders.some((newHeader) => newHeader.RfqHeaderFk === header.RfqHeaderFk && newHeader.BusinessPartnerFk === header.BusinessPartnerFk)) {
				newHeaders.push(header);
			}
		});

		if (invalidHeaders.length > 0) {
			const invalidCodes = invalidHeaders.map((header) => header.Code).join(',');
			const bodyText = this.translate.instant('procurement.quote.wizard.increase.error.idealBidderSelected', {
				invalidQuoteCodes: invalidCodes,
			});

			this.dialogService.showMsgBox(bodyText.toString(), '', 'ico-info');

			if (invalidHeaders.length === headers.length) {
				return;
			}
		}

		this.procurementQuoteHeaderDataService.updateAndExecute(() => {
			this.http.post$<IQuoteHeaderEntity[]>('procurement/quote/header/increaseversion', newHeaders).subscribe((response) => {
				if (!response || response.length === 0) {
					return;
				}
				const list = this.procurementQuoteHeaderDataService.getList();

				newHeaders.forEach((header, index) => {
					const headerIndex = list.indexOf(header);
					if (headerIndex !== -1 && response[index]) {
						list.splice(headerIndex + 1, 0, response[index]);
					}
				});

				this.procurementQuoteHeaderDataService.refreshAll();
				this.procurementQuoteHeaderDataService.setModified(response[0]);
			});
		});
	}
}
