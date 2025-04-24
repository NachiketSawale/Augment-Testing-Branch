/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, EventEmitter, inject, Injector } from '@angular/core';
import { Orientation, PlatformConfigurationService } from '@libs/platform/common';
import { BasicsCostGroupCatalogEntity, ICostGroupEntity } from '@libs/basics/costgroups';
import {
	IAccordionItem,
	IGridConfiguration,
} from '@libs/ui/common';
import {
	GridContainerBaseComponent,
	ISplitGridConfiguration, ISplitGridContainerLink,
	ISplitGridSplitter, SplitGridConfigurationToken,
	UiBusinessBaseEntityContainerMenulistHelperService
} from '@libs/ui/business-base';
import { IEntityList, IEntitySelection } from '@libs/platform/data-access';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import _ from 'lodash';


@Component({
	selector: 'estimate-shared-cost-group',
	templateUrl: 'estimate-share-cost-group.component.html',
})
export class EstimateShareCostGroupComponent<T extends object,TP extends object> extends GridContainerBaseComponent<T, ISplitGridContainerLink<T, TP>> {

	protected isOpen: boolean = false;

	protected inputOpen:boolean=false;

	public mainCategoryList:BasicsCostGroupCatalogEntity[]=[];

	protected costGroupCatDatas :BasicsCostGroupCatalogEntity[]=[];

	public costGroups:T[]=[];

	protected configuration!: IGridConfiguration<ICostGroupEntity>;

	private readonly treeConfiguration = inject(this.injectionTokens.treeConfigurationToken, { optional: true });

	private readonly injector = inject(Injector);

	private selectParentItem:BasicsCostGroupCatalogEntity = new BasicsCostGroupCatalogEntity();

	/**
	 *  injector for custom component
	 */
	public subInjector!: Injector;
	private readonly splitConfig = inject<ISplitGridConfiguration<T, TP>>(SplitGridConfigurationToken);

	public constructor() {
		super();

		this.containerLink = this.createGridContainerLink();

		this.generateGridColumns();


		const menulistHelperSvc = inject(UiBusinessBaseEntityContainerMenulistHelperService);
		this.uiAddOns.toolbar.addItems(menulistHelperSvc.createListMenuItems(this.containerLink));
		this.uiAddOns.toolbar.deleteItems(['create', 'delete']);

		this.attachToEntityServices();

		if (this.treeConfiguration) {
			this.config.treeConfiguration = {
				parent: (entity) => this.retrieveEntityParent(entity),
				children: (entity) => this.retrieveEntityChildren(entity),
				...this.treeConfiguration,
			};
		}
		this.costGroupCatDatas =this.containerLink.parentGrid.entityList?.getList() as BasicsCostGroupCatalogEntity[];

		this.parentList.listChanged$.subscribe(()=> {
			if(this.containerLink){
				this.costGroupCatDatas =this.containerLink.parentGrid.entityList?.getList() as BasicsCostGroupCatalogEntity[];
			}

			this.OnInit();
		});

		this.OnInit();
	}


	/**
	 * Override to return ISplitGridContainerLink<T, TP>
	 * @protected
	 */
	protected override createGridContainerLink(): ISplitGridContainerLink<T, TP> {
		// It is impossible to access the outer object without a reference.
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;
		return {
			...super.createGridContainerLink(),
			get splitter() {
				return that.splitter;
			},
			set splitter(value) {
				this.splitter = value;
			},
			parentGrid: {
				get uuid(): string {
					return that.splitConfig.parent.uuid;
				},
				get config(): IGridConfiguration<TP> {
					return that.parentGridConfig;
				},
				set config(value: IGridConfiguration<TP>) {
					that.parentGridConfig = value;
				},
				get data(): TP[] | undefined {
					return that.parentGridConfig.items;
				},
				set data(value: TP[]) {
					that.parentGridConfig = {
						...that.parentGridConfig,
						items: value
					};
				},
				get entitySelection(): IEntitySelection<TP> {
					return that.parentSelection;
				},
				get entityList(): IEntityList<TP> | undefined {
					return that.parentList;
				}
			}
		};
	}
	/**
	 * Parent grid configuration
	 * @protected
	 */
	protected parentGridConfig: IGridConfiguration<TP> = {
		uuid: this.splitConfig.parent.uuid,
		columns: this.splitConfig.parent.columns,
		treeConfiguration: this.splitConfig.parent.treeConfiguration
	};

	/**
	 * Handle parent grid entity selection
	 * @protected
	 */
	protected get parentSelection(): IEntitySelection<TP> {
		return <IEntitySelection<TP>>this.resolveParentDataService();
	}
	/**
	 * It is allowed to provide parent data service provider token or instance itself.
	 * @private
	 */
	private resolveParentDataService() {
		if (this.splitConfig.parent.dataService) {
			return this.splitConfig.parent.dataService;
		}

		if (this.splitConfig.parent.dataServiceToken) {
			return this.injector.get(this.splitConfig.parent.dataServiceToken);
		}

		throw new Error('Parent data service is undefined!');
	}
	/**
	 * Handle parent grid list
	 * @protected
	 */
	protected get parentList(): IEntityList<TP> {
		return <IEntityList<TP>>this.resolveParentDataService();
	}
	public OnInit(): void {

		this.isOpen =false;
		this.inputOpen=true;

		if(this.data && this.data.length <= 0){
			this.data.push({id:1,title:'estimate.main.costGroupTitle2',expanded:true,
				children: []
			});
			this.data.push({id:2,title:'estimate.main.costGroupTitle1',expanded:true,
				children: []
			});
		}else {
			this.data[0].children=[];
			this.data[1].children=[];
		}

		if(this.costGroupCatDatas && this.costGroupCatDatas.length >0 ){
			const prjCostGroupCtas = this.costGroupCatDatas[0].PrjCostGroupCats;
			const lisCostGroupCtas = this.costGroupCatDatas[0].LicCostGroupCats;
			lisCostGroupCtas.forEach(item =>{
				if(item && this.data.length>0 && this.data[0].children){
					this.data[0].children.push({
						id:item.Id,
						title:item.DescriptionInfo.Description,
					});
				}
			});

			prjCostGroupCtas.forEach(item =>{
				if(item && this.data.length>0 && this.data[1].children){
					this.data[1].children.push({
						id:item.Id,
						title:item.DescriptionInfo.Description,
					});
				}
			});
		}

	}
	
	/**
	 * Splitter configuration
	 * @protected
	 */
	protected splitter: ISplitGridSplitter = {
		direction: Orientation.Horizontal,
		areaSizes: [20, 80]
	};

	public opened: EventEmitter<IAccordionItem> = new EventEmitter<IAccordionItem>();

	public selected: EventEmitter<IAccordionItem> = new EventEmitter<IAccordionItem>();

	public data: IAccordionItem[] = [];
	protected removeFilter(id:number){
		this.mainCategoryList = this.mainCategoryList.filter(e=>e.Id!==id);
	}
	public toggleOpen(): void {
		this.isOpen = !this.isOpen;
		//this.openChange.emit(this.isOpen);
	}
	/**
	 * on panel opened
	 * @param item
	 */
	public onSelectedPaent(item: IAccordionItem) {

		this.selected.emit(item);

		const url = `${this.configService.webApiBaseUrl}project/main/costgroup/GetCostGroupStructureTree`;
		firstValueFrom(this.http.post<ICostGroupEntity[]>(url, [item.id])).then(response => {

			if(this.costGroupCatDatas && this.costGroupCatDatas.length>0){
				this.selectParentItem = this.costGroupCatDatas[0].LicCostGroupCats.find(e=>e.Id === item.id)!;
			}
			if(!this.selectParentItem){
				this.selectParentItem = this.costGroupCatDatas[0].PrjCostGroupCats.find(e=>e.Id === item.id)!;
			}
			this.costGroups = response as T[];

		});

	}
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	public async getConfigData(id:number|string){

		return  await firstValueFrom(this.http.post(`${this.configService.webApiBaseUrl}project/main/costgroup/GetCostGroupStructureTree`, [id])).then(res=>{
			return res;
		});
	}
	/**
	 * on panel closed
	 * @param item
	 */
	public onPanelClosed(item: IAccordionItem) {
		this.opened.emit(item);
	}

	/**
	 * on accordion item clicked
	 * @param item
	 */
	public onItemClick(item: IAccordionItem) {
		this.selected.emit(item);
	}
	public override onSelectionChanged(selectedRows: T[]) {
		this.entitySelection.select(selectedRows);

		if(selectedRows && selectedRows.length>0){

			const selectedItem = selectedRows[0] as ICostGroupEntity;

			if(this.selectParentItem && this.selectParentItem.Code && this.selectParentItem.Code.includes(':')){
				this.selectParentItem.Code = this.selectParentItem.Code.slice(0,this.selectParentItem.Code.indexOf(':'));
			}else {
				this.selectParentItem.Code = this.selectParentItem.Code + ':' + selectedItem.Code;
			}


			if (this.mainCategoryList && this.mainCategoryList.length > 0) {
				const existItemCostGroupCatalog = _.filter(this.mainCategoryList, {'CostGroupCatalogFk': selectedItem.CostGroupCatalogFk});
				if (existItemCostGroupCatalog) {
					const dex = _.findIndex(this.mainCategoryList,{'Id':selectedItem.CostGroupCatalogFk});
					if(dex>-1){
						this.mainCategoryList.splice(dex,1,this.selectParentItem);
					}else{
						this.mainCategoryList.push(this.selectParentItem);
					}

				}else{
					this.mainCategoryList.push(this.selectParentItem);
				}

			} else {
				this.mainCategoryList.push(this.selectParentItem);
			}
		}
	}
}