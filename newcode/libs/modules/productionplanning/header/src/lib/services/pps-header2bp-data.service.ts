/*
 * Copyright(c) RIB Software GmbH
 */
/* it's useless, to be deleted in the future
import { Injectable, inject, } from '@angular/core';
import { ServiceRole, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { PpsHeaderDataService } from './pps-header-data.service';
import { IPpsHeaderEntity } from '../model/entities/pps-header-entity.interface';
import { PpsHeaderComplete } from '../model/pps-header-complete.class';
import {
	PpsCommonBizPartnerComplete,
	IPpsCommonBizPartnerEntity, PpsCommonBusinessPartnerDataService,
} from '@libs/productionplanning/common';

@Injectable({
	providedIn: 'root'
})
export class PpsHeader2BpDataService extends PpsCommonBusinessPartnerDataService<IPpsCommonBizPartnerEntity, PpsCommonBizPartnerComplete, IPpsHeaderEntity, PpsHeaderComplete> {
	public constructor() {
		const roleInfo: IDataServiceChildRoleOptions<IPpsCommonBizPartnerEntity, IPpsHeaderEntity, PpsHeaderComplete> = {
			role: ServiceRole.Node,
			itemName: 'CommonBizPartner',
			parent: inject(PpsHeaderDataService)
		};

		super(roleInfo, 'PrjProjectFk', 'Id');
	}

	public override createUpdateEntity(modified: IPpsCommonBizPartnerEntity | null): PpsCommonBizPartnerComplete {
		const complete = new PpsCommonBizPartnerComplete();

		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.CommonBizPartner = modified;
		}

		return complete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: PpsHeaderComplete, modified: PpsCommonBizPartnerComplete[], deleted: IPpsCommonBizPartnerEntity[]) {
		if (modified && modified.length > 0) {
			complete.CommonBizPartnerToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			complete.CommonBizPartnerToDelete = deleted;
		}
	}
}
*/