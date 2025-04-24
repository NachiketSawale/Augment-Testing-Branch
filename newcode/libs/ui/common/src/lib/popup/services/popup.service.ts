/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	Injectable,
	Injector,
	RendererFactory2,
	TemplateRef,
	ElementRef,
	ApplicationRef,
	ViewContainerRef,
	EventEmitter, Type
} from '@angular/core';
import { IPopupOptions, IPopupConfig } from '../model/interfaces/popup-options.interface';
import { PopupConfigService } from './popup-config.service';
import { ActivePopup } from '../model/active-popup';
import {PopupMenuContext} from '../model/popup-menu-context';
import {UiCommonPopupMenuComponent} from '../components/popup-menu/popup-menu.component';

/**
 * A service for opening popup windows.
 *
 * Creating a popup is straightforward: create a component or a template and pass it as an argument to
 * the `.open()` method.
 */
@Injectable({ providedIn: 'root' })
export class PopupService {
	private viewContainerRef: ViewContainerRef | null = null;
	private activeViewMap: Map<ElementRef, ActivePopup> = new Map();
	private activeViewsEE: EventEmitter<ActivePopup[]> = new EventEmitter();

	/**
	 * Popup container getter
	 */
	public get viewContainer() {
		return this.viewContainerRef;
	}

	/**
	 * Popup container setter
	 * @param value
	 */
	public set viewContainer(value: ViewContainerRef | null) {
		this.viewContainerRef = value;
	}

	/**
	 * Returns an observable that holds the active popup instances.
	 */
	private get activeViews() {
		return this.activeViewsEE;
	}

	public constructor(private applicationRef: ApplicationRef,
	            private injector: Injector,
	            private rendererFactory: RendererFactory2,
	            private globalConfig: PopupConfigService) {

	}

	/**
	 * Dismisses all currently displayed popup windows with the supplied reason.
	 */
	public dismissAll(reason?: unknown) {
		[...this.activeViewMap.values()].forEach(activePopup => activePopup.dismiss(reason));
	}

	/**
	 *
	 * @param level
	 * @param reason
	 */
	public dismissByLevel(level: number, reason?: unknown) {
		[...this.activeViewMap.values()].forEach(activePopup => {
			if (activePopup.level > level) {
				activePopup.dismiss(reason);
			}
		});
	}

	/**
	 * Toggles a new popup window with the specified content and supplied options.
	 */
	public toggle(ownerElement: ElementRef, content: Type<unknown> | TemplateRef<unknown>, options: IPopupOptions): ActivePopup | null {
		const config = {...this.globalConfig, ...options};

		// one owner should only have one popup window
		if (this.activeViewMap.has(ownerElement)) {
			const ref = this.activeViewMap.get(ownerElement);

			if (ref) {
				ref.dismiss();
				return null;
			}
		}

		return this.createActivePopup(ownerElement, content, config);
	}

	/**
	 * Opens a new popup window with the specified content and supplied options.
	 */
	public open(ownerElement: ElementRef, content: Type<unknown> | TemplateRef<unknown>, options: IPopupOptions): ActivePopup {
		const config = {...this.globalConfig, ...options};

		// one owner should only have one popup window
		if (this.activeViewMap.has(ownerElement)) {
			const ref = this.activeViewMap.get(ownerElement);

			if (ref) {
				return ref;
			}
		}

		return this.createActivePopup(ownerElement, content, config);
	}

	/**
	 * Open popup menu
	 * @param ownerElement
	 * @param context
	 * @param options
	 */
	public openMenu(ownerElement: ElementRef, context: PopupMenuContext, options?: IPopupOptions) {

		return this.open(ownerElement, UiCommonPopupMenuComponent, {
			...options,
			showFooter: false,
			showHeader: false,
			providers: [
				{
					provide: PopupMenuContext,
					useValue: context
				}
			]
		});
	}

	/**
	 * Indicates if there are currently unknown open popup windows in the application.
	 */
	private hasOpenPopups(): boolean {
		return this.activeViewMap.size > 0;
	}

	private createActivePopup(ownerElement: ElementRef, content: Type<unknown> | TemplateRef<unknown>, options: IPopupConfig): ActivePopup {
		const activePopup = new ActivePopup(ownerElement, options);
		const injector = Injector.create({
			parent: this.injector,
			providers: options.providers ?? []
		});

		if (content instanceof TemplateRef) {
			this.createFromTemplateRef(injector, content, activePopup);
		} else {
			this.createFromComponent(injector, content, activePopup);
		}

		this.registerActivePopup(ownerElement, activePopup);

		return activePopup;
	}

	private createFromTemplateRef(contentInjector: Injector, content: TemplateRef<unknown>, activePopup: ActivePopup) {
		if (!this.viewContainer) {
			throw new Error('<ui-common-popup-container> is not placed');
		}

		const context = {
			$implicit: activePopup,
			close(result: unknown) {
				activePopup.close(result);
			},
			dismiss(reason: unknown) {
				activePopup.dismiss(reason);
			}
		};
		const popupContentInjector =
			Injector.create({providers: [{provide: ActivePopup, useValue: activePopup}], parent: contentInjector});
		const viewRef = this.viewContainer.createEmbeddedView(content, context, {
			injector: popupContentInjector
		});
		activePopup.view = viewRef;
	}

	private createFromComponent(contentInjector: Injector, content: Type<unknown>, activePopup: ActivePopup) {
		if(!this.viewContainer) {
			throw new Error('<ui-common-popup-container> is not placed');
		}

		const popupContentInjector =
			Injector.create({providers: [{provide: ActivePopup, useValue: activePopup}], parent: contentInjector});
		const componentRef = this.viewContainer.createComponent(content, {
			injector: popupContentInjector
		});
		activePopup.component = componentRef;
	}

	private registerActivePopup(owner: ElementRef, activePopup: ActivePopup) {
		const unregisterPopupRef = () => {
			if (this.activeViewMap.has(owner)) {
				this.activeViewMap.delete(owner);
				this.activeViewsEE.emit([...this.activeViewMap.values()]);
			}
		};

		if (this.activeViewMap.has(owner)) {
			throw new Error('Owner element has related popup window!');
			return;
		}

		this.activeViewMap.set(owner, activePopup);
		this.activeViewsEE.emit([...this.activeViewMap.values()]);
		activePopup.closed.subscribe(unregisterPopupRef);
	}
}