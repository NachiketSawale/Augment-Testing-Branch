/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, HostListener, Injector, Type, ViewChild, inject, runInInjectionContext } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LOCAL_IFRAME_ANGULARJS_PATH, IFRAME_BASE_CONTROLLER_SCRIPT, IFRAME_BASE_HTML, IFRAME_LODASH_CDN_PATH, IFRAME_JQUERY_CDN_PATH } from '../../constants/workflow-iframe-base-contants';
import { IFrameMessageOptions } from '../../model/workflow-iframe-message-options.interface';
import { PlatformConfigurationService } from '@libs/platform/common';
import { TValue, IActionParam, DebugContext } from '@libs/workflow/interfaces';
import { IDialogResult, StandardDialogButtonId } from '@libs/ui/common';
import { ExtendedUserActionParams } from '../../model/enum/actions/extended-user-action-params.enum';
import { IFrameWindow } from '../../model/interfaces/iframe-window.interface';
import { isFunction, set } from 'lodash';
import { IServiceCallProxy } from '../../model/interfaces/extended-user-action/service-proxy.interface';
import { IFrameCallableServices } from '../../model/types/extended-user-action/iframe-callable-services.type';
import { WorkflowInstanceLegacyService } from '../../model/classes/extended-user-action-legacy-services/workflow-instance-legacy.service';
import { PlatformTranslationLegacyService } from '../../model/classes/extended-user-action-legacy-services/platform-translation-legacy.service';
import { KeysOfUnion, ServiceFnArr, ServiceMethodMap } from '../../model/types/extended-user-action/legacy-service-method-map.type';
import { WORKFLOW_ACTION_CONTEXT_TOKEN, WORKFLOW_ACTION_INPUT_TOKEN } from '@libs/workflow/shared';

/**
 * Extended user action component container
 * Used to set/get content to/from the iframe.
 */
@Component({
	selector: 'workflow-main-workflow-extended-action-container',
	templateUrl: './workflow-extended-action-container.component.html',
	styleUrls: ['./workflow-extended-action-container.component.scss'],
})
export class WorkflowExtendedActionContainerComponent implements AfterViewInit {

	/**
	 * Element reference to the iframe
	 */
	@ViewChild('iframe', { static: false })
	private iframe!: ElementRef;

	/**
	 * Window referene to the iframe
	 */
	private iframeWindow!: IFrameWindow;

	/**
	 * Dialogue reference of popup in which current component is opened
	 */
	private readonly dialogRef: MatDialogRef<WorkflowExtendedActionContainerComponent> = inject(MatDialogRef<WorkflowExtendedActionContainerComponent>);
	private readonly actionInput: IActionParam[] = inject(WORKFLOW_ACTION_INPUT_TOKEN);
	private context: DebugContext = inject(WORKFLOW_ACTION_CONTEXT_TOKEN);

	//Services used in the extended user action
	private readonly injector = inject(Injector);

	/**
	 * Event listener that will listen to messages passed from iframe
	 * @param messageEvent message from iframe
	 */
	@HostListener('window:message', ['$event'])
	private async messagePassed(messageEvent: MessageEvent<IServiceCallProxy & IFrameMessageOptions>) {
		if (messageEvent.source === this.iframeWindow) {
			const message: IServiceCallProxy & IFrameMessageOptions = messageEvent.data;
			if (message.ShouldSetPrerequisites) {
				this.setPrerequisites();
				return;
			}
			if (message.ShouldSetContextInIFrame) {
				this.setContextInIframe();
				return;
			}
			if (message.IsSubmit) {
				this.updateContext(message.Context);
				this.dialogRef.close({ closingButtonId: StandardDialogButtonId.Ok });
			}

			this.callServices(message);
		}
	}

	private async callServices(message: IServiceCallProxy & IFrameMessageOptions) {
		if (this.serviceMap.has(message.ServiceName)) {
			const serviceInfoObj = this.serviceMap.get(message.ServiceName);
			if (serviceInfoObj) {
				runInInjectionContext(this.injector, async () => {

					//Injecting the legacy service
					const service = inject(serviceInfoObj.Type);
					const serviceFn = service[message.MethodName as keyof IFrameCallableServices];

					//Checking if the method is available in the legacy service.
					if (!isFunction(serviceFn)) {
						const propertyDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(service), message.MethodName)?.get;
						if (propertyDescriptor && isFunction(propertyDescriptor)) {
							this.sendMessageToIframe({ IframePayloadId: message.IframePayloadId, ParentFnResult: serviceFn });
							return;
						} else {
							throw new Error('Function not available in the service');
						}
					}

					//Calling methods from legacy service.
					const result = await callMethod(service, (message.MethodName as keyof IFrameCallableServices), ...message.Parameters as Parameters<IFrameCallableServices[keyof IFrameCallableServices]>);
					this.sendMessageToIframe({ IframePayloadId: message.IframePayloadId, ParentFnResult: result });
				});
			}
		}
	}

	private createTypedMethods<T extends IFrameCallableServices>(legacyServiceName: string, service: Type<T>, methods: (KeysOfUnion<T>)[]): void {
		const typedServiceMethodMap: ServiceMethodMap<IFrameCallableServices> = {
			Type: service,
			Methods: methods
		};
		this.serviceMap.set(legacyServiceName, typedServiceMethodMap);
	}

	private serviceMap = new Map<string, ServiceMethodMap<IFrameCallableServices>>();
	public constructor() {
		this.setLegacyServiceMap();
	}

	private setLegacyServiceMap(): void {
		this.createTypedMethods<WorkflowInstanceLegacyService>('basicsWorkflowInstanceService', WorkflowInstanceLegacyService, ['startWorkflowByEvent', 'startWorkflow']);
		this.createTypedMethods<PlatformConfigurationService>('configurationService', PlatformConfigurationService, ['webApiBaseUrl']);
		this.createTypedMethods<PlatformTranslationLegacyService>('$translate', PlatformTranslationLegacyService, ['instant', 'load']);
	}

	private updateContext(context?: DebugContext): void {
		if (context) {
			for (const prop in context) {
				set(this.context, prop, context[prop]);
			}
		}
	}

	/**
	 * Initializes the content of the Iframe after Iframe is loaded on the view.
	 */
	public ngAfterViewInit(): void {
		// Loading scripts and html into the iframe
		this.setIframeContent(this.iframe);

		// get latest context details from iframe when popup is closed
		this.dialogRef.beforeClosed().subscribe((result: IDialogResult) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok) {
				// when the popup is closed, get the current context and pass it back to parent
				const iframeMessage: IFrameMessageOptions = {
					IsSubmit: true
				};
				this.sendMessageToIframe(iframeMessage);
			}
		});
	}

	/**
	 * Sends message from angular component to iframe
	 * @param iframeMessage the message to be sent to iframe
	 */
	private sendMessageToIframe(iframeMessage: IFrameMessageOptions): void {
		this.iframeWindow.postMessage(iframeMessage);
	}

	private setIframeContent(iframe: ElementRef): void {

		const controllerScript = this.actionInput.filter(item => item.key === ExtendedUserActionParams.Script)[0]?.value ?? '';
		const htmlContent = this.actionInput.filter(item => item.key === ExtendedUserActionParams.Html)[0]?.value ?? '';

		this.iframeWindow = iframe.nativeElement.contentWindow;
		const doc: Document = this.iframeWindow.document;
		doc.open();
		doc.write(LOCAL_IFRAME_ANGULARJS_PATH);
		// As a workaround for now, lodash and jquery are loaded from CDN. Later, they will be loaded from our npm repo.
		doc.write(IFRAME_LODASH_CDN_PATH);
		doc.write(IFRAME_JQUERY_CDN_PATH);
		doc.write(IFRAME_BASE_CONTROLLER_SCRIPT.replace('@content', controllerScript));
		doc.write(IFRAME_BASE_HTML.replace('@content', htmlContent));
		doc.close();
	}

	/**
	 * Sets workflow context object in Iframe
	 */
	private setContextInIframe(): void {
		const iframeMessage: IFrameMessageOptions = {
			Context: this.context,
			ShouldSetContextInIFrame: true
		};
		this.sendMessageToIframe(iframeMessage);
	}

	/**
	 * Sets pre-requisites into the iframe.
	 */
	private setPrerequisites(): void {
		const serviceFnArr: ServiceFnArr = [...this.serviceMap.entries()].map((keyValuePair) => {
			return { legacyServiceName: keyValuePair[0], methods: keyValuePair[1].Methods };
		});

		const iframeMessage: IFrameMessageOptions = {
			Context: this.context,
			ShouldSetPrerequisites: true,
			ServiceFnArr: serviceFnArr
		};
		this.sendMessageToIframe(iframeMessage);
	}
}

/**
 * Helper function to call methods
 * @param service
 * @param method
 * @param args
 * @returns
 */
function callMethod<T extends keyof IFrameCallableServices>(
	service: IFrameCallableServices,
	method: T,
	...args: Parameters<IFrameCallableServices[T]>
): Promise<TValue | undefined> {

	// eslint-disable-next-line @typescript-eslint/ban-types
	return (service[method] as Function)(...args);
}