/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { RfqBidderSender } from '../configuration/rfq-bidder/types/rfq-bidder-sender.type';
import { IEntityContext } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { GenericWizardConfigService } from '../services/base/generic-wizard-config.service';
import { RfqBidderWizardContainers } from '../configuration/rfq-bidder/enum/rfq-bidder-containers.enum';

@Injectable({
	providedIn: 'root'
})
export class GenericWizardSenderLookupService extends UiCommonLookupEndpointDataService <RfqBidderSender> {

	private readonly wizardConfigService = inject(GenericWizardConfigService);

	public constructor() {
		super({httpRead: {route: 'procurement/rfq/wizard', endPointRead: 'getSenderMail', usePostForRead: false}}, {
			displayMember: 'Value',
			uuid: 'fd56e97d22494904802b70b2906b6113',
			valueMember: 'Value',
		});
	}

	public override getList(context?: IEntityContext<RfqBidderSender>): Observable<RfqBidderSender[]> {
		return new Observable<RfqBidderSender[]>(observer => {
			let filteredSender: RfqBidderSender[] = [];
			super.getList(context).subscribe(items => {
				const settings = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_BIDDER_SETTINGS).getList()[0];
				filteredSender = settings.SendWithOwnMailAddress ? [items[1]] : items;
				observer.next(filteredSender);
				observer.complete();
			});
		});
	}


}