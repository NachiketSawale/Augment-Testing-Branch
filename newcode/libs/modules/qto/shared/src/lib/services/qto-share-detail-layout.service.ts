/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector, ProviderToken, runInInjectionContext } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { CompleteIdentification, IEntityContext, IEntityIdentification, PlatformConfigurationService, prefixAllTranslationKeys } from '@libs/platform/common';
import { ConcreteFieldOverload, createLookup, FieldType, ILayoutConfiguration, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { BasicsSharedAssetMasterLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProcurementSharePesLookupService } from '@libs/procurement/shared';
import { QtoShareSalesContractLookupService, SalesContractsEntity } from '../lookup-services/qto-share-sales-contract-lookup.service';
import { BillToEntity, QtoShareBillToLookupService } from '../lookup-services/qto-share-bill-to-lookup.service';
import { IQtoShareLineTypeLookupEntity, QtoShareLineTypeLookupService } from '../lookup-services/qto-share-line-type-lookup.service';
import { QtoShareFormulaLookupService } from '../lookup-services/qto-share-formula-lookup.service';
import {IQtoShareDetailEntity} from '../model/entities/qto-share-detail-entity.interface';
import {QtoShareDetailGridComplete} from '../model/qto-share-detail-complete.class';
import {QtoShareBoqType} from '../model/enums/qto-share-boq-type.enum';
import {QtoShareLineType} from '../model/enums/qto-share-line-type.enum';
import {QtoShareDetailDataService} from '../services/qto-share-detail-data.service';
import {IQtoShareHeaderEntity} from '../model/entities/qto-share-header-entity.interface';
import {QtoShareFormulaType} from '../model/enums/qto-share-formula-type.enum';

/**
 * qto detail operator info
 */
export interface IQtoDetailOperatorInfo {
	Id: string;
	Code: string;
}

@Injectable({
	providedIn: 'root',
})
export class QtoShareDetailLayoutService {
	private readonly injector = inject(Injector);

	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);

	private lookupServiceFactory = inject(UiCommonLookupDataFactoryService);

	private getCommonAttributes(): string[] {
		return [
			'PageNumber',
			'LineReference',
			'LineIndex',
			'QtoDetailStatusFk',
			'BoqItemFk',
			'BoqSplitQuantityFk',
			'BasUomFk',
			'PrjLocationFk',
			'AssetMasterFk',
			'PrcStructureFk',
			'QtoLineTypeFk',
			'QtoFormulaFk',
			'Factor',
			'Value1Detail',
			'Operator1',
			'Value2Detail',
			'Operator2',
			'Value3Detail',
			'Operator3',
			'Value4Detail',
			'Operator4',
			'Value5Detail',
			'Operator5',
			'FormulaResult',
			'Result',
			'SubTotal',
			'IsBlocked',
			'IsReadonly',
			'SpecialUse',
			'PerformedDate',
			'PerformedFromWip',
			'PerformedToWip',
			'PerformedFromBil',
			'PerformedToBil',
			'ProgressInvoiceNo',
			'RemarkText',
			'Remark1Text',
			'WipHeaderFk',
			'PesHeaderFk',
			'OrdHeaderFk',
			'BilHeaderFk',
			'BillToFk',
			'LineText',
			'V',
			'QtoDetailSplitFromReference',
			'QtoDetailReference',
			'UserDefined1',
			'UserDefined2',
			'UserDefined3',
			'UserDefined4',
			'UserDefined5',
			'SortCode01Fk',
			'SortCode02Fk',
			'SortCode03Fk',
			'SortCode04Fk',
			'SortCode05Fk',
			'SortCode06Fk',
			'SortCode07Fk',
			'SortCode08Fk',
			'SortCode09Fk',
			'SortCode10Fk',
		];
	}

	private readonly operatorOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<IQtoShareDetailEntity>>({
		type: FieldType.Description,
	});

	private readonly value1DetailOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<IQtoShareDetailEntity>>({
		type: FieldType.Description,
	});

	private readonly value2DetailOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<IQtoShareDetailEntity>>({
		type: FieldType.Description,
	});

	/**
	 * Generate layout config
	 */
	public async generateLayout<T extends IQtoShareDetailEntity, U extends QtoShareDetailGridComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		dataServiceToken: ProviderToken<QtoShareDetailDataService<T, U, PT, PU>>;
	}): Promise<ILayoutConfiguration<T>> {
		return runInInjectionContext(this.injector, () => {
			const dataService = this.injector.get(config.dataServiceToken);

			const commonAttributes = this.getCommonAttributes();

			// get the boq Type
			// on the basis of boq type, push the clomns IsBQ, IsIQ, IsWQ or IsAQ
			const boqType = dataService.boqType;
			const isPrjBoq = boqType === QtoShareBoqType.PrjBoq;
			const isPrcBoq = boqType === QtoShareBoqType.PrcBoq;
			const isWipBoq = boqType === QtoShareBoqType.WipBoq;
			const isPesBoq = boqType === QtoShareBoqType.PesBoq;
			const isBillingBoq = boqType === QtoShareBoqType.BillingBoq;
			// TODO: Temporarily commenting out to resolve eslint the error because it never used.
			// const isQtoBoq = boqType === QtoShareBoqType.QtoBoq;
			if (isBillingBoq || isWipBoq || isPesBoq) {
				commonAttributes.push('IsBQ');
				commonAttributes.push('IsIQ');
			} else if (isPrcBoq || isPrjBoq) {
				commonAttributes.push('IsWQ');
				commonAttributes.push('IsAQ');
			} else {
				commonAttributes.push('IsWQ');
				commonAttributes.push('IsAQ');
				commonAttributes.push('IsBQ');
				commonAttributes.push('IsIQ');
			}

			return <ILayoutConfiguration<T>>{
				groups: [
					{
						gid: 'default',
						attributes: commonAttributes,
					},
				],
				overloads: {
					QtoDetailStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideQtoDetailStatusReadonlyLookupOverload(),
					// TODO: BoqItemFk lookup => has addition colums:
					// TODO: BoqSplitQuantityFk lookup
					BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMReadonlyLookupOverload(),
					// TODO: PrjLocationFk lookup => has addition colums:
					AssetMasterFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedAssetMasterLookupService,
							showDescription: true,
							descriptionMember: 'DescriptionInfo.Translated',
							showClearButton: true,
						}),
						additionalFields: [
							{
								displayMember: 'DescriptionInfo.Translated',
								label: {
									key: 'qto.main.AssetMasterDesc',
								},
								column: true,
								singleRow: true,
								row: true,
							},
						],
					},
					PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
					QtoLineTypeFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup<T, IQtoShareLineTypeLookupEntity>({
							dataServiceToken: QtoShareLineTypeLookupService,
							showDescription: true,
							descriptionMember: 'Description',
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: (e) => {
										if (e.context.entity && e.context.lookupInput?.selectedItem) {
											const selectedItem = e.context.lookupInput.selectedItem;
											// TODO: Temporarily commenting out to resolve the eslint error -jack.
											// let syncLineTypeInGroup = false;
											const qtoLineTypeFk = e.context.entity.QtoLineTypeFk;

											if (qtoLineTypeFk === QtoShareLineType.Standard) {
												e.context.entity.bakResult = e.context.entity.Result;
												if (selectedItem.Id === QtoShareLineType.Hilfswert) {
													// TODO: Temporarily commenting out to resolve the eslint error -jack.
													// syncLineTypeInGroup = true;
													//TODO: not sure how to deal with this case -lnt
													//entity.Result = '(' + entity.Result + ')';
												}
											} else if (qtoLineTypeFk === QtoShareLineType.CommentLine && selectedItem.Id === QtoShareLineType.Standard) {
												e.context.entity.Result = e.context.entity.bakResult as number;
											} else if (qtoLineTypeFk === QtoShareLineType.Hilfswert && selectedItem.Id === QtoShareLineType.Standard) {
												// TODO: Temporarily commenting out to resolve the eslint error -jack.
												// syncLineTypeInGroup = true;
												dataService.changeQtoLineTypeFromAuxToStd(e.context.entity);
												e.context.entity.Result = e.context.entity.bakResult as number;
											}

											if (selectedItem) {
												e.context.entity.QtoLineTypeCode = selectedItem.Code;
												e.context.entity.QtoLineTypeFk = selectedItem.Id;
												if (selectedItem.Id === QtoShareLineType.CommentLine) {
													e.context.entity.Result = 0;
												}
											}

											e.context.entity.IsCalculate = true;
										}
									},
								},
							],
						}),
						additionalFields: [
							{
								displayMember: 'Description',
								label: {
									key: 'cloud.common.entityDescription',
								},
								column: true,
								singleRow: true,
								row: true,
							},
						],
					},
					QtoFormulaFk: {
						type: FieldType.Dynamic,
						overload: (ctx) => {
							const qtoFormulaFkOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<IQtoShareDetailEntity>>({
								type: FieldType.Lookup,
								lookupOptions: createLookup({
									dataServiceToken: QtoShareFormulaLookupService,
									showDescription: true,
									displayMember: 'Code',
									serverSideFilter: {
										key: 'qto-detail-formula-filter',
										execute: (context: IEntityContext<IQtoShareDetailEntity>): Promise<string> => {
											return new Promise((resolve) => {
												resolve(' BasRubricCategoryFk=' + dataService.currentQtoHeader?.BasRubricCategoryFk + ' && IsLive=true');
											});
										},
									},
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: (e) => {
												dataService.setIsFormulaChanged(true);
											},
										},
									],
								}),
								additionalFields: [
									{
										displayMember: 'DescriptionInfo.Translated',
										label: {
											key: 'qto.main.QtoFormulaDesc',
										},
										column: true,
										singleRow: true,
										row: true,
									},
								],
							});
							if (ctx.entity) {
								this.updateQtoFormulaFkOverload(ctx.entity, qtoFormulaFkOverloadSubject);
							}
							return qtoFormulaFkOverloadSubject;
						},
					},
					Factor: {
						type: FieldType.Factor,
						formatterOptions: {
							decimalPlaces: this.getRoundingDigits(dataService.currentQtoHeader),
						},
					},
					Value1Detail: {
						type: FieldType.Dynamic,
						overload: (ctx) => {
							this.updatevalue1detailOverload(ctx.entity, dataService.getList());
							return this.value1DetailOverloadSubject;
						},
					},
					Operator1: {
						type: FieldType.Dynamic,
						overload: (ctx) => {
							this.updateOperatorOverload('Operator1', ctx.entity);
							return this.operatorOverloadSubject;
						},
					},
					Value2Detail: {
						type: FieldType.Dynamic,
						overload: (ctx) => {
							this.updatevalue2detailOverload(ctx.entity);
							return this.value2DetailOverloadSubject;
						},
					},
					Operator2: {
						type: FieldType.Dynamic,
						overload: (ctx) => {
							this.updateOperatorOverload('Operator2', ctx.entity);
							return this.operatorOverloadSubject;
						},
					},
					Value3Detail: {
						type: FieldType.Description,
						required: false,
					},
					Operator3: {
						type: FieldType.Dynamic,
						overload: (ctx) => {
							this.updateOperatorOverload('Operator3', ctx.entity);
							return this.operatorOverloadSubject;
						},
					},
					Value4Detail: {
						type: FieldType.Description,
						required: false,
					},
					Operator4: {
						type: FieldType.Dynamic,
						overload: (ctx) => {
							this.updateOperatorOverload('Operator4', ctx.entity);
							return this.operatorOverloadSubject;
						},
					},
					Value5Detail: {
						type: FieldType.Description,
						required: false,
					},
					Operator5: {
						type: FieldType.Dynamic,
						overload: (ctx) => {
							this.updateOperatorOverload('Operator5', ctx.entity);
							return this.operatorOverloadSubject;
						},
					},
					// TODO: FormulaResult
					// TODO: Result
					SubTotal: {
						type: FieldType.Quantity,
						formatterOptions: {
							decimalPlaces: this.getRoundingDigits(dataService.currentQtoHeader),
						},
						readonly: true,
					},
					ProgressInvoiceNo: { readonly: true },
					// TODO: PageNumber
					// TODO: LineReference
					// TODO: LineIndex
					// TODO: WipHeaderFk lookup => has addition colums:
					PesHeaderFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: ProcurementSharePesLookupService,
							showDescription: true,
							descriptionMember: 'Description',
						}),
						additionalFields: [
							{
								displayMember: 'Description',
								label: {
									key: 'qto.main.PesHeaderDescription',
								},
								column: true,
								singleRow: true,
								row: true,
							},
						],
					},
					OrdHeaderFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup<IQtoShareDetailEntity, SalesContractsEntity>({
							serverSideFilter: {
								key: 'qto-main-header-sales-contract-filter',
								execute: (context: IEntityContext<IQtoShareDetailEntity>) => {
									const companyId = this.configurationService.clientId;
									const searchString = '(CompanyFk=' + companyId + ')';
									const qtoHeader = dataService.currentQtoHeader;
									if (qtoHeader?.ProjectFk) {
										return {
											Filters: searchString + ' AND (ProjectFk=' + qtoHeader.ProjectFk + ' AND OrdHeaderFk = null)',
										};
									} else {
										return { Filters: '' };
									}
								},
							},
							dataServiceToken: QtoShareSalesContractLookupService,
							showDescription: true,
							descriptionMember: 'Description',
							//TODO: missing dialogOptions -lnt
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: (e) => {
										if (e.context.entity && e.context.lookupInput?.selectedItem) {
											e.context.entity.BillToFk = e.context.lookupInput.selectedItem.BillToFk;
										}
									},
								},
							],
						}),
						additionalFields: [
							{
								displayMember: 'DescriptionInfo.Description',
								label: {
									key: 'cloud.common.entityDescription',
								},
								column: true,
								singleRow: true,
								row: true,
							},
						],
					},
					// TODO: BilHeaderFk lookup => has addition colums:
					BillToFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup<T, BillToEntity>({
							dataServiceToken: QtoShareBillToLookupService,
							showDescription: true,
							descriptionMember: 'Code',
							serverSideFilter: {
								key: 'qto-share-bill-to-filter',
								execute: (context: IEntityContext<IQtoShareDetailEntity>) => {
									const qtoHeader = dataService.currentQtoHeader;
									return {
										OrdHeaderFk: context.entity?.OrdHeaderFk,
										PrjProjectFk: qtoHeader?.ProjectFk,
									};
								},
							},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: (e) => {
										if (e.context.entity) {
											if (e.context.lookupInput?.selectedItem) {
												e.context.entity.BillToFk = e.context.lookupInput.selectedItem.Id;
												const qtoHeader = dataService.currentQtoHeader;
												const projectFk = qtoHeader?.ProjectFk;
												const companyId = this.configurationService.clientId;
												const filter = '(CompanyFk=' + companyId + ') and (ProjectFk=' + projectFk + ')';
												const postParam = {
													Filter: filter,
													BillToFk: e.context.entity.BillToFk,
												};
												this.http.post(this.configurationService.webApiBaseUrl + 'sales/contract/GetSalesContractByPortal', postParam).subscribe((res) => {
													const items = res as SalesContractsEntity[];
													if (e.context.entity && items.length > 0) {
														e.context.entity.OrdHeaderFk = items[0].Id;
													}
												});
											} else {
												e.context.entity.OrdHeaderFk = null;
											}
										}
									},
								},
							],
						}),
						additionalFields: [
							{
								displayMember: 'Description',
								label: {
									key: 'qto.main.BillToDesc',
								},
								column: true,
								singleRow: true,
								row: true,
							},
						],
					},
					// TODO: V
					QtoDetailSplitFromReference: { readonly: true },
					QtoDetailReference: { readonly: true },
					// TODO: SortCode01Fk lookup
					// TODO: SortCode022Fk lookup
					// TODO: SortCode03Fk lookup
					// TODO: SortCode04Fk lookup
					// TODO: SortCode05Fk lookup
					// TODO: SortCode06Fk lookup
					// TODO: SortCode07Fk lookup
					// TODO: SortCode08Fk lookup
					// TODO: SortCode09Fk lookup
					// TODO: SortCode10Fk lookup
				},
				labels: {
					...prefixAllTranslationKeys('cloud.common.', {
						BasUomFk: { key: 'entityUoM' },
						UserDefined1: { key: 'entityUserDefined', params: { p_0: 1 } },
						UserDefined2: { key: 'entityUserDefined', params: { p_0: 2 } },
						UserDefined3: { key: 'entityUserDefined', params: { p_0: 3 } },
						UserDefined4: { key: 'entityUserDefined', params: { p_0: 4 } },
						UserDefined5: { key: 'entityUserDefined', params: { p_0: 5 } },
					}),
					...prefixAllTranslationKeys('qto.main.', {
						PageNumber: { key: 'PageNumber' },
						LineReference: { key: 'LineReference' },
						LineIndex: { key: 'LineIndex' },
						QtoDetailStatusFk: { key: 'detailStatus' },
						BoqItemFk: { key: 'boqItem' },
						BoqSplitQuantityFk: { key: 'splitQtyNo' },
						PrjLocationFk: { key: 'PrjLocation' },
						AssetMasterFk: { key: 'AssetMaster' },
						PrcStructureFk: { key: 'PrcStructureFk' },
						QtoLineTypeFk: { key: 'QtoLineType' },
						QtoFormulaFk: { key: 'QtoFormulaCode' },
						Factor: { key: 'Factor' },
						Value1Detail: { key: 'Value1' },
						Operator1: { key: 'Operator1' },
						Value2Detail: { key: 'Value2' },
						Operator2: { key: 'Operator2' },
						Value3Detail: { key: 'Value3' },
						Operator3: { key: 'Operator3' },
						Value4Detail: { key: 'Value4' },
						Operator4: { key: 'Operator4' },
						Value5Detail: { key: 'Value5' },
						Operator5: { key: 'Operator5' },
						FormulaResult: { key: 'FormulaResult' },
						Result: { key: 'Result' },
						SubTotal: { key: 'FormulaResult' },
						IsBlocked: { key: 'IsBlocked' },
						IsReadonly: { key: 'IsReadonly' },
						SpecialUse: { key: 'SpecialUse' },
						PerformedDate: { key: 'PerformedDate' },
						PerformedFromWip: { key: 'performedFromWip' },
						PerformedToWip: { key: 'performedToWip' },
						PerformedFromBil: { key: 'performedFromBil' },
						PerformedToBil: { key: 'performedToBil' },
						ProgressInvoiceNo: { key: 'entityProgressInvoiceNo' },
						RemarkText: { key: 'RemarkText' },
						Remark1Text: { key: 'Remark1Text' },
						WipHeaderFk: { key: 'WipHeaderCode' },
						PesHeaderFk: { key: 'PesHeaderCode' },
						OrdHeaderFk: { key: 'OrdHeaderFk' },
						BilHeaderFk: { key: 'bilheaderfk' },
						BillToFk: { key: 'BillToFk' },
						LineText: { key: 'LineText' },
						V: { key: 'V' },
						QtoDetailSplitFromReference: { key: 'qtoDetailSplitFromReference' },
						QtoDetailReference: { key: 'QtoDetailReference' },
						SortCode01Fk: { key: 'sortCode01' },
						SortCode02Fk: { key: 'sortCode02' },
						SortCode03Fk: { key: 'sortCode03' },
						SortCode04Fk: { key: 'sortCode04' },
						SortCode05Fk: { key: 'sortCode05' },
						SortCode06Fk: { key: 'sortCode06' },
						SortCode07Fk: { key: 'sortCode07' },
						SortCode08Fk: { key: 'sortCode08' },
						SortCode09Fk: { key: 'sortCode09' },
						SortCode10Fk: { key: 'sortCode10' },
						IsWQ: { key: 'isWq' },
						IsAQ: { key: 'isAq' },
						IsBQ: { key: 'isBq' },
						IsIQ: { key: 'isIq' },
					}),
				},
			};
		});
	}

	private getRoundingDigits(qtoHeader: IQtoShareHeaderEntity | undefined): number {
		let tempPlaces = 6;
		if (qtoHeader && qtoHeader.NoDecimals) {
			tempPlaces = qtoHeader.NoDecimals;
		}
		return tempPlaces;
	}

	private updateQtoFormulaFkOverload(entity: IQtoShareDetailEntity, qtoFormulaFkOverloadSubject: BehaviorSubject<ConcreteFieldOverload<IQtoShareDetailEntity>>) {
		let value: ConcreteFieldOverload<IQtoShareDetailEntity> = {
			type: FieldType.Description,
		};

		let isDefaultFormula = true;
		if (entity && entity.QtoLineTypeFk > 0) {
			switch (entity.QtoLineTypeFk) {
				case QtoShareLineType.CommentLine:
					//TODO: missing -lnt
					isDefaultFormula = false;
					break;
				case QtoShareLineType.LRefrence:
				case QtoShareLineType.RRefrence:
				case QtoShareLineType.IRefrence:
					entity.QtoFormulaFk = null;
					value = {
						type: FieldType.Remark,
					};
					isDefaultFormula = false;
					break;
			}
		}

		if (!isDefaultFormula) {
			qtoFormulaFkOverloadSubject.next(value);
		}
	}

	private updatevalue1detailOverload(entity: IQtoShareDetailEntity | undefined, itemList: IQtoShareDetailEntity[]) {
		let value: ConcreteFieldOverload<IQtoShareDetailEntity> = {
			type: FieldType.Description,
		};

		if (entity) {
			switch (entity.QtoLineTypeFk) {
				case QtoShareLineType.Standard:
				case QtoShareLineType.Hilfswert:
				case QtoShareLineType.Subtotal:
				case QtoShareLineType.ItemTotal:
					if (entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === QtoShareFormulaType.FreeInput) {
						value = {
							type: FieldType.Remark,
						};
						//TODO: how to set the changes to linetext -lnt
					}
					break;
				case QtoShareLineType.RRefrence:
					value = {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataService: this.lookupServiceFactory.fromItems(itemList, {
								uuid: '',
								idProperty: 'Id',
								valueMember: 'Id',
								displayMember: 'QtoDetailReference',
							}),
							clientSideFilter: {
								execute(item, context): boolean {
									return item.Id === context.entity?.Id;
								},
							},
						}),
					};
					break;
				case QtoShareLineType.LRefrence:
				case QtoShareLineType.IRefrence:
					//TODO: missing qto-detail-boq-reference-lookup -lnt
					break;
			}
		}

		this.value1DetailOverloadSubject.next(value);
	}

	private updatevalue2detailOverload(entity: IQtoShareDetailEntity | undefined) {
		let value: ConcreteFieldOverload<IQtoShareDetailEntity> = {
			type: FieldType.Description,
		};

		if (entity) {
			switch (entity.QtoLineTypeFk) {
				case QtoShareLineType.Standard:
				case QtoShareLineType.Hilfswert:
				case QtoShareLineType.Subtotal:
				case QtoShareLineType.ItemTotal:
					if (entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === QtoShareFormulaType.FreeInput) {
						value = {
							type: FieldType.Description,
						};
					}
					break;
				case QtoShareLineType.LRefrence:
					//TODO: missing LocationLookupService -lnt
					break;
			}
		}

		this.value2DetailOverloadSubject.next(value);
	}

	private updateOperatorOverload(field: string, entity?: IQtoShareDetailEntity) {
		let value: ConcreteFieldOverload<IQtoShareDetailEntity> = {
			type: FieldType.Description,
		};

		if (entity && entity.QtoFormula) {
			let formulaOperator: string = '';
			let entityOperator: string = '';
			switch (entity.QtoLineTypeFk) {
				case QtoShareLineType.Standard:
				case QtoShareLineType.Hilfswert:
				case QtoShareLineType.Subtotal:
				case QtoShareLineType.ItemTotal:
					switch (entity.QtoFormula.QtoFormulaTypeFk) {
						case QtoShareFormulaType.Script:
						case QtoShareFormulaType.Predefine:
							formulaOperator = _.get(entity.QtoFormula, field) as unknown as string;
							entityOperator = _.get(entity, field) as unknown as string;
							if ((formulaOperator && entityOperator && formulaOperator.indexOf(entityOperator) >= 0) || entityOperator === null || entityOperator === '') {
								value = {
									type: FieldType.Lookup,
									lookupOptions: createLookup({
										dataService: this.lookupServiceFactory.fromItems(this.getOperators(formulaOperator), {
											uuid: '',
											idProperty: 'Id',
											valueMember: 'Id',
											displayMember: 'Code',
										}),
									}),
								};
							}
							break;
					}
					break;
			}
		}

		this.operatorOverloadSubject.next(value);
	}

	private getOperators(operatorStr: string) {
		const operatorStrList: IQtoDetailOperatorInfo[] = [];
		// const operatorArray = _.uniq(_.split(operatorStr, ''));
		_.forEach(operatorStr, function (item) {
			const temp: IQtoDetailOperatorInfo = {
				Id: item,
				Code: item,
			};
			operatorStrList.push(temp);
		});

		return operatorStrList;
	}
}
