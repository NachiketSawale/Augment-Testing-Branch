import { inject, Injectable } from '@angular/core';
import { ExportOptions, ExportOptionsEx } from '../models/types/export-options.type';
import { PlatformConfigurationService, PlatformModuleManagerService, PlatformTranslateService } from '@libs/platform/common';
import { ContainerDefinition, ContainerModuleInfoBase } from '@libs/ui/container-system';
import { IExportContainer } from '../models/interfaces/export-container.interface';
import { createLookup, FieldType, GridApiService, LookupEvent, LookupSimpleEntity, StandardDialogButtonId, UiCommonDialogService, UiCommonLookupDataFactoryService, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsExportFormatService } from './basics-export-format.service';
import { firstValueFrom, map, Observable } from 'rxjs';
import { IExcelProfile } from '../models/interfaces/excel-profile.interface';
import { cloneDeep, map as lodashMap } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { BasicsSharedCheckedListBoxComponent, createCheckedListBoxLookupProvider } from '../../checked-list-box/checked-list-box.component';
import { ProfileContext } from '../../model/enums/profile-context.enums';
import { BasicsSharedExportComponent, ExportFormConfig } from '../components/basics-shared-export/basics-shared-export.component';

@Injectable({
	providedIn: 'root',
})
export class BasicsExportService {
	private moduleManageService = inject(PlatformModuleManagerService);
	private translateService = inject(PlatformTranslateService);
	private dialogService = inject(UiCommonDialogService);
	private msgBoxService = inject(UiCommonMessageBoxService);
	private gridApi = inject(GridApiService);
	private lookupServiceFactory: UiCommonLookupDataFactoryService = inject(UiCommonLookupDataFactoryService);
	private exportFormatService = inject(BasicsExportFormatService);
	// use HttpClient as it needs to access the HttpHeaders
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);

	private readonly profileContextMap: Record<string, ProfileContext> = {
		1: ProfileContext.FreeCSV,
		2: ProfileContext.FreeXML,
		BoqBidder: ProfileContext.BoqBidder,
		BoqPlanner: ProfileContext.BoqPlanner,
		MatBidder: ProfileContext.MatBidder,
		BoqPes: ProfileContext.BoqPes,
		BoqPlannerPrice: ProfileContext.BoqPlannerPrice,
		General: ProfileContext.FreeExcel,
	};

	public constructor() {
		this.translateService.load(['basics.shared']).then();
	}

	public async showExportDialog(exportOptions: ExportOptions) {
		const exportOptionsEx = exportOptions as ExportOptions & ExportOptionsEx;
		const module = this.moduleManageService.activeModule as ContainerModuleInfoBase;
		const containers = module.effectiveContainers;

		// automatically add all dependent data container to the subContainer list
		containers.forEach((container) => {
			if (Object.prototype.hasOwnProperty.call(container, 'dependentDataId')) {
				const exists = exportOptionsEx.subContainers.find((item) => {
					return item.dependentDataId && item.dependentDataId === (container as unknown as Record<string, string>['dependentDataId']);
				});
				if (!exists) {
					exportOptionsEx.subContainers.push({
						id: container.id,
						gridId: container.uuid,
						qualifier: 'dependentdata',
						label: this.translateService.instant(container.title).text,
						selected: false,
						dependentDataId: container as unknown as Record<string, string>['dependentDataId'],
					});
				}
			}
		});

		// main container
		this.addColInfo2Options(containers, exportOptionsEx.mainContainer);

		if (!exportOptionsEx.mainContainer.gridId) {
			throw 'Can\'t  get columns of container "' + exportOptionsEx.mainContainer.label + '" - Please ensure its visibilty!';
		}

		// sub containers
		exportOptionsEx.subContainers.forEach((subContainer) => {
			this.addColInfo2Options(containers, subContainer);
		});

		if (exportOptionsEx.handlerSubContainer) {
			exportOptionsEx.handlerSubContainer(exportOptionsEx.subContainers);
		}

		//check sub containers other config
		exportOptionsEx.subContainers.forEach(item=> {
			if (item.everVisible && !item.visible) {
				item.visible = true;
			}
		});

		//special sub  containers
		if (exportOptionsEx.specialSubContainers) {
			exportOptionsEx.specialSubContainers.forEach((specialContainer) => {
				if (specialContainer.label) {
					specialContainer.label = this.translateService.instant(specialContainer.label).text;
				}
				const res = exportOptionsEx.subContainers.find((item) => {
					return item.id === specialContainer.id;
				});
				if (!res) {
					exportOptionsEx.subContainers.push(specialContainer);
				} else {
					res.visible = true;
				}
			});
		}

		// TODO: replace it when cloudDesktopSidebarService.getFilterRequestParams is ready.
		// exportOptionsEx.filter = cloudDesktopSidebarService.getFilterRequestParams();
		exportOptionsEx.filter = {
			PageSize: 10,
			PageNumber: 0,
			UseCurrentClient: false,
			UseCurrentProfitCenter: null,
			IncludeNonActiveItems: true,
			ProjectContextId: null,
			PinningContext: [],
			ExecutionHints: null,
			OrderBy: [],
			IsEnhancedFilter: false,
			InterfaceVersion: '2.0',
			furtherFilters: [],
		};

		if (exportOptionsEx.exportOptionsCallback) {
			exportOptionsEx.exportOptionsCallback(exportOptionsEx);
		}

		if (exportOptionsEx.canExecuteExport === undefined || exportOptionsEx.canExecuteExport) {
			this.exportFormatService.addValidExcelProfileContexts(exportOptionsEx.excelProfileContexts);
			const formConfig = await this.getFormConfig(exportOptionsEx);

			//const result = await this.formDialogService.showDialog(formConfig);

			const result = await this.dialogService.show({
				id: 'basics-export-dialog',
				headerText: {
					key: 'cloud.common.exportDialogTitle',
				},
				bodyComponent: BasicsSharedExportComponent,
				buttons: [
					{
						id: StandardDialogButtonId.Ok,
						// isDisabled: () => !entity.file || !!entity.dialogLoading,
						// autoClose: false,
						// fn: async (event, info) => {
						// 	entity.dialogLoading = true;
						// 	await importOkFn(info.dialog.value?.entity ?? entity);
						// 	entity.dialogLoading = false;
						// 	info.dialog.close(StandardDialogButtonId.Ok);
						// },
					},
					{ id: StandardDialogButtonId.Cancel },
				],
				value: formConfig,
			});
			if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				this.createImportFile(result.value.entity).subscribe((result) => {
					//Create anchor to download file
					const link = document.createElement('a');
					document.body.appendChild(link);
					link.setAttribute('display', 'none');
					const fileName = result.headers.get('Content-Disposition')?.slice(21);
					if (fileName) {
						link.download = fileName.split('"').join('');
					}
					link.href = result.body ?? '';
					link.click();
				});
			}
		} else {
			this.msgBoxService.showMsgBox('cloud.common.noSelected', 'cloud.common.informationDialogHeader', 'info');
		}
	}

	private addColInfo2Options(containers: ContainerDefinition[], containerOption: IExportContainer) {
		containerOption.visible = false; // default: container not in layout

		const container = containers.find((item) => {
			if (containerOption.gridId) {
				return item.uuid.toLowerCase() === containerOption.gridId.toLowerCase();
			} else {
				return item.id === containerOption.id;
			}
		});

		if (container) {
			if (containerOption.label) {
				containerOption.label = this.translateService.instant(containerOption.label).text;
			} else {
				containerOption.label = this.translateService.instant(container.title).text;
			}

			if (Object.prototype.hasOwnProperty.call(container, 'sectionId')) {
				containerOption.sectionId = container as unknown as Record<string, string>['sectionId'];
			}

			const gridId = container.uuid;
			const grid = this.gridApi.get(gridId);
			if (grid) {
				containerOption.gridId = gridId;
				containerOption.visible = true;
			}
		}
	}

	private async getFormConfig(exportOptions: ExportOptions & ExportOptionsEx): Promise<ExportFormConfig> {
		const profiles = await firstValueFrom(this.getExcelProfiles(exportOptions));

		return {
			formConfiguration: {
				formId: 'basics.export.dialog',
				showGrouping: false,
				rows: [
					{
						id: 'subContainers',
						model: 'subContainers',
						type: FieldType.CustomComponent,
						componentType: BasicsSharedCheckedListBoxComponent,
						providers: [
							createCheckedListBoxLookupProvider({
								idProperty: 'id',
								valueMember: 'selected',
								displayMember: 'label',
								clientSideFilter: {
									execute(item: IExportContainer, context): boolean {
										return item.visible ?? false;
									},
								},
							}),
						],
						label: {
							text: 'Container',
							key: 'basics.export.entitySubContainers',
						},
						visible: exportOptions.subContainers && exportOptions.subContainers.length > 0,
					},
					{
						id: 'ExcelProfile',
						model: 'excelProfileId',
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataService: this.lookupServiceFactory.fromSimpleItemClass(profiles),
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: (e) => {
										const selectedItem = (e as LookupEvent<LookupSimpleEntity, ExportOptions>).selectedItem as IExcelProfile;
										this.setupControls(selectedItem, exportOptions);
									},
								},
							],
						}),
						label: {
							text: 'ExcelProfile',
							key: 'basics.export.entityExcelProfile',
						},
					},
					{
						id: 'JustifyPropertyNames',
						model: 'justifyPropertyNames',
						type: FieldType.Boolean,
						label: {
							text: 'Remove special chars',
							key: 'basics.export.justifyPropertyNames',
						},
						visible: exportOptions.justifyPropertyNamesVisible,
					},
				],
			},
			entity: exportOptions,
		};
	}

	private getExcelProfiles(exportOptions: ExportOptions & ExportOptionsEx): Observable<LookupSimpleEntity[]> {
		return this.exportFormatService.loadExcelProfiles().pipe(
			map((profiles) => {
				const defaultExcelProfile =
					profiles.find((profile) => {
						return profile.IsDefault;
					}) || profiles[0];
				if (!exportOptions.excelProfileId) {
					exportOptions.excelProfileId = defaultExcelProfile.Id;
				}
				this.setupControls(defaultExcelProfile, exportOptions);
				const itemSource: LookupSimpleEntity[] = [];
				profiles.forEach((profile) => {
					profile.id = profile.Id;
					profile.desc = profile.Description;
					itemSource.push(profile);
					//itemSource.push({id: profile.Id, desc: profile.Description});
				});
				return itemSource;
			}),
		);
	}

	private setupControls(excelProfile: IExcelProfile, exportOptions?: ExportOptions & ExportOptionsEx) {
		if (exportOptions) {
			exportOptions.exportFormat = this.profileContextMap[excelProfile.Id] || this.profileContextMap[excelProfile.ProfileContext] || ProfileContext.FreeExcel;
			exportOptions.justifyPropertyNamesVisible = excelProfile.ProfileContext === 'General';
		}
	}

	private createImportFile(exportOptions: ExportOptions & ExportOptionsEx) {
		const grid = this.gridApi.get(exportOptions.mainContainer.gridId);
		if (grid) {
			//var gridColumns = angular.copy(exportOptions.ExcelProfileId > 3 ? gridConfig.current : gridConfig.visible);

			const gridColumns = cloneDeep(grid.columns);

			if (gridColumns.length > 0 && gridColumns[0].id === 'Indicator') {
				gridColumns.splice(0, 1);
			}

			exportOptions.mainContainer.selectedColumns = lodashMap(gridColumns, 'id');
			// TODO: is model the same as field?
			exportOptions.mainContainer.internalFieldNames = lodashMap(gridColumns, 'model') as string[];
			exportOptions.mainContainer.columnLabels = [];
			gridColumns.forEach((column) => {
				exportOptions.mainContainer.columnLabels?.push((column as unknown as Record<string, string>)['userLabelName'] ?? this.translateService.instant(column.label ?? column.id).text);
			});
			// TODO: module specify logic
			// if (exportOptions.moduleName === 'procurement.invoice') {
			// 	if (exportOptions.subContainers) {
			// 		exportOptions.subContainers.forEach((subContainer) => {
			// 			if (subContainer.gridId) {
			// 				if (subContainer.selected) {
			// 					const grid = this.gridApi.get(subContainer.uuid ?? '');
			// 					//var gridColumns = angular.copy(exportOptions.ExcelProfileId > 3 ? gridConfig.current : gridConfig.visible);
			// 					const gridColumns = cloneDeep(grid.columns);
			// 					if (gridColumns.length > 0 && gridColumns[0].id === 'Indicator') {
			// 						gridColumns.splice(0, 1);
			// 					}
			//
			// 					subContainer.selectedColumns = lodashMap(gridColumns, 'Id');
			// 					// TODO: is model the same as field?
			// 					subContainer.internalFieldNames = lodashMap(gridColumns, 'model') as string[];
			// 					subContainer.columnLabels = [];
			// 					gridColumns.forEach((column) => {
			// 						subContainer.columnLabels?.push((column as unknown as Record<string, string>)['userLabelName'] ?? this.translateService.instant(column.label ?? column.id).text);
			// 					});
			// 				}
			// 			}
			// 		});
			// 	}
			// }
		}

		return this.http.post(this.configService.webApiBaseUrl + 'basics/export/list', exportOptions, { observe: 'response', responseType: 'text' });
	}
}
