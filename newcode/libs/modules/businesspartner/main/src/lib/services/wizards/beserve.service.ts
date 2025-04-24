import {inject, Injectable} from '@angular/core';
import {
	PlatformConfigurationService,
	PlatformPermissionService,
	PlatformTranslateService,
	ServiceLocator
} from '@libs/platform/common';
import {
	FieldType,
	GridStep,
	ICustomDialogOptions,
	IGridConfiguration,
	MultistepDialog,
	MultistepTitleFormat,
	StandardDialogButtonId,
	UiCommonDialogService,
	UiCommonMessageBoxService,
	UiCommonMultistepDialogService
} from '@libs/ui/common';
import {BusinesspartnerMainBeserveAddDialogComponent} from '../../components/beserve/beserve-add-dialog.component';
import {BESERVE_DATA_TOKEN} from '../../model/beserve/beserve-data.model';
import {IBusinessPartnerEntity} from '@libs/businesspartner/interfaces';
import {filter, find, forEach, isArray, isString} from 'lodash';
import {BusinesspartnerMainHeaderDataService} from '../businesspartner-data.service';
import {HttpClient} from '@angular/common/http';
import {IBeserveUpdateAddressResultEntity} from '../../model/beserve/beserve-update-address-result-entity.interface';
import {IBeserveUpdateAddressDataEntity} from '../../model/beserve/beserve-update-address-data-entity.interface';
import {IBeserveUpdateAndResultUiData} from '../../model/beserve/beserve-update-and-result-ui-data.interface';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainBeserveService {
	private readonly crefoPermissionDescriptorAddUpdateSingle = 'db75fac8500a42e185261eaf95ae946e';
	private readonly crefoPermissionDescriptorUpdateMultiple = '55d7d07357f34cf18fb7b9d87b5e2181';
	private hasAddUpdateSingle = false;
	private hasUpdateMultiple = false;

	private readonly translateService = inject(PlatformTranslateService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly permissionService = inject(PlatformPermissionService);
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly crefoBaseUrl = this.configService.webApiBaseUrl + 'businesspartner/main/beserve/';
	private readonly appctxtoken = 'bp.crefofilter'; // token for save/read application context data

	// todo chi: for update dialog, white board is not ready. noresult, idle: $translate.instant('businesspartner.main.crefoupdatedlg.idle'),

	public constructor() {
		this.loadPermissions();
	}

	public async showAddDialog() {
		const modalOptions: ICustomDialogOptions<StandardDialogButtonId, BusinesspartnerMainBeserveAddDialogComponent> = {
			headerText: this.translateService.instant({key: 'businesspartner.main.crefodlg.title'}).text,
			width: '50%',
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: {key: 'cloud.common.apply'},
					isDisabled: (info) => {
						return !info.dialog.body.onCanApply();
					},
					fn(evt, info) {
						info.dialog.body.onOk();
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: {key: 'ui.common.dialog.cancelBtn'},
				}
			],
			resizeable: true,
			showCloseButton: true,
			bodyComponent: BusinesspartnerMainBeserveAddDialogComponent,
			bodyProviders: [
				{
					provide: BESERVE_DATA_TOKEN,
					useValue: {
						crefoBaseUrl: this.crefoBaseUrl,
						appctxtoken: this.appctxtoken
					}
				},
			]
		};

		await this.dialogService.show(modalOptions);
	}

	public async showUpdateSingleSelectionDialog() {
		return this.updateBusinessPartner(true);
	}

	public async showUpdateAllDialog() {
		return this.updateBusinessPartner(false);
	}

	// todo chi: the values need to use in wizard hidden but now the framework does not provide such kind of feature
	private loadPermissions() {
		this.hasAddUpdateSingle = this.permissionService.has(this.crefoPermissionDescriptorAddUpdateSingle, this.permissionService.permissionsFromString('e'));
		this.hasUpdateMultiple = this.permissionService.has(this.crefoPermissionDescriptorUpdateMultiple, this.permissionService.permissionsFromString('e'));
	}

	private async updateBusinessPartner(singleSelection: boolean) {// jshint ignore:line
		let selectedItems: IBusinessPartnerEntity[] | null;
		let dialogheight = '500px';
		let beDirectItems: IBusinessPartnerEntity[] | null = null;
		const bpService = ServiceLocator.injector.get(BusinesspartnerMainHeaderDataService);
		const messageBoxService = ServiceLocator.injector.get(UiCommonMessageBoxService);
		const multiStepService = ServiceLocator.injector.get(UiCommonMultistepDialogService);
		const http = ServiceLocator.injector.get(HttpClient);

		if (singleSelection) {
			const item = bpService.getSelectedEntity();
			selectedItems = item ? [item] : null;
			dialogheight = '300px'; // smaller if only one item it there
		} else {
			selectedItems = bpService.getList();
		}

		if (selectedItems) {
			beDirectItems = filter(selectedItems, function (item) {
				return (isString(item.BedirektNo) && item.BedirektNo.length > 0);
			});
		}
		if (!beDirectItems || beDirectItems.length === 0) {
			return messageBoxService.showMsgBox('businesspartner.main.crefoupdatedlg.nobpsfound', 'businesspartner.main.crefoupdatedlg.updatetitle', 'info');
		}

		const updateData = {
			itemsToUpdate: <IBeserveUpdateAndResultUiData[]> [],
			result: <IBeserveUpdateAddressResultEntity | null> null,
			itemsUpdated: <IBeserveUpdateAndResultUiData[]> []
		};

		forEach(beDirectItems, (item) => {
			updateData.itemsToUpdate.push({
				id: item.Id, update: false, name: item.BusinessPartnerName1, bedirectno: item.BedirektNo,
				crefono: item.CrefoNo,
				address: item.SubsidiaryDescriptor?.AddressDto?.AddressLine ?? null
			});
		});

		const updateGridConfig: IGridConfiguration<IBeserveUpdateAndResultUiData> = {
			uuid: 'bf8d287f47744a5388a7bab0b449a8b7',
			skipPermissionCheck: true,
			idProperty: 'id',
			columns: [
				{
					id: 'update', model: 'update', label: 'businesspartner.main.crefodlg.gridcolupdate',
					type: FieldType.Boolean,
					pinned: true, width: 60, sortable: false, visible: true
				},
				{
					id: 'name', model: 'name', label: 'businesspartner.main.crefodlg.gridcolname',
					type: FieldType.Description, width: 300, sortable: true, visible: true, readonly: true
				},
				{
					id: 'address', model: 'address', label: 'businesspartner.main.crefodlg.gridcoladdress',
					type: FieldType.Description, width: 300, sortable: true, visible: true, readonly: true
				},
				{
					id: 'bedirectno', model: 'bedirectno', label: 'businesspartner.main.crefodlg.gridcolbedirectno',
					type: FieldType.Description, width: 100, sortable: true, visible: true, readonly: true
				},
				{
					id: 'crefono', model: 'crefono', label: 'businesspartner.main.crefodlg.gridcolcrefono',
					type: FieldType.Description, width: 100, sortable: true, visible: true, readonly: true
				}
			],
		};

		const resultGridConfig: IGridConfiguration<IBeserveUpdateAndResultUiData> = {
			uuid: 'bf8d287f47744a5388a7bab0b449a8b8',
			skipPermissionCheck: true,
			idProperty: 'id',
			columns: [
				{
					id: 'resulttype', model: 'resulttype', label: 'businesspartner.main.crefodlg.gridcolstatus',
					type: FieldType.Description,
					// todo chi: the framework is not ready, do formatter later
					// formatter: 'image', formatterOptions: {imageSelector: 'businesspartnerMainBeserveAddIconService', tooltip: true},
					readonly: true, width: 35, sortable: true, cssClass: 'text-center', visible: true
				},
				{
					id: 'name', model: 'name', label: 'businesspartner.main.crefodlg.gridcolname',
					type: FieldType.Description, readonly: true, width: 300, sortable: true, visible: true
				},
				{
					id: 'address', model: 'address', label: 'businesspartner.main.crefodlg.gridcoladdress',
					type: FieldType.Description, width: 200, sortable: true, visible: true, readonly: true
				},
				{
					id: 'phone', model: 'phone', label: 'businesspartner.main.crefodlg.gridcolphone',
					type: FieldType.Description, width: 100, sortable: true, visible: true, readonly: true
				},
				{
					id: 'fax', model: 'fax', label: 'businesspartner.main.crefodlg.gridcolfax',
					type: FieldType.Description, width: 100, sortable: true, visible: true, readonly: true
				},
				{
					id: 'updateinfo', model: 'updateinfo', label: 'businesspartner.main.crefodlg.gridcolupdateinfo',
					type: FieldType.Description, width: 200, sortable: true, visible: true, readonly: true
				}
			],
		};

		const updateSetting = new GridStep('update', 'businesspartner.main.crefoupdatedlg.title', updateGridConfig, 'itemsToUpdate');
		updateSetting.bottomDescription = 'businesspartner.main.crefoupdatedlg.paymenthint';

		const resultSetting = new GridStep('result', 'businesspartner.main.creforesultdlg.title', resultGridConfig, 'itemsUpdated');
		const multistepDialog = new MultistepDialog(updateData, [
			updateSetting, resultSetting
		]);

		multistepDialog.titleFormat = MultistepTitleFormat.StepTitle;
		multistepDialog.dialogOptions.width = '900px';
		multistepDialog.dialogOptions.height = dialogheight;
		multistepDialog.hideDisplayOfNextStep = true;
		multistepDialog.hideIndicators = true;
		multistepDialog.dialogOptions.buttons = [
			{
				id: 'synchronize',
				caption: 'businesspartner.main.crefoupdatedlg.syncbutton',
				isVisible: (info) => {
					return info.dialog.value?.stepIndex === 0;
				},
				isDisabled: (info) => {
					return !this.hasSelectedItems(info.dialog.value?.dataItem.itemsToUpdate || []);
				},
				fn: async (event, info) => {
					const selectedItems = this.getSelectedItems(info.dialog.value?.dataItem.itemsToUpdate || []);
					if (!selectedItems) {
						return;
					}
					const dialogResult = await messageBoxService.showYesNoDialog(this.translateService.instant('businesspartner.main.crefoupdatedlg.confirmupdatebodytext').text,
						this.translateService.instant('businesspartner.main.crefoupdatedlg.updatetitle').text);
					if (dialogResult?.closingButtonId === StandardDialogButtonId.Yes) {
						updateSetting.loadingMessage = 'businesspartner.main.crefoupdatedlg.syncrunning'; // todo chi: right?
						const bpIds: number[] = [];
						forEach(selectedItems, function (n) {
							bpIds.push(n.id);
						});

						http.post<IBeserveUpdateAddressResultEntity>(
							this.crefoBaseUrl + 'updateaddress',
							bpIds
						).subscribe({
							next: (data) => {
								updateSetting.loadingMessage = undefined;
								updateData.result = data;
								if (updateData.result?.resultdata) {
									forEach(updateData.result.resultdata, (item) => {
										updateData.itemsUpdated.push({
											id: item.bpid,
											resulttype: item.beserveupdatestatus,
											name: item.newname,
											address: item.newaddress,
											phone: item.newphone,
											fax: item.newfax,
											updateinfo: item.updateinfo
										});
									});
								}
								info.dialog.value?.goToNext();
							},
							error: () => {
								updateSetting.loadingMessage = undefined;
								info.dialog.close(StandardDialogButtonId.Cancel);
							}
						});
					}
				}
			},
			{
				id: StandardDialogButtonId.Ok,
				isVisible: (info) => {
					return info.dialog.value?.stepIndex === 1;
				},
				isDisabled: () => {
					return false;
				},
				fn: async (event, info) => {
					if (isArray(updateData.result?.resultdata) && updateData.result?.resultdata?.length && updateData.result?.resultdata?.length > 0) {
						await this.askNavigateToBizPartnersDialog(updateData.result?.resultdata);
					}
					info.dialog.close(StandardDialogButtonId.Ok);
				}
			},
			{
				id: StandardDialogButtonId.Cancel,
				caption: {key: 'basics.common.button.cancel'},
				isVisible: (info) => {
					return info.dialog.value?.stepIndex === 0;
				},
				autoClose: true
			}
		];

		const result = await multiStepService.showDialog(multistepDialog);
		return result?.value;
	}

	private getSelectedItems(datalist: IBeserveUpdateAndResultUiData[]) {

		const selectedItems = filter(datalist, (item) => {
			return !!item.update;
		});
		return (selectedItems.length > 0) ? selectedItems : null;
	}

	private hasSelectedItems(datalist: IBeserveUpdateAndResultUiData[]) {
		const found = find(datalist, function (item) {
			return !!item.update;
		});
		return !!found;
	}

	private askNavigateToBizPartnersDialog(bizPartners: IBeserveUpdateAddressDataEntity[]) {
		const messageBoxService = ServiceLocator.injector.get(UiCommonMessageBoxService);
		const bodytext = this.translateService.instant('businesspartner.main.creforesultdlg.navigatetobpstitlebody').text;

		return messageBoxService.showYesNoDialog({
			headerText: this.translateService.instant('businesspartner.main.creforesultdlg.navigatetobpstitle').text,
			bodyText: bodytext,
			defaultButtonId: StandardDialogButtonId.Yes
		})?.then((result) => {
			if (result.closingButtonId === StandardDialogButtonId.Yes) {
				this.navigateToBusinessPartners(bizPartners);
				return true;
			}
			return false;
		});
	}

	private navigateToBusinessPartners(items: IBeserveUpdateAddressDataEntity[]) {
		const bpIds: number[] = [];
		filter(items, function (n) {
			if (n.bpid && n.bpid !== 0) {
				bpIds.push(n.bpid);
			}
		});
		if (bpIds && bpIds.length > 0) {
			// TODO : once cloudDesktopSidebarService service is implemented then used below code
			// cloudDesktopSidebarService.filterSearchFromPKeys(bpIds);
		}
	}
}