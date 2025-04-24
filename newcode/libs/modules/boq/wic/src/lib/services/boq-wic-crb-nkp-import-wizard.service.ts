/* eslint-disable angular-file-naming/component-filename-suffix */

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { IInitializationContext, PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ColumnDef, FieldType, GridApiService, GridComponent, ICustomDialogOptions, IFormConfig, IGridConfiguration, StandardDialogButtonId, UiCommonDialogService, UiCommonLookupDataFactoryService, UiCommonMessageBoxService, UiCommonModule, createLookup } from '@libs/ui/common';
import { WicGroupDataService } from './boq-wic-group.service';
import { remove } from 'lodash';
import { IWicGroupEntity } from '../model/entities/wic-group-entity.interface';

export class CrbNpkImportWizardService {
	private dialogService: UiCommonDialogService;
	private messageBoxService: UiCommonMessageBoxService;
	private translateService: PlatformTranslateService;
	private http: PlatformHttpService;
	private wicGroupDataService: WicGroupDataService;

	public constructor(context: IInitializationContext) {
		this.dialogService       = context.injector.get(UiCommonDialogService);
		this.wicGroupDataService = context.injector.get(WicGroupDataService);
		this.messageBoxService   = context.injector.get(UiCommonMessageBoxService);
		this.http                = context.injector.get(PlatformHttpService);
		this.translateService    = context.injector.get(PlatformTranslateService);
	}

	public async start() {
		const selectedWicGroup = this.wicGroupDataService.getSelectedEntity();
		if (!selectedWicGroup) {
			this.messageBoxService.showInfoBox('boq.main.npkImportWicMissing', 'info', false);
			return;
		}

		const copyrightOptions: ICustomDialogOptions<object,CrbNpkCopyrightComponent> = {
			headerText: 'Copyright',
			height:     '560px',
			width:      '560px',
			bodyComponent: CrbNpkCopyrightComponent
		};
		await this.dialogService.show(copyrightOptions);

		const importOptions: ICustomDialogOptions<object,CrbNpkImportComponent> = {
			headerText: this.translateService.instant('boq.main.npkImport'),
			resizeable: true,
			height: '500px',
			bodyComponent: CrbNpkImportComponent,
			buttons: [{
				id: StandardDialogButtonId.Ok,
				caption: 'cloud.common.ok',
				isDisabled: info => {
					return info.dialog.body.getSelectedNpkChapters().length===0 || info.dialog.body.getSelectedNpkVersions().length===0;
				},
				autoClose: true,
				fn: (event, info) => {
					this.import(selectedWicGroup, info.dialog.body.getSelectedNpkChapters(), info.dialog.body.getSelectedNpkVersions());
				}

				// TODO-BOQ: To be deleted. Just a template for this implementation
				// Starts the import
				//	http.post(configurationService.webApiBaseUrl + 'basics/costgroupcat/importcrbbkp',
				//	{
				//		BkpType:    dialogBody.selectedBKPType,
				//		BkpVersion: dialogBody.selectedBKPVersion
				//		}).subscribe(() => {
				//			const basicsCostGroupCatalogDataService = context.injector.get(BasicsCostGroupCatalogDataService);
				//			basicsCostGroupCatalogDataService.refreshAllLoaded();
				//		});
				//	}
			},
			{
				id: StandardDialogButtonId.Cancel, caption: 'ui.common.dialog.cancelBtn'
			}]
		};
		await this.dialogService.show(importOptions);
	}

	private import(wicGroup: IWicGroupEntity, npkChapters: NpkItem[], npkVersions: NpkItem[])	{
		const isGroupedByChapter = npkChapters.length===1;
		const rightGridSelections = isGroupedByChapter ? npkVersions : npkChapters;

		const request = { // TODO-BOQ: To be created by schematics tool
			'WicGroupId':       wicGroup.Id,
			'NpkChapterNumber': ( isGroupedByChapter ? npkChapters[0] : rightGridSelections[0]).c,
			'NpkVersion':       (!isGroupedByChapter ? npkVersions[0] : rightGridSelections[0]).c,
		};
		this.http.post$('boq/wic/boq/importcrbnpk', request).subscribe(() => {
			// TODO-BOQ: from old client: boqWicCatBoqService.addWicCatBoq(response.data);
			// Or? this.wicGroupDataService.refreshAllLoaded();
			if (rightGridSelections.length > 1) {
				remove(rightGridSelections, rightGridSelections[0]);
				this.import(wicGroup, npkChapters, npkVersions);
			} else {
				this.messageBoxService.showMsgBox('boq.main.importSucceeded', 'boq.main.npkImport', 'ico-info');
			}
		});
	}
}

@Component({
	template: '<section class="modal-body"><div><img src="{{image}}" alt=""/></div></section>'
})
export class CrbNpkCopyrightComponent implements OnInit {
	private readonly configService = inject(PlatformConfigurationService);

	public image: string = 'Cloud.Style/content/images/crb-copyright/CRB_Dialogbox_'; // TODO-BOQ: Image not visible

	public ngOnInit(): void {
		const language = this.configService.savedOrDefaultUiCulture;
		this.image += (language==='fr' ? 'F' : language==='it' ? 'I' : 'D') + '_NPK.gif';
	}
}

interface GroupByCriterion {
	selected: number;
}

interface NpkItem {
	c: string;
	d: string;
	x: string;
}

@Component({
	standalone: true,
	imports: [UiCommonModule,GridComponent],
	templateUrl: './boq-wic-crb-nkp-import.component.html'
})
export class CrbNpkImportComponent implements OnInit, OnDestroy {
	private translationService   = inject(PlatformTranslateService);
	private lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
	private http                 = inject(PlatformHttpService);
	private gridApiService       = inject(GridApiService);

	public groupByCriterion: GroupByCriterion = { selected: 1 };

	public comboboxConfig: IFormConfig<GroupByCriterion> = {
		rows: [{
			label: 'boq.main.npkGroupBy',
			id: 'selected',
			model: 'selected',
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataService: this.lookupServiceFactory.fromSimpleItems([[1, this.translationService.instant('boq.main.npkChapter').text], [2, this.translationService.instant('boq.main.npkVersion').text]]),
				events: [{
					name: 'onSelectedItemChanged',
					handler: e => {
						this.cleanChapterGrid();
						this.cleanVersionGrid();

						this.isGroupedByChapter = e.context.lookupInput?.selectedItem?.id === 1;
						this.http.get$('boq/main/crb/' + (this.isGroupedByChapter ? 'npkchapters' : 'npkversionyears')).subscribe(response => {
							if (this.isGroupedByChapter) {
								this.chapters = response as NpkItem[];
							} else {
								this.versions = response as NpkItem[];
							}
						});
					}
				}]
			}),
		}]
	};

	private isGroupedByChapter: boolean = true;

	public chapters: NpkItem[] = [];
	public versions: NpkItem[] = [];

	public chapterGridConfig!: IGridConfiguration<NpkItem>;
	public versionGridConfig!: IGridConfiguration<NpkItem>;

	public ngOnInit(): void {
		this.chapterGridConfig = {
			uuid: '00274750E0AE4B77986BE16011EF6348',
			idProperty: 'c',
			columns: [{
				id:    'c',
				model: 'c',
				label: 'boq.main.npkChapter',
				type: FieldType.Description,
				width: 80
			},
			{
				id:    'd',
				model: 'd',
				label: 'boq.main.Brief',
				type: FieldType.Description,
				width: 170
			}] as ColumnDef<NpkItem>[]
		};

		this.versionGridConfig = {
			uuid: 'B88C91D9BF2C4C7985AE60C13773B623',
			idProperty: 'c',
			columns: [{
				id:    'c',
				model: 'c',
				label: 'boq.main.npkVersion',
				type: FieldType.Description,
				width: 85
			},
			{
				id:    'd',
				model: 'd',
				label: 'boq.main.npkYear',
				type: FieldType.Description,
				width: 85
			},
			{
				id:    'x',
				model: 'x',
				label: 'boq.main.npkStand',
				type: FieldType.Description,
				width: 85
			}] as ColumnDef<NpkItem>[]
		};
	}

	public ngOnDestroy(): void {
		// TODO-BOQ: from old client: $injector.get('boqMainCrbLicenseService').logoutLicenseService();
		console.log('logout');
	}

	public chapterGridSelectionChanged(selectedChapters: NpkItem[]) {
		if (this.isGroupedByChapter) {
			this.cleanVersionGrid();

			if (selectedChapters.length === 1) {
				this.http.get$('boq/main/crb/npkversions?chapter=' + selectedChapters[0].c).subscribe(response => {
					this.versions = response as NpkItem[];
				});
			}
		}
	}

	public versionGridSelectionChanged(selectedVersions: NpkItem[]) {
		if (!this.isGroupedByChapter) {
			this.cleanChapterGrid();

			if (selectedVersions.length === 1) {
				this.http.get$('boq/main/crb/npkchaptersforyear?year=' + selectedVersions[0].c).subscribe(response => {
					this.chapters = response as NpkItem[];
				});
			}
		}
	}

	public getSelectedNpkChapters(): NpkItem[] {
		return this.gridApiService.get(this.chapterGridConfig.uuid as string).selection as NpkItem[];
	}

	public getSelectedNpkVersions(): NpkItem[] {
		return this.gridApiService.get(this.versionGridConfig.uuid as string).selection as NpkItem[];
	}

	private cleanChapterGrid() {
		const gridApi = this.gridApiService.get(this.chapterGridConfig.uuid as string);
		if (gridApi) {
			gridApi.selection = [];
		}

		this.chapters = [];
	}

	private cleanVersionGrid() {
		const gridApi = this.gridApiService.get(this.versionGridConfig.uuid as string);
		if (gridApi) {
			gridApi.selection = [];
		}

		this.versions = [];
	}
}
