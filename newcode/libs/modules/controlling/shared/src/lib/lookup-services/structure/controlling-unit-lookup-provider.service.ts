/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILookupDialogSearchFormEntity, ILookupFieldOverload } from '@libs/ui/common';
import { BasicsCompanyLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { ControllingSharedControllingUnitLookupService } from './controlling-unit-lookup.service';
import { ContextService, IInitializationContext, LazyInjectable } from '@libs/platform/common';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { IControllingUnitLookupEntity, IControllingUnitLookupFormEntity } from '@libs/controlling/interfaces';
import { CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN, IControllingUnitLookupOptions, IControllingUnitLookupProvider } from '@libs/controlling/interfaces';

/**
 * Provide controlling unit lookup
 */
@LazyInjectable({
	token: CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true,
})
@Injectable({
	providedIn: 'root',
})
export class ControllingSharedControllingUnitLookupProviderService implements IControllingUnitLookupProvider {
	private readonly contextService = inject(ContextService);
	private readonly formEntity: IControllingUnitLookupFormEntity = {};

	public getSearchFormEntity(): IControllingUnitLookupFormEntity {
		return this.formEntity;
	}

	public async generateControllingUnitLookup<T extends object>(context: IInitializationContext, options: IControllingUnitLookupOptions<T>): Promise<ILookupFieldOverload<T>> {
		const projectLookupProvider = await context.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN);
		const projectLookupOverload = projectLookupProvider.generateProjectLookup<IControllingUnitLookupFormEntity>({
			lookupOptions: {
				serverSideFilter: {
					key: 'project-company-filter',
					execute: (context) => {
						return {
							CompanyFk: context.entity?.CompanyFk,
						};
					},
				},
				showClearButton: true,
				showDescription: true,
				descriptionMember: 'ProjectName',
			},
		});

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IControllingUnitLookupEntity>({
				dataServiceToken: ControllingSharedControllingUnitLookupService,
				gridConfig: {
					columns: [
						{
							id: 'code',
							model: 'Code',
							type: FieldType.Code,
							label: { text: 'Code', key: 'cloud.common.entityCode' },
							sortable: true,
							visible: true,
							readonly: true,
						},
						{
							id: 'description',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: { text: 'Description', key: 'cloud.common.entityDescription' },
							sortable: true,
							visible: true,
							readonly: true,
						},
						{
							id: 'companyCode',
							model: 'CompanyFk',
							width: 120,
							label: { key: 'cloud.common.entityCompanyCode' },
							sortable: true,
							visible: true,
							readonly: true,
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsCompanyLookupService,
							}),
						},
						{
							id: 'companyName',
							model: 'CompanyFk',
							width: 120,
							label: { key: 'cloud.common.entityCompanyCode' },
							sortable: true,
							visible: true,
							readonly: true,
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsCompanyLookupService,
								displayMember: 'CompanyName',
							}),
						},
						{
							id: 'projectNo',
							model: 'PrjProjectFk',
							width: 120,
							label: { key: 'cloud.common.entityProjectNo' },
							sortable: true,
							visible: true,
							readonly: true,
							type: FieldType.Lookup,
							lookupOptions: projectLookupOverload.lookupOptions,
						},
						{
							id: 'projectName',
							model: 'PrjProjectFk',
							width: 150,
							label: { key: 'cloud.common.entityProjectName' },
							sortable: true,
							visible: true,
							readonly: true,
							type: FieldType.Lookup,
							lookupOptions: projectLookupOverload.lookupOptions,
						},
						{
							id: 'quantity',
							model: 'Quantity',
							type: FieldType.Integer,
							label: { text: 'Quantity', key: 'cloud.common.entityQuantity' },
							sortable: true,
							visible: true,
							readonly: true,
						},
						{
							id: 'uomFk',
							model: 'UomFk',
							width: 120,
							label: { key: 'cloud.common.entityUoM' },
							type: FieldType.Lookup,
							sortable: true,
							visible: true,
							readonly: true,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedUomLookupService,
							}),
						},
					],
				},
				showDialog: true,
				dialogOptions: {
					headerText: {
						text: 'Controlling Unit',
						key: 'cloud.common.controllingCodeTitle',
					},
				},
				dialogSearchForm: {
					visible: true,
					form: {
						entity: (context) => {
							this.formEntity.CompanyFk = this.contextService.clientId;
							this.formEntity.PrjProjectFk = options?.projectGetter && context.entity ? options.projectGetter(context.entity) : undefined;
							return this.formEntity as ILookupDialogSearchFormEntity;
						},
						config: {
							groups: [
								{
									groupId: 'default',
								},
							],
							rows: [
								{
									id: 'companyFk',
									groupId: 'default',
									model: 'CompanyFk',
									label: { key: 'cloud.common.entityCompany' },
									type: FieldType.Lookup,
									lookupOptions: createLookup({
										dataServiceToken: BasicsCompanyLookupService,
										showClearButton: true,
										showDescription: true,
										descriptionMember: 'CompanyName',
									}),
								},
								{
									id: 'projectFk',
									groupId: 'default',
									model: 'PrjProjectFk',
									label: { key: 'cloud.common.entityProject' },
									type: FieldType.Lookup,
									lookupOptions: projectLookupOverload.lookupOptions,
								},
							],
						},
						rowChanged: (context) => {
							if (context.model === 'CompanyFk') {
								this.formEntity.PrjProjectFk = null;
							}
						},
					},
				},
				selectableCallback: options?.checkIsAccountingElement
					? (item, context) => {
							if (item.Isaccountingelement) {
								return true;
							}

							if (options.controllingUnitGetter && context.entity) {
								const cuFk = options.controllingUnitGetter(context.entity);

								if (cuFk && cuFk !== item.Id) {
									// Todo - show message, not sure if we still need it.
									// 'procurement.common.controllingUnitSelection.message'
								}
							}

							return false;
						}
					: undefined,
				...options?.lookupOptions,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: 'cloud.common.entityControllingUnitDesc',
					column: true,
					singleRow: true,
				},
			],
		};
	}
}
