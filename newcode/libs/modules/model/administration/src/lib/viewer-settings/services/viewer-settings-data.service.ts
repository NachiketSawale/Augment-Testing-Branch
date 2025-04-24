/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IEntityProcessor, IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IViewerSettingsEntity } from '../model/entities/viewer-settings-entity.interface';
import { IModelAdministrationRootEntity } from '../../model/entities/model-administration-root-entity.interface';
import {
	IModelAdministrationCompleteEntity
} from '../../model/entities/model-administration-complete-entity.interface';
import { ModelAdministrationRootDataService } from '../../services/model-administration-root-data.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { ModelAdministrationViewerSettingsRuntimeService } from './viewer-settings-runtime.service';
import { ModelAdministrationViewerSettingsConfigService } from './viewer-settings-config.service';
import { IContainerUiAddOns } from '@libs/ui/container-system';
import { ItemType } from '@libs/ui/common';

/**
 * The data service for the viewer settings entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationViewerSettingsDataService
	extends DataServiceFlatLeaf<IViewerSettingsEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity> {

	public constructor() {
		super({
			apiUrl: 'model/administration/viewersettings',
			readInfo: {
				endPoint: 'all',
				prepareParam() {
					return {};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IViewerSettingsEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity>>{
				itemName: 'ModelAdministrationViewerSettings',
				role: ServiceRole.Leaf,
				parent: inject(ModelAdministrationRootDataService)
			}
		});
	}

	private readonly viewerSettingsRuntimeSvc = inject(ModelAdministrationViewerSettingsRuntimeService);

	private readonly translateSvc = inject(PlatformTranslateService);

	private readonly viewerSettingsConfigSvc = inject(ModelAdministrationViewerSettingsConfigService);

	protected override provideAllProcessor(options: IDataServiceOptions<IViewerSettingsEntity>): IEntityProcessor<IViewerSettingsEntity>[] {
		return [
			...super.provideAllProcessor(options),
			{
				process: (toProcess: IViewerSettingsEntity) => {
					toProcess.Active = this.viewerSettingsRuntimeSvc?.getActiveProfileId() === toProcess.Id;

					this.addTransientValues(toProcess);
					this.updateReadOnlyState(toProcess);
				},
				revertProcess: (toProcess: IViewerSettingsEntity) => {
					this.removeTransientValues(toProcess);
				}
			}
		];
	}

	private addTransientValues(item: IViewerSettingsEntity) {
		item.Scope = (item.UserFk ? this.translateSvc.instant('model.administration.viewerSettings.personal') : this.translateSvc.instant('model.administration.viewerSettings.global')).text;
	}

	private removeTransientValues(item: IViewerSettingsEntity) {
		/*if (_.get(item, 'BackgroundColor2.backgroundColor2') || _.isNumber(_.get(item, 'BackgroundColor2.backgroundColor2'))) {
			if (item.BackgroundColor2.backgroundColor2 === 0) {
				let color = 0;
				delete item.BackgroundColor2.backgroundColor2;
				item.BackgroundColor2 = color;
			} else {
				let color = item.BackgroundColor2.backgroundColor2;
				delete item.BackgroundColor2.backgroundColor2;
				item.BackgroundColor2 = color;
			}
		}
		_.unset(item, 'Scope');
		_.unset(item, 'Active');
		_.unset(item, 'HasServerSideRenderingPermission');*/
	}

	private updateReadOnlyState(item: IViewerSettingsEntity) {
		if (item.UserFk) {
			if (!this.viewerSettingsConfigSvc.canDoServerSideRendering) {
				this.setEntityReadOnlyFields(item, [{
					field: 'RenderingMode',
					readOnly: true
				}]);
				item.RenderingMode = 'c';
			}
		} else {
			if (this.viewerSettingsConfigSvc.canEditGlobal) {
				this.setEntityReadOnlyFields(item, [{
					field: 'DescriptionInfo',
					readOnly: true
				}]);
			} else {
				this.setEntityReadOnly(item, true);
			}
		}
	}

	private markSelectedAsDefault() {
		const selProfile = this.getSelection()[0];
		if (selProfile) {
			this.setModified(selProfile);
			selProfile.IsDefault = true;
			for (const prf of this.getList()) {
				const newIsDefault = prf === selProfile;
				if (prf.IsDefault !== newIsDefault) {
					prf.IsDefault = newIsDefault;
				}
			}
			// TODO: trigger re-render of list, if necessary
		}
	}

	private markSelectedAsActive() {
		const selProfile = this.getSelection()[0];
		if (selProfile) {
			this.viewerSettingsRuntimeSvc.markSettingsProfileAsActive(selProfile.Id);
			selProfile.Active = true;
			for (const prf of this.getList()) {
				const newActive = prf === selProfile;
				if (Boolean(prf.Active) !== newActive) {
					prf.Active = newActive;
				}
			}
			// TODO: trigger re-render of list, if necessary
		}
	}

	public modifyToolBar(containerUiAddOns: IContainerUiAddOns) {
		containerUiAddOns.toolbar.addItems([{
			id: 'createCopy',
			type: ItemType.Item,
			iconClass: 'tlb-icons ico-rec-new-copy',
			caption: { key: 'model.administration.viewerSettings.copyCreate' },
			fn: function () {
				// TODO: implement this
				/*
				const selProfile = modelAdministrationViewerSettingsDataService.getSelected();
				if (selProfile) {
					platformGridAPI.grids.commitAllEdits();
					return modelAdministrationViewerSettingsDataService.createItem({
						copyCreateFromProfileId: selProfile.Id
					});
				}*/
				throw new Error('Not yet implemented.');
			},
			disabled: () => !this.hasSelection()
		}, {
			id: 'setDefault',
			type: ItemType.Item,
			iconClass: 'tlb-icons ico-view-profile-default',
			caption: { key: 'model.administration.viewerSettings.setDefault' },
			fn: () => {
				this.markSelectedAsDefault();
				// TODO: migrate when alarm is ready
				//$scope.getUiAddOns().getAlarm().show($translate.instant('model.administration.viewerSettings.defaultSet'));
			},
			disabled: () => {
				const selProfile = this.getSelection()[0];
				return !selProfile || selProfile.IsDefault;
			}
		}, {
			id: 'setActive',
			type: ItemType.Item,
			iconClass: 'tlb-icons ico-view-profile-active',
			caption: { key: 'model.administration.viewerSettings.setActive' },
			fn: () => {
				this.markSelectedAsActive();
				// TODO: migrate when alarm is ready
				//$scope.getUiAddOns().getAlarm().show($translate.instant('model.administration.viewerSettings.activeSet'));
			},
			disabled: () => {
				const selProfile = this.getSelection()[0];
				return Boolean(!selProfile || selProfile.Active);
			}
		}]);
	}
}
