/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatNode, ServiceRole, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IRfqBusinessPartnerEntity, IRfqBusinessPartnerResponse } from '../model/entities/rfq-businesspartner-entity.interface';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqBusinessPartnerEntityComplete } from '../model/entities/rfq-businesspartner-entity-complete.class';
import { ProcurementRfqHeaderMainDataService } from './procurement-rfq-header-main-data.service';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';
import { ProcurementRfqBusinesspartnerReadonlyProcessorService } from './processors/rfq-businesspartner-readonly-processor.service';
import { RfqBusinessPartnerMainPortalUserManagementService } from './rfq-businesspartner-portal-user-management.service';
import { isArray, isUndefined } from 'lodash';
import { IContactEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqBusinessPartnerDataService extends DataServiceFlatNode<IRfqBusinessPartnerEntity, RfqBusinessPartnerEntityComplete, IRfqHeaderEntity, RfqHeaderEntityComplete> {

	private readonly businesspartnerContactPortalUserManagementService = inject(RfqBusinessPartnerMainPortalUserManagementService);

	/**
	 *
	 * @param parentService
	 */
	public constructor(
		private readonly parentService: ProcurementRfqHeaderMainDataService,
	) {
		super({
			apiUrl: 'procurement/rfq/businesspartner',
			readInfo: {
				endPoint: 'getlist',
				usePost: true
			},
			createInfo: {
				endPoint: 'createnew'
			},
			roleInfo: <IDataServiceChildRoleOptions<IRfqBusinessPartnerEntity, IRfqHeaderEntity, RfqHeaderEntityComplete>>{
				role: ServiceRole.Node,
				itemName: 'RfqBusinessPartner',
				parent: parentService,
			},
			processors: [] // TODO-DRIZZLE: Date time processor to be implemented.
			// doesRequireLoadAlways: platformPermissionService.hasRead('a2f96b998a304eecadbc246514c4089a') // TODO-DRIZZLE: Is this still needs?
		});

		this.processor.addProcessor(new ProcurementRfqBusinesspartnerReadonlyProcessorService(this));

		// TODO:DRIZZLE procurementRfqMainService.refreshRfqBusinessPartner.register(service.load);
	}

	public async updateContactHasPortalUserField(entities: IRfqBusinessPartnerEntity[]) {

		let contacts: IContactEntity[] = [];
		//let doesUpdate = false;

		entities.forEach(entity => {
			if (!entity.ContactFk) {
				entity.ContactHasPortalUser = false;
				//doesUpdate = true;
				return;
			}
			contacts.push({ Id: entity.ContactFk } as IContactEntity);
		});

		contacts = await this.businesspartnerContactPortalUserManagementService.getAndMapProviderInfo(contacts);
		if (!isArray(contacts)) {
			contacts = [];
		}

		entities.forEach(item => {
			if (!item.ContactFk) {
				return;
			}

			const found = contacts.find(contact => contact.Id === item.ContactFk);
			if (found) {
				item.ContactHasPortalUser = found.LogonName !== null && !isUndefined(found.LogonName);
				//doesUpdate = true;
			}
		});
		// TODO-DRIZZLE: businesspartnerContactPortalUserManagementService.getAndMapProviderInfo(contacts)
	}

	public override createUpdateEntity(modified: IRfqBusinessPartnerEntity | null): RfqBusinessPartnerEntityComplete {
		const complete = new RfqBusinessPartnerEntityComplete();
		if (modified) {
			complete.MainItemId = modified.Id;
			complete.RfqBusinessPartner = modified;
			complete.EntitiesCount = 1;
		}
		return complete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: RfqHeaderEntityComplete, modified: RfqBusinessPartnerEntityComplete[], deleted: IRfqBusinessPartnerEntity[]) {
		if (modified && modified.length > 0) {
			complete.RfqBusinessPartnerToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.RfqBusinessPartnerToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: RfqHeaderEntityComplete): IRfqBusinessPartnerEntity[] {
		return complete ?.RfqBusinessPartnerToSave ? complete.RfqBusinessPartnerToSave.map(e => e.RfqBusinessPartner!) : [];
	}

	protected override provideCreatePayload(): object {
		const selected = this.parentService.getSelectedEntity();
		return selected ? {
			Value: selected.Id
		} : {};
	}

	protected override onCreateSucceeded(created: IRfqBusinessPartnerEntity): IRfqBusinessPartnerEntity {
		return created;
	}

	protected override provideLoadPayload(): object {
		const selected = this.parentService.getSelectedEntity();
		return selected ? {
			Value: selected.Id
		} : {};
	}

	protected override onLoadSucceeded(loaded: IRfqBusinessPartnerResponse): IRfqBusinessPartnerEntity[] {
		this.updateContactHasPortalUserField(loaded.Main);
		return loaded.Main;
	}

	public override canDelete(): boolean {
		return super.canDelete() && !this.parentService.isEntityReadonly();
	}

	public override canCreate(): boolean {
		return super.canCreate() && !this.parentService.isEntityReadonly();
	}

	public disablePrev(): boolean {
		const selected = this.getSelectedEntity();
		const entities = this.getList();
		return !selected || entities.indexOf(selected) === 0;
	}

	public disableNext(): boolean {
		const selected = this.getSelectedEntity();
		const entities = this.getList();
		return !selected || entities.indexOf(selected) === (entities.length - 1);
	}
}