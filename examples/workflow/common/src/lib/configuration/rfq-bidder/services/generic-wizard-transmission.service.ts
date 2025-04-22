import { IGenericWizardTransmissionService } from '../../../models/interface/generic-wizard-transmission-service.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { RfqBidders } from '../types/rfq-bidders.type';
import { inject, Injectable } from '@angular/core';
import { RfqBidderWizardContainers } from '../enum/rfq-bidder-containers.enum';
import { GenericWizardConfigService } from '../../../services/base/generic-wizard-config.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { IGenericWizardTransmissionErrors } from '../../../models/interface/generic-wizard-transmission-errors.interface';

/**
 * Service used to load/update the status of transmission for the generic wizard.
 */
@Injectable({
	providedIn: 'root'
})
export class GenericWizardTransmissionService implements IGenericWizardTransmissionService {

	private readonly genericWizardService = inject(GenericWizardConfigService);
	private readonly translateService = inject(PlatformTranslateService);
	private errorList!: IGenericWizardTransmissionErrors[];

	/**
	 * An observable stream of current selected bidders.
	 */
	private selectedRfqBidders$: BehaviorSubject<RfqBidders[]> = new BehaviorSubject<RfqBidders[]>([]);

	/**
	 * Selected bidders from bidder container.
	 */
	private selectedBidders: RfqBidders[] = [];

	public getBusinessPartners$(): Observable<RfqBidders[]> {
		return this.selectedRfqBidders$;
	}

	public loadIncludedBusinessPartners(): void {
		if (this.genericWizardService.getService(RfqBidderWizardContainers.RFQ_BIDDER)) {
			const businessPartnerService = this.genericWizardService.getService(RfqBidderWizardContainers.RFQ_BIDDER);
			this.selectedBidders = businessPartnerService.getList().filter(item => item.isIncluded);
			this.selectedRfqBidders$.next(this.selectedBidders);

			businessPartnerService.entitiesModified$.subscribe((modifiedItem: RfqBidders[]) => {
				this.selectedBidders = businessPartnerService.getList().filter(item => item.isIncluded);
				this.selectedRfqBidders$.next(this.selectedBidders);
			});
		}
	}

	public resetErrorList(): void {
		const businessPartnerService = this.genericWizardService.getService(RfqBidderWizardContainers.RFQ_BIDDER);
		const bidders = businessPartnerService.getList().filter(item => item.isIncluded);
		bidders.forEach(bidder => {
			bidder.sendStatus = undefined;
			bidder.errorList = [];
		});
	}

	public updateBusinessPartnersSendStatus$(rfqBidders: RfqBidders): void {
		const currentBidder = this.selectedBidders.find(item => item.BusinessPartnerFk === rfqBidders.BusinessPartnerFk);
		if (currentBidder) {
			currentBidder.sendStatus = rfqBidders.sendStatus;
			currentBidder.errorList = rfqBidders.errorList;
		}
		this.selectedRfqBidders$.next(this.selectedBidders);
	}


	/**
	 * set errors based
	 * @param errorList type of the configured error.
	 */
	public setErrorList(errorList: IGenericWizardTransmissionErrors[]): void {
		errorList.forEach((error) => {
			switch (error.type) {
				case 'reportError':
					error.message = this.translateService.instant('basics.workflow.sendRfQTransmission.reportErrorMessage', {
						reportId: error.id,
						templateName: error.displayValue,
					});
					break;
				case 'gaebError':
					error.message = this.translateService.instant('basics.workflow.sendRfQTransmission.gaebErrorMessage', {
						boqId: error.id,
						boqRefNo: error.displayValue,
					});
					break;
				case 'zipError':
					error.message = this.translateService.instant('basics.workflow.sendRfQTransmission.zipErrorMessage');
					break;
				case 'materialError':
					error.message = this.translateService.instant('basics.workflow.sendRfQTransmission.materialErrorMessage', {
						materialId: error.id,
						materialCode: error.displayValue,
					});
					break;
				case 'sendMailError':
					error.message = this.translateService.instant('basics.workflow.sendRfQTransmission.sendMailErrorMessage', {
						errorMessage: error.displayValue,
					});
					break;
				case 'contactMailError':
					error.message = this.translateService.instant('basics.workflow.sendRfQTransmission.contactMailErrorMessage', {
						bidderName: error.displayValue,
					});
					break;
				default:
					error.message =
						error.message ||
						this.translateService.instant('basics.workflow.sendRfQTransmission.undefinedErrorMessage');
			}
		});
		this.errorList = errorList;
	}
	
	public getErrorList(): IGenericWizardTransmissionErrors[] {
		return this.errorList;
	}
}