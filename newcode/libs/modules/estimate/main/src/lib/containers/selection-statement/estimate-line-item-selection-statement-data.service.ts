/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable} from '@angular/core';
import { DataServiceHierarchicalRoot,IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole, ValidationResult } from '@libs/platform/data-access';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { BasicsExportService, BasicsSharedImportExcelService, BasicsSharedImportField, BasicsSharedImportOptions, ExportOptions, MainDataDto } from '@libs/basics/shared';
import { find, findIndex, get, isUndefined, set } from 'lodash';
import { IFilterResult, ISearchResult, PlatformConfigurationService, PlatformPermissionService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EstLineItemSelectionStatementComplete } from '../../model/complete/est-line-item-selection-statement-complete.class';
import { IEstLineItemSelStatementEntity } from '@libs/estimate/interfaces';
import { FieldType, IFormConfig,UiCommonFormDialogService } from '@libs/ui/common';
import { ISelStatementApplyConfigEntity } from './interfaces/selection-statement-container-config.interface';

@Injectable({ providedIn: 'root' })
export class EstimateLineItemSelectionStatementDataService extends DataServiceHierarchicalRoot<IEstLineItemSelStatementEntity, EstLineItemSelectionStatementComplete> {
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly platformPermissionService = inject(PlatformPermissionService);
	private readonly basicsExportService = inject(BasicsExportService);
	private readonly basicsImportService = inject(BasicsSharedImportExcelService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly formDialogService = inject(UiCommonFormDialogService);

	public constructor() {
		const options: IDataServiceOptions<IEstLineItemSelStatementEntity> = {
			apiUrl: 'estimate/main',
			roleInfo: <IDataServiceRoleOptions<IEstLineItemSelStatementEntity>>{
				role: ServiceRole.Root,
				itemName: 'EstimatePriceAdjustmentToSave',
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'selstatement/tree',
				usePost: false,
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'lineitem/update',
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'selstatement/delete',
			},
		};
		super(options);
		//this.processor.addProcessor([new EstimatePriceAdjustmentReadonlyProcessor(this)]);
	}

	protected override onLoadSucceeded(loaded: object): IEstLineItemSelStatementEntity[] {
		if (loaded && Array.isArray(loaded)) {
			return loaded as IEstLineItemSelStatementEntity[];
		}
		return [];
	}

	private flatten(originItems: IEstLineItemSelStatementEntity[]): IEstLineItemSelStatementEntity[] {
		const result: IEstLineItemSelStatementEntity[] = [];
		originItems.forEach((item) => {
			result.push(item);
			result.push(...this.flatten(this.childrenOf(item)));
		});
		return result;
	}

	/**
	 * get children items
	 * @param element
	 */
	public override childrenOf(element: IEstLineItemSelStatementEntity): IEstLineItemSelStatementEntity[] {
		if (element && element.EstLineItemSelStatementChildren) {
			return element.EstLineItemSelStatementChildren as IEstLineItemSelStatementEntity[];
		}
		element.EstLineItemSelStatementChildren = [];
		return element.EstLineItemSelStatementChildren as IEstLineItemSelStatementEntity[];
	}

	/**
	 * get parent item
	 * @param element
	 */
	public override parentOf(element: IEstLineItemSelStatementEntity): IEstLineItemSelStatementEntity | null {
		if (!element.EstLineItemSelStatementFk) {
			return null;
		}
		const parent = this.flatList().find((candidate) => candidate.Id === element.BoqItemFk);
		return parent ? parent : null;
	}

	protected override provideLoadByFilterPayload(): object {
		// const projectFk = this.estimateMainContextService.getSelectedProjectId();
		// const estimateFk = this.estimateMainContextService.getSelectedEstHeaderId();
		return {
			projectId: 1007720, //projectFk, //1007720,
			headerId: 1005001, //estimateFk, // 1005001
		};
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IEstLineItemSelStatementEntity> {
		// const tree: IEstLineItemSelStatementEntity[] = this.onLoadSucceeded(loaded);

		return {
			FilterResult: {} as IFilterResult,
			dtos: loaded as IEstLineItemSelStatementEntity[], //this.flatten(tree),
		};
	}

	private async asyncCreatePriceAdjustments(count: number): Promise<IEstLineItemSelStatementEntity[]> {
		const estHeader = this.estimateMainContextService.getSelectedEstHeaderItem();
		if (estHeader) {
			const responseData = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'estimate/main/priceadjustment/create?estHeaderFk=' + estHeader.Id + '&count=' + count));
			return responseData as IEstLineItemSelStatementEntity[];
		}
		return [] as IEstLineItemSelStatementEntity[];
	}

	public override createUpdateEntity(modified: IEstLineItemSelStatementEntity | null): EstLineItemSelectionStatementComplete {
		const complete = new EstLineItemSelectionStatementComplete();
		if (modified) {
			complete.EstimatePriceAdjustmentToSave = [modified];
		}
		return complete;
	}

	private _filterStatue: boolean = false;

	/**
	 * whether the item filter status is true
	 * @constructor
	 */
	public get FilterStatue(): boolean {
		return this._filterStatue;
	}

	/**
	 * whether the project is loaded
	 * @constructor
	 */
	public get IsProjectLoaded(): boolean {
		return (this.estimateMainContextService.getSelectedProjectId() ?? 0) > 0;
	}

	private _subDivisionDisabled: boolean = true;

	/**
	 * get sub division disabled status
	 * @constructor
	 */
	public get SubDivisionDisabled(): boolean {
		return this._subDivisionDisabled;
	}

	/**
	 * get toolbar disabled status
	 */
	public get ApplyDisabled(): boolean {
		const isHeaderReadOnly = this.estimateMainContextService.isReadonly();
		if (isHeaderReadOnly) {
			return true;
		}
		const list = this.getList();
		const selectStatements = list.filter((item) => {
			return item.IsExecute === true && item.EstLineItemSelStatementType === 0;
		});
		if (this.IsProjectLoaded) {
			if (selectStatements.length === 0) {
				return true;
			}
		}
		if (!this.platformPermissionService.hasRead('681223e37d524ce0b9bfa2294e18d650')) {
			return true;
		}
		return !this.platformPermissionService.hasWrite('681223e37d524ce0b9bfa2294e18d650');
	}

	/**
	 *
	 * @constructor
	 */
	public get ImportDisable(): boolean {
		const isHeaderReadOnly = this.estimateMainContextService.isReadonly();
		if (isHeaderReadOnly) {
			return true;
		}
		if (!this.platformPermissionService.hasWrite('49e56a48a2b5481189f871774a0e641a')) {
			return true;
		}
		return !this.IsProjectLoaded;
	}

	/**
	 *
	 * @constructor
	 */
	public get ExportDisable(): boolean {
		const isHeaderReadOnly = this.estimateMainContextService.isReadonly();
		if (isHeaderReadOnly) {
			return true;
		}
		const items = this.getList();
		return !(this.IsProjectLoaded && items.length > 0);
	}

	/**
	 *
	 * @constructor
	 */
	public get NewDivisionDisable(): boolean {
		const isHeaderReadOnly = this.estimateMainContextService.isReadonly();
		if (isHeaderReadOnly) {
			return true;
		}
		return !this.IsProjectLoaded;
	}

	private readonly MODULE_NAME = 'estimate.main';

	private exportOptions = {
		moduleName: this.MODULE_NAME,
		mainContainer: {
			id: 'estimate.main.lineItemSelectionStatement',
			label: 'estimate.main.lineItemSelStatement.containerTitle',
			gridId: 'c90e5cf712f646a1b163d8ef308c1960',
			/*NoExportFields: ['Id', 'Structure', 'isexecute', 'wicheaderitemfk', 'wiccatfk', 'Select', 'boqrootref', 'BoQ-RootItemRefNo', 'schedulefk',
					'psdactivityfk', 'Activity-Description', 'Activity Schedule', 'mdlmodelfk', 'Model-Description'],
				SelectedColumns: []*/
		},
		subContainers: [],
		permission: '',
		excelProfileContexts: [],
		exportOptionsCallback(ex: ExportOptions) {},
		// todo replace property
		//Language2Id: projectId // Workaround to pass selected ProjectId
	};

	/**
	 * open export dialog
	 */
	public excelExport() {
		const options = this.getExportOptions();
		this.basicsExportService.showExportDialog(options);
	}

	/**
	 * get export option
	 */
	public getExportOptions() {
		return this.exportOptions;
	}

	private trLanguages = [];

	//todo cloudCommonLanguageService
	/*cloudCommonLanguageService.getLanguageItems().then(function (data) {
		trLanguages = data.filter(function (item) {
			return !item.IsDefault;
		});
	});*/

	private importOptions: BasicsSharedImportOptions = {
		moduleName: this.MODULE_NAME,
		customSettingsPage: {
			skip: false,
			config: {
				showGrouping: false,
				groups: [
					{
						groupId: 'lineItemSelectionImport',
						header: '',
						open: true,
						visible: true,
						sortOrder: 1,
					},
				],
				rows: [
					{
						groupId: 'lineItemSelectionImport',
						id: 'OverrideDocument',
						label: this.translateService.instant('estimate.main.lineItemSelStatement.overwriteDocument'),
						type: FieldType.Boolean,
						model: 'OverrideDocument',
						validator: (info) => {
							set(info.entity, 'OverrideDocument', false);
							return new ValidationResult();
						},
						visible: true,
						sortOrder: 1,
					},
					{
						groupId: 'lineItemSelectionImport',
						id: 'ModifiedDocument',
						label: this.translateService.instant('estimate.main.lineItemSelStatement.modifyDocument'),
						type: FieldType.Boolean,
						model: 'ModifiedDocument',
						validator: (info) => {
							set(info.entity, 'ModifiedDocument', false);
							return new ValidationResult();
						},
						visible: true,
						sortOrder: 1,
					},
				],
			},
		},
		ImportDescriptor: {
			Fields: [
				{
					PropertyName: 'Code',
					EntityName: 'EstLineItemSelStatement',
					DomainName: 'code',
					Editor: 'domain',
					DisplayName: 'cloud.common.entityCode',
				},
				{
					PropertyName: 'Description',
					EntityName: 'EstLineItemSelStatement',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'cloud.common.entityDescription',
				},
				{
					PropertyName: 'Structure',
					EntityName: 'EstLineItemSelStatement',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'cloud.common.entityStructure',
				},
				{
					PropertyName: 'SelectionStatementType',
					EntityName: 'EstLineItemSelStatement',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.main.lineItemSelStatement.recordType',
				},
				{
					PropertyName: 'estassemblyfirstlevelcat',
					EntityName: 'Assembly',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.main.lineItemSelStatement.parentLevelAssembly',
				},
				{
					PropertyName: 'estassemblycat',
					EntityName: 'Assembly',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.assemblies.estAssemblyCat',
				},
				{
					PropertyName: 'estassemblyfk',
					EntityName: 'Assembly',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.main.estAssemblyFk',
				},
				{
					PropertyName: 'boqheaderitemfk',
					EntityName: 'BoqItem',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.main.boqHeaderRef',
				},
				{
					PropertyName: 'Reference',
					EntityName: 'BoqItem',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.main.boqItemFk',
				},
				{
					PropertyName: 'wicgroupitemfk',
					EntityName: 'BoqItem',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.main.boqWicCatFk',
				},
				{
					PropertyName: 'wicheaderitemfk',
					EntityName: 'BoqItem',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.main.wicBoqHeaderFk',
				},
				{
					PropertyName: 'wicitemfk',
					EntityName: 'BoqItem',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.main.wicBoqItemFk',
				},
				{
					PropertyName: 'quantity',
					EntityName: 'EstLineItemSelStatement',
					DomainName: 'quantity',
					Editor: 'domain',
					DisplayName: 'cloud.common.entityQuantity',
				},
				{
					PropertyName: 'selectstatement',
					EntityName: 'EstLineItemSelStatement',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.main.lineItemSelStatement.selectStatement',
				},
				{
					PropertyName: 'schedulefk',
					EntityName: 'EstLineItemSelStatement',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.main.scheduleCode',
				},
				{
					PropertyName: 'psdactivityfk',
					EntityName: 'EstLineItemSelStatement',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.main.psdActivityFk',
				},
				{
					PropertyName: 'mdlmodelfk',
					EntityName: 'EstLineItemSelStatement',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'model.main.entityModel',
				},
				{
					PropertyName: 'objectselectstatement',
					EntityName: 'EstLineItemSelStatement',
					DomainName: 'description',
					Editor: 'domain',
					DisplayName: 'estimate.main.lineItemSelStatement.objectSelectStatement',
				},
			],
			CustomSettings: {
				OverrideDocument: true,
				ModifiedDocument: false,
				Translations: ['Description'],
			},
			FieldProcessor: (parentScope, oldProfile) => {
				 (field: BasicsSharedImportField, fields: BasicsSharedImportField[]) => {
					return (item: object) => {
						const culture = get(item, 'Culture') || '';
						const index = findIndex(fields, { PropertyName: field.PropertyName + '_' + culture });
						if (index === -1) {
							return {
								PropertyName: field.PropertyName + '_' + culture,
								EntityName: field.EntityName,
								DomainName: field.DomainName,
								Editor: field.Editor,
								DisplayName: this.translateService.instant(field.DisplayName).text + ' - ' + get(item, 'Description'),
								ValueName: field.ValueName ? field.ValueName + '_' + culture : null,
							};
						}
						return {};
					};
				};

				const processTrFields = () => {
					// remove all translation columns first.
					parentScope.ImportDescriptor.Fields = parentScope.ImportDescriptor.Fields.filter(function (field) {
						return true; // !field.__isTrColumn;
					});

					const fields = parentScope.ImportDescriptor.Fields;
					const translations = (get(parentScope.ImportDescriptor.CustomSettings, 'Translations') ?? []) as string[];

					translations.forEach((propertyName) => {
						// const field = find(fields, { PropertyName: propertyName });
						const index = findIndex(fields, { PropertyName: propertyName });

						if (index < 0) {
							return;
						}

						// const args: any[] = [index + 1, 0];
						/*const trFields = this.trLanguages.map(mapTrColumnFn(field, fields));
						args = args.concat(
							filter(trFields, (trField) => {
								return !!trField;
							}),
						);
						fields.splice.apply(fields, args);*/
					});
				};

				processTrFields();

				if (oldProfile && oldProfile.ImportDescriptor && oldProfile.ImportDescriptor.Fields) {
					const oldFields = oldProfile.ImportDescriptor.Fields;
					parentScope.ImportDescriptor.Fields.forEach((item) => {
						const res = find(oldFields, (field) => {
							return field.PropertyName === item.PropertyName;
						});
						if (res && isUndefined(item.MappingName)) {
							item.MappingName = res.MappingName;
						}
					});
				}

				for (let i = 0; i < parentScope.ImportDescriptor.Fields.length; i++) {
					parentScope.ImportDescriptor.Fields[i].Id = i;
				}
			},
			DoubletFindMethods: [],
		},
		preOpenImportDialogFn: () => {
			const headers = this.basicsImportService.importHeaderService.getList();
			this.importOptions.ImportDescriptor.Fields.forEach((field) => {
				const existItem = find(headers, { description: field.MappingName });
				if (!existItem) {
					field.MappingName = '';
				}
			});
			return Promise.resolve(true);
		},
	};

	/**
	 * open import dialog
	 */
	public excelImport() {
		const options = this.getImportOptions();
		this.basicsImportService.showImportDialog(options);
	}

	/**
	 * get import option
	 */
	public getImportOptions(): BasicsSharedImportOptions {
		return this.importOptions;
	}

	/**
	 * apply selection statement function
	 * @param applyForCurrentLineItems
	 */
	public applySelectionStatementFn(applyForCurrentLineItems?: boolean): void {
		const list = this.getList();
		const selectStatements = list.filter((item) => {
			return item.IsExecute === true && item.EstLineItemSelStatementType === 0;
		});
		if (selectStatements.length > 0) {
			this.applyFilters(selectStatements, !!applyForCurrentLineItems).then(this.showSelStatementExecutionReport, this.showSelStatementExecutionReportError);
		}
	}

	public async applyFilters(selStatements: IEstLineItemSelStatementEntity[], applyForCurrentLineItems: boolean): Promise<object> {
		//serviceContainer.data.reloadOnAppliedAssignment = true;
		const url = this.configService.webApiBaseUrl + 'estimate/main/selstatement/applyfilters';
		const headerId = this.estimateMainContextService.getSelectedEstHeaderId();
		const projectId = this.estimateMainContextService.getSelectedProjectId();
		//TODO depend on estimateMainService.getLastFilter
		//let filterRequest = this.parentService.getLastFilter();
		const postData = {
			projectFk: projectId,
			headerFk: headerId,
			ids: selStatements.map((e) => {
				return e.Id;
			}),
			applyForCurrentLineItems: !!applyForCurrentLineItems,
			filterRequest: {},
		};
		return firstValueFrom(this.http.post(url, postData));
	}

	public showSelStatementExecutionReport(response: object) {
		const res = new MainDataDto(response);
		const selStateDtos = (res.getValueAs<IEstLineItemSelStatementEntity[]>('selStateDtos') ?? []) as IEstLineItemSelStatementEntity[];
		const data = selStateDtos.map((item) => {
			return { Id: item.EstLineItemSelStatementFk, StartTime: item.StartTime, LoggingMessage: item.LoggingMessage };
		});
		this.onLoadByFilterSucceeded(data);
		const filterLineItemsBySelStatementResult = () => {
			const lineItemsResult = (Object.prototype.hasOwnProperty.call(response, 'lineItemsListUpdated') ? get(response, 'lineItemsListUpdated') : []) as object[];
			if (lineItemsResult.length > 0) {
				const lineItemIds = lineItemsResult.map((e) => {
					return get(e, 'LineItemId') ?? -1;
				});
				const lineItemsToFilter = { data: { lineItemIds: lineItemIds } };
				// Display line items affected by selection statement only when it is not for current line items
				// if (dataItems.hasOwnProperty('isForCurrentLineItems') && dataItems.isForCurrentLineItems === false){
				this.showSelStatementLineItemsFiltered(lineItemsToFilter);
			}
		};
		this.showSelStatementResultDialog(response).then(filterLineItemsBySelStatementResult, filterLineItemsBySelStatementResult);
	}

	private showSelStatementExecutionReportError() {}

	private async showSelStatementResultDialog(response: object) {
		//const res = new MainDataDto(response);
		const entity: ISelStatementApplyConfigEntity = {};
		// const firstTestFormRuntimeInfo: EntityRuntimeData<ISelStatementApplyConfigEntity> = {
		// 	readOnlyFields: [
		// 		/*{
		// 			field: 'isGood',
		// 			readOnly: true,
		// 		},*/
		// 	],
		// 	validationResults: [
		// 		/*{
		// 			field: 'myText',
		// 			result: {
		// 				valid: false,
		// 				error: 'I dont like this!',
		// 			},
		// 		},*/
		// 	],
		// 	entityIsReadOnly: false,
		// };
		const formConfig: IFormConfig<ISelStatementApplyConfigEntity> = {
			formId: 'bulkEditor.changeReport',
			showGrouping: true,
			groups: [
				{
					header: this.translateService.instant('platform.bulkEditor.records').text,
					groupId: 'estimate.main.selstatement.records',
					open: true,
					// eslint-disable-next-line no-prototype-builtins
					visible: !response.hasOwnProperty('isShowSingleExecutionInfo'),
					sortOrder: 100,
				},
				{
					header: this.translateService.instant('estimate.main.lineItemSelStatement.report.conflict').text,
					groupId: 'estimate.main.selstatement.conflict',
					open: false,
					// eslint-disable-next-line no-prototype-builtins
					visible: !response.hasOwnProperty('isShowSingleExecutionInfo'),
					sortOrder: 110,
				},
				{
					header: this.translateService.instant('platform.bulkEditor.details').text,
					groupId: 'estimate.main.selstatement.details',
					// eslint-disable-next-line no-prototype-builtins
					open: response.hasOwnProperty('isShowSingleExecutionInfo') || response.hasOwnProperty('errors'),
					sortOrder: 120,
				},
			],
			rows: [
				{
					groupId: 'estimate.main.selstatement.records',
					id: 'changedRecords',
					label: this.translateService.instant('platform.bulkEditor.totalRecords').text,
					type: FieldType.Integer,
					readonly: true,
					model: 'totalRecords',
					visible: true,
					sortOrder: 200,
				},
				{
					groupId: 'estimate.main.selstatement.records',
					id: 'changedRecords',
					label: this.translateService.instant('platform.bulkEditor.changedRecords').text,
					type: FieldType.Integer,
					readonly: true,
					model: 'changedRecords',
					visible: true,
					sortOrder: 210,
				},
				{
					groupId: 'estimate.main.selstatement.records',
					id: 'unchangedRecords',
					label: this.translateService.instant('platform.bulkEditor.unchangedRecords').text,
					type: FieldType.Integer,
					readonly: true,
					model: 'unchangedRecords',
					visible: true,
					sortOrder: 220,
				},
				{
					groupId: 'estimate.main.selstatement.conflict',
					id: 'logConflicts',
					label: this.translateService.instant('platform.bulkEditor.logs').text,
					type: FieldType.Text,
					readonly: true,
					model: 'logConflicts',
					visible: true,
					sortOrder: 230,
				},
				{
					groupId: 'estimate.main.selstatement.details',
					id: 'logSelStatement',
					label: this.translateService.instant('estimate.main.lineItemSelStatement.report.selectionStatementLabel').text,
					type: FieldType.Description,
					readonly: true,
					model: 'selStatementCode',
					// eslint-disable-next-line no-prototype-builtins
					visible: response.hasOwnProperty('isShowSingleExecutionInfo'),
					sortOrder: 240,
				},
				{
					groupId: 'estimate.main.selstatement.details',
					id: 'logStartTime',
					label: this.translateService.instant('estimate.main.lineItemSelStatement.report.lastExecutionTime').text,
					type: FieldType.Description,
					readonly: true,
					model: 'startTime',
					// eslint-disable-next-line no-prototype-builtins
					visible: response.hasOwnProperty('isShowSingleExecutionInfo'),
					sortOrder: 250,
				},
				{
					groupId: 'estimate.main.selstatement.details',
					id: 'logDetails',
					label: this.translateService.instant('platform.bulkEditor.logs').text,
					type: FieldType.Text,
					readonly: true,
					model: 'logDetails',
					visible: true,
					sortOrder: 260,
				},
			],
		};
		 await this.formDialogService.showDialog<ISelStatementApplyConfigEntity>({
			id: 'first-test',
			headerText: this.translateService.instant('estimate.main.lineItemSelStatement.report.title').text,
			formConfiguration: formConfig,
			entity: entity,
			//runtime: this.firstTestFormRuntimeInfo,
		});
		// TODO: here (and elsewhere) use constant
		// if (result?.closingButtonId === StandardDialogButtonId.Ok) {
		// }
	}

	private showSelStatementLineItemsFiltered(response: object) {
		const res = new MainDataDto(response);
		const data = res.getValueAs<object>('data');
		// eslint-disable-next-line no-prototype-builtins
		if (data && data.hasOwnProperty('lineItemIds')) {
			// const lineItemIds = get(data, 'lineItemIds') ?? ([] as number[]);
			// const filterKey = 'EST_SEL_STATEMENT';
			// const allFilterIds = [];
			// todo depend on estimateMainFilterService
			/* let estimateMainFilterService = $injector.get('estimateMainFilterService');
			if (lineItemIds.length > 0) {
				allFilterIds = lineItemIds;
				estimateMainFilterService.setFilterIds(filterKey, allFilterIds);
				estimateMainFilterService.addFilter('estimateMainLineItemSelectionStatementListController', estimateMainLineItemSelStatementListService, function (lineItem) {
					return allFilterIds.indexOf(lineItem.Id) >= 0;
				}, {id: filterKey, iconClass: 'tlb-icons ico-filter-script', captionId: 'filteringBySelStatements'}, 'Id');
			} else {
				estimateMainFilterService.setFilterIds(filterKey, []);
				estimateMainFilterService.addFilter('estimateMainLineItemSelectionStatementListController', estimateMainLineItemSelStatementListService, function () {
					return false;
				}, {id: filterKey, iconClass: 'tlb-icons ico-filter-script', captionId: 'filteringBySelStatements'}, 'Id');
			} */
		}
	}

	/**
	 * create new item
	 */
	public createNewItem() {
		//myCreationData.lineType = 0; // item
		const selected = this.getSelectedEntity();
		if (selected && selected.EstLineItemSelStatementType === 1) {
			void this.createChild();
		} else {
			void this.create();
		}
	}

	/**
	 * create new division
	 */
	public createNewDivision() {
		//myCreationData.lineType = 1; // folder
		void this.create();
	}

	/**
	 * create new sub division
	 */
	public createNewSubDivision() {
		//myCreationData.lineType = 1; // folder
		void this.createChild();
	}
}
