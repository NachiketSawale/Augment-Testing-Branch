/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, ViewEncapsulation } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import {
	BasicsSharedTelephoneDialogComponent,
	createFormDialogLookupProvider,
	CustomDialogLookupOptions,
	TelephoneEntity
} from '@libs/basics/shared';
import { FieldType, IFormConfig } from '@libs/ui/common';

/**
 *
 */
export class BusinessPartnerEntity {
	public constructor(id: number) {
		this.Id = id;
	}

	public Id: number;
	public Name?: string;
	public MatchCode?: string;
	public TelephoneFk?: number;
	public Telephone?: TelephoneEntity | null | undefined;
	public TelephoneFk1?: number;
	public Telephone1?: TelephoneEntity | null | undefined;
}

@Component({
	selector: 'example-topic-one-telephone-demo',
	templateUrl: './telephone-demo.component.html',
	styleUrls: ['./telephone-demo.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class TelephoneDemoComponent extends ContainerBaseComponent {

	/**
	 * Telephone test component constructor
	 */
	public constructor() {
		super();
	}

	/**
	 *
	 */
	public options: CustomDialogLookupOptions<TelephoneEntity, object> = {
		objectKey: 'Telephone',
		createOptions: {
			titleField: 'cloud.common.TelephoneDialogTelephone',
			initCreationData: (item: object, entity?: object) => {
				const bpEntity = entity as BusinessPartnerEntity;
				return {
					pattern: bpEntity.Name
				};
			},
			handleCreateSucceeded: (item: TelephoneEntity, entity?: object) => {
				const bpEntity = entity as BusinessPartnerEntity;
				item.CommentText = bpEntity.Name + ' - ' + bpEntity.MatchCode;
				return item;
			}
		}
	};

	public options1: CustomDialogLookupOptions<TelephoneEntity, object> = {
		foreignKey: 'TelephoneFk1',
		createOptions: {
			titleField: 'cloud.common.TelephoneDialogTelephone',
			initCreationData: (item: object, entity?: object) => {
				const bpEntity = entity as BusinessPartnerEntity;
				return {
					pattern: bpEntity.Name
				};
			},
			handleCreateSucceeded: (item: TelephoneEntity, entity?: object) => {
				const bpEntity = entity as BusinessPartnerEntity;
				item.CommentText = bpEntity.Name + ' - ' + bpEntity.MatchCode;
				return item;
			}
		}
	};

	/**
	 * Telephone info
	 */
	public businessPartner: BusinessPartnerEntity = {
		Id: 1,
		Name: 'Comercial Customers',
		MatchCode: 'AAAAA22200ABCDEFGHJKABCDEFGHJKABCDEFGHJKABCDEFGHJK',
		TelephoneFk1: 12345,
		Telephone1: {
			Id: 12345,
			CountryFk: 14,
			AreaCode: '10086',
			CommentText: 'Telephone1',
			Telephone: 'Telephone1'
		}
	};

	/**
	 *
	 */
	public formConfig: IFormConfig<BusinessPartnerEntity> = {
		formId: 'cloud.common.dialog.default.form',
		showGrouping: false,
		addValidationAutomatically: true,
		rows: [{
			id: 'id',
			label: {
				text: 'Id',
				key: 'cloud.common.TelephoneDialogCountry'
			},
			type: FieldType.Integer,
			model: 'Id',
			required: true,
			readonly: true
		}, {
			id: 'name',
			label: {
				text: 'Name',
				key: 'cloud.common.TelephoneDialogAreaCode'
			},
			type: FieldType.Description,
			model: 'Name',
			maxLength: 252
		}, {
			id: 'matchcode',
			label: {
				text: 'Match Code',
				key: 'cloud.common.TelephoneDialogPhoneNumber'
			},
			type: FieldType.Code,
			model: 'MatchCode',
			maxLength: 252
			}, {
				id: 'telephonefk',
				label: {
					text: 'Telephone'
				},
				type: FieldType.CustomComponent,
				componentType: BasicsSharedTelephoneDialogComponent,
				providers: createFormDialogLookupProvider(this.options),
				model: 'TelephoneFk',
		}, {
			id: 'telephonefk1',
			label: {
				text: 'Telephone1'
			},
			type: FieldType.CustomComponent,
			componentType: BasicsSharedTelephoneDialogComponent,
			providers: createFormDialogLookupProvider(this.options1),
			model: 'Telephone1',
		}]
	};
}
