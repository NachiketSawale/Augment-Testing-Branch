import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
	FieldType, ICustomDialogOptions,
	IFormConfig,
	StandardDialogButtonId, UiCommonDialogService,
	UiCommonFormDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import {
	BusinesspartnerMainConvertAddressToGeoCoordinateComponent
} from '../../components/convert-address-to-geo-coordinate/convert-address-to-geo-coordinate.component';

interface IMapSetting{
	ShowMapByDefault: boolean,
	MapProvider: string
}

@Injectable({
	providedIn: 'root'
})
export class ConvertAddressToGeoCoordinateService{
	private readonly bpMainDataService = inject(BusinesspartnerMainHeaderDataService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly dialog = inject(UiCommonDialogService);

	private mapSettingEntity:IMapSetting = {
		ShowMapByDefault: false,
		MapProvider: ''
	};

	private mapSettingFormConfig : IFormConfig<IMapSetting> = {
		formId: 'mapSetting',
		showGrouping: false,
		rows: [
			{
				id: 'ShowMapByDefault',
				label: {
					text: this.translateService.instant('basics.common.map.showDefault').text
				},
				type: FieldType.Boolean,
				model: 'ShowMapByDefault'
			},
			{
				id: 'MapProvider',
				label: {
					text: this.translateService.instant('basics.common.map.mapProvider').text
				},
				type: FieldType.Select,
				itemsSource: {
					items: [
						{
							displayName: 'baidu',
							id: 'baidu'
						},
						{
							displayName: 'bingv8',
							id: 'bingv8'
						},
						{
							displayName: 'google',
							id: 'google'
						},
						{
							displayName: 'openstreet',
							id: 'openstreet'
						}
					]
				},
				model: 'MapProvider'
			}
		]
	};

	public async onConvertAddressToGeoCoordinate(){
		const selectedBps = this.bpMainDataService.getSelection();
		if(!selectedBps || selectedBps.length < 1){
			this.dialogService.showMsgBox(this.translateService.instant('businesspartner.main.importContact.mustSelectBp').text, this.translateService.instant('basics.common.geographicLocationInfo.title').text, 'ico-info');
			return;
		}
		const ids = _.map(selectedBps, 'Id');
		const bpAddress = await this.bpMainDataService.getBusinessPartnerAddresses(ids);
		const modalOption : ICustomDialogOptions<StandardDialogButtonId, BusinesspartnerMainConvertAddressToGeoCoordinateComponent> = {
			headerText: this.translateService.instant('basics.common.geographicLocationInfo.title').text,
			bodyComponent: BusinesspartnerMainConvertAddressToGeoCoordinateComponent,
			bodyProviders: [
				{
					provide: 'listdata',
					useValue: bpAddress
				}
			],
			resizeable: true,
			maxWidth: '1200px',
			width: '800px',
			buttons: [
				{
					id: 'settings',
					caption: {key: 'basics.common.settings'},
					fn: async (event, info) => {
						const ret = await this.formDialogService.showDialog<IMapSetting>({
							id: 'updatePrcStructureFromQtnAndContract',
							headerText: this.translateService.instant('basics.common.map.mapSettings').text,
							formConfiguration: this.mapSettingFormConfig,
							entity: this.mapSettingEntity,
							customButtons: [

							]
						});
						if(ret?.closingButtonId === StandardDialogButtonId.Ok){
							this.mapSettingEntity = ret.value as IMapSetting;
						}
					}
				},
				{
					id: 'map',
					caption: {key: 'cloud.common.addressDialogMap'},
					fn: (event, info) => {
						const component = info.dialog.body;
						component.showMap = component.showMap === 'none' ? 'block' : 'none';
					}
				},
				{
					id: StandardDialogButtonId.Ok
				},
				{
					id: StandardDialogButtonId.Cancel
				}
			]
		};
		this.dialog.show(modalOption);
	}

}