/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { BusinessPartnerMainRegionDataService } from '../../services/business-partner-main-region-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BusinessPartnerMainRegionValidationService } from '../../services/validations/business-partner-main-region-validation.service';
import { FieldType } from '@libs/ui/common';
import { BasicsSharedAddressDialogComponent, createFormDialogLookupProvider } from '@libs/basics/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { IRegionEntity } from '@libs/businesspartner/interfaces';

/**
 * Businesspartner region Entity info model.
 */
export const BUSINESS_PARTNER_MAIN_REGION_ENTITY_INFO: EntityInfo = EntityInfo.create<IRegionEntity> ({
    grid: {
        title: {key: 'businesspartner.main.regionGridContainerTitle'},
    },
    form: {
		title: { key: 'businesspartner.main.regionDetailContainerTitle'},
		containerUuid: '1f3b4fb819584c0395af28c85bd8a648',
    },
    dataService: ctx => ctx.injector.get(BusinessPartnerMainRegionDataService),
	validationService: ctx => ctx.injector.get(BusinessPartnerMainRegionValidationService),
    dtoSchemeId: {moduleSubModule: 'BusinessPartner.Main', typeName: 'RegionDto'},
    permissionUuid: 'ab732806d7ef4ffc92b6a4e60ff1fa67',
    layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					text: 'Basic Data',
					key: 'cloud.common.entityProperties',
				},
				attributes: ['IsActive', 'Code', 'Description'],
			},
            {
				gid: 'addresses',
				title: {
					text: 'Address',
					key: 'businesspartner.main.groupAddresses',
				},
				attributes: ['AddressDto', 'AddressDto.Street',
						'AddressDto.City', 'AddressDto.ZipCode','AddressDto.CountryISO2', 'AddressDto.CountryDescription'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				IsActive: {
                    text: 'Is Active',
					key: 'entityIsActive',
				},
				Code: {
					text: 'Code',
					key: 'entityCode',
				},
				Description: {
					key: 'entityDescription', 
                    text: 'Description'
				},
				AddressDto: {
					key: 'entityAddress', 
                    text: 'Address'
				}
			}),
		},
		overloads: {
			AddressDto:{
				type: FieldType.CustomComponent,
				componentType: BasicsSharedAddressDialogComponent,
				providers: createFormDialogLookupProvider({
					foreignKey: 'AddressFk',
					showClearButton: true,
					createOptions: {
						titleField: 'cloud.common.entityDeliveryAddress'
					}
				}),
			}
		},
		transientFields: [
			{
				id: 'AddressDto',
				model: 'AddressDto',
				type: FieldType.CustomComponent,
				componentType: BasicsSharedAddressDialogComponent,
				providers: createFormDialogLookupProvider({
					foreignKey: 'AddressFk',
					showClearButton: true,
					createOptions: {
						titleField: 'cloud.common.entityDeliveryAddress'
					}
				}),
				label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityAddress'},
			},
			{
				id: 'AddressDto.Street',
				model: 'AddressDto.Street',
				type: FieldType.Description,
				label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityStreet'},
				readonly: true
			},
			{
				id: 'AddressDto.City',
				model: 'AddressDto.City',
				type: FieldType.Description,
				label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityCity'},
				readonly: true
			},
			{
				id: 'AddressDto.ZipCode',
				model: 'AddressDto.ZipCode',
				type: FieldType.Description,
				label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityZipCode'},
				readonly: true
			},
			{
				id: 'AddressDto.CountryISO2',
				model: 'AddressDto.CountryISO2',
				type: FieldType.Description,
				label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityCountry'},
				readonly: true
			},
			{
				id: 'AddressDto.CountryDescription',
				model: 'AddressDto.CountryDescription',
				type: FieldType.Description,
				label: {key: MODULE_INFO_BUSINESSPARTNER.basicsCommonModuleName + '.entityCountryDescription'},
				readonly: true
			},
		],
	},
});