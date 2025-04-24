/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	ServiceRole,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions, DataServiceFlatLeaf
} from '@libs/platform/data-access';
import { IRfqBusinessPartnerEntity } from '../model/entities/rfq-businesspartner-entity.interface';
import { RfqBusinessPartnerEntityComplete } from '../model/entities/rfq-businesspartner-entity-complete.class';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IContactEntity } from '@libs/businesspartner/interfaces';
import { ProcurementRfqBusinessPartnerDataService } from './rfq-business-partner-data.service';
import { IRfqBusinessPartner2ContactEntity } from '../model/entities/rfq-businesspartner-2contact-entity.interface';
import { isArray, isUndefined, get, includes, forEach, find } from 'lodash';
import { ProcurementRfqHeaderMainDataService } from './procurement-rfq-header-main-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqBusinessPartnerContactDataService extends DataServiceFlatLeaf<IRfqBusinessPartner2ContactEntity, IRfqBusinessPartnerEntity, RfqBusinessPartnerEntityComplete> {
	/**
	 *
	 * @param parentService
	 */
	private readonly http = inject(HttpClient);
	private readonly config = inject(PlatformConfigurationService);
	private readonly procurementRfqMainService = inject(ProcurementRfqHeaderMainDataService);
	public constructor(
		private readonly parentService: ProcurementRfqBusinessPartnerDataService
	) {
		super({
			apiUrl: 'procurement/rfq/businesspartner2contact',
			readInfo: {
				endPoint: 'getbyparentid',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'save'
			},
			roleInfo: <IDataServiceChildRoleOptions<IRfqBusinessPartner2ContactEntity, IRfqBusinessPartnerEntity, RfqBusinessPartnerEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'RfqBusinessPartner2Contact',
				parent: parentService,
			},
			processors: []
		});
	}

	public override registerByMethod(): boolean {
		return true;
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				PKey1: parentSelection.Id
			};
		}
		throw new Error('Please select a business partner first');
	}

	protected override onCreateSucceeded(created: IRfqBusinessPartner2ContactEntity): IRfqBusinessPartner2ContactEntity {
		return created;
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}
		return {
			mainItemId: -1
		};
	}

	protected override onLoadSucceeded(loaded: object): IRfqBusinessPartner2ContactEntity[] {
		//TODO: get the Contacts via businesspartner/contact/getbyids url and return IContactEntity[]
		if (loaded) {
			return get(loaded, 'Main', []) as IRfqBusinessPartner2ContactEntity[];
		}
		return [];
	}

	public override registerModificationsToParentUpdate(parentUpdate: RfqBusinessPartnerEntityComplete, modified: IRfqBusinessPartner2ContactEntity[], deleted: IRfqBusinessPartner2ContactEntity[]): void {
		if (modified ?.some(() => true)) {
			parentUpdate.RfqBusinessPartner2ContactToSave = modified;
		}
		if (deleted ?.some(() => true)) {
			parentUpdate.RfqBusinessPartner2ContactToDelete = deleted;
		}
	}

	private isReadonlyByMainStatus() {
		let readonly = false;
		const isStatusReadonly = this.procurementRfqMainService.isEntityReadonly();
		if (isStatusReadonly) {
			readonly = true;
		}
		return readonly;
	}

	public override canDelete(): boolean {
		if (this.getList().length <= 0) {
			return false;
		}
		return !this.isReadonlyByMainStatus();
	}

	public override canCreate(): boolean {
		const rfqItem = this.procurementRfqMainService.getSelection()[0];
		if (!rfqItem || isUndefined(rfqItem.Id)) {
			return false;
		}

		return !this.isReadonlyByMainStatus();
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

	private updateWithContacts(list: IRfqBusinessPartner2ContactEntity[], contactIds: number[]) {
		if (!isArray(list) || list.length === 0 || !isArray(contactIds) || contactIds.length === 0) {
			return;
		}
		this.getContactsByIds(contactIds)
			.then(function(result) {
				//TODO: mergeWithContacts
			});
	}

	private getContactsByIds(contactIds: number[]) {
		return new Promise((resolve, reject)=>{
			this.http.post(this.config.webApiBaseUrl + 'businesspartner/contact/getbyids', contactIds)
				.subscribe(function(response) {
					if (!response) {
						return [];
					}
					return resolve(get(response, 'Contact', []) as IContactEntity[]);
				});
		});
	}

	private mergeWithContacts(list: IRfqBusinessPartner2ContactEntity[], contacts: IContactEntity[]) {
		if (!isArray(list) || list.length === 0 || !isArray(contacts) || contacts.length === 0) {
			return;
		}

		forEach(contacts, function (contact) {
			const item = find(list, {ContactFk: contact.Id});
			if (!item) {
				return;
			}

			const procurementRfqBpContactExcludeModelValue=['Id', 'BusinessPartnerFk', 'FirstName', 'FamilyName',
				'InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy', 'Version'];
			for (const prop in contact) {
				if (Object.prototype.hasOwnProperty.call(contact,prop) && !includes(procurementRfqBpContactExcludeModelValue, prop)) {
					//item[prop] = contact[prop];
				}
			}
		});
	}
}





