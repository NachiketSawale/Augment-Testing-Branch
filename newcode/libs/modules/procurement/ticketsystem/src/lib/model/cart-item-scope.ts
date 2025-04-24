/*
 * Copyright(c) RIB Software GmbH
 */
import { inject } from '@angular/core';
import { find, forOwn, isNil, groupBy, sumBy, maxBy } from 'lodash';
import { ProcurementTicketSystemCartItemService } from '../services/cart-item.service';
import { ProcurementTicketSystemCartItemResponse } from './cart-item-reponse';
import { BasicsSharedMaterialBlobService, BasicsSharedMaterialSearchService, BasicsSharedProcurementConfigurationLookupService, IMaterialSearchEntity, IMaterialSearchOptions, Rubric } from '@libs/basics/shared';
import { ICartCatalogEntity, ICartItemEntity } from './interfaces/cart-item-entity.interface';
import { formatNumber } from 'accounting';
import * as dayjs from 'dayjs';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { createLookup, FieldType, IGridDialogOptions, ILookupOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService, UiCommonGridDialogService } from '@libs/ui/common';
import { ProcurementType } from './interfaces/procurement-type.enum';
import { ProcurementTicketSystemPlaceOrderFormComponent } from '../components/place-order-form/place-order-form.component';
import { IProcurementConfigurationEntity, ISubmitEntity, ISubmitGroupEntity, ISubmitResponseEntity } from './interfaces/submit-entity.interface';
import { PlaceOrderResponseHttpResponse } from './place-order-submit-reponse';
import { IBusinessPartnerSearchMainEntity } from '@libs/businesspartner/interfaces';
import { forkJoin, firstValueFrom } from 'rxjs';
import { PlatformConfigurationService } from '@libs/platform/common';
import { ProjectSharedLookupService } from '@libs/project/shared';

/**
 * Cart Item scope which used to store state and communicate among child components
 */
export class ProcurementTicketSystemCartItemScope {
	/**
	 * cart item service
	 */
	public cartItemService = inject(ProcurementTicketSystemCartItemService);

	/**
	 * cart item  response
	 */
	public cartItemResponse = new ProcurementTicketSystemCartItemResponse();

	/**
	 * dialog Service
	 */
	private dialogService = inject(UiCommonDialogService);
	/**
	 * Image service
	 * @private
	 */
	private blobService = inject(BasicsSharedMaterialBlobService);

	/**
	 * material service
	 * @private
	 */
	public materialService = inject(BasicsSharedMaterialSearchService);

	/**
	 * message  Box service
	 * @private
	 */
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * business Partner lookup service
	 */
	public businessPartnerLookup = inject(BusinessPartnerLookupService);

	/**
	 * procurement configuration lookup service
	 */
	public procurementConfigurationLookup = inject(BasicsSharedProcurementConfigurationLookupService);

	/**
	 * Search view options
	 */
	public searchOptions?: IMaterialSearchOptions;
	/**
	 * Business Partner options
	 */
	public businessPartnerOptions: ILookupOptions<IBusinessPartnerSearchMainEntity, object> = {};

	/**
	 * Show cart item detail view
	 */
	public showDetail = false;

	/**
	 * Cart item detail
	 */
	public detailItem?: IMaterialSearchEntity;
	/**
	 * default configuration from contract
	 */
	public defaultConfigurationForCon?: number;

	/**
	 * default configuration from requsition
	 */
	public defaultConfigurationForReq?: number;
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);

	/**
	 * Procurement Type list
	 */
	public prcTypes = [
		{
			value: ProcurementType.Requisition,
			description: 'procurement.ticketsystem.buttonText.requisition',
		},
		{
			value: ProcurementType.Contract,
			description: 'procurement.ticketsystem.buttonText.contract',
		},
	];

	/**
	 * Initial Cart item list
	 */
	public initialCart() {
		this.cartItemService.loadCartItem().subscribe((response) => {
			this.cartItemResponse = response;
			this.cartItemResponse.cartList.forEach((item) => {
				item.Material.Requirequantity = item.Quantity;
				this.refreshPriceViewByMaterial(item.Material);
			});
			this.updateCatalogs();
			this.refreshSummary();
			const materialList = this.cartItemResponse.cartList.map((item) => {
				return item.Material;
			});
			this.blobService.provideImage(materialList);
		});
	}

	/**
	 * get default configuration
	 */
	public getDefaultConfiguration() {
		return forkJoin([this.cartItemService.getDefaultConfiguration(Rubric.Contract), this.cartItemService.getDefaultConfiguration(Rubric.Requisition)]).subscribe(([contractResponse, requisitionResponse]) => {
			this.defaultConfigurationForCon = (contractResponse as IProcurementConfigurationEntity).Id;
			this.defaultConfigurationForReq = (requisitionResponse as IProcurementConfigurationEntity).Id;
		});
	}

	/**
	 * delete cart item
	 */
	public delete(id: number) {
		return this.cartItemService.delete(id).subscribe((response) => {
			this.cartItemResponse.cartList = this.cartItemResponse.cartList.filter((item) => {
				return item.Material.Id !== id;
			});
			this.updateCatalogs();
			this.refreshSummary();
		});
	}

	/**
	 * clear
	 */
	public clear() {
		this.cartItemService.clear().subscribe((res) => {
			if (res as boolean) {
				this.cartItemResponse.cartList = [];
				this.updateCatalogs();
				this.refreshSummary();
			}
		});
	}

	/**
	 * calculate show cost
	 */
	private refreshPriceViewByMaterial(entity: IMaterialSearchEntity) {
		const priceConditions = entity.PriceConditions;
		if (!isNil(priceConditions)) {
			let TotalOc = 0;
			priceConditions.forEach((priceCondition) => {
				if (priceCondition.PriceConditionType.IsShowInTicketSystem && priceCondition.IsActivated) {
					TotalOc = TotalOc + priceCondition.TotalOc;
				}
			});
			entity.ShowCost = entity.Cost - TotalOc;
		} else {
			entity.ShowCost = entity.Cost;
		}
	}

	/**
	 * format Money
	 */
	public formatMoney(value: number) {
		const decimalPlaces = 2;
		const pow = Math.pow(10, decimalPlaces);
		const result = Math.round(value * pow) / pow;
		// TODO: format price by culture
		/*var culture = platformContextService.culture();
		var cultureInfo = platformLanguageService.getLanguageInfo(culture);
		return accounting.formatNumber(result, 2, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);*/
		return formatNumber(result, 2, ',', '.');
	}

	/**
	 * get order list
	 */
	private getOrderList() {
		const response = this.cartItemResponse;
		const catalogs = response.catalogs;
		let orderList: ICartItemEntity[] = [];
		catalogs
			.filter(function (group) {
				return group.checked;
			})
			.forEach(function (group) {
				orderList = orderList.concat(group.items);
			});
		return orderList;
	}

	/**
	 * calculate delivery
	 */
	public getDeliveryByPriceCondition(item: IMaterialSearchEntity) {
		let delivery = 0;
		if (item.PriceConditions && item.PriceConditions.length > 0) {
			const arrPriceConditions = item.PriceConditions;
			for (let i = 0; i < arrPriceConditions.length; i++) {
				const priceCondition = arrPriceConditions[i];
				if (priceCondition.IsActivated) {
					delivery += priceCondition.TotalOc;
				}
			}
		}
		return delivery;
	}

	/**
	 * calculate sub total
	 */
	public getSubTotal(item: IMaterialSearchEntity) {
		let subTotal = (item.ShowCost / item.PriceUnit) * item.FactorPriceUnit + this.getDeliveryByPriceCondition(item);
		subTotal = subTotal * item.Requirequantity;
		return subTotal;
	}

	/**
	 * refresh Summary
	 */
	public refreshSummary() {
		const response = this.cartItemResponse;
		const cartList = response.cartList;
		const orderList = this.getOrderList();
		const total = sumBy(orderList, (item) => {
			let subTotal = this.getSubTotal(item.Material);
			subTotal = subTotal / item.ExchangeRate;
			return subTotal;
		});
		response.selectCartCount = orderList.length;
		response.cartCount = cartList.length;
		response.cartTotal = this.formatMoney(total);
	}

	/**
	 *get require date
	 */
	private requireDate(leadTime: number) {
		const currentDate = new Date().getTime();
		const maxDate = currentDate + leadTime * 24 * 60 * 60 * 1000;
		const maxMomentDate = dayjs(maxDate);
		if (maxMomentDate.isValid()) {
			return maxMomentDate.toDate();
		} else {
			return dayjs(currentDate).toDate();
		}
	}

	/**
	 *get max require date
	 */
	private getMaxRequireDate(cartItems: ICartItemEntity[]) {
		let maxLeadTime = 0;
		if (cartItems.length > 0) {
			const maxItem = maxBy(cartItems, (item) => {
				return item.Material.LeadTime;
			});
			if (maxItem) {
				maxLeadTime = maxItem.Material.LeadTime;
			}
		}
		return this.requireDate(maxLeadTime);
	}

	/**
	 * get default Configuration
	 */
	public getDefaultConfigurationByPrcType(prcType: number) {
		return prcType === ProcurementType.Requisition ? this.defaultConfigurationForReq : prcType === ProcurementType.Contract ? this.defaultConfigurationForCon : null;
	}

	/**
	 * update updateCatalogsCatalogs
	 */
	private updateCatalogs() {
		const response = this.cartItemResponse;
		const cartList = response.cartList;
		const mergedItems = cartList.filter((item) => {
			return !isNil(item.catalogKey);
		});
		const normalItems = cartList.filter((item) => {
			return isNil(item.catalogKey);
		});
		const itemsWithBp = normalItems.filter((item) => {
			return !isNil(item.Material.BpdBusinesspartnerFk);
		});
		const itemsWithoutBp = normalItems.filter((item) => {
			return isNil(item.Material.BpdBusinesspartnerFk);
		});
		const catalogs = groupBy(itemsWithBp, function (item) {
			if (isNil(item.Material.InternetCatalogFk)) {
				return item.Material.MdcMaterialCatalogFk;
			}
			return item.Material.InternetCatalogFk;
		});
		const mergedCatalogs = groupBy(mergedItems, 'catalogKey');
		if (itemsWithoutBp.length) {
			catalogs['generic'] = itemsWithoutBp;
		}
		// add custom groups of merged
		forOwn(mergedCatalogs, function (materials, pKey) {
			catalogs[pKey] = materials;
		});
		// clear items for each group, but keep group info.
		response.catalogs.forEach((catalog) => {
			catalog.items = [];
		});
		for (const pKey in catalogs) {
			const cartItems = catalogs[pKey];
			let catalog = find(response.catalogs, {key: pKey});
			if (isNil(catalog)) {
				catalog = {
					key: pKey,
					checked: true,
					businessPartnerFk: null,
					contactFk: null,
					prcType: cartItems[0].PrcType,
					requireDate: null,
					collapsed: false,
					isFrameworkType: cartItems[0].Material.MaterialCatalogTypeFk === 3,
					items: [],
				};
				catalog.configurationFk = this.getDefaultConfigurationByPrcType(catalog.prcType);
				response.catalogs.push(catalog);
			}
			catalog.items = cartItems;
			if (isNil(catalog.businessPartnerFk)) {
				catalog.businessPartnerFk = cartItems[0].Material.BpdBusinesspartnerFk;
			}
			catalog.requireDate = this.getMaxRequireDate(cartItems);
			if (catalog.isFrameworkType) {
				catalog.prcType = ProcurementType.Requisition;
			}
		}
		response.catalogs = response.catalogs.filter((catalog) => {
			return catalog.items.length > 0;
		});
	}

	/**
	 * merge catalogs
	 */
	public mergeCatalogs() {
		const catalogList = this.cartItemResponse.catalogs;
		const checkedCatalogs = catalogList.filter((item) => item.checked);
		const uncheckedCatalogs = catalogList.filter((item) => !item.checked);
		const excludeCatalogs = checkedCatalogs.filter((item) => item.isFrameworkType);
		const targetCatalogs = checkedCatalogs.filter((item) => !item.isFrameworkType);
		const catalogs = uncheckedCatalogs.concat(excludeCatalogs);
		if (targetCatalogs.length) {
			let mergeCatalog: ICartCatalogEntity;
			if (targetCatalogs.length === 1) {
				mergeCatalog = targetCatalogs[0];
			} else {
				mergeCatalog = {
					key: '',
					checked: true,
					//merged: true,
					businessPartnerFk: null,
					contactFk: null,
					prcType: ProcurementType.Requisition,
					requireDate: null,
					collapsed: false,
					isFrameworkType: false,
					items: [],
					// docs: []
				};

				targetCatalogs.forEach(function (catalog) {
					if (mergeCatalog.key.length) {
						mergeCatalog.key += '-';
					}
					mergeCatalog.key += catalog.key;
					mergeCatalog.items = mergeCatalog.items.concat(catalog.items);
					//mergeCatalog.docs = mergeCatalog.docs.concat(catalog.docs);
				});

				mergeCatalog.requireDate = this.getMaxRequireDate(mergeCatalog.items);

				mergeCatalog.items.forEach(function (item) {
					item.catalogKey = mergeCatalog.key;
				});
			}
			mergeCatalog.configurationFk = this.getDefaultConfigurationByPrcType(mergeCatalog.prcType);
			catalogs.push(mergeCatalog);
		}
		this.cartItemResponse.catalogs = catalogs;
	}

	/**
	 * can merge catalogs
	 */
	public canMergeCatalogs() {
		const catalogList = this.cartItemResponse.catalogs;
		const checkedCatalogs = catalogList.filter((item) => item.checked);
		const targetCatalogs = checkedCatalogs.filter((item) => !item.isFrameworkType);
		return targetCatalogs.length > 1;
	}

	/**
	 * can place Order
	 */
	public canPlaceOrder() {
		return this.getOrderList().length > 0;
	}

	/**
	 * get catalogs
	 */
	public getSelectedCatalogs() {
		return this.cartItemResponse.catalogs.filter((group) => {
			return group.checked;
		});
	}

	/**
	 * get Group
	 */
	private getGroup() {
		const catalogs = this.getSelectedCatalogs();
		const groups = catalogs.map((catalog) => {
			return {
				Type: catalog.prcType,
				BusinessPartnerId: catalog.businessPartnerFk,
				DateRequire: catalog.requireDate,
				MaterialIds: catalog.items.map((cartItem) => {
					return cartItem.Material.Id;
				}),
				ConfigurationFk: catalog.configurationFk,
				// todo Documents: catalog.docs,
				CartItemVEntities: catalog.items.map(function (cartItem) {
					return {
						MdcMaterialFk: cartItem.Material.Id,
						Co2Project: cartItem.Material.Co2Project,
						Co2Source: cartItem.Material.Co2Source
					};
				})
			} as ISubmitGroupEntity;
		});
		return groups;
	}

	/**
	 * place Order
	 */
	public async placeOrder() {
		//TODO procurementContextService.loginProject
		const projectId = -1;
		const groups = this.getGroup();
		const submitCartEntity: ISubmitEntity = {
			ProjectFK: projectId,
			CompanyId: this.configurationService.clientId,
			StructureFK: -1,
			Groups: groups
		};
		const submitItem = await this.dialogService.show<ISubmitEntity, ProcurementTicketSystemPlaceOrderFormComponent>({
			id: 'place-order-dialog',
			headerText: 'procurement.ticketsystem.htmlTranslate.submitButton',
			bodyComponent: ProcurementTicketSystemPlaceOrderFormComponent,
			value: submitCartEntity
		});
		if (submitItem && submitItem.closingButtonId === StandardDialogButtonId.Ok && submitItem.value) {
			const submitCartItemEntity = submitItem.value;
			if (submitCartItemEntity.ProjectFK != null && submitCartItemEntity.ProjectFK > -1) {
				const cartItemResult = await firstValueFrom(this.cartItemService.placeOrder(submitCartItemEntity)) as PlaceOrderResponseHttpResponse;
				this.showSuccessDialog(cartItemResult.Items);
			} else {
				this.messageBoxService.showInfoBox('procurement.ticketsystem.submitDialog.projectError', 'info', true);
			}
		}
	}

	private showSuccessDialog(entities: ISubmitResponseEntity[]) {
		const gridDialogData: IGridDialogOptions<ISubmitResponseEntity> = {
			headerText: 'procurement.ticketsystem.htmlTranslate.submitButton',
			windowClass: 'grid-dialog',
			gridConfig: {
				uuid: 'aa02cd44202f455aa517fcd1e00a227e',
				columns: [
					{
						type: FieldType.Code,
						id: 'Code',
						model: 'Code',
						label: {key: 'cloud.common.entityCode'},
						visible: true,
						sortable: false,
					},
					{
						type: FieldType.Description,
						id: 'Description',
						model: 'Description',
						label: {key: 'cloud.common.entityDescription'},
						visible: true,
						width: 150,
						sortable: false,
					},
					{
						type: FieldType.Lookup,
						id: 'ProjectId',
						model: 'ProjectId',
						label: {key: 'cloud.common.entityProjectNo'},
						visible: true,
						sortable: false,
						lookupOptions: createLookup({
							dataServiceToken: ProjectSharedLookupService,
							showDescription: true,
							descriptionMember: 'ProjectNo',
						}),
						additionalFields: [
							{
								displayMember: 'ProjectName',
								label: {text: 'Project Name', key: 'cloud.common.entityProjectName'},
								column: true,
								singleRow: true,
							}
						]
					},
					{
						type: FieldType.Lookup,
						id: 'BusinessPartnerId',
						model: 'BusinessPartnerId',
						label: {key: 'cloud.common.entityBusinessPartner'},
						visible: true,
						sortable: false,
						lookupOptions: createLookup({dataServiceToken: BusinessPartnerLookupService})
					}
				]
			},
			items: entities,
			selectedItems: [],
			resizeable: true
		};
		this.gridDialogService.show(gridDialogData);
	}
}