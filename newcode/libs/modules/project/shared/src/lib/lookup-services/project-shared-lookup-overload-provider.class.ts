/*
 * Copyright(c) RIB Software GmbH
 */


import { ConcreteFieldOverload, createLookup, FieldType, ILookupContext, ILookupOptions, ILookupServerSideFilter, TypedConcreteFieldOverload } from '@libs/ui/common';
import { BasicsCompanyLookupService, BasicsSharedCompanyContextService, BasicsSharedSalesTaxGroupLookupService } from '@libs/basics/shared';
import { IBasicsCustomizeSalesTaxGroupEntity, IProjectStockLookupEntity } from '@libs/basics/interfaces';
import { IProjectInfoRequestEntity, IProjectLookupEntity, IProjectStockLocationEntity } from '@libs/project/interfaces';
import { ProjectGroupLookupService } from './group/project-group-lookup.service';
import { ProjectStockLocationLookupService } from './stock/project-stock-location-lookup.service';
import { ProjectSharedLookupOverloadProviderGenerated } from './project-shared-lookup-overload-provider-generated.class';
import { ProjectSharedLookupService } from './main/project-lookup.service';
import { ProjectLocationLookupService } from './location/project-location-lookup.service';
import { ProjectInfoRequestLookupService } from '../inforequest/project-info-request-lookup.service';
import { ProjectStockLookupService } from './stock/project-stock-lookup.service';
import { get } from 'lodash';
import { ServiceLocator } from '@libs/platform/common';
import { ProjectSharedStock2ProjectLookupService } from './stock/project-stock-2-project-lookup.service';

export class ProjectSharedLookupOverloadProvider extends ProjectSharedLookupOverloadProviderGenerated {

	public static provideProjectLookupOverload<T extends object>(showClearBtn: boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions: createLookup({
				dataServiceToken: ProjectSharedLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: ProjectSharedLookupService,
				showClearButton: false
			})
		};
	}

	public static provideProjectGroupLookupOverload<T extends object>(showClearBtn: boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions: createLookup({
				dataServiceToken: ProjectGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectGroupReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: ProjectGroupLookupService,
				showClearButton: false
			})
		};
	}

	public static provideProjectLocationLookupOverload<T extends object>(showClearBtn: boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions: createLookup({
				dataServiceToken: ProjectLocationLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectLocationReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: ProjectLocationLookupService,
				showClearButton: false
			})
		};
	}

	public static provideProjectStock2ProjectOptionLookupOverload<T extends object>(option?: ILookupOptions<IProjectLookupEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: option?.readonly,
			lookupOptions: createLookup({
				dataServiceToken: ProjectSharedStock2ProjectLookupService,
				showClearButton: option?.showClearButton,
				serverSideFilter: option?.serverSideFilter,
				clientSideFilter: option?.clientSideFilter
			}),
			additionalFields: [
				{
					displayMember: 'ProjectName',
					label: {text: 'Project Name', key: 'cloud.common.entityProjectName'},
					column: true,
					singleRow: true,
				}]
		};
	}

	/**
	 * provide Project Stock Additional Lookup Overload
	 * @param option use {showClearButton, readonly, serverSideFilter, clientSideFilter}
	 * @remark have additional filed: Description, Company Code, Company Name, Project No, Project Name, Stock Type
	 */
	public static provideProjectStockOptionLookupOverload<T extends object>(option?: ILookupOptions<IProjectStockLookupEntity, T>): ConcreteFieldOverload<T> {
		const companyLookupService = ServiceLocator.injector.get(BasicsCompanyLookupService);
		const projectLookupService = ServiceLocator.injector.get(ProjectSharedLookupService);
		// If the filter is not written, an error will be reported
		const serverSideFilter = option && option.serverSideFilter
			? option.serverSideFilter
			: {
				key: 'project-stock-filter',
				execute: (context: ILookupContext<IProjectStockLookupEntity, T>) => {
					return {
						PKey3: get(context.entity, 'ProjectFk') || get(context.entity, 'PrjProjectFk') || 0
					};
				}
			};
		return {
			type: FieldType.Lookup,
			readonly: option?.readonly,
			lookupOptions: createLookup({
				dataServiceToken: ProjectStockLookupService,
				showClearButton: option?.showClearButton,
				serverSideFilter: serverSideFilter,
				clientSideFilter: option?.clientSideFilter
			}),
			additionalFields: [
				{
					displayMember: 'Description',
					label: {text: 'Stock-Description', key: 'basics.common.stock.description'},
					column: true,
					singleRow: true,
				},
				{
					displayMember: 'CompanyFk',
					label: {text: 'Stock-Company Code', key: 'basics.common.stock.companyCode'},
					column: true,
					singleRow: false,
					lookupOptions: createLookup({
						formatter: {
							format(dataItem: IProjectStockLookupEntity): string {
								const company = companyLookupService.cache.getItem({id: dataItem.CompanyFk});
								return `<span class='pane-r'>${company?.Code}</span>`;
							}
						}
					})
				},
				{
					displayMember: 'CompanyName',
					label: {text: 'Stock-Company Name', key: 'basics.common.stock.companyName'},
					column: true,
					singleRow: false,
					lookupOptions: createLookup({
						formatter: {
							format(dataItem: IProjectStockLookupEntity): string {
								const company = companyLookupService.cache.getItem({id: dataItem.CompanyFk});
								return `<span class='pane-r'>${company?.CompanyName}</span>`;
							}
						}
					})
				},
				{
					displayMember: 'ProjectFk',
					label: {text: 'Stock-Project No.', key: 'basics.common.stock.projectNo'},
					column: true,
					singleRow: false,
					lookupOptions: createLookup({
						formatter: {
							format(dataItem: IProjectStockLookupEntity): string {
								const projectItem = projectLookupService.cache.getItem({id: dataItem.ProjectFk});
								return `<span class='pane-r'>${projectItem?.ProjectNo}</span>`;
							}
						}
					})
				},
				{
					displayMember: 'ProjectName',
					label: {text: 'Stock-Project Name', key: 'basics.common.stock.projectName'},
					column: true,
					singleRow: false,
					lookupOptions: createLookup({
						formatter: {
							format(dataItem: IProjectStockLookupEntity): string {
								const projectItem = projectLookupService.cache.getItem({id: dataItem.ProjectFk});
								return `<span class='pane-r'>${projectItem?.ProjectName}</span>`;
							}
						}
					})
				},
				{
					displayMember: 'StockTypeDescriptionInfo.Translated',
					label: {text: 'Stock-PrjStockTypeDesc', key: 'basics.common.stock.typeDescription'},
					column: true,
					singleRow: false
				}
			]
		};
	}

	public static provideProjectStockLookupOverload<T extends object>(showClearBtn: boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions: createLookup({
				dataServiceToken: ProjectStockLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStockReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: ProjectStockLookupService,
				showClearButton: false
			}),
			additionalFields:[
				{
					displayMember: 'Description',
					label: {text: 'Stock-Description', key: 'basics.common.stock.description'},
					column: true,
					singleRow: true,
				}
			]
		};
	}

	public static provideProjectStockLocationOptionLookupOverload<T extends object>(option?: ILookupOptions<IProjectStockLocationEntity, T>): ConcreteFieldOverload<T> {
		const serverSideFilter = option && option.serverSideFilter
			? option.serverSideFilter
			: {
				key: 'project-stock-location-filter',
				execute: (context: ILookupContext<IProjectStockLocationEntity, T>) => {
					return {
						Pkey1: get(context.entity, 'ProjectStockFk') || get(context.entity, 'PrjStockFk'),
						Pkey2: get(context.entity, 'ProjectFk') || get(context.entity, 'PrjProjectFk')
					};
				}
			};
		return {
			type: FieldType.Lookup,
			readonly: option?.readonly,
			lookupOptions: createLookup({
				dataServiceToken: ProjectStockLocationLookupService,
				showClearButton: option?.showClearButton,
				serverSideFilter: serverSideFilter,
				clientSideFilter: option?.clientSideFilter
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						text: 'Stock Location-Description',
						key: 'basics.common.stock.locationDescription',
					},
					column: true,
					singleRow: true
				}
			]
		};
	}

	public static provideProjectStockLocationLookupOverload<T extends object>(showClearBtn: boolean, sideFilter?: ILookupServerSideFilter<IProjectStockLocationEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions: createLookup({
				dataServiceToken: ProjectStockLocationLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: sideFilter
			})
		};
	}

	public static provideProjectStockLocationReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: ProjectStockLocationLookupService,
				showClearButton: false
			})
		};
	}

	public static provideProjectSalesTaxGroupLookupOverload<T extends object>(showClearBtn: boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedSalesTaxGroupLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: {
					key: 'sales-tax-group-filter',
					async execute(context: ILookupContext<IBasicsCustomizeSalesTaxGroupEntity, never>) {
						const loginCompanyEntity = context.injector.get(BasicsSharedCompanyContextService).loginCompanyEntity;
						return {
							LedgerContextFk: loginCompanyEntity ? loginCompanyEntity.LedgerContextFk : null
						};
					},
				},
			})
		};
	}

	public static providerProjectInfoRequestLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IProjectInfoRequestEntity>({
				dataServiceToken: ProjectInfoRequestLookupService,
				showClearButton: showClearBtn,
				showDescription: true,
				descriptionMember: 'Description'
			})
		};
	}
}