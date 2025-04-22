import { CellChangeEvent, createLookup, FieldType, FieldValidationInfo, GridApiService, IGridConfiguration } from '@libs/ui/common';
import { IBusinessPartnerEntity, IBusinessPartnerResponse, IContact2ExchangeResponse, IContactEntity } from '@libs/businesspartner/interfaces';
import { Component, inject } from '@angular/core';
import { filter, forEach, isUndefined } from 'lodash';
import { BasicsCompanyLookupService, BasicsSharedClerkLookupService, BasicsSharedTitleLookupService } from '@libs/basics/shared';
import {
	BusinesspartnerSharedContactRoleLookupService,
	BusinesspartnerSharedCustomerAbcLookupService,
	BusinesspartnerSharedCustomerGroupLookupService,
	BusinesspartnerSharedCustomerSectorLookupService,
	BusinesspartnerSharedCustomerStatusLookupService,
} from '@libs/businesspartner/shared';
import { PlatformHttpService, PlatformSearchAccessService } from '@libs/platform/common';
import { ValidationResult } from '@libs/platform/data-access';
import { IBasicsCustomizeTitleEntity } from '@libs/basics/interfaces';

@Component({
	selector: 'businesspartner-main-ccontacts-to-exchange',
	templateUrl: './contacts-to-exchange.component.html',
	styleUrls: ['./contacts-to-exchange.component.scss'],
})
export class ContactsToExchangeComponent {
	private readonly http = inject(PlatformHttpService);
	private readonly platformSearchAccessService = inject(PlatformSearchAccessService);
	private readonly gridApi = inject(GridApiService);

	public checkUserContact: boolean = false;
	public checkGlobalContact: boolean = false;
	public currentCheckBp!: IBusinessPartnerEntity;
	public businessPartnerAndContactMapping: Map<number, IContactEntity[]> = new Map();
	public dataList: IContactEntity[] = [];

	public bpGridCfg!: IGridConfiguration<IBusinessPartnerEntity>;
	public bps: IBusinessPartnerEntity[] = [];
	public contacts: IContactEntity[] = [];
	public contactGridCfg!: IGridConfiguration<IContactEntity>;

	public constructor() {
		this.findBusinessPartners();
		this.updataBpGridConfig();
		this.updataContactGridConfig();
	}

	public updataBpGridConfig() {
		this.bpGridCfg = {
			uuid: 'e6430a38383e40349f8d294ec1c7537c',
			columns: [
				{
					id: 'IsCheck',
					type: FieldType.Boolean,
					width: 50,
					model: 'IsCheck',
					label: {
						text: 'Selected',
						key: 'businesspartner.main.synContact.selected',
					},
					visible: true,
					sortable: true,
					readonly: false,
					// validator: (info)=>this.setContactGridDataByBP(info)	//	it's cant work now
				},
				{
					id: 'TitleFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup<IBusinessPartnerEntity, IBasicsCustomizeTitleEntity>({
						dataServiceToken: BasicsSharedTitleLookupService,
						showClearButton: true,
					}),
					width: 100,
					model: 'TitleFk',
					label: {
						text: 'Title',
						key: 'businesspartner.main.synContact.Title',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'BusinessPartnerName1',
					type: FieldType.Text,
					width: 100,
					model: 'BusinessPartnerName1',
					label: {
						text: 'Name',
						key: 'businesspartner.main.name1',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'BusinessPartnerName2',
					type: FieldType.Text,
					width: 100,
					model: 'BusinessPartnerName2',
					label: {
						text: 'Name',
						key: 'businesspartner.main.name2',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'TradeName',
					type: FieldType.Text,
					width: 100,
					model: 'TradeName',
					label: {
						text: 'Trade Name',
						key: 'businesspartner.main.tradeName',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'BusinessPartnerStatus',
					type: FieldType.Translation,
					width: 100,
					model: 'BusinessPartnerStatus',
					label: {
						text: 'BusinessPartnerStatus',
						key: 'procurement.rfq.businessPartnerStatus',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'CompanyFk',
					type: FieldType.Lookup,
					width: 100,
					model: 'CompanyFk',
					label: {
						text: 'Company Name',
						key: 'cloud.common.entityCompanyName',
					},
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyLookupService,
					}),
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'clerkDescription',
					type: FieldType.Lookup,
					width: 100,
					model: 'ClerkFk',
					label: {
						text: 'Responsible',
						key: 'businesspartner.main.synContact.responsible',
					},
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
					}),
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'CustomerStatusFk',
					type: FieldType.Lookup,
					width: 100,
					model: 'CustomerStatusFk',
					label: {
						text: 'Customer Status',
						key: 'businesspartner.main.customerStatus',
					},
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedCustomerStatusLookupService,
					}),
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'CustomerAbcFk',
					type: FieldType.Lookup,
					width: 100,
					model: 'CustomerAbcFk',
					label: {
						text: 'BusinessPartnerStatus2',
						key: 'businesspartner.main.customerAbc',
					},
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedCustomerAbcLookupService,
					}),
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'CustomerSectorFk',
					type: FieldType.Lookup,
					width: 100,
					model: 'CustomerSectorFk',
					label: {
						text: 'Sector',
						key: 'businesspartner.main.customerSector',
					},
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedCustomerSectorLookupService,
					}),
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'CustomerGroupFk',
					type: FieldType.Lookup,
					width: 100,
					model: 'CustomerGroupFk',
					label: {
						text: 'Group',
						key: 'businesspartner.main.customerGroup',
					},
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedCustomerGroupLookupService,
					}),
					visible: true,
					sortable: true,
					readonly: true,
				},
			],
			items: [...this.bps],
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			idProperty: 'Id',
		};
	}

	public updataContactGridConfig() {
		this.contactGridCfg = {
			uuid: '043bbc1dcc9540f4b005ebcc7e72b5da',
			columns: [
				{
					id: 'IsCheck',
					type: FieldType.Boolean,
					width: 50,
					model: 'IsCheck',
					label: {
						text: 'Selected',
						key: 'businesspartner.main.synContact.selected',
					},
					visible: true,
					sortable: true,
					validator: (info) => this.setBpAndContactsMapping(info.entity, info.value as boolean),
				},
				{
					id: 'IsToExchangeUser',
					type: FieldType.Boolean,
					model: 'IsToExchangeUser',
					label: {
						text: 'To Exchange User',
						key: 'businesspartner.main.synContact.isToExchange',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'Title',
					type: FieldType.Text,
					model: 'Title',
					label: {
						text: 'Title',
						key: 'businesspartner.main.synContact.title',
					},
					visible: true,
					sortable: false,
					readonly: true,
				},
				{
					id: 'TitleFk',
					type: FieldType.Lookup,
					width: 100,
					model: 'TitleFk',
					label: {
						text: 'Opening',
						key: 'businesspartner.main.titleName',
					},
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTitleLookupService,
					}),
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'FirstName',
					type: FieldType.Text,
					model: 'FirstName',
					label: {
						text: 'FirstName',
						key: 'businesspartner.main.firstName',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'FamilyName',
					type: FieldType.Description,
					model: 'FamilyName',
					label: {
						text: 'Last Name',
						key: 'businesspartner.main.familyName',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'Email',
					type: FieldType.Email,
					model: 'Email',
					label: {
						text: 'Email',
						key: 'cloud.common.sidebarInfoDescription.email',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'ContactRoleFk',
					type: FieldType.Lookup,
					model: 'ContactRoleFk',
					label: {
						text: 'ContactRoleFk',
						key: 'procurement.common.findBidder.contactRole',
					},
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedContactRoleLookupService,
					}),
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'Initials',
					type: FieldType.Text,
					model: 'Initials',
					label: {
						text: 'Initials',
						key: 'businesspartner.main.initials',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'CompanyFk',
					type: FieldType.Lookup,
					width: 100,
					model: 'CompanyFk',
					label: {
						text: 'Company Name',
						key: 'cloud.common.entityCompanyName',
					},
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyLookupService,
					}),
					visible: true,
					sortable: true,
					readonly: true,
				},
			],
			items: [...this.contacts],
			iconClass: null,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			idProperty: 'Id',
		};
	}

	public async findBusinessPartners() {
		const payload = this.platformSearchAccessService.currentSearchPayload();
		const resp = await this.http.post<IBusinessPartnerResponse>('businesspartner/main/exchange/businesspartnerlist', payload);

		this.bps = resp.Main ? [...resp.Main] : [];
		this.updataBpGridConfig();
	}

	public findContacts(value: number) {
		return this.http.post<IContact2ExchangeResponse>('businesspartner/main/exchange/contactlist', {
			Value: value,
			filter: '',
		});
	}

	public async onBpSelectionChanged(selectedRows: IBusinessPartnerEntity[]) {
		if (selectedRows.length > 0) {
			const result = await this.findContacts(selectedRows[0].Id);
			this.contacts = result.Main ?? [];
			if (selectedRows[0].IsCheck) {
				this.currentCheckBp = selectedRows[0];
			}

			this.setContactCheck(this.businessPartnerAndContactMapping, selectedRows[0], result.Main ?? []);
			this.dataList = result.Main ?? [];

			this.updataContactGridConfig();
		}
	}

	public async check(isCheck: boolean) {
		for (const value of this.businessPartnerAndContactMapping.values()) {
			for (const contact of value) {
				if (this.checkUserContact) {
					contact.IsToExchangeUser = isCheck;
				}
				if (this.checkGlobalContact) {
					contact.IsToExchangeGlobal = isCheck;
				}
			}
		}
		const mapObj: Map<number, IContactEntity[]> = new Map();
		for (const [key, value] of this.businessPartnerAndContactMapping) {
			mapObj.set(key, value);
		}
		if (this.currentCheckBp && !isUndefined(this.currentCheckBp.Id)) {
			await this.http.post('businesspartner/main/exchange/updatecontacts', mapObj);
			const contacts = await this.findContacts(this.currentCheckBp.Id);
			this.setContactCheck(this.businessPartnerAndContactMapping, this.currentCheckBp, contacts.Main ?? []);

			forEach(this.contacts, (item) => {
				item.IsToExchangeUser = isCheck;
			});

			this.dataList = contacts.Main ?? [];

			this.updataContactGridConfig();
		}
	}

	public uncheck(isCheck: boolean) {
		return this.check(isCheck);
	}

	private setContactCheck(map: Map<number, IContactEntity[]>, currentCheckBp: IBusinessPartnerEntity, contacts: IContactEntity[]) {
		const mapContacts = map.get(currentCheckBp.Id);
		if (contacts) {
			for (const contact of contacts) {
				const mapContact = filter(mapContacts, { Id: contact.Id });
				if (mapContact.length > 0) {
					contact.IsCheck = currentCheckBp.IsCheck;
				}
			}
		}
		this.updataContactGridConfig();
	}

	public setBpAndContactsMapping(entity: IContactEntity, checked: boolean) {
		const map = this.businessPartnerAndContactMapping;
		let tmpContacts = map.get(this.currentCheckBp.Id);
		if (tmpContacts) {
			if (checked && entity) {
				if (!filter(tmpContacts, { Id: entity.Id })) {
					tmpContacts.push(entity);
				}
			} else {
				tmpContacts = tmpContacts.filter((item) => item.Id !== entity.Id);
				map.set(this.currentCheckBp.Id, tmpContacts);
			}
		} else {
			const tmpBps = this.gridApi.get(this.bpGridCfg.uuid ? this.bpGridCfg.uuid : '').selection as IBusinessPartnerEntity[];
			if (tmpBps.length > 0) {
				tmpBps[0].IsCheck = true;
				this.currentCheckBp = tmpBps[0];
				if (isUndefined(this.businessPartnerAndContactMapping.get(tmpBps[0].Id))) {
					this.businessPartnerAndContactMapping.set(tmpBps[0].Id, [entity]);
				}
			}
		}
		return new ValidationResult();
	}

	public async cellChanged(event: CellChangeEvent<IBusinessPartnerEntity>) {
		if (event.item?.IsCheck) {
			this.currentCheckBp = event.item;
			if (isUndefined(this.businessPartnerAndContactMapping.get(event.item.Id))) {
				this.businessPartnerAndContactMapping.set(event.item.Id, []);
			}
			const resp = await this.findContacts(event.item.Id);
			this.setContactCheck(this.businessPartnerAndContactMapping, event.item, resp.Main ?? []);
			const tmpContacts = this.businessPartnerAndContactMapping.get(this.currentCheckBp.Id);
			forEach(resp.Main, (item) => {
				item.IsCheck = true;
				if (tmpContacts && !filter(tmpContacts, { Id: item })) {
					tmpContacts.push(item);
				}
			});
			this.dataList = resp.Main ?? [];

			this.contacts = this.dataList;
			this.updataContactGridConfig();
		} else {
			if (!isUndefined(this.businessPartnerAndContactMapping.get(event.item.Id))) {
				this.businessPartnerAndContactMapping.delete(event.item.Id);
				const resp = await this.findContacts(event.item.Id);
				this.dataList = resp.Main ?? [];

				this.contacts = this.dataList;
				this.updataContactGridConfig();
			}
		}
	}

	public async setContactGridDataByBP(info: FieldValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		if (info.entity && info.value) {
			this.currentCheckBp = info.entity;
			if (isUndefined(this.businessPartnerAndContactMapping.get(info.entity.Id))) {
				this.businessPartnerAndContactMapping.set(info.entity.Id, []);
			}
			const resp = await this.findContacts(info.entity.Id);
			this.setContactCheck(this.businessPartnerAndContactMapping, info.entity, resp.Main ?? []);
			const tmpContacts = this.businessPartnerAndContactMapping.get(this.currentCheckBp.Id);
			forEach(resp.Main, (item) => {
				item.IsCheck = true;
				if (tmpContacts && !filter(tmpContacts, { Id: item })) {
					tmpContacts.push(item);
				}
			});
			this.dataList = resp.Main ?? [];
		} else {
			if (!isUndefined(this.businessPartnerAndContactMapping.get(info.entity.Id))) {
				this.businessPartnerAndContactMapping.delete(info.entity.Id);
				const resp = await this.findContacts(info.entity.Id);
				this.dataList = resp.Main ?? [];
			}
		}
		return new ValidationResult();
	}
}
