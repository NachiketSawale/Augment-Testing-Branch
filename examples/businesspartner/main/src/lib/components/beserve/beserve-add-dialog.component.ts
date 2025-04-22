import {Component, ElementRef, Inject, inject} from '@angular/core';
import {IBeserveSearchResultEntity} from '../../model/beserve/beserve-search-result-entity.interface';
import {IBeserveSearchResultDataEntity} from '../../model/beserve/beserve-search-result-data-entity.interface';
import {find, forEach, isObject, isString, isArray} from 'lodash';
import { isAppContextValObject, isAppContextValString, PlatformConfigurationService, PlatformTranslateService} from '@libs/platform/common';
import {
	ColumnDef,
	FieldType,
	getCustomDialogDataToken, IGridConfiguration, IMenuItemsList, ItemType,
	StandardDialogButtonId,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import {HttpClient} from '@angular/common/http';
import {BESERVE_DATA_TOKEN, IBeserveData} from '../../model/beserve/beserve-data.model';
import {lastValueFrom} from 'rxjs';
import {
	IBeservePurchaseAddressResultEntity
} from '../../model/beserve/beserve-purchase-address-result-entity.interface';
import {IBeserveBusinessPartnerDataEntity} from '../../model/beserve/beserve-business-partner-data-entity.interface';
import {EntityContainerCommand} from '@libs/ui/business-base';
import {ICrefoOption} from '../../model/beserve/crefo-option.interface';
import {CrefoSearchParams} from '../../model/beserve/crefo-search-params.class';

@Component({
	selector: 'businesspartner-main-beserve-add-dialog',
	templateUrl: './beserve-add-dialog.component.html',
	styleUrls: ['./beserve-add-dialog.component.scss']
})
export class BusinesspartnerMainBeserveAddDialogComponent {

	private readonly translateService = inject(PlatformTranslateService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);
	private lastResponseData: IBeserveSearchResultEntity | null = null;
	private lastSearchfilter: (string | { [x: string]: string } | null | undefined) | null | undefined = null; // => move to component
	private readonly historicalBedirectNo = 100000000;
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected searchResult: IBeserveSearchResultDataEntity[];
	private hostElement = inject(ElementRef);
	public configuration!: IGridConfiguration<IBeserveSearchResultDataEntity>;

	public crefoOption: ICrefoOption;

	private readonly columns: ColumnDef<IBeserveSearchResultDataEntity>[];

	private readonly dialogWrapper = inject(getCustomDialogDataToken<StandardDialogButtonId, BusinesspartnerMainBeserveAddDialogComponent>());

	public constructor(@Inject(BESERVE_DATA_TOKEN) public beserveData: IBeserveData) {
		this.searchResult = [];
		this.crefoOption = {
			loading: false,
			searchParams: new CrefoSearchParams(),
			keepfilter: isObject(this.getLastSearchfilter()),
			selectedItemId: <number | null> null,
			noresult: true,
			resultMessage: <string | null> null,
			searchStarted: '',
			searchIdle: this.translateService.instant('businesspartner.main.crefodlg.searchidle').text,
			keepFilterChkLabel: this.translateService.instant('businesspartner.main.crefodlg.keepfilter').text
		};
		this.columns = [
			{
				id: 'resulttype', model: 'resulttype', label: 'businesspartner.main.crefodlg.gridcolstatus',
				type: FieldType.Description,
				// todo chi: the framework is not ready, do formatter later
				// formatter: 'image', formatterOptions: {imageSelector: 'businesspartnerMainBeserveAddIconService', tooltip: true},
				readonly: true, width: 35, sortable: true, cssClass: 'text-center', visible: true
			},
			{
				id: 'companyname', model: 'companyname', label: 'businesspartner.main.crefodlg.gridcolname',
				type: FieldType.Description, width: 170, sortable: true, visible: true, readonly: true
			},
			{
				id: 'zipcode', model: 'zipcode', label: 'businesspartner.main.crefodlg.gridcolzipcode',
				type: FieldType.Description, width: 50, sortable: true, visible: true, readonly: true
			},
			{
				id: 'location', model: 'location', label: 'businesspartner.main.crefodlg.gridcollocation',
				type: FieldType.Description, width: 100, sortable: true, readonly: true
			},
			{
				id: 'address', model: 'address', label: 'businesspartner.main.crefodlg.gridcoladdress',
				type: FieldType.Description, width: 180, sortable: true, visible: true, readonly: true
			},
			{
				id: 'phonecomplete', model: 'phonecomplete', label: 'businesspartner.main.crefodlg.gridcolphone',
				type: FieldType.Description, width: 80, sortable: true, visible: true, readonly: true
			},
			{
				id: 'bedirectno', model: 'bedirectno', label: 'businesspartner.main.crefodlg.gridcolbedirectno',
				type: FieldType.Description, width: 70, sortable: true, visible: true, readonly: true
			},
			{
				id: 'crefono', model: 'crefono', label: 'businesspartner.main.crefodlg.gridcolcrefono',
				type: FieldType.Description, width: 70, sortable: true, visible: true, readonly: true
			},
			{
				id: 'score', model: 'score', label: 'businesspartner.main.crefodlg.gridcolscore',
				type: FieldType.Description, width: 40, sortable: true, visible: true, readonly: true
			},
		];

		this.updateGrid();
	}

	protected recordCount() {
		if (this.searchResult && this.searchResult.length > 0) {
			return ' (' + this.searchResult.length + ')';
		}
		return '';
	}

	public get tools(): IMenuItemsList {
		return {
			cssClass: 'tools',
			items: [
				{
					caption: { key: 'cloud.common.exportClipboard' },
					groupId: 'dropdown-btn-t199',
					iconClass: 'tlb-icons ico-clipboard',
					id: EntityContainerCommand.Clipboard,
					sort: 200,
					type: ItemType.DropdownBtn,
					list: {
						cssClass: 'dropdown-menu-right',
						showImages: false,
						showTitles: true,
						items: [
							{
								caption: { key: 'cloud.common.exportArea' },
								id: EntityContainerCommand.CopyCellArea,
								sort: 100,
								type: ItemType.Item,
								fn: () => {
									throw new Error('This method is not implemented');
								},
							},
							{
								caption: { key: 'cloud.common.exportCopy' },
								id: EntityContainerCommand.Copy,
								sort: 200,
								type: ItemType.Item,
								fn: () => {
									throw new Error('This method is not implemented');
								},
							},
							{
								id: EntityContainerCommand.ExportOptions,
								type: ItemType.Sublist,
								sort: 400,
								list: {
									items: [
										{
											caption: { key: 'cloud.common.exportWithHeader' },
											id: EntityContainerCommand.CopyWithHeader,
											sort: 100,
											type: ItemType.Item,
											fn: () => {
												throw new Error('This method is not implemented');
											},
										}
									]
								}
							}
						]
					}
				}
			]
		};
	}

	protected onSearch() {
		if (this.crefoOption.loading) {
			return;
		}
		console.log('onSearch started...');

		// platformGridAPI.grids.commitEdit($scope.gridId);
		this.setFocusToExecuteSearch();

		this.setLoadingText(1);
		// console.log('onSearch() ', $scope.crefoOption.searchParams);
		this.crefoSearch(this.crefoOption.searchParams);

		if (this.crefoOption.keepfilter) {
			this.setLastSearchfilter(JSON.stringify(this.crefoOption.searchParams));
		} else {
			this.clearCrefoFilter();
		}
	}

	protected onClear() {
		// console.log('Clear search pattern ...');
		this.setFocusToOnStartSearch();
		this.crefoOption.searchParams.clear();
		this.searchResult = [];
		this.updateGrid();
	}

	public onOk() {

		const selectedItem = this.getSelectItemById(this.crefoOption.selectedItemId ?? 0);
		if (selectedItem) {
			if (selectedItem.resulttype === 2 /* assigned */) {
				this.askNavigateDialog(selectedItem)?.then((result) => {
					this.closeDialogIfTrue(result);
				});
			} else {
				this.setLoadingText(2);
				this.crefoBuySelectedItem(selectedItem, (flag: boolean) => {
					this.crefoOption.loading = flag;
				})?.then((result) =>  {
					this.closeDialogIfTrue(result || false);
				});
			}
		}
	}

	public onCancel() {
		this.resetService();
		this.dialogWrapper.close(StandardDialogButtonId.Cancel);
	}

	public onCanApply() {
		return this.crefoOption.selectedItemId && this.crefoOption.selectedItemId > 0;
	}

	public crefoSearch(param: CrefoSearchParams) {
		this.searchResult = [];
		this.updateGrid();
		this.crefoOption.loading = true;
		this.crefoOption.noresult = false;
		this.crefoOption.resultMessage = null;
		this.crefoReadbySearch(param).then((response) => {
			this.crefoOption.loading = false;
			/** @namespace response.resultcode */
			// noinspection JSValidateTypes
			if (response.resultcode === 200) {
				const data = response.resultdata;
				let id = 1;
				if (isArray(data)) {
					forEach(data, function (item) {
						item.id = id++;
					});
					this.searchResult = data;
				}
				this.updateGrid();
			} else {
				/** @namespace response.resultmessage */
				this.crefoOption.resultMessage = this.translateService.instant('businesspartner.main.crefodlg.searcherrormsg', {
					code: response.resultcode,
					msg: response.resultmessage
				}).text;
			}

		}, (/* reason */) => {
			// console.log('crefoReadbySearch failed', reason);
			this.crefoOption.loading = false;
		});

		return true;
	}

	protected onSelectedRowsChanged(selectedItems: IBeserveSearchResultDataEntity[]) {
		if (selectedItems.length === 0) {
			return;
		}
		const selectedItem = selectedItems[0];
		this.crefoOption.selectedItemId = selectedItem.id;
	}

	// todo chi: how to do this selection change event, now there is no such event in grid-host.component
	protected onGridDblClick() {// jshint ignore:line
		this.onOk();
	}

	private setFocusToOnStartSearch() {
		// must run in new digest cycle, otherwise focus not working, we delay it slightly to be sure focus
		// move to this input field
		setTimeout(() => {
			const element = this.hostElement.nativeElement.querySelector('#onCrefoStartFocus');

			if (element) {
				element.focus();
			}
		}, 500);
	}

	private setFocusToExecuteSearch() {
		// move to this input field
		const element = this.hostElement.nativeElement.querySelector('#onExecuteStartFocus');

		if (element) {
			element.focus();
		}
	}

	private updateGrid() {
		this.crefoOption.noresult = this.searchResult.length === 0;
		this.configuration = {
			uuid: 'bf8d287f47744a5388a7bab0b449a8b6',
			columns: this.columns,
			skipPermissionCheck: true,
			items: [...this.searchResult],
			enableColumnReorder: false,
			enableCopyPasteExcel: true,
			idProperty: 'id'
		};
	}

	private setLoadingText(flag: number) {
		const loadingTexts: { [key: number]: string } = {
			1: 'businesspartner.main.crefodlg.searchloading',
			2: 'businesspartner.main.crefodlg.takeoverloading',
			3: 'businesspartner.main.crefodlg.takeoverorcreatennewloading'
		};

		const translationKey = loadingTexts[flag];
		this.crefoOption.searchStarted = translationKey ? this.translateService.instant(translationKey).text : '';
	}

	private closeDialogIfTrue(flag: boolean) {
		if (flag) {
			this.dialogWrapper.close(StandardDialogButtonId.Ok);
		}
	}

	private validateCrefoBuyRequest(currentItem: IBeserveSearchResultDataEntity) {
		const result: {valid: boolean, target: IBeserveSearchResultDataEntity | null, assigned: boolean} = {valid: true, target: null, assigned: false};
		if (currentItem.resulttype !== 3 /* historical */) {
			return result;
		}

		const bedirectNo = currentItem.bedirectno ? +currentItem.bedirectno : 0;
		const nonHistoricalBedirectNo = bedirectNo - this.historicalBedirectNo;
		if (this.lastResponseData?.resultdata) {
			forEach(this.lastResponseData.resultdata, function (crefoRecord) {
				if (bedirectNo === nonHistoricalBedirectNo) {// string == int
					result.target = crefoRecord;
					result.valid = false;
				}
			});
		}
		return result;
	}

	private formatAddress(selectedItem: IBeserveSearchResultDataEntity) {
		return this.translateService.instant('businesspartner.main.crefodlg.formattedAddressTemplate',
			{
				name: selectedItem.companyname,
				zipcode: selectedItem.zipcode,
				address: selectedItem.address,
				bedirectno: selectedItem.bedirectno
			}).text;
	}

	private getSelectItemById(selectedItemId: number) {
		if (selectedItemId <= 0 || !this.lastResponseData?.resultdata) {
			return null;
		}
		return this.lastResponseData.resultdata.find(e => e.id === selectedItemId);
	}

	private purchase(bindtoexistingbpd: boolean | null, selectedItem: IBeserveSearchResultDataEntity, setLoadingCallback: (isLoading: boolean) => void) {
		setLoadingCallback(true);
		selectedItem.bindtoexistingbpd = bindtoexistingbpd;
		return this.crefoPurchaseAddress(selectedItem).then((buyResult) => {
			setLoadingCallback(false);
			if (buyResult.resultdata?.bpid) {
				this.navigateToBusinessPartner({bpid: buyResult.resultdata.bpid});
			}
			return true;
		}, function error() {
			return false;
		});
	}

	private userDialogAndBuyItem(bodytext: string, selectedItem: IBeserveSearchResultDataEntity, setLoadingCallback: (isLoading: boolean) => void, askDuplete?: boolean, bodytextBindWithBpd?: string) {

		// noinspection JSCheckFunctionSignatures,UnnecessaryLocalVariableJS
		return this.messageBoxService.showYesNoDialog({
			headerText: this.translateService.instant('businesspartner.main.crefodlg.buydialogtitle').text,
			bodyText: bodytext,
			defaultButtonId: StandardDialogButtonId.Yes
		})?.then((result) => {
			if (result.closingButtonId === StandardDialogButtonId.Yes) {
				if (askDuplete) {
					return this.messageBoxService.showYesNoDialog({
						headerText: this.translateService.instant('businesspartner.main.crefodlg.bindbpddialogtitle').text,
						bodyText: bodytextBindWithBpd,
						defaultButtonId: StandardDialogButtonId.Yes
					})?.then(() => {
						return this.purchase(true, selectedItem, setLoadingCallback); // bindtoexistingbpd=true
					});
				} else {
					return this.purchase(null, selectedItem, setLoadingCallback);
				}
			}
			return false;
		});
	}

	private crefoBuySelectedItem(selectedItem: IBeserveSearchResultDataEntity, setLoadingCallback: (isLoading: boolean) => void) {
		if (selectedItem.resulttype === 2 /* validAssigned */) {
			return Promise.resolve(false);
		}

		const addressInfo = this.formatAddress(selectedItem);
		let newaddressInfo: string | null = null;
		let bodytext: string | null = null;

		if (selectedItem.resulttype === 1 || selectedItem.resulttype === 5 /* valid */) {
			// display Dialog
			// bodytext = $translate.instant('businesspartner.main.crefodlg.buydialogtakeaddress', {address: addressInfo});
			bodytext = this.translateService.instant('businesspartner.main.crefodlg.buydialogtakeaddress', {address: addressInfo}).text;
			let askDuplete = false;
			let bodytextBindWithBpd;
			if (selectedItem.resulttype === 5) {
				askDuplete = true;
				bodytextBindWithBpd = this.translateService.instant('businesspartner.main.crefodlg.buydialognotbindwithexistingbpd', {address: addressInfo}).text;
			}
			return this.userDialogAndBuyItem(bodytext, selectedItem, setLoadingCallback, askDuplete, bodytextBindWithBpd);
		}

		if (selectedItem.resulttype === 3 /* historical */ || selectedItem.resulttype === 4/* 4 historicalassigned */) {
			const checkResult = this.validateCrefoBuyRequest(selectedItem);
			if (checkResult.target) {
				newaddressInfo = this.formatAddress(checkResult.target);
				if (checkResult.target.resulttype === 1 /* valid */) {
					bodytext = this.translateService.instant('businesspartner.main.crefodlg.buydialogtakealternateaddress', {
						address: addressInfo,
						newaddress: newaddressInfo
					}).text;
					return this.userDialogAndBuyItem(bodytext, checkResult.target, setLoadingCallback);
				} else {
					bodytext = this.translateService.instant('businesspartner.main.crefodlg.buydialogalreadyassignedwithnavigate', {
						address: addressInfo,
						newaddress: newaddressInfo
					}).text;
					// noinspection JSCheckFunctionSignatures

					return this.messageBoxService.showYesNoDialog({
						headerText: this.translateService.instant('businesspartner.main.crefodlg.buydialogtitle').text,
						bodyText: bodytext,
						defaultButtonId: StandardDialogButtonId.Yes
					})?.then((result) => {
						if (result.closingButtonId === StandardDialogButtonId.Yes) {
							if (checkResult.target) {
								this.navigateToBusinessPartner(checkResult.target);
							}
							return true;
						}
						return false;
					});
				}
			} else { // target=null, no fallback address available, we cannot buy this address
				bodytext = this.translateService.instant('businesspartner.main.crefodlg.buydialognofallbackaddress', {address: addressInfo}).text;
				return this.messageBoxService.showYesNoDialog({
					headerText: this.translateService.instant('businesspartner.main.crefodlg.buydialogtitle').text,
					bodyText: bodytext,
					defaultButtonId: StandardDialogButtonId.Cancel,
					buttons: [{id: StandardDialogButtonId.Cancel}],

				})?.then(() => {
					return false;
				});
			}
		}

		return Promise.resolve(false);
	}

	private askNavigateDialog(targetbp: IBeserveSearchResultDataEntity) {

		const theAddress = this.formatAddress(targetbp);
		const bodytext = this.translateService.instant('businesspartner.main.crefodlg.buydialogalnavigatebody', {address: theAddress}).text;

		return this.messageBoxService.showYesNoDialog({
			headerText: this.translateService.instant('businesspartner.main.crefodlg.buydialogalnavigatetitle').text,
			bodyText: bodytext,
			defaultButtonId: StandardDialogButtonId.Yes
		})?.then((result) => {
			if (result.closingButtonId === StandardDialogButtonId.Yes) {
				this.navigateToBusinessPartner(targetbp);
				return true;
			}
			return false;
		});
	}

	private resetService() {
		this.lastResponseData = null;
	}

	private getLastSearchfilter() {
		if (this.lastSearchfilter === null) {
			const searchFiterVal = this.configService.getApplicationValue(this.beserveData.appctxtoken);
			if(isAppContextValString(searchFiterVal) || isAppContextValObject(searchFiterVal)) {
				this.lastSearchfilter = searchFiterVal;
				if (!isObject(this.lastSearchfilter)) {
					this.lastSearchfilter = null;
				}
			}
		}
		return this.lastSearchfilter;
	}

	private setLastSearchfilter(para: string) {
		this.lastSearchfilter = para;

		this.configService.setApplicationValue(this.beserveData.appctxtoken, para, true);
		// todo chi: function saveContextToLocalStorage is private now
		// this.configService.saveContextToLocalStorage();
	}

	private clearCrefoFilter() {
		this.lastSearchfilter = null;

		this.configService.removeApplicationValue(this.beserveData.appctxtoken);
		// todo chi: function saveContextToLocalStorage is private now
		// this.configService.saveContextToLocalStorage();

	}

	private navigateToBusinessPartner(item: IBeserveBusinessPartnerDataEntity) {
		const bpId = item.bpid;
		if (bpId && bpId !== 0) {
			// TODO : once cloudDesktopSidebarService service is implemented then used below code
			// cloudDesktopSidebarService.filterSearchFromPKeys([bpId]);
		}
	}

	private async crefoReadbySearch(searchParams: CrefoSearchParams) {
		const responseData = await lastValueFrom(this.http.post<IBeserveSearchResultEntity>(
			this.beserveData.crefoBaseUrl + 'searchbyfilter',
			searchParams
		));
		this.lastResponseData = responseData;
		this.translateResponseData(this.lastResponseData);
		return responseData;
	}

	private crefoPurchaseAddress(targetItem: IBeserveSearchResultDataEntity): Promise<IBeservePurchaseAddressResultEntity> {

		return new Promise((resolve, reject) => {
			return this.http.post<IBeservePurchaseAddressResultEntity>(
				this.beserveData.crefoBaseUrl + 'purchaseaddress',
				targetItem
			).subscribe({
				next: (data) => {
					resolve(data);
				},
				error: (err) => {
					this.crefoOption.loading = false;
					reject(new Error(`An error occurred: ${err.message || err}`));
				}
			});
		});
	}

	private translateResponseData(lastresponseData: IBeserveSearchResultEntity) {
		if (lastresponseData?.resultdata && lastresponseData?.resultdata?.length > 0) {
			forEach(lastresponseData.resultdata, (item) => {
				if (!item.message) {
					return;
				}
				const messages = item.message.split('\n');
				let newMessage: string | null = null;
				forEach(messages, (msg) => {
					const regex = /%([a-zA-Z0-9_&]*)%/;
					const match = regex.exec(msg);
					if (match) {
						const modelName = match[1];
						const modelNames = modelName.split('&');
						let fieldTr: string | null = null;
						forEach(modelNames, (model) => {
							let field = null;
							switch (model) {
								case 'BusinessPartnerName1':
									field = 'companyname';
									break;
								case 'TelephonePattern':
									field = 'phonecomplete';
									break;
								case 'BedirektNo':
									field = 'bedirectno';
									break;
								case 'CrefoNo':
									field = 'crefono';
									break;
								case 'CustomerBranchFk':
									field = 'branchcode';
									break;
								case 'TelefaxPattern':
									field = 'faxcomplete';
									break;
								case 'Email':
									field = 'email';
									break;
								case 'Internet':
									field = 'interneturl';
									break;
								case 'VatNo':
									field = 'vatno';
									break;
								case 'TaxNo':
									field = 'taxnoused';
									break;
								case 'TradeRegister':
									field = 'traderegisterused';
									break;
								case 'TradeRegisterNo':
									field = 'traderegisternoused';
									break;
								default:
									break;
							}

							let tr = null;
							if (field) {
								const col = find(this.columns, {model: field});
								if (col && col.label && isString(col.label)) {
									tr = this.translateService.instant(col.label).text;
								}
							} else if (model === 'MatchCode') {
								tr = this.translateService.instant('businesspartner.main.matchCode').text;
							}

							if (tr) {
								if (fieldTr) {
									fieldTr += ' & ' + tr;
								} else {
									fieldTr = tr;
								}
							}
						});
						if (newMessage) {
							newMessage += '\n' + (fieldTr ? msg.replace(/%([a-zA-Z0-9_&]*)%/, fieldTr) : msg);
						} else {
							newMessage = fieldTr ? msg.replace(/%([a-zA-Z0-9_&]*)%/, fieldTr) : msg;
						}
					}
				});
				if (newMessage) {
					item.message = newMessage;
				}
			});
		}
	}
}

