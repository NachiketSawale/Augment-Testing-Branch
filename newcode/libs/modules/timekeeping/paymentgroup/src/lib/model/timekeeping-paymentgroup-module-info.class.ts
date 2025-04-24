/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, IEntityInfo, ITranslationContainerInfo } from '@libs/ui/business-base';
import { TimekeepingPaymentGroupDataService } from '../services/timekeeping-payment-group-data.service';
import { TimekeepingPaymentGroupRateDataService } from '../services/timekeeping-payment-group-rate-data.service';
import { TimekeepingPaymentGroupSurchargeDataService } from '../services/timekeeping-payment-group-surcharge-data.service';
import { createLookup, FieldType } from '@libs/ui/common';
import {  BasicsSharedTimekeepingSurchargeTypeLookupService } from '@libs/basics/shared';
import { TimekeepingEmployeePaymentGroupLookupService, TimekeepingEmployeePaymentRateLookupService } from '@libs/timekeeping/shared';
import { IPaymentGroupEntity, IPaymentGroupRateEntity, IPaymentGroupSurEntity } from '@libs/timekeeping/interfaces';
import { addUserDefinedDateTranslation, addUserDefinedNumberTranslation, addUserDefinedTextTranslation, prefixAllTranslationKeys } from '@libs/platform/common';



/**
 * Exports information about containers that will be rendered by this module.
 */
export class TimekeepingPaymentgroupModuleInfo extends BusinessModuleInfoBase {

	private static _instance?: TimekeepingPaymentgroupModuleInfo;
	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TimekeepingPaymentgroupModuleInfo {
		if (!this._instance) {
			this._instance = new TimekeepingPaymentgroupModuleInfo();
		}

		return this._instance;
	}
	/**
	 * Initializes the module information of timekeeping paymentgroup module
	 */

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module
	 * @returns {string}
	 */
	public override get internalModuleName(): string {
		return 'timekeeping.paymentgroup';
	}

	private get moduleSubModule(): string {
		return 'Timekeeping.PaymentGroup';
	}

	/**
	 * Returns the entities used by the module.
	 * @returns The list of entities.
	 */

	public override get entities(): EntityInfo[] {
		return [
			this.paymentGroupEntityInfo,
			this.paymentGroupRateEntityInfo,
			this.paymentGroupSurchargeEntityInfo
		];
	}

	/**
	 * Loads the translation file used for timekeeping paymentgroup
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}

	protected override get translationContainer(): string | ITranslationContainerInfo | undefined {
		return 'a43dcd5a3c8a4f0195aa42dbe132f587';
	}

	private readonly paymentGroupEntityInfo: EntityInfo = EntityInfo.create( {
		grid: {
			title: {key:'timekeeping.paymentgroup.paymentGroupListTitle'}
		},
		form: {
			title: { key: 'timekeeping.paymentgroup.paymentGroupDetailTitle' },
			containerUuid:'c800ef2747434e7199b5b59c5f0a5057'
		},
		dataService: ctx => ctx.injector.get(TimekeepingPaymentGroupDataService),
		dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'PaymentGroupDto'},
		permissionUuid: 'efae4d9755834726b31ad7cbdf09d41f',
		layoutConfiguration: {
			groups: [{gid: 'default-group', attributes: [
					'Code','DescriptionInfo', 'IsDefault', 'IsLive']}
			],
			overloads: {
				IsLive:{readonly:true},
			},

			labels:
				{
					...prefixAllTranslationKeys('cloud.common.', {
						Code :{ key: 'entityCode'},
						DescriptionInfo: { key: 'entityDescription'},
						IsDefault: { key: 'entityBankIsDefault'},
					}),
				}
		}
	}as IEntityInfo<IPaymentGroupEntity>);


	private readonly paymentGroupRateEntityInfo: EntityInfo = EntityInfo.create( {
		grid: {
			title: {key:'timekeeping.paymentgroup.paymentGroupRateListTitle'}
		},
		form: {
			title: { key: 'timekeeping.paymentgroup.paymentGroupRateDetailTitle' },
			containerUuid:'33b18a1eea52466d9bfb81c335671a6a'
		},
		dataService: ctx => ctx.injector.get(TimekeepingPaymentGroupRateDataService),
		dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'PaymentGroupRateDto'},
		permissionUuid: 'faadbbc815c7406ca8c1032a1998b36a',
		layoutConfiguration: {
			groups: [{gid: 'default-group', attributes: [
				'ValidFrom', 'Rate', 'CommentText','SurchargeTypeFk']}
			],
			overloads: {
				SurchargeTypeFk:{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTimekeepingSurchargeTypeLookupService,
					})
				},
			},
			labels:
				{
					...prefixAllTranslationKeys('timekeeping.paymentgroup.', {
						ValidFrom :{ key: 'validFrom'},
						Rate: { key: 'rate'},
						SurchargeTypeFk: { key: 'surchargeTypeFk'},
					}),
					...prefixAllTranslationKeys('cloud.common.', {
						CommentText: {key: 'entityComment'},
					})
				}
		}
	}as IEntityInfo<IPaymentGroupRateEntity>);

	private readonly paymentGroupSurchargeEntityInfo: EntityInfo = EntityInfo.create( {
		grid: {
			title: {key:'timekeeping.paymentgroup.paymentGroupSurchargeListTitle'}
		},
		form: {
			title: { key: 'timekeeping.paymentgroup.paymentGroupSurchargeDetailTitle' },
			containerUuid:'6f04b27dea9244759d2bbbff88bd13a2'
		},
		dataService: ctx => ctx.injector.get(TimekeepingPaymentGroupSurchargeDataService),
		dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'PaymentGroupSurDto'},
		permissionUuid: 'b02e6c0517ba4d548e8cadcf1e322353',
		layoutConfiguration: {
			groups: [{gid: 'default-group', attributes: [
					'PaymentGroupRateFk','PaymentGroupFk', 'SurchargeTypeFk', 'ValidFrom','Rate']},
				{
					gid: 'userDefTexts',
					attributes: ['UserDefinedText01','UserDefinedText02','UserDefinedText03','UserDefinedText04','UserDefinedText05']
				},{
					gid: 'userDefNumbers',
					attributes: ['UserDefinedNumber01','UserDefinedNumber02','UserDefinedNumber03','UserDefinedNumber04','UserDefinedNumber05']
				},{
					gid: 'userDefDates',
					attributes: ['UserDefinedDate01','UserDefinedDate02','UserDefinedDate03','UserDefinedDate04','UserDefinedDate05']
				}
			],
			overloads: {
				SurchargeTypeFk:{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTimekeepingSurchargeTypeLookupService,
					})
				},
				PaymentGroupFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: TimekeepingEmployeePaymentGroupLookupService,
					})
				},
				PaymentGroupRateFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: TimekeepingEmployeePaymentRateLookupService,
               //Todo filter: function (entity) not available
					})
				},
			},
			labels:
				{
					...prefixAllTranslationKeys('timekeeping.paymentgroup.', {
						ValidFrom :{ key: 'validFrom'},
						Rate: { key: 'rate'},
						PaymentGroupFk :{ key: 'paymentGroupFk'},
						SurchargeTypeFk: { key: 'surchargeTypeFk'},
						PaymentGroupRateFk: { key: 'paymentGroupRateFk'},
					}),
					...addUserDefinedTextTranslation({ UserDefinedText: {key: 'entityUserDefinedText',params: { 'p_0': 1 }} }, 10, 'UserDefinedText', '', 'userDefTextGroup'),
					...addUserDefinedNumberTranslation({ UserDefinedNumber: {key: 'entityUserDefinedNumber',params: { 'p_0': 1 }} }, 10, 'UserDefinedNumber', '', 'userDefNumberGroup'),
					...addUserDefinedDateTranslation({ UserDefinedDate: {key: 'entityUserDefDate',params: { 'p_0': 1 }} }, 10, 'UserDefinedDate', '', 'userDefDateGroup'),

				}
		}
	}as IEntityInfo<IPaymentGroupSurEntity>);
}