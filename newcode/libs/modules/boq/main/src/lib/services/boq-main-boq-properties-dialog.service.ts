import { inject, Injectable } from '@angular/core';
import {
	createLookup,
	FieldType,
	IEditorDialogResult,
	IFormConfig,
	IGridConfiguration,
	LookupSimpleEntity,
	StandardDialogButtonId,
	UiCommonFormDialogService,
	UiCommonLookupDataFactoryService,
	UiCommonLookupEndpointDataService
} from '@libs/ui/common';
import { IBoqStructureEntity, IBoqStructureDetailEntity, IBoqCatAssignDetailEntity, IBoqTypeEntity } from '@libs/boq/interfaces';
import { IBasicsCustomizeBoqStandardEntity, IBasicsCustomizeCatalogAssignTypeEntity } from '@libs/basics/interfaces';
import { BasicsSharedLineTypeLookupService } from '@libs/basics/shared';

@Injectable({providedIn: 'root'})
export class BoqMainBoqPropertiesDialogService {
	private formDialogService : UiCommonFormDialogService;
	private lookupServiceFactory = inject(UiCommonLookupDataFactoryService);

	public constructor() {
		this.formDialogService = inject(UiCommonFormDialogService);
	}

	public async openBoqPropertiesDialog(boqStructureEntity: IBoqStructureEntity) {
		await this.formDialogService.showDialog<IBoqStructureEntity>({
			id: 'boqPropertiesDialog',
			headerText: 'boq.main.boqProperties',
			formConfiguration: this.boqPropertiesFormConfig,
			entity: boqStructureEntity,
			runtime: undefined,
			customButtons: [
				{
					id: 'reset',
					caption: 'boq.main.roundingConfig',
				},
			],
			topDescription: '',
			width: '1200px',
			maxHeight: 'max'
		})?.then(result => {
			// TODO: here (and elsewhere) use constant
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				this.handleOk(result);
			} else {
				this.handleCancel(result);
			}
		});
	}

	private boqStructureDetailGridConfiguration:  IGridConfiguration<IBoqStructureDetailEntity> =  {
		uuid: 'e8850e68aecd4790b59e7ecbba069848',
		idProperty: 'Id',
		skipPermissionCheck: true,
		columns: [{
			id: 'lineTyp',
			model: 'BoqLineTypeFk',
			sortable: true,
			label: 'boq.main.BoqLineTypeFk',
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedLineTypeLookupService,
			}),
			width: 170,
		}, {
			id: 'dec',
			model: 'DescriptionInfo',
			sortable: true,
			label: 'cloud.common.entityDescription',
			type: FieldType.Translation,
			width: 170,
		}, {
			id: 'typ',
			model: 'DataType',
			sortable: true,
			label: 'boq.main.DataType',
			type: FieldType.Lookup, //TODO-BOQ-Field type 'select' is used, but it is not working in new client as expected, so used lookup
			lookupOptions: createLookup<IBoqStructureDetailEntity, LookupSimpleEntity>({
				dataService: this.lookupServiceFactory.fromSimpleItemClass([
					{id: 1, desc: 'boq.main.structureDetailTypeNumeric' },
					{id: 2, desc: 'boq.main.structureDetailTypeAlphaNumeric' },
				], {
					displayMember: 'desc'
				})
			}),
			width: 80,
		},{
			id: 'length',
			model: 'LengthReference',
			sortable: true,
			label: 'boq.main.LengthReference',
			type: FieldType.Integer,
			width: 100,
		}, {
			id: 'val',
			model: 'StartValue',
			sortable: true,
			label: 'boq.main.StartValue',
			type: FieldType.Description,
			width: 80,
		}, {
			id: 'stepInc',
			model: 'Stepincrement',
			sortable: true,
			label: 'boq.main.Stepincrement',
			type: FieldType.Description,
			readonly: false,
			width: 100,
		}]
	};

	private boqCatalogAssignDetailsGridConfiguration:  IGridConfiguration<IBoqStructureDetailEntity> =  {
		uuid: '85085d3492cf4ec0be27db184f944d3b',
		idProperty: 'Id',
		skipPermissionCheck: true,
		columns: [{
			id: 'CtlgName',
			model: 'GaebName',
			sortable: true,
			label: 'boq.main.CtlgName',
			type: FieldType.Description,
			width: 120,
		}, {
			id:'CtlgType',
			model:'GaebId',
			sortable: true,
			label: 'boq.main.CtlgType',
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: CatalogAssignGaebLookupService,
				showClearButton: true,
			})
		}, {
			id:'BoqCatalogFk',
			model:'BoqCatalogFk',
			sortable: true,
			label: 'boq.main.costgroupcatcode',
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: CatalogAssignCatalogLookupService,
				showClearButton: true,
			})
		}, {
			id: 'CostGroupCatalogCode',
			model: 'Code',
			sortable: true,
			label: 'boq.main.newcostgroupcatcode',
			type: FieldType.Description,
			width: 120,
		}, {
			id: 'CostGroupCatalogDescription',
			model: 'DescriptionInfo',
			sortable: true,
			label: 'boq.main.newcostgroupcatDescr',
			type: FieldType.Translation,
			width: 150,
		}, {
			id:'CatalogAssignmentMode',
			model:'SearchMode',
			sortable: true,
			label: 'boq.main.CatalogAssignmentMode',
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: CatalogAssignModeLookupService,
				showClearButton: true,
			})
		}]
	};

	/**
	 * Demo first form configuration data.
	 */
	private boqPropertiesFormConfig: IFormConfig<IBoqStructureEntity> = {
		formId: 'boq-properties-form',
		showGrouping: true,
		groups: [

			{
				groupId: '1',
				header: 'boq.main.boqConfiguration',
				open: true
			},
			{
				groupId: '2',
				header: 'boq.main.boqStructure',
				open: true
			},
			{
				groupId: '3',
				header: 'boq.main.UrBreakdown',
				open: true
			},
			{
				groupId: '4',
				header: 'boq.main.UserDefined',
				open: true
			},
			{
				groupId: 'boqCatalog',
				header: 'boq.main.catalogSection',
				open: true
			},
		],
		rows: [
			//TODO-BOQ: Grid on dialog for Structure details and catalog assign details. Framework team is working on adding grid on dialog
			//TODO-BOQ: Discuss with Silvio and Helmut for refactoring of BoqTypeId and IsChecked fields below as those are not present in real entities and are added from js code
			{
				groupId: '1',
				id:'type',
				label: 'boq.main.boqType',
				type: FieldType.Lookup,
				model:'BoqTypeId',
				lookupOptions: createLookup({
					dataServiceToken: BoqTypeLookupService,
				})
			},
			{
				groupId: '1',
				id: 'editConfig',
				label: 'boq.main.boqSpecificStruc',
				type: FieldType.Boolean,
				model: 'IsChecked',
			},
			{
				groupId: '1',
				id: 'str',
				label: 'boq.main.Description',
				type: FieldType.Description,
				model: 'Description',
			},
			{
				groupId: '2',
				id:'standard',
				label: 'boq.main.boqStandard',
				type: FieldType.Lookup,
				model:'BoqStandardFk',
				lookupOptions: createLookup({
					dataServiceToken: BoqStandardLookupService,
				})
			},
			{
				groupId: '2',
				id: 'mask',
				label: 'boq.main.boqMask',
				type: FieldType.Description,
				model: 'Boqmask',
			},

			{
				groupId: '2',
				id: 'detail',
				label: 'boq.main.structDetails',
				type: FieldType.Grid,
				configuration: this.boqStructureDetailGridConfiguration as IGridConfiguration<object>,
				model: 'BoqStructureDetailEntities',
			},

			{
				groupId: '2',
				id: 'enfrcStr',
				label: 'boq.main.enforceStruct',
				type: FieldType.Boolean,
				model: 'EnforceStructure',
			},
			{
				groupId: '2',
				id: 'leadZero',
				label: 'boq.main.refNoLeadingZeros',
				type: FieldType.Boolean,
				model: 'LeadingZeros',
			},
			{
				groupId: '2',
				id: 'skippedHierarchies',
				label: 'boq.main.SkippedHierarchiesAllowed',
				type: FieldType.Boolean,
				model: 'SkippedHierarchiesAllowed',
			},

			{
				groupId: '3',
				id:'ed1',
				label: 'boq.main.Urb1',
				type: FieldType.InputSelect,
				model:'NameUrb1',
				options: {
					items: [
						{
							description: 'Wage',
							id: 1,
							isLive: true,
							remark: 'Wage',
							sorting: 1,
							version: 1,
						},
					],
					//serviceName:'BoqUrBreakdownService', //TODO-BOQ: Questions asked on Teams channel for usage of serviceName and seems functionality pending from framework side
					//serviceMethod:'test',
					inputDomain: 'Description',
				},
			},
			{
				groupId: '3',
				id:'ed2',
				label: 'boq.main.Urb2',
				type: FieldType.InputSelect,
				model:'NameUrb2',
				options: {
					items: [
						{
							description: 'Wage',
							id: 1,
							isLive: true,
							remark: 'Wage',
							sorting: 1,
							version: 1,
						},
					],
					//serviceName:'BoqUrBreakdownService', //TODO-BOQ: Questions asked on Teams channel for usage of serviceName and seems functionality pending from framework side
					//serviceMethod:'test',
					inputDomain: 'Description',
				},
			},
			{
				groupId: '3',
				id:'ed3',
				label: 'boq.main.Urb3',
				type: FieldType.InputSelect,
				model:'NameUrb3',
				options: {
					items: [
						{
							description: 'Wage',
							id: 1,
							isLive: true,
							remark: 'Wage',
							sorting: 1,
							version: 1,
						},
					],
					//serviceName:'BoqUrBreakdownService', //TODO-BOQ: Questions asked on Teams channel for usage of serviceName and seems functionality pending from framework side
					//serviceMethod:'test',
					inputDomain: 'Description',
				},
			},
			{
				groupId: '3',
				id:'ed4',
				label: 'boq.main.Urb4',
				type: FieldType.InputSelect,
				model:'NameUrb4',
				options: {
					items: [
						{
							description: 'Wage',
							id: 1,
							isLive: true,
							remark: 'Wage',
							sorting: 1,
							version: 1,
						},
					],
					//serviceName:'BoqUrBreakdownService', //TODO-BOQ: Questions asked on Teams channel for usage of serviceName and seems functionality pending from framework side
					//serviceMethod:'test',
					inputDomain: 'Description',
				},
			},
			{
				groupId: '3',
				id:'ed5',
				label: 'boq.main.Urb5',
				type: FieldType.InputSelect,
				model:'NameUrb5',
				options: {
					items: [
						{
							description: 'Wage',
							id: 1,
							isLive: true,
							remark: 'Wage',
							sorting: 1,
							version: 1,
						},
					],
					//serviceName:'BoqUrBreakdownService', //TODO-BOQ: Questions asked on Teams channel for usage of serviceName and seems functionality pending from framework side
					//serviceMethod:'test',
					inputDomain: 'Description',
				},
			},
			{
				groupId: '3',
				id:'ed6',
				label: 'boq.main.Urb6',
				type: FieldType.InputSelect,
				model:'NameUrb6',
				options: {
					items: [
						{
							description: 'Wage',
							id: 1,
							isLive: true,
							remark: 'Wage',
							sorting: 1,
							version: 1,
						},
					],
					//serviceName:'BoqUrBreakdownService', //TODO-BOQ: Questions asked on Teams channel for usage of serviceName and seems functionality pending from framework side
					//serviceMethod:'test',
					inputDomain: 'Description',
				},
			},
			{
				groupId: '3',
				id: '7',
				label: 'boq.main.urCalcByURB',
				type: FieldType.Boolean,
				model: 'CalcFromUrb',
			},

			{
				groupId: '4',
				id: 'f1',
				label: 'boq.main.Userdefined1',
				type: FieldType.Description,
				model: 'NameUserdefined1',
			},
			{
				groupId: '4',
				id: 'f2',
				label: 'boq.main.Userdefined2',
				type: FieldType.Description,
				model: 'NameUserdefined2',
			},
			{
				groupId: '4',
				id: 'f3',
				label: 'boq.main.Userdefined3',
				type: FieldType.Description,
				model: 'NameUserdefined3',
			},
			{
				groupId: '4',
				id: 'f4',
				label: 'boq.main.Userdefined4',
				type: FieldType.Description,
				model: 'NameUserdefined4',
			},
			{
				groupId: '4',
				id: 'f5',
				label: 'boq.main.Userdefined5',
				type: FieldType.Description,
				model: 'NameUserdefined5',
			},

			{
				groupId: 'boqCatalog',
				id:'boqCatalogAssignType',
				label: 'boq.main.catalogHeader',
				type: FieldType.Lookup,
				model:'BoqCatAssignTypeId',
				lookupOptions: createLookup({
					dataServiceToken: CatalogAssignTypeLookupService,
				})
			},
			{
				groupId: 'boqCatalog',
				id: 'editBoqCatalogConfigType',
				label: 'boq.main.editBoqCatalogConfigType',
				type: FieldType.Boolean,
				model: 'EditBoqCatalogConfigType',
			},
			{
				groupId: 'boqCatalog',
				id: 'boqCatalogAssignDesc',
				label: 'boq.main.Description',
				type: FieldType.Description,
				model: 'BoqCatalogAssignDesc',
			},
			{
				groupId: 'boqCatalog',
				id: 'boqCatalogAssignDetails',
				label: 'boq.main.boqCatalogAssignDetails',
				type: FieldType.Grid,
				configuration: this.boqCatalogAssignDetailsGridConfiguration as IGridConfiguration<object>,
				model: 'BoqCatAssignDetailEntities',
			},

		],

	};

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<IBoqStructureEntity>): void {
		//TODO:Operations to be carried out on ok click.
		console.log(result);
	}

	/**
	 * Method handles 'Cancel' button functionality.
	 */
	private handleCancel(result?: IEditorDialogResult<IBoqStructureEntity>): void {
		//TODO:Operations to be carried out on ok click.
		console.log(result);
	}

}

@Injectable({
	providedIn: 'root'
})
class BoqStandardLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBoqStandardEntity, TEntity> {

	public constructor() {
		const endpoint = {httpRead: { route: 'basics/customize/boqstandard/', endPointRead: 'list', usePostForRead: true }};
		const config = {
			uuid: '3a5b9c077f39457ba2ff1fb1edb39143',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Description'
		};
		super(endpoint, config);
	}
}

@Injectable({
	providedIn: 'root'
})
class BoqTypeLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBoqTypeEntity, TEntity> {

	public constructor() {
		const endpoint = {httpRead: { route: 'boq/main/type/', endPointRead: 'getboqtypes' }};
		const config = {
			uuid: '22ac8586a5a642280278e50a46d8a9c2',
			valueMember: 'Id',
			displayMember: 'Description'
		};
		super(endpoint, config);
	}
}

@Injectable({
	providedIn: 'root'
})
class CatalogAssignTypeLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCatalogAssignTypeEntity, TEntity> {

	public constructor() {
		const endpoint = {httpRead: { route: 'basics/customize/catalogassigntype/', endPointRead: 'list', usePostForRead: true }};
		const config = {
			uuid: '16aca849e9d44ead8d4ed2ac1e2aa852',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Description'
		};
		super(endpoint, config);
	}
}


@Injectable({
	providedIn: 'root'
})
class CatalogAssignModeLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBoqCatAssignDetailEntity, TEntity> {

	public constructor() {
		const endpoint = {httpRead: { route: 'boq/main/catalog/', endPointRead: 'modelist' }};
		const config = {
			uuid: 'd315e0ecb82a41b297810554211921d8',
			valueMember: 'Id',
			displayMember: 'Description' //DescriptionInfo.Description
		};
		super(endpoint, config);
	}
}

@Injectable({
	providedIn: 'root'
})
class CatalogAssignCatalogLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBoqCatAssignDetailEntity, TEntity> {

	public constructor() {
		const endpoint = {httpRead: { route: 'boq/main/catalog/', endPointRead: 'list' }};
		const config = {
			uuid: '66ec9a6328cf4f608b7e08098acf473e',
			valueMember: 'Id',
			displayMember: 'Description' //DescriptionInfo.Description
		};
		super(endpoint, config);
	}
}

@Injectable({
	providedIn: 'root'
})
class CatalogAssignGaebLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBoqCatAssignDetailEntity, TEntity> {

	public constructor() {
		const endpoint = {httpRead: { route: 'boq/main/catalog/', endPointRead: 'gaebtypelist' }};
		const config = {
			uuid: 'dab29b9aaea54e5aa2e1ae32d19c5618',
			valueMember: 'Id',
			displayMember: 'Description' //DescriptionInfo.Description
		};
		super(endpoint, config);
	}
}