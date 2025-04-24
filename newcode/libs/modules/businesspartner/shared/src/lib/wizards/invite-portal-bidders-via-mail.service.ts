/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService, IFormConfig, FieldType, UiCommonFormDialogService, StandardDialogButtonId, createLookup, IFormDialogConfig } from '@libs/ui/common';
import { catchError, forkJoin, map, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Dictionary, PlatformConfigurationService, PlatformLazyInjectorService } from '@libs/platform/common';
import {
	PlatformTranslateService,
} from '@libs/platform/common';
import { IBasicsClerkEntity} from '@libs/basics/interfaces';
import { WORKFLOW_INSTANCE_SERVICE } from '@libs/workflow/interfaces';

interface IInvitationDialog {
	contactFullName: string | null;
	contactEmail: string | null;
	bpdFullName: string | null;
	bpdAddress: string | null;
	accessGroup?: string;
	confirm?: boolean;
	selectedContactId?: number;
}
import { IEntityIdentification } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { FrmPortalUserGroupLookupService } from '../lookup-services/frm-portal-user-group-lookup.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Shared Service for Invite Portal Bidders Via Mail.
 */
export abstract class InvitePortaBiddersViaMailSharedService<T extends IEntityIdentification> {

	/**
	 * Injects the PlatformLazyInjector Service.
	 */
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	/**
	 * Injects the Data for different modules Service.
	 */
	protected abstract readonly dataService: IEntitySelection<T>;

	/**
	 * Injects the UiCommonMessageBoxService service.
	 */
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * Injects the UiCommonFormDialogService service.
	 */
	private readonly formDialogService = inject(UiCommonFormDialogService);

	/**
	 * Injects the PlatformConfigurationService service.
	 */
	private readonly configService = inject(PlatformConfigurationService);

	/**
	 * Injects the WorkflowInstanceService service.
	 */

	private readonly workflowInstanceService = this.lazyInjector.inject(WORKFLOW_INSTANCE_SERVICE);

	/**
	 * Injects the PlatformTranslateService service.
	 */
	private readonly translateService = inject(PlatformTranslateService);

	/**
	 * Injects the HttpClient service.
	 */
	private http = inject(HttpClient);

	/**
	 * Holds the invitation dialog data.
	 */
	public invitePortalDialogData: IInvitationDialog = {
		contactFullName: '',
		contactEmail: '',
		bpdFullName: '',
		bpdAddress: ''
	};

	/**
	 * ID of the selected contact.
	 */
	public selectedContactId!: number;

	/**
	 * ID of the workflow template.
	 */
	public workflowTemplateId!: number;

	/**
	 * ID of the selected user.
	 */
	public selectedUserId!: number;

	/**
	 * Holds the error message.
	 */
	public errMsg!: string;

	/**
	 * Holds the selected item, which can be an IRfqBusinessPartner2ContactEntity, IContactEntity, or IUserEntity.
	 */

	public selectedItem!: T;

	/**
	 * Holds the clerk entity.
	 */
	public theClerk!: IBasicsClerkEntity;

	/**
	 * Retrieves the portal user based on the provided wizard parameters.
	 * @param wizardParameters - Dictionary of wizard parameters.
	 */
	public getPortalUser(wizardParameters?: Dictionary<string, unknown>) {
		const contextType = wizardParameters?.get('ContextType') as string;
		const workflowTemplateId = wizardParameters?.get('WorkflowTemplateId') as number;

		if (workflowTemplateId) {
			this.workflowTemplateId = workflowTemplateId;
		} else {
			this.errMsg = 'Configuration Error: <br>WorkflowTemplateId not defined in Module Config, please define parameter WorkflowTemplateId there!';
			this.messageBoxService.showInfoBox(this.errMsg, 'info', false);
			return null;
		}
		this.selectedItem = this.dataService.getSelection()[0];
		if (this.selectedItem) {
			if (contextType == 'user') {
				this.errMsg = 'usermanagement.user.wizards.noUserSelected';
				this.selectedUserId = this.selectedItem.Id;
			} else {
				this.errMsg = 'usermanagement.user.wizards.noContactSelected';
				this.selectedContactId = this.selectedItem.Id;
			}
		}

		if (!this.selectedItem) {
			this.messageBoxService.showMsgBox(this.errMsg, this.translateService.instant('Bidder Invitation Wizard failed').text, 'ico-error');
			return null;
		}

		if (contextType === 'user' && !this.selectedUserId) {
			this.messageBoxService.showMsgBox(this.errMsg, this.translateService.instant('Bidder Invitation Wizard failed').text, 'ico-error');
			return null;
		} else if (contextType !== 'user' && !this.selectedContactId) {
			this.messageBoxService.showMsgBox(this.errMsg, this.translateService.instant('Bidder Invitation Wizard failed').text, 'ico-error');
			return null;
		}

		return {
			workflowTemplateId: this.workflowTemplateId,
			selectedItem: this.selectedItem,
			selectedContactId: this.selectedContactId,
			selectedUserId: this.selectedUserId
		};
	}

	/**
	 * Invites the selected bidder via mail.
	 */
	public inviteSelectedBidder(wizardParameters?: Dictionary<string, unknown>) {
		const selectedItemInfo = this.getPortalUser(wizardParameters);
		if (!selectedItemInfo) {
			return;
		}
		this.workflowTemplateId = selectedItemInfo.workflowTemplateId;
		this.selectedContactId = selectedItemInfo.selectedContactId;
		this.selectedUserId = selectedItemInfo.selectedUserId;

		this.startupLoader(this.selectedContactId).subscribe(() => {
			const config: IFormDialogConfig<IInvitationDialog> = {
				headerText: { key: 'businesspartner.main.portal.wizard.invitationDialogTitle' },
				formConfiguration: this.invitePortalBidderForm(),
				customButtons: [],
				entity: this.invitePortalDialogData,
				topDescription: 'businesspartner.main.portal.wizard.invitationDialogBody'
			};
			this.formDialogService.showDialog(config)?.then(async (result) => {

				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					await this.startInvitationWorkflow();
				}
			});
		});
	}

	/**
	 * Returns the form configuration for inviting a portal bidder.
	 */
	public invitePortalBidderForm(): IFormConfig<IInvitationDialog> {
		return {
			formId: 'invitePortal',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: [
				{
					id: 'contactName',
					type: FieldType.Description,
					label: {
						text: 'Contact Name',
					},
					model: 'contactFullName',
					readonly: true,
					sortOrder: 1,
				},
				{
					id: 'email',
					type: FieldType.Description,
					label: {
						text: 'Email',
					},
					model: 'contactEmail',
					readonly: true,
					sortOrder: 2,
				},
				{
					id: 'partnerName',
					type: FieldType.Description,
					label: {
						text: 'Partner Name',
					},
					model: 'bpdFullName',
					readonly: true,
					sortOrder: 3,
				},
				{
					id: 'partnerAddress',
					type: FieldType.Description,
					label: {
						text: 'Partner Address',
					},
					model: 'bpdAddress',
					readonly: true,
					sortOrder: 4,
				},
				{
					id: 'accessGroup',
					type: FieldType.Lookup,
					label: {
						text: 'Access Group'
					},
					model: 'accessGroup',
					lookupOptions: createLookup({
						dataServiceToken: FrmPortalUserGroupLookupService,
					}),
					sortOrder: 5,
				},
				{
					id: 'confirm',
					type: FieldType.Composite,
					label: {
						text: 'Confirm'
					},
					composite: [
						{
							id: 'confirm',
							label: {
								text: 'Receive sn email after invitation finished?'
							},
							type: FieldType.Boolean,
							readonly: false,
							model: 'confirm',
						}
					],
				},
			]
		};
	}

	/**
	 * Fetches the startup data for the selected contact.
	 * @param selectedContactId - ID of the selected contact.
	 */
	public startupLoader(selectedContactId: number) {
		const p3 = this.checkClerktoLoginUser().pipe(
			tap(clerkdto => {
				this.theClerk = clerkdto;
				if (!this.theClerk) {
					this.messageBoxService.showMsgBox(this.translateService.instant('businesspartner.main.portal.wizard.errClerkInvalidBody').text,
						this.translateService.instant('businesspartner.main.portal.wizard.errClerkInvalidTitle').text,
						'ico-error');
					close();
				}

			}),
		);
		let promise2: Observable<IInvitationDialog> = of({} as IInvitationDialog);
		if (selectedContactId) {
			promise2 = this.getContactwithBpd(selectedContactId).pipe(
				tap(data => {
					this.invitePortalDialogData.contactEmail = data.contactEmail;
					this.invitePortalDialogData.contactFullName = data.contactFullName;
					this.invitePortalDialogData.bpdFullName = data.bpdFullName;
					this.invitePortalDialogData.bpdAddress = data.bpdAddress;
				}),
			);
		} else if (this.selectedUserId) {
			promise2 = this.getContactwithBpdFromUserId(this.selectedUserId).pipe(
				tap(data => {
					if (data) {
						this.invitePortalDialogData.contactEmail = data.contactEmail;
						this.invitePortalDialogData.contactFullName = data.contactFullName;
						this.invitePortalDialogData.bpdFullName = data.bpdFullName;
						this.invitePortalDialogData.bpdAddress = data.bpdAddress;
					} else {

						this.messageBoxService.showMsgBox(this.translateService.instant('businesspartner.main.portal.wizard.errUsernotFoundBody').text,
							this.translateService.instant('businesspartner.main.portal.wizard.errUsernotFoundTitle').text,
							'ico-error');
					}
				}),
			);
		}

		return forkJoin([p3, promise2]).pipe(
			catchError(reason => {
				this.messageBoxService.showMsgBox(reason,
					this.translateService.instant('businesspartner.main.portal.wizard.errSomeThingFailedTitle').text,
					'ico-error');
				return throwError(reason);
			})
		);
	}

	/**
	  * Checks if the current clerk is logged in as a user.
	  * @returns An observable of the clerk entity.
	  */
	public checkClerktoLoginUser(): Observable<IBasicsClerkEntity> {
		return this.http.get<IBasicsClerkEntity>(`${this.configService.webApiBaseUrl}basics/clerk/checkclerktologinuser`).pipe(
			map((response: IBasicsClerkEntity) => {
				return response;
			}),
			catchError((error) => throwError(error))
		);
	}

	/**
	  * Retrieves business partner contact details for the specified contact ID.
	  * @param contactId - The ID of the contact.
	  * @returns An observable of the invitation dialog data.
	  */
	public getContactwithBpd(contactId: number): Observable<IInvitationDialog> {
		return this.http.get<IInvitationDialog>(`${this.configService.webApiBaseUrl}usermanagement/main/portal/getcontactwithbpd?contactid=${contactId}`).pipe(
			map((response: IInvitationDialog) => {
				return {
					selectedContactId: response.selectedContactId,
					contactEmail: response.contactEmail,
					contactFullName: response.contactFullName,
					bpdFullName: response.bpdFullName,
					bpdAddress: response.bpdAddress
				};
			}),
		);
	}

	/**
 * Retrieves business partner contact details for the specified user ID.
 * @param userId - The ID of the user.
 * @returns An observable of the invitation dialog data.
 */
	public getContactwithBpdFromUserId(userId: number): Observable<IInvitationDialog> {
		return this.http.get<IInvitationDialog>(`${this.configService.webApiBaseUrl}usermanagement/main/portal/getcontactwithbpdbyuserid?userid=${userId}`).pipe(
			map((response: IInvitationDialog) => {
				return {
					selectedContactId: response.selectedContactId,
					contactEmail: response.contactEmail,
					contactFullName: response.contactFullName,
					bpdFullName: response.bpdFullName,
					bpdAddress: response.bpdAddress
				};
			}),
		);
	}

	/**
	 * Starts the invitation workflow for the selected contact.
	 */
	public async startInvitationWorkflow(): Promise<void> {
		const jsonContext = {
			ContactId: this.selectedContactId,
			PortalAccessGroupId: this.invitePortalDialogData.accessGroup,
			EmailtoClerkAfterRegistration: this.invitePortalDialogData.confirm ?? true,
			PortalBaseUrl: this.configService.portalUrl,
		};
		const jsonContextString = JSON.stringify(jsonContext);
		(await this.workflowInstanceService).startWorkflow(this.workflowTemplateId, undefined, jsonContextString);
	}
}
