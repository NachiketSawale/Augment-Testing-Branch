import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { CONTACT_ENTITIY, IBusinessPartnerSearchMainEntity, IContactEntity } from '@libs/businesspartner/interfaces';
import { PlatformCommonModule, PlatformTranslateService, PropertyType } from '@libs/platform/common';
import { ColumnDef, createLookup, FieldType, getCustomDialogDataToken, GridComponent, IFieldValueChangeInfo, IGridConfiguration,  UiCommonModule } from '@libs/ui/common';
import { FormsModule } from '@angular/forms';
import { BusinessPartnerLookupService, BusinesspartnerSharedContactAbcLookupService, BusinesspartnerSharedContactOriginLookupService, BusinesspartnerSharedContactRoleLookupService, BusinesspartnerSharedContactTimelinessLookService, BusinesspartnerSharedSubsidiaryLookupService } from '../../../../lookup-services';
import { BasicsCompanyLookupService, BasicsSharedAddressDialogComponent, BasicsSharedClerkLookupService, BasicsSharedCountryLookupService, BasicsSharedLanguageLookupService, BasicsSharedTelephoneDialogComponent, BasicsSharedTitleLookupService, createFormDialogLookupProvider } from '@libs/basics/shared';
import { BusinessPartnerSharedReOrInActivatePortalUserService } from '../../../../wizards/shared-reactivate-or-inactive-portal-user.service';


@Component({
  selector: 'businesspartner-shared-activate-or-inactivate-porta-user',
  imports: [CommonModule, PlatformCommonModule, UiCommonModule, GridComponent, FormsModule],
  standalone: true,
  templateUrl: './activate-or-inactivate-porta-user.component.html',
  styleUrl: './activate-or-inactivate-porta-user.component.scss'
})
/*
 * Shared Re/In Activate Portal User Component for the Business Partner.
 */
export class ActivateOrInactivatePortaUserComponent implements OnInit {
  /*
  * Inject the PlatformTranslateService.
  */
  protected readonly translate = inject(PlatformTranslateService);

  /*
  * Inject BusinessPartnerSharedReOrInActivatePortalUserService.
  */
  protected sharedReOrInActivatePortalUser = inject
  (BusinessPartnerSharedReOrInActivatePortalUserService)!;

  /*
  * Dialog Wrapper to retrive dialog value.
  */
  private readonly dialogWrapper = inject(getCustomDialogDataToken<{ executeType: string }, ActivateOrInactivatePortaUserComponent>());

  /*
  * contacts list for activation or inactivation.
  */
  public contactList: IContactEntity[] = [];

  /*
  * Boolean if the operation can be executed.
  */
  public canExecute = true;

  /*
  * Tracks the execution state of the operation.
  */
  public isExecute = false;

  /*
   * The type of operation to perform:
   * - `1`: Re-activate portal user(s).
   * - `2`: Inactivate portal user(s).
  */
  public executeType = this.dialogWrapper.value?.executeType;

  /*
  * Translation for the reactivate portal user label.
  */  
  public reactivate = this.translate.instant('businesspartner.contact.reactivatePortalUser').text;

  /*
  * Translation for the inactivate portal user label.
  */  
  public inactivate = this.translate.instant('businesspartner.contact.inactivatePortalUser').text;

  /*
  * Labels for execution types re-activate and inactivate.
  */  
  public executeTypeTexts: { reactivate: string; inactivate: string } = { reactivate: this.reactivate, inactivate: this.inactivate };

  public constructor(
    @Inject(CONTACT_ENTITIY) providedContacts: IContactEntity[],
  ) {
    this.contactList = providedContacts.map(contact => ({
      ...contact,
      Selected: true,
    }));
  }
  public ngOnInit(): void {
    this.initializeGrid();
  }

  /*
  * Generates the grid column configuration for displaying contact details.
  * @returns An array of column definitions for the contact grid.
  */
    public gridConfig: IGridConfiguration<IContactEntity> = {
      uuid: 'bcc2cf9f45374c30a8dacab8490d4c3e',
      columns: [],
      items: [],
      iconClass: null,
      skipPermissionCheck: true,
      enableColumnReorder: true,
      enableCopyPasteExcel: false,
    };
  
    /*
    * Initializes the grid configuration with the generated columns and contact list items.
    */
    private initializeGrid(): void {
      const columns = this.generateGridConfig();
      this.gridConfig = {
        ...this.gridConfig,
        columns: columns,
        items: [...this.contactList]
      };
    }
  
    /*
    * Executes the re-activation or inactivation operation on the selected contacts.
    */  
    public onExecute(): void {
      if (!this.executeType || this.contactList.length === 0) {
        return;
      }
      this.isExecute = false;
      this.sharedReOrInActivatePortalUser
        .execute(this.contactList, this.executeType)
        .subscribe({
          next: () => {
            this.isExecute = true;
          },
          error: (err: Error) => {
            console.error('Error executing portal user action:', err);
          }
        });
    }
  
    /*
    * Updates the `executeType` based on the selected radio button value.
    * @param radioValue - The selected value from the radio group.
    */  
    public changeRadioGroupOpt(radioValue: string) {
      this.executeType = radioValue;
    }
  

  /*
  * Shared Re/In Activate Portal User Component for the Business Partner.
  */
  public generateGridConfig(): ColumnDef<IContactEntity>[] {
    return [
      {
        id: 'Selected',
        model: 'Selected',
        type: FieldType.Boolean,
        label: { text: 'Selected' },
        sortable: true,
        visible: true,
        readonly: false,
        cssClass: 'cell-center',
        change: (changeInfo: IFieldValueChangeInfo<IContactEntity, PropertyType>) => {
          const isChecked = changeInfo.newValue;
          if (isChecked) {
            this.canExecute = true;
          } else {
            this.canExecute = false;
          }
        },
      },
      {
        id: 'BusinessPartnerFk',
        model: 'BusinessPartnerFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup<IContactEntity, IBusinessPartnerSearchMainEntity>({
          dataServiceToken: BusinessPartnerLookupService,
          displayMember: 'BusinessPartnerName1',
        }),
        label: {
          text: 'Business Partner',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'ContactRoleFk',
        model: 'ContactRoleFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BusinesspartnerSharedContactRoleLookupService
        }),
        label: {
          text: 'Role',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'TitleFk',
        model: 'TitleFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BasicsSharedTitleLookupService,
          displayMember:'DescriptionInfo.Translated',
        }),
        label: {
          text: 'Salutation',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'Title',
        model: 'Title',
        type: FieldType.Description,
        label: {
          text: 'Title',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'FirstName',
        model: 'FirstName',
        type: FieldType.Description,
        label: {
          text: 'First Name',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'Initials',
        model: 'Initials',
        type: FieldType.Description,
        label: {
          text: 'Initials',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'FamilyName',
        model: 'FamilyName',
        type: FieldType.Description,
        label: {
          text: 'Last Name',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'Pronunciation',
        model: 'Pronunciation',
        type: FieldType.Description,
        label: {
          text: 'Pronunciation',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'CompanyFk',
        model: 'CompanyFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BasicsCompanyLookupService,
          displayMember: 'Code',
        }),
        label: {
          text: 'Company',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'CompanyName',
        model: 'CompanyFk',
        type: FieldType.Lookup,
        lookupOptions:createLookup({
          dataServiceToken: BasicsCompanyLookupService,
          displayMember: 'CompanyName',
        }),
        label: {
          text: 'Company Name',
        },
        visible: true,
        sortable: false,
        readonly: true,       
      },
      {
        id: 'IsLive',
        model: 'IsLive',
        type: FieldType.Boolean,
        label: {
          text: 'Active',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'IsDefaultBaseline',
        model: 'IsDefaultBaseline',
        type: FieldType.Boolean,
        label: {
          text: 'Is Default Baseline',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'TelephoneNumberDescriptor',
        model: 'TelephoneNumberDescriptor',
        type: FieldType.CustomComponent,
        componentType: BasicsSharedTelephoneDialogComponent,
        providers: createFormDialogLookupProvider({
          foreignKey: 'TelephoneNumberFk',
        }),
        label: {
          text: 'Telephone',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'TelephoneNumber2Descriptor',
        model: 'TelephoneNumber2Descriptor',
        type: FieldType.CustomComponent,
        componentType: BasicsSharedTelephoneDialogComponent,
        providers: createFormDialogLookupProvider({
          foreignKey: 'TelephoneNumber2Fk',
        }),
        label: {
          text: 'other Telephone',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'TeleFaxDescriptor',
        model: 'TeleFaxDescriptor',
        type: FieldType.CustomComponent,
        componentType: BasicsSharedTelephoneDialogComponent,
        providers: createFormDialogLookupProvider({
          foreignKey: 'TelephoneNumberTelefaxFk',
        }),
        label: {
          text: 'Telefax',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'MobileDescriptor',
        model: 'MobileDescriptor',
        type: FieldType.CustomComponent,
        componentType: BasicsSharedTelephoneDialogComponent,
        providers: createFormDialogLookupProvider({
          foreignKey: 'TelephoneNumberMobilFk',
        }),
        label: {
          text: 'Mobile',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'Internet',
        model: 'Internet',
        type: FieldType.Description,
        label: {
          text: 'Internet',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'Email',
        model: 'Email',
        type: FieldType.Description,
        label: {
          text: 'E-Mail',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'BasLanguageFk',
        model: 'BasLanguageFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BasicsSharedLanguageLookupService,
        }),
        label: {
          text: 'Language',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'EmailPrivate',
        model: 'EmailPrivate',
        type: FieldType.Description,
        label: {
          text: 'Private E-Mail',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'CountryFk',
        model: 'CountryFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BasicsSharedCountryLookupService,
          displayMember: 'DescriptionInfo',
        }),
        label: {
          text: 'Country',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'Subsidiaryfk',
        model: 'Subsidiaryfk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
          displayMember: 'DisplayText'
        }),
        label: {
          text: 'Branch',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'subsidiaryAdress',
        model: 'Subsidiaryfk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
          displayMember: 'AddressLine'
        }),
        label: {
          text: 'Branch Address',
        },
        visible: true,
        sortable: false,
        readonly: true,        
      },
      {
        id: 'city',
        model: 'SubsidiaryFk',
        type: FieldType.Lookup,
        label: {
          text: 'City',
        },
        lookupOptions: createLookup({
          dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
          displayMember: 'City'
        }),
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'zipCode',
        model: 'SubsidiaryFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
          displayMember: 'ZipCode'
        }),
        label: {
          text: 'Zip Code',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'street',
        model: 'SubsidiaryFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
          displayMember: 'Street'
        }),
        label: {
          text: 'Street',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'AddressDescriptor',
        model: 'AddressDescriptor',
        type: FieldType.CustomComponent,
        componentType: BasicsSharedAddressDialogComponent,
        providers: createFormDialogLookupProvider({
          foreignKey: 'AddressFk',
        }),
        label: {
          text: 'Private Address',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'PrivateTelephoneNumberDescriptor',
        model: 'PrivateTelephoneNumberDescriptor',
        type: FieldType.CustomComponent,
        componentType: BasicsSharedTelephoneDialogComponent,
        providers: createFormDialogLookupProvider({
          foreignKey: 'TelephonePrivatFk',         
        }),
        label: {
          text: 'Private Telephone',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'Responsible',
        model: 'ClerkResponsibleFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BasicsSharedClerkLookupService,
          displayMember: 'Code',
        }),
        label: {
          text: 'Responsible',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'ClerkResponsibleFk',
        model: 'ClerkResponsibleFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BasicsSharedClerkLookupService,
          displayMember: 'Description'
        }),
        label: {
          text: 'Responsible Name',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'ContactTimelinessFk',
        model: 'ContactTimelinessFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BusinesspartnerSharedContactTimelinessLookService,
        }),
        label: {
          text: 'Contact Timeliness',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'ContactOriginFk',
        model: 'ContactOriginFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BusinesspartnerSharedContactOriginLookupService,
        }),
        label: {
          text: 'Origin',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'ContactAbcFk',
        model: 'ContactAbcFk',
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BusinesspartnerSharedContactAbcLookupService,
        }),
        label: {
          text: 'ABC Classification',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'BirthDate',
        model: 'BirthDate',
        type: FieldType.Date,
        label: {
          text: 'Date of Birth',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'NickName',
        model: 'NickName',
        type: FieldType.Description,
        label: {
          text: 'Nickname',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'PartnerName',
        model: 'PartnerName',
        type: FieldType.Description,
        label: {
          text: 'Partner Name',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'Children',
        model: 'Children',
        type: FieldType.Description,
        label: {
          text: 'Children',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'Remark',
        model: 'Remark',
        type: FieldType.Description,
        label: {
          text: 'Remarks',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'IsDefault',
        model: 'IsDefault',
        type: FieldType.Boolean,
        label: {
          text: 'Is Default',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'Provider',
        model: 'Provider',
        type: FieldType.Description,
        label: {
          text: 'Provider',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'ProviderId',
        model: 'ProviderId',
        type: FieldType.Description,
        label: {
          text: 'Provider Id',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'ProviderFamilyName',
        model: 'ProviderFamilyName',
        type: FieldType.Description,
        label: {
          text: 'Provider Family Name',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'ProviderEmail',
        model: 'ProviderEmail',
        type: FieldType.Description,
        label: {
          text: 'Provider E-mail',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'ProviderAddress',
        model: 'ProviderAddress',
        type: FieldType.Description,
        label: {
          text: 'Provider Address',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'ProviderComment',
        model: 'ProviderComment',
        type: FieldType.Description,
        label: {
          text: 'Comment',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'PortalUserGroupName',
        model: 'PortalUserGroupName',
        type: FieldType.Description,
        label: {
          text: 'Portal Access Group',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'LogonName',
        model: 'LogonName',
        type: FieldType.Description,
        label: {
          text: 'Logon Name',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'IdentityProviderName',
        model: 'IdentityProviderName',
        type: FieldType.Description,
        label: {
          text: 'Identity Provider Name',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'LastLogin',
        model: 'LastLogin',
        type: FieldType.Date,
        label: {
          text: 'Last Logon',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'Statement',
        model: 'Statement',
        type: FieldType.Description,
        label: {
          text: 'State',
          key: 'businesspartner.main.state'
        },
        visible: true,
        sortable: false,
        readonly: true
      },
      {
        id: 'SetInactiveDate',
        model: 'SetInactiveDate',
        type: FieldType.Date,
        label: {
          text: 'Set Inactive Date',
        },
        visible: true,
        sortable: false,
        readonly: true
      },
    ];
  }
}