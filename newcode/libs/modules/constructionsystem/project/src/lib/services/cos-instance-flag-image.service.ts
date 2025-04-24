import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';

@Injectable({ providedIn: 'root' })
export class ConstructionSystemProjectCosInstanceFlagImageService {
	private readonly configurationService = inject(PlatformConfigurationService);
	public getImage(flag: number) {
		let icon = '';
		switch (flag) {
			case 1:
				icon = 'status25';
				break;
			case 2:
				icon = 'status01';
				break;
			case 3:
				icon = 'status02';
				break;
			case 4:
				icon = 'status45';
				break;
			case 5:
				icon = 'status44';
				break;
			case 6:
				icon = 'status03';
				break;
			case 7:
				icon = 'status25';
				break;
			case 8:
				icon = 'status01';
				break;
		}
		return this.configurationService.appBaseUrl + '/cloud.style/content/images/status-icons.svg#ico-' + icon;
	}
}