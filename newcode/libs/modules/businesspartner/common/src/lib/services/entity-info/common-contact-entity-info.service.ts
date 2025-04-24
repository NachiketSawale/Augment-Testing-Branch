/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityInfo, IFormContainerSettings, IGridContainerSettings } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '../../model/entity-info/module-info-common.model';
import { IBusinessPartnerSearchMainEntity, IContactEntity, ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';
import { createLookup, FieldOverloadSpec, FieldType, ILayoutGroup, ILookupContext, LookupSimpleEntity } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IEntitySchemaId, IEntitySelection } from '@libs/platform/data-access';
import {
	BasicsCompanyLookupService,
	BasicsSharedAddressDialogComponent,
	BasicsSharedClerkLookupService,
	BasicsSharedCountryLookupService,
	BasicsSharedLanguageLookupService,
	BasicsSharedTelephoneDialogComponent,
	BasicsSharedTitleLookupService,
	createFormDialogLookupProvider,
} from '@libs/basics/shared';
import {
	BusinessPartnerLookupService,
	BusinesspartnerSharedContactAbcLookupService,
	BusinesspartnerSharedContactOriginLookupService,
	BusinesspartnerSharedContactRoleLookupService,
	BusinesspartnerSharedContactTimelinessLookService,
	BusinesspartnerSharedSubsidiaryLookupService,
} from '@libs/businesspartner/shared';
import { IBasicsClerkEntity, IBasicsCountryEntity, IBasicsCustomizeLanguageEntity, ICompanyEntity, IBasicsCustomizeTitleEntity } from '@libs/basics/interfaces';
import { ContactSource } from '../../model/enums/contact-source.enum';
import { OptionallyAsyncResource, prefixAllTranslationKeys, Translatable } from '@libs/platform/common';
import { extend } from 'lodash';
import { IContactEntityInfoSetting } from '../../model/interfaces/contact/contact-entity-info-setting.interface';

@Injectable({
	providedIn: 'root',
})
export class CommonContactEntityInfoService {
	//  base setting,base setting is depend on bp contact no contact module
	private basicGroups: ILayoutGroup<IContactEntity>[] = [
		{
			gid: 'basicData',
			attributes: ['ContactRoleFk', 'TitleFk', 'Title', 'FirstName', 'Initials', 'FamilyName', 'Pronunciation', 'CompanyFk', 'IsLive', 'IsDefaultBaseline'],
		},
		{
			gid: 'communication',
			attributes: ['TelephoneNumberDescriptor', 'TelephoneNumber2Descriptor', 'TeleFaxDescriptor', 'MobileDescriptor', 'Internet', 'Email', 'BasLanguageFk', 'EmailPrivate'],
		},
		{
			gid: 'addresses',
			attributes: ['CountryFk', 'SubsidiaryFk', 'AddressDescriptor', 'PrivateTelephoneNumberDescriptor'],
		},
		{
			gid: 'marketing',
			attributes: ['ClerkResponsibleFk', 'ContactTimelinessFk', 'ContactOriginFk', 'ContactAbcFk'],
		},
		{
			gid: 'other',
			attributes: ['BirthDate', 'NickName', 'PartnerName', 'Children', 'Remark', 'IsDefault'],
		},
		{
			gid: 'itwoPortal',
			attributes: ['Provider', 'ProviderId', 'ProviderFamilyName', 'ProviderEmail', 'ProviderAddress', 'ProviderComment', 'PortalUserGroupName', 'LogonName', 'IdentityProviderName', 'LastLogin', 'Statement', 'SetInactiveDate'],
		},
	];
	private basicOverloads: { [key in keyof Partial<IContactEntity>]: FieldOverloadSpec<IContactEntity> } = {
		ContactRoleFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IContactEntity, LookupSimpleEntity>({
				dataServiceToken: BusinesspartnerSharedContactRoleLookupService,
				showClearButton: true,
			}),
		},
		TitleFk: {
			width: 110,
			type: FieldType.Lookup,
			lookupOptions: createLookup<IContactEntity, IBasicsCustomizeTitleEntity>({
				dataServiceToken: BasicsSharedTitleLookupService,
				showClearButton: true,
			}),
		},
		FirstName: {
			// todo need to add mandatory and navigator
			// mandatory: true,
			// navigator
		},
		FamilyName: {
			// todo need to add mandatory and navigator
			// mandatory: true,
			// navigator
		},
		CompanyFk: {
			type: FieldType.Lookup,
			width: 120,
			lookupOptions: createLookup<IContactEntity, ICompanyEntity>({
				dataServiceToken: BasicsCompanyLookupService,
			}),
		},
		BasLanguageFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IContactEntity, IBasicsCustomizeLanguageEntity>({
				dataServiceToken: BasicsSharedLanguageLookupService,
				showClearButton: true,
			}),
		},
		TelephoneNumberDescriptor: {
			type: FieldType.CustomComponent,
			width: 150,
			componentType: BasicsSharedTelephoneDialogComponent,
			providers: createFormDialogLookupProvider({
				foreignKey: 'TelephoneNumberFk',
				showClearButton: true,
			}),
			// todo wait to do domain type, telephone need this
			// domainType: 'phone'
		},
		TelephoneNumber2Descriptor: {
			type: FieldType.CustomComponent,
			width: 150,
			componentType: BasicsSharedTelephoneDialogComponent,
			providers: createFormDialogLookupProvider({
				foreignKey: 'TelephoneNumber2Fk',
				showClearButton: true,
			}),
			// todo wait to do domain type, telephone need this
			// domainType: 'phone'
		},
		TeleFaxDescriptor: {
			width: 150,
			type: FieldType.CustomComponent,
			componentType: BasicsSharedTelephoneDialogComponent,
			providers: createFormDialogLookupProvider({
				foreignKey: 'TelephoneNumberTelefaxFk',
				showClearButton: true,
			}),
			// todo wait to do domain type, telephone need this
			// domainType: 'phone'
		},
		MobileDescriptor: {
			width: 150,
			type: FieldType.CustomComponent,
			componentType: BasicsSharedTelephoneDialogComponent,
			providers: createFormDialogLookupProvider({
				foreignKey: 'TelephoneNumberMobilFk',
				showClearButton: true,
			}),
			// todo wait to do domain type, telephone need this
			// domainType: 'phone'
		},
		Internet: { maxLength: 100 },
		Email: {
			// todo wait to email lookup and type
			// domainType: 'email'
		},
		CountryFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IContactEntity, IBasicsCountryEntity>({
				dataServiceToken: BasicsSharedCountryLookupService,
				showClearButton: true,
			}),
		},
		SubsidiaryFk: {
			width: 150,
			type: FieldType.Lookup,
			lookupOptions: createLookup<IContactEntity, ISubsidiaryLookupEntity>({
				dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
				showClearButton: true,
				serverSideFilter: {
					key: 'contact-subsidiary-filter',
					execute(context: ILookupContext<ISubsidiaryLookupEntity, IContactEntity>) {
						return {
							BusinessPartnerFk: context.entity ? context.entity.BusinessPartnerFk : null,
						};
					},
				},
				disableDataCaching: true,
				inputSearchMembers: ['SubsidiaryDescription', 'Street', 'ZipCode', 'City', 'Iso2'],
			}),
		},
		AddressDescriptor: {
			width: 200,
			type: FieldType.CustomComponent,
			componentType: BasicsSharedAddressDialogComponent,
			providers: createFormDialogLookupProvider({
				foreignKey: 'AddressFk',
				showClearButton: true,
				createOptions: {
					titleField: 'businesspartner.main.contactAddress',
				},
			}),
		},
		PrivateTelephoneNumberDescriptor: {
			width: 150,
			type: FieldType.CustomComponent,
			componentType: BasicsSharedTelephoneDialogComponent,
			providers: createFormDialogLookupProvider({
				foreignKey: 'TelephonePrivatFk',
				showClearButton: true,
				createOptions: {
					titleField: 'businesspartner.main.contactTelephoneNumber',
				},
			}),
			// todo wait to do domain type, telephone need this
			// domainType: 'phone'
		},
		ClerkResponsibleFk: {
			width: 150,
			type: FieldType.Lookup,
			lookupOptions: createLookup<IContactEntity, IBasicsClerkEntity>({
				dataServiceToken: BasicsSharedClerkLookupService,
				showClearButton: true,
			}),
		},
		ContactTimelinessFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IContactEntity, LookupSimpleEntity>({
				dataServiceToken: BusinesspartnerSharedContactTimelinessLookService,
				showClearButton: true,
			}),
		},
		ContactOriginFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IContactEntity, LookupSimpleEntity>({
				dataServiceToken: BusinesspartnerSharedContactOriginLookupService,
				showClearButton: true,
			}),
		},
		ContactAbcFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IContactEntity, LookupSimpleEntity>({
				dataServiceToken: BusinesspartnerSharedContactAbcLookupService,
			}),
		},
		LastLogin: {
			readonly: true,
		},
		Provider: {
			maxLength: 64,
		},
		ProviderId: {
			readonly: true,
		},
		ProviderFamilyName: {
			readonly: true,
		},
		ProviderEmail: {
			readonly: true,
		},
		ProviderAddress: {
			readonly: true,
			maxLength: 320,
		},
		ProviderComment: {
			readonly: true,
		},
		PortalUserGroupName: {
			readonly: true,
			maxLength: 50,
		},
		LogonName: {
			readonly: true,
		},
		IdentityProviderName: {
			readonly: true,
			maxLength: 50,
		},
		Statement: {
			readonly: true,
		},
		SetInactiveDate: {
			readonly: true,
		},
		EmailPrivate: {
			visible: true,
			// todo wait to email lookup and type
			// domainType: 'email'
		},
		IsLive: {
			readonly: true,
		},
	};
	private basicLabels: { [p: string]: Translatable } = {
		...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
			ContactRoleFk: { key: 'role' },
			FirstName: { key: 'firstName' },
			Initials: { key: 'initials' },
			FamilyName: { key: 'familyName' },
			Pronunciation: { key: 'pronunciation' },
			TelephoneNumberDescriptor: { key: 'telephoneNumber' },
			TelephoneNumber2Descriptor: { key: 'telephoneNumber2' },
			TeleFaxDescriptor: { key: 'telephoneFax' },
			MobileDescriptor: { key: 'mobileNumber' },
			Internet: { key: 'internet' },
			Email: { key: 'email' },
			SubsidiaryFk: { key: 'subsidiaryAddress' },
			AddressDescriptor: { key: 'contactAddress' },
			PrivateTelephoneNumberDescriptor: { key: 'contactTelephoneNumber' },
			ContactTimelinessFk: { key: 'timeliness' },
			ContactOriginFk: { key: 'origin' },
			ContactAbcFk: { key: 'customerAbc' },
			BirthDate: { key: 'birthDate' },
			NickName: { key: 'nickname' },
			PartnerName: { key: 'partnerName' },
			Children: { key: 'children' },
			Remark: { key: 'entityRemark' },
			LastLogin: { key: 'lastLogin' },
			Provider: { key: 'provider' },
			ProviderId: { key: 'providerId' },
			ProviderFamilyName: { key: 'providerFamilyName' },
			ProviderEmail: { key: 'providerEmail' },
			ProviderAddress: { key: 'providerAddress' },
			PortalUserGroupName: { key: 'portalAccessGroup' },
			IdentityProviderName: { key: 'identityProviderName' },
			Statement: { key: 'state' },
			SetInactiveDate: { key: 'setInactiveDate' },
			IsDefaultBaseline: { key: 'isDefaultBaseline' },
		}),
		...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
			CompanyFk: { key: 'entityCompany' },
			CountryFk: { key: 'entityCountry' },
			ClerkResponsibleFk: { key: 'entityResponsible' },
			ProviderComment: { key: 'entityCommentText' },
			LogonName: { key: 'User_LogonName' },
			IsDefault: { key: 'entityIsDefault' },
			EmailPrivate: { key: 'emailPrivate' },
			IsLive: { key: 'contactIsLive' },
		}),
		...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.', {
			Title: { key: 'titleName' },
			TitleFk: { key: 'title' },
		}),
		...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.basicsCustomizeModuleName + '.', {
			BasLanguageFk: { key: 'language' },
		}),
	};

	private basicDtoSchemeId: IEntitySchemaId = { moduleSubModule: 'BusinessPartner.Contact', typeName: 'ContactDto' };

	/**
	 * Generate corresponding contact container
	 * @returns {EntityInfo}
	 * @param contactEntityInfoSetting
	 */
	public getContactEntityInfo(contactEntityInfoSetting: IContactEntityInfoSetting): IEntityInfo<IContactEntity> {
		// region basic info
		const basicGrid: boolean | [string] | IGridContainerSettings<IContactEntity> = {
			title: { text: 'Contacts', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.contactGridContainerTitle' },
			behavior: contactEntityInfoSetting.behavior,
			containerUuid:contactEntityInfoSetting.gridUuid
		};
		const basicFrom: false | string | [string, string] | IFormContainerSettings<IContactEntity> = {
			title: { text: 'Contact Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.contactFormContainerTitle' },
			containerUuid: contactEntityInfoSetting.fromUuid

		};
		const basicDataServiceToken: OptionallyAsyncResource<IEntitySelection<IContactEntity>> = contactEntityInfoSetting.dataServiceToken;
		const basicPermissionUuid: string =contactEntityInfoSetting.permissionUuid;
		// endregion
		switch (contactEntityInfoSetting.source) {
			case ContactSource.Contact: {
				// region overloads
				// add BusinessPartnerFk in grid
				const ContactOverloads: { [key in keyof Partial<IContactEntity>]: FieldOverloadSpec<IContactEntity> } = {
					BusinessPartnerFk: {
						label: { key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityBusinessPartner' },
						type: FieldType.Lookup,
						lookupOptions: createLookup<IContactEntity, IBusinessPartnerSearchMainEntity>({
							dataServiceToken: BusinessPartnerLookupService,
							displayMember: 'BusinessPartnerName1',
							showClearButton: true,
						}),
					},
				};
				this.basicOverloads = extend(this.basicOverloads, ContactOverloads);
				// endregion
				// region groups
				const columnBusinessPartnerFk: keyof IContactEntity = 'BusinessPartnerFk';
				const data = this.basicGroups.find((e) => e.gid === 'basicData');
				if (data) {
					data.attributes.unshift(columnBusinessPartnerFk);
				}
				// endregion
				// region other,wait contact to do
				// endregion
				break;
			}
			case ContactSource.BusinesspartnerMain: {
				// region groups
				// endregion
				// region other
				// endregion
				break;
			}
			case ContactSource.Rfq: {
				// region groups
				// endregion
				// region other
				// endregion
				break;
			}
			default:
				break;
		}
		// endregion
		// region create final entityInfo
		// endregion
		const EntityInfo:IEntityInfo<IContactEntity>={
			grid: basicGrid,
			form: basicFrom,
			dataService: basicDataServiceToken,
			dtoSchemeId: this.basicDtoSchemeId,
			permissionUuid: basicPermissionUuid,
			layoutConfiguration: {
				groups: this.basicGroups,
				labels: this.basicLabels,
				overloads: this.basicOverloads,
			}
		};
		return EntityInfo;
	}
}
