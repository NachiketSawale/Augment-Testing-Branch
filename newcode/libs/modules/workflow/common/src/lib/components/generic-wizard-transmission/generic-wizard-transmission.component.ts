/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { GenericWizardTransmissionService } from '../../configuration/rfq-bidder/services/generic-wizard-transmission.service';
import { RfqBidders } from '../../configuration/rfq-bidder/types/rfq-bidders.type';
import { GenericWizardConfigService } from '../../services/base/generic-wizard-config.service';
import { Subscription } from 'rxjs';
import { BidderSendStatus } from '../../configuration/rfq-bidder/enum/bidder-send-status.enum';



@Component({
	selector: 'workflow-common-generic-wizard-transmission',
	templateUrl: './generic-wizard-transmission.component.html',
	styleUrl: './generic-wizard-transmission.component.scss',
})
export class GenericWizardTransmissionComponent extends ContainerBaseComponent{

	private readonly transmissionService = inject(GenericWizardTransmissionService);
	private readonly genericWizardService = inject(GenericWizardConfigService);
	private readonly subscription: Subscription;

	public transmissionBidders: RfqBidders[] = [];

	/**
	 * Displayed columns in the transmission container
	 */
	public displayedColumns: string[] = ['bidder', 'status'];

	public constructor() {
		super();
		this.transmissionService.loadIncludedBusinessPartners();
		this.subscription = this.transmissionService.getBusinessPartners$().subscribe(value => {
			this.transmissionBidders = value;
		});
		this.registerFinalizer(() => this.subscription.unsubscribe());
	}

	/**
	 * Gets icon based on current transmission state for the corresponding bidder.
	 * @param sendStatus 
	 * @returns 
	 */
	public getTransmissionStatusIcon(sendStatus: BidderSendStatus): string {
		switch(sendStatus) {
			case BidderSendStatus.Loading:
				return 'spinner-sm';
			case BidderSendStatus.Error:
				return 'control-icons ico-grid-stop';
			case BidderSendStatus.Success:
				return 'control-icons ico-tick';
			default: 
				return 'control-icons ico-blank';
		}
	}

	protected readonly BidderSendStatus = BidderSendStatus;
}
