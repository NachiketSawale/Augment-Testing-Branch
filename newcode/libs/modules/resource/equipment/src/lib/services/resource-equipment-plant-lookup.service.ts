/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ICertificateEntity } from '@libs/resource/interfaces';
import { ILookupDialogSearchFormEntity } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';


/**
 * Resource Equipment Plant Lookup Service
 */
@Injectable({
	providedIn: 'root'
})

export class ResourceEquipmentPlantLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ICertificateEntity, TEntity> {
	public constructor() {
		const result: ILookupDialogSearchFormEntity = {};

		const lookupOption :ILookupConfig<ICertificateEntity, TEntity> = {
			uuid: '3af0e3ceeb374d9ab3060d8fc1fdbf82',
			valueMember: 'Id',
			displayMember: 'Code',
			showDialog: true,
			dialogOptions: {
				headerText: {key: 'resource.certificate.equipmentplant'}
			},
			dialogSearchForm: {
				form: {
					entity: () => {
						return result;
					},
					config: {
						groups: [{groupId: 'default'}],
						rows: [{
							id: 'plantKind',
							groupId: 'default',
							model: 'PlantKindFk',
							...BasicsSharedCustomizeLookupOverloadProvider.providePlantKindLookupOverload(true),
							visible:true,
							label: {key: 'basics.customize.plantkind'}
						},
						{
							id: 'plantType',
							groupId: 'default',
							model: 'PlantTypeFk',
							...BasicsSharedCustomizeLookupOverloadProvider.providePlantTypeLookupOverload(true),
							visible:true,
							label: {key: 'basics.customize.planttype'}
						},
							//TODO Plant Group
						{
							id: 'plantStatus',
							groupId: 'default',
							model: 'PlantStatusFk',
							...BasicsSharedCustomizeLookupOverloadProvider.providePlantStatusLookupOverload(true),
							visible:true,
							label: {key: 'basics.customize.plantstatus'}
						},
						{
							id: 'validFrom',
							groupId: 'default',
							model: 'ValidFrom',
							type:FieldType.Date,
							visible:true,
							label: {key: 'cloud.common.entityValidFrom'}
						},
						{
							id: 'validTo',
							groupId: 'default',
							model: 'ValidTo',
							type:FieldType.Date,
							visible:true,
							label: {key: 'cloud.common.entityValidTo'}
						}
						//TO Company
						]
					},


				},
				visible:true
			},
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'LongDescriptionInfo',
						model: 'LongDescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'LongDescriptionInfo', key: 'cloud.common.entityLongDescriptionInfo'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Specification',
						model: 'Specification',
						type: FieldType.Comment,
						label: {text: 'Specification', key: 'resource.certificate.entitySpecification'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AlternativeCode',
						model: 'AlternativeCode',
						type: FieldType.Code,
						label: {text: 'AlternativeCode', key: 'resource.certificate.entityAlternativeCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Matchcode',
						model: 'Matchcode',
						type: FieldType.Code,
						label: {text: 'Matchcode', key: 'resource.certificate.entityMatchcode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NfcId',
						model: 'NfcId',
						type: FieldType.Description,
						label: {text: 'NfcId', key: 'resource.certificate.entityNfcId'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: {text: 'NfcId', key: 'resource.certificate.entityCommentText'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ValidFrom',
						model: 'ValidFrom',
						type: FieldType.Date,
						label: {text: 'ValidFrom', key: 'cloud.common.entityValidFrom'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ValidTo',
						model: 'ValidTo',
						type: FieldType.Date,
						label: {text: 'ValidTo', key: 'cloud.common.entityValidTo'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsLive',
						model: 'IsLive',
						type: FieldType.Boolean,
						label: {text: 'IsLive', key: 'resource.certificate.entityIsLive'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RegNumber',
						model: 'RegNumber',
						type: FieldType.Description,
						label: {text: 'RegNumber', key: 'resource.certificate.entityRegNumber'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CompanyFk',
						model: 'CompanyFk',
						type: FieldType.Quantity,
						label: {text: 'CompanyFk', key: 'resource.certificate.entityCompanyFk'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PlantStatusFk',
						model: 'PlantStatusFk',
						type: FieldType.Quantity,
						label: {text: 'PlantStatusFk', key: 'resource.certificate.entityPlantStatusFk'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SerialNumber',
						model: 'SerialNumber',
						type: FieldType.Description,
						label: {text: 'SerialNumber', key: 'resource.certificate.entitySerialNumber'},
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		};
		super({
			httpRead: {
				route: 'resource/equipment/plant/',
				endPointRead: 'lookuplist',
				usePostForRead: false,
			},
			filterParam: true,
			prepareListFilter: (context) => {
				if (context) {
					const filterMapping = {
						plantKind: result['PlantKindFk'],
						plantType: result['PlantTypeFk'],
						plantStatus: result['PlantStatusFk'],
						validFrom: result['ValidFrom'],
						validTo: result['ValidTo'],
					};

					const filters = Object.entries(filterMapping)
						.filter(([_, value]) => value !== undefined && value !== null)
						.map(([key, value]) => `${key}=${value}`);

					return filters.length > 0 ? filters.join('&') : '';
				} else {
					return '';
				}
			}

		}, lookupOption);

	}
}

