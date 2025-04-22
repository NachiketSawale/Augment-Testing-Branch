/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';

import { firstValueFrom, takeUntil } from 'rxjs';

import { IFormDialogConfig, IYesNoDialogOptions, StandardDialogButtonId } from '@libs/ui/common';
import { IContactEntity, IPortalUserDialog, IPortalUserGroup, IUserProviderInfoEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerContactRequest, BusinessPartnerContactResponse, BusinessPartnerSharedPortalUserManagementService } from '@libs/businesspartner/shared';

import { BusinesspartnerContactDataService } from '../businesspartner-contact-data.service';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';

/**
 * Business partner Main Portal User Management Wizard Service.
 */
@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerMainPortalUserManagementWizardService extends BusinessPartnerSharedPortalUserManagementService {
	/**
	 * hold context type
	 */
	protected contextType = 'bp';

	/**
	 * To inject BusinesspartnerContactDataService
	 */
	public bpContactDataService = inject(BusinesspartnerContactDataService);
	/**
	 * To inject BusinesspartnerMainHeaderDataService
	 */
	public mainHeaderDataService = inject(BusinesspartnerMainHeaderDataService);
	/**
	 * Hold selected entity of dataService.
	 */
	public selectedItem!: IContactEntity | null;

	/**
	 * To handle context type bp
	 * @param {IPortalUserGroup[]} userGroups
	 * @param {IFormDialogConfig<IPortalUserDialog>} modalOptions
	 */
	protected override async handleBpContext(userGroups: IPortalUserGroup[], modalOptions: IFormDialogConfig<IPortalUserDialog>): Promise<void> {
		this.selectedItem = this.bpContactDataService.getSelectedEntity();
		if (!this.selectedItem) {
			this.noSelectContactItem();
			return;
		}

		const contactSelection = this.bpContactDataService.getSelection();
		const contactIds = contactSelection.map((contact) => contact.Id);
		const providers = await this.getUserExternalProviderInfoVEntities(contactIds);
		const contactsDetails = providers[0];

		const selectedParent = this.mainHeaderDataService?.getSelectedEntity();
		if (this.selectedItem.FrmUserExtProviderFk) {
			this.portalUserDialogData.BusinessPartnerName1 = selectedParent?.BusinessPartnerName1;

			this.processItem(userGroups, contactsDetails);
			this.formDialogService.showDialog(modalOptions)?.then(async (result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.onOkBtnClicked(contactsDetails);
				}
			});
		} else {
			this.notAPortalUser();
		}
	}

	/**
	 * To bind the item data to the portalUserDialogData
	 * @param {T} item
	 * @param {IPortalUserGroup[]} userGroups
	 * @param {string | null} BusinessPartnerName1
	 */
	public processItem(userGroups: IPortalUserGroup[], contactDetails: IUserProviderInfoEntity): void {
		this.portalUserDialogData.BusinessPartnerName1 = contactDetails.bpdName1 || '';
		this.portalUserDialogData.FamilyName = contactDetails.familyName || '';
		this.portalUserDialogData.PortalAccessGroup = userGroups;
		this.portalUserDialogData.Provider = contactDetails.provider || '';
		this.portalUserDialogData.ProviderId = contactDetails.providerId || null;
		this.portalUserDialogData.ProviderEmail = contactDetails.email || '';
		this.portalUserDialogData.ProviderComment = contactDetails.comment || '';
		this.portalUserDialogData.State = contactDetails.state || 1;
	}

	/**
	 * To handle ok Button when the dialog is submitted.
	 */
	protected override onOkBtnClicked(contactsDetails?: IUserProviderInfoEntity) {
		const comment = contactsDetails?.comment ?? '';
		const groupId = contactsDetails?.portalusergroupFk ?? 1;
		const setInactiveDate = this.selectedItem?.SetInactiveDate instanceof Date ? this.selectedItem.SetInactiveDate.toISOString() : this.selectedItem?.SetInactiveDate ?? '';

		const param = {
			extProviderId: this.selectedItem?.FrmUserExtProviderFk ?? '',
			portalAccessGroupId: groupId,
			comment: comment,
			state: contactsDetails?.state ?? '',
			setInactiveDate: setInactiveDate,
		};

		this.http
			.get(this.configService.webApiBaseUrl + 'usermanagement/main/portal/updateextprovider',{params:param})
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: () => {
					this.messageBoxService?.showMsgBox('businesspartner.contact.managePortalUserSucceessfully', 'businesspartner.contact.managePortalUserSucceessfully', 'info')?.then(() => {
						this.refreshList();
						this.dialogClose.emit(true);
					});
				},
			});
	}

	/**
	 * To handle refresh List according to context type
	 */
	protected override async refreshList() {
		if (this.contextType === 'bp') {
			const bpMainSelectedItem = this.mainHeaderDataService.getSelectedEntity();
			const bpMainContactSelectedItem = this.bpContactDataService.getSelectedEntity();

			if (bpMainSelectedItem?.Id) {
				const request = new BusinessPartnerContactRequest();
				request.Value = bpMainSelectedItem.Id;
				const resp = await firstValueFrom(this.http.post<BusinessPartnerContactResponse>(this.configService.webApiBaseUrl + 'businesspartner/contact/listbybusinesspartnerid', request));
				const selectedContact = resp.Main?.filter((item) => item.Id === bpMainContactSelectedItem?.Id);
				if (selectedContact) {
					this.bpContactDataService.setList(selectedContact);
				}
			}
		}
	}

	/**
	 * To handle unlink Button Action.
	 */
	protected override async onUnlinkBtnClicked(): Promise<void> {
		this.disableUnlinkBtn = true;
		this.disableOkBtn = true;
		this.disableCancelBtn = true;
		const option: IYesNoDialogOptions = {
			headerText: 'businesspartner.contact.unlinkPortalUserButton',
			bodyText: 'businesspartner.contact.doYouUnlinkPortalUser',
			defaultButtonId: 'no',
		};

		const result = await this.messageBoxService.showYesNoDialog(option);
		if (result?.closingButtonId === 'yes') {
			const contactIds = this.selectedItem?.Id ? [this.selectedItem.Id] : [];
			if (this.contextType === 'bp') {
				this.http
					.post(this.configService.webApiBaseUrl + 'usermanagement/main/portal/unlinkportalusersbyuserids/', contactIds)
					.pipe(takeUntil(this.destroy$))
					.subscribe({
						next: () => {
							this.refreshList();
							this.dialogClose.emit(false);
						},
					});
			}
		} else {
			this.disableUnlinkBtn = !this.isPortalUser;
			this.disableOkBtn = !this.isPortalUser;
			this.disableCancelBtn = false;
		}
	}
}
