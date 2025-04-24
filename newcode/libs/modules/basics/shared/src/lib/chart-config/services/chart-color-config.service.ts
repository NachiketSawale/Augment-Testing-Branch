import {isString} from 'lodash';
// import { PlatformCommonMainviewService} from '@libs/platform/common';

export const DEFAULT_COLOR: string = '3355443';

export class BasicsSharedChartColorConfigService {
	public constructor() {
	}

	public loadColorConfig() {
		// let viewData = colorProfileService.getCustomDataFromView($scope.modalOptions.uuid, $scope.viewDatakey);
		// if (viewData) {
		// 	viewData.Max ? $scope.maxValue = rgbToHex(viewData.Max) : '#000000';
		// 	viewData.Min ? $scope.minValue = rgbToHex(viewData.Min) : '#000000';
		// 	viewData.Avg ? $scope.avgValue = rgbToHex(viewData.Avg) : '#000000';
		// }
	}

	public parseDecToRgb(dec: string | number) {
		if (isString(dec) && dec.charAt(0) === '#') {
			dec = dec.substr(1);
		}
		const hex = dec.toString(16);
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		return r + ',' + g + ',' + b;
	}

	public rgbToHex(rgb: string) {
		if (rgb.charAt(0) === '#') {
			return rgb;
		}
		const ds = rgb.split(/\D+/);
		const decimal = Number(ds[0]) * 65536 + Number(ds[1]) * 256 + Number(ds[2]);
		return '#' + this.zeroFillHex(decimal, 6);
	}

	public zeroFillHex(num: number, digists: number) {
		let s = num.toString(16);
		while (s.length < digists) {
			s = '0' + s;
		}
		return s;
	}

	public getCustomDataFromView(guid: string, itemKey: string) {
		// let customData = PlatformCommonMainviewService.customData(guid, itemKey);
		// return customData;
		//TODO lack customData
	}

	public setCustomViewData(guid: string, key: string, value: object) {
		// PlatformCommonMainviewService.customData(guid, key, value);
		//TODO, lack customData
	}

	public setViewConfig(gridId: string, columnConfig: object) {
		// PlatformCommonMainviewService.setViewConfig(gridId, columnConfig, null, true);
		//TODO, lack setViewConfig
	}

}
