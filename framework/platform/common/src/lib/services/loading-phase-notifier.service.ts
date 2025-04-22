/*
 * Copyright(c) RIB Software GmbH
 */

import { EventEmitter, Injectable } from '@angular/core';
import { ILoadingNotification } from '../model/loading-notification.interface';

/**
 * Notification service for different loading phases
 */
@Injectable({
	providedIn: 'root'
})
export class LoadingPhaseNotifierService {

	private currentModuleInternalName: string = '';
	private currentNonModulePage: string = '';
	private moduleNavigationInitializedEvent = new EventEmitter<ILoadingNotification>();
	private moduleNavigationCompleteEvent = new EventEmitter<ILoadingNotification>();
	private moduleLoadingCompleteEvent = new EventEmitter<ILoadingNotification>();

	private getModuleSubmoduleNameFromUrl(destinationUrl: string) {
		const urlParts = destinationUrl.split('/');
		let destinationModuleName = '';
		if (urlParts.length > 2) {
			destinationModuleName = urlParts[1] + '.' + urlParts[2];
		}
		return destinationModuleName;
	}

	private processNonModulePageNavigationStart(destinationUrl: string) {
		const pagePath = this.getCleanPath(destinationUrl);
		const notificationData: ILoadingNotification = {
			isModule: false,
			destinationNonModulePagePath: pagePath
		};

		if (this.currentNonModulePage !== '' && this.currentModuleInternalName === '') {
			notificationData.sourceNonModulePagePath = this.currentNonModulePage;
		} else {
			notificationData.sourceModuleInternalName = this.currentModuleInternalName;
		}

		this.moduleNavigationInitializedEvent.emit(notificationData);
		this.currentModuleInternalName = '';
		this.currentNonModulePage = pagePath;
	}

	private getCleanPath(destinationUrl: string) {
		if (destinationUrl) {
			if (destinationUrl[0] === '/') {
				destinationUrl = destinationUrl.substring(1);
			}

			if (destinationUrl[destinationUrl.length - 1] === '/') {
				destinationUrl = destinationUrl.substring(0, destinationUrl.length - 1);
			}

			if (destinationUrl.indexOf('?') !== -1) {
				destinationUrl = destinationUrl.substring(0, destinationUrl.indexOf('?'));
			}
		}
		return destinationUrl;
	}

	private processModulePageNavigationStart(destinationModuleName: string) {
		const notificationData: ILoadingNotification = {
			isModule: true,
			destinationModuleInternalName: destinationModuleName
		};
		if (this.currentNonModulePage !== '' && this.currentModuleInternalName === '') {
			notificationData.sourceNonModulePagePath = this.currentNonModulePage;
		} else {
			notificationData.sourceModuleInternalName = this.currentModuleInternalName;
		}
		this.moduleNavigationInitializedEvent.emit(notificationData);
		this.currentModuleInternalName = destinationModuleName;
		this.currentNonModulePage = '';
	}

	/**
	 * moduleNavigationInitialized$
	 * Subscribe to get notified at navigation start
	 */
	public moduleNavigationInitialized$() {
		return this.moduleNavigationInitializedEvent.asObservable();
	}

	/**
	 * moduleNavigationCompleted$
	 * Subscribe to get notified at module is initiated
	 */
	public moduleNavigationCompleted$() {
		return this.moduleNavigationCompleteEvent.asObservable();
	}

	/**
	 * moduleLoadingCompleted$
	 * Subscribe to get notified at module view is loaded
	 */
	public moduleLoadingCompleted$() {
		return this.moduleLoadingCompleteEvent.asObservable();
	}

	/**
	 * notifyModuleNavigationStart
	 * Emit event at router NavigationStart, called from platform module manager
	 */
	public notifyModuleNavigationStart(destinationUrl: string) {
		const destinationModuleName = this.getModuleSubmoduleNameFromUrl(destinationUrl);
		if (destinationUrl === '/' || (this.currentModuleInternalName !== '' && destinationModuleName === this.currentModuleInternalName)) {
			return;
		}
		if (destinationModuleName === '') {
			this.processNonModulePageNavigationStart(destinationUrl);
		} else {
			this.processModulePageNavigationStart(destinationModuleName);
		}
	}

	/**
	 * notifyModuleNavigationComplete
	 * Emit event on entering a module. Called from module client area component ngOnInit
	 */
	public notifyModuleNavigationComplete() {
		const notificationData: ILoadingNotification = {
			isModule: true,
			destinationModuleInternalName: this.currentModuleInternalName
		};
		this.moduleNavigationCompleteEvent.emit(notificationData);
	}

	/**
	 * notifyNonModulePageNavigationComplete
	 * Emit event on entering a non-module page. Called from the non-module page component ngOnInit
	 */
	public notifyNonModulePageNavigationComplete() {
		const notificationData: ILoadingNotification = {
			isModule: false,
			destinationNonModulePagePath: this.currentNonModulePage
		};
		this.moduleNavigationCompleteEvent.emit(notificationData);
	}

	/**
	 * notifyModuleLoadingComplete
	 * Emit event at module view is loaded. Called from module client area component ngAfterViewInit
	 */
	public notifyModuleLoadingComplete() {
		const notificationData: ILoadingNotification = {
			isModule: true,
			destinationModuleInternalName: this.currentModuleInternalName
		};
		this.moduleLoadingCompleteEvent.emit(notificationData);
	}

	/**
	 * notifyNonModulePageLoadingComplete
	 * Emit event at a non-module page is loaded. Called from the non-module page component ngAfterViewInit
	 */
	public notifyNonModulePageLoadingComplete() {
		const notificationData: ILoadingNotification = {
			isModule: false,
			destinationNonModulePagePath: this.currentNonModulePage
		};
		this.moduleLoadingCompleteEvent.emit(notificationData);
	}
}
