/*
 * Copyright(c) RIB Software GmbH
 */
import { merge } from 'lodash';
import { ElementRef, inject, Injectable, Injector, StaticProvider } from '@angular/core';
import { ILookupConfig, ILookupOptions } from '../model/interfaces/lookup-options.interface';
import {LookupContext} from '../model/lookup-context';
import {UiCommonDialogService} from '../../dialogs/base/services/dialog.service';
import { LookupReadonlyDataServiceFacade } from '../model/lookup-readonly-data-service-facade';
import {LookupConfigService} from './lookup-config.service';
import { ILookupDialogView, ILookupPopupView } from '../model/interfaces/lookup-view.interface';
import { ILookupReadonlyDataService } from '../model/interfaces/lookup-readonly-data-service.interface';
import { ILookupContext } from '../model/interfaces/lookup-context.interface';
import { ActivePopup, PopupService } from '../../popup';

/**
 * The lookup view service to open lookup dialog
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonLookupViewService {
	protected injector = inject(Injector);
	protected dialogService = inject(UiCommonDialogService);
	protected popupService = inject(PopupService);

	/**
	 * Show lookup dialog with options
	 * @param dataService
	 * @param options
	 * @param context
	 */
	public showDialog<TItem extends object, TEntity extends object>(dataService: ILookupReadonlyDataService<TItem, TEntity>, options?: ILookupOptions<TItem, TEntity>, context?: ILookupContext<TItem, TEntity>) {
		const config = this.combineConfig(dataService, options);
		const ctx = this.createLookupContext(dataService, config, context);
		return this.openDialog(ctx, config);
	}

	/**
	 * Open lookup dialog with config
	 * @param context
	 * @param options
	 */
	public openDialog<TItem extends object, TEntity extends object>(context: LookupContext<TItem, TEntity>, config: ILookupConfig<TItem, TEntity>) {
		const dialogComponent = config.dialogComponent;

		if (!dialogComponent) {
			throw new Error('dialogComponent is not configured!');
		}

		const dialogOptions = config.dialogOptions || {};
		const bodyProviders = this.combineProviders(context, config, dialogOptions.providers);

		return this.dialogService.show({
			resizeable: true,
			bodyComponent: dialogComponent,
			buttons: [
				{
					id: 'refresh',
					caption: {
						key: 'ui.common.dialog.refreshBtn'
					},
					fn: (event, info) => {
						(info.dialog.body as ILookupDialogView<TItem>).refresh();
					}
				},
				{
					id: 'cancel',
					caption: {
						key: 'ui.common.dialog.cancelBtn'
					}
				},
				{
					id: 'ok',
					caption: {
						key: 'ui.common.dialog.okBtn'
					},
					fn: (event, info) => {
						(info.dialog.body as ILookupDialogView<TItem>).apply();
					},
					isDisabled: (info) => {
						const dialogView = info.dialog.body as ILookupDialogView<TItem>;

						if (dialogView.canApply) {
							return !dialogView.canApply();
						}

						return !dialogView.focusedItem;
					}
				}
			],
			...config.dialogOptions,
			bodyProviders: bodyProviders
		});
	}

	/**
	 * Combine lookup config
	 * @param dataService
	 * @param options
	 */
	public combineConfig<TItem extends object, TEntity extends object>(dataService: ILookupReadonlyDataService<TItem, TEntity>, options?: ILookupOptions<TItem, TEntity>): ILookupConfig<TItem, TEntity> {
		const mergeConfig = dataService.config.mergeConfig;
		const globalConfig = this.injector.get(LookupConfigService<TItem, TEntity>);

		if (mergeConfig) {
			return merge(
				{},
				globalConfig,
				dataService.config,
				options
			);
		}
		return {
			...globalConfig,
			...dataService.config,
			...options
		};
	}

	/**
	 * Combine providers
	 * @param context
	 * @param config
	 * @param externals
	 */
	public combineProviders<TItem extends object, TEntity extends object>(context: LookupContext<TItem, TEntity>, config: ILookupConfig<TItem, TEntity>, externals?: StaticProvider[]) {
		let providers: StaticProvider[] = [
			{ provide: LookupContext, useValue: context }
		];

		if (config.viewProviders) {
			providers = providers.concat(config.viewProviders);
		}

		if (externals) {
			providers = providers.concat(externals);
		}

		return providers;
	}

	private createLookupContext<TItem extends object, TEntity extends object>(dataService: ILookupReadonlyDataService<TItem, TEntity>, config: ILookupConfig<TItem, TEntity>, context?: ILookupContext<TItem, TEntity>) {
		const ctx = new LookupContext<TItem, TEntity>(this.injector);
		ctx.lookupConfig = config;
		ctx.lookupFacade = new LookupReadonlyDataServiceFacade<TItem, TEntity>(dataService, ctx);
		if (context) {
			ctx.entity = context.entity;
			ctx.indexInSet = context.indexInSet;
			ctx.totalCount = context.totalCount;
			ctx.injector = context.injector;
			ctx.selectedId = context.selectedId;
			ctx.lookupInput = context.lookupInput;
			ctx.inputValue = context.inputValue;
		}
		return ctx;
	}

	/**
	 * Open popup with options
	 * @param ownerElement
	 * @param dataService
	 * @param options
	 * @param context
	 */
	public showPopup<TItem extends object, TEntity extends object>(ownerElement: ElementRef, dataService: ILookupReadonlyDataService<TItem, TEntity>, options?: ILookupOptions<TItem, TEntity>, context?: ILookupContext<TItem, TEntity>) {
		const config = this.combineConfig(dataService, options);
		const ctx = this.createLookupContext(dataService, config, context);
		const popup = this.openPopup(ownerElement, ctx, config, true) as ActivePopup;
		(popup.component.instance as ILookupPopupView<TItem>).load();
		return popup;
	}

	/**
	 * Toggle popup with options
	 * @param ownerElement
	 * @param dataService
	 * @param options
	 * @param context
	 */
	public togglePopup<TItem extends object, TEntity extends object>(ownerElement: ElementRef, dataService: ILookupReadonlyDataService<TItem, TEntity>, options?: ILookupOptions<TItem, TEntity>, context?: ILookupContext<TItem, TEntity>) {
		const config = this.combineConfig(dataService, options);
		const ctx = this.createLookupContext(dataService, config, context);
		const popup = this.openPopup(ownerElement, ctx, config, true);

		if (popup) {
			(popup.component.instance as ILookupPopupView<TItem>).load();
		}

		return popup;
	}

	/**
	 * Open popup with config
	 * @param ownerElement
	 * @param context
	 * @param config
	 * @param toggle
	 */
	public openPopup<TItem extends object, TEntity extends object>(ownerElement: ElementRef, context: LookupContext<TItem, TEntity>, config: ILookupConfig<TItem, TEntity>, toggle?: boolean) {
		const defaultGridPopupWidth = 300;
		const comboComponent = config.showGrid ? config.gridComponent : config.comboComponent;

		if (!comboComponent) {
			throw new Error('comboComponent is not configured!');
		}


		const popupOptions = {
			hasDefaultWidth: true,
			resizable: true,
			showFooter: true,
			showHeader: config.showCustomInputContent,
			width: config.showGrid ? defaultGridPopupWidth : undefined,
			...config.popupOptions
		};

		popupOptions.providers = this.combineProviders(context, config, popupOptions.providers);

		if (toggle) {
			return this.popupService.toggle(ownerElement, comboComponent, popupOptions);
		}

		return this.popupService.open(ownerElement, comboComponent, popupOptions);
	}
}