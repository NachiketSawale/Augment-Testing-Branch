/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject, ElementRef, ViewChild, Renderer2, AfterContentInit, ViewEncapsulation, } from '@angular/core';
import { Subscription } from 'rxjs';
import { SwaggerUIBundle } from 'swagger-ui-dist';

import { ISwaggerData } from '../../model/interface/swagger-data.interface';
import { SearchChar } from '../../model/enum/search.enum';

import { WebApiHelpMainService } from '../../services/webapihelp-main.service';

import { PlatformConfigurationService } from '@libs/platform/common';
import { PlatformAuthService } from '@libs/platform/authentication';

/**
 * This is the body page where swagger and paginator loaded
 */
@Component({
	selector: 'webapihelp-main-swagger-content',
	templateUrl: './webapihelp-main-swagger-content.component.html',
	styleUrls: ['./webapihelp-main-swagger-content.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class WebApiHelpMainSwaggerContentComponent implements OnInit, AfterContentInit, OnDestroy {
	/**
	 * Reset reload flag
	 */
	@Output() public resetReloadFlag: EventEmitter<boolean> =
		new EventEmitter<boolean>();

	/**
	 * Enum object for concate the url string
	 */
	private searchChar = SearchChar;

	/**
	 * The page number
	 */
	public pageNumber = 1;

	/**
	 * The ruler length of the paginator
	 */
	public rulerLength = 1;

	/**
	 *  The search Value
	 */
	public searchValue: string = this.searchChar.EmptySpace;

	/**
	 * Total count of page for paginator
	 */
	public ribDocTotalPage = 1;

	/**
	 * Search API Url
	 */
	public newApiLink!: string;

	/**
	 * Subscription for searching data
	 */
	private ribDocDataSubscription$!: Subscription;

	/**
	 * Subscription for reload subject behaviour data
	 */
	private reloadButtonSubscription$!: Subscription;

	/**
	 * Subscription for AccessToken.
	 */
	private accessTokenSubscribtion$!: Subscription;

	/**
	 * Injection of webapihelp servise
	 */
	private webApiHelpService = inject(WebApiHelpMainService);

	/**
	 * service to get client-context
	 */
	private configurationService = inject(PlatformConfigurationService);

	/**
	 * Service for get access token.
	 */
	private platformAuthService = inject(PlatformAuthService);

	/**
	 * Injection for ElementRef
	 */
	public elementref = inject(ElementRef);

	/**
	 * Template reference variable
	 */
	@ViewChild('apicontainer') public apicontainer!: ElementRef;

	public render = inject(Renderer2);

	/**
	 * Swagger Data
	 */
	public swaggerData!: ISwaggerData;
	/**
	 * Set searched data
	 */
	@Input() public set searchData(value: string) {
		this.searchValue = value;
		this.pageNumber = 1;
		this.loadSwagger(this.pageNumber);
	}

	/**
	 * get searched data
	 */
	public get searchData(): string {
		return this.searchValue;
	}

	/**
	 * Reload flag
	 */
	public reloadData = false;

	/**
	 * Set reload flag and load swagger
	 */
	public set reloadFlagData(value: boolean) {
		this.reloadData = value;
		this.loadSwagger(this.pageNumber);
	}

	/**
	 * Get reload flag
	 */
	public get reloadFlagData(): boolean {
		return this.reloadData;
	}

	/**
	 * token access string
	 */
	public accessToken!: string;

	public ngOnInit(): void {
		this.toGetTockenAccess();
		this.loadSwagger(this.pageNumber);
		this.reloadButton();
	}

	public ngAfterContentInit(): void {
		this.attachTagSelectiOnEvent();
	}

	/**
	 * get Tolen Access
	 */
	public toGetTockenAccess() {
		this.accessTokenSubscribtion$ = this.platformAuthService
			.getAccessToken()
			.subscribe((res: string) => {
				this.accessToken = res as string;
			});
	}

	/**
	 * Subscribe the reload button flag for reload button
	 */
	public reloadButton() {
		this.reloadButtonSubscription$ =
			this.webApiHelpService.reloadButtonFlag$.subscribe((res: boolean) => {
				this.reloadFlagData = res;
			});
	}

	/**
	 * Load Swagger on ui
	 */
	public loadSwaggerUi(spec: ISwaggerData): void {
		let cCtx: string;
		if (this.configurationService) {
			cCtx = this.configurationService.getContextHeader() as string;
		}
		SwaggerUIBundle({
			spec: spec,
			// url: this.newApiLink,
			dom_id: '#swagger-ui',
			layout: 'BaseLayout',
			presets: [SwaggerUIBundle['presets'].apis],
			defaultModelRendering: 'example',
			defaultModelExpandDepth: 0,
			docExpansion: 'list',
			deepLinking: true,
			filter: null,
			validatorUrl: null,
			persistAuthorization: true,
			pluginLoadType: ['legacy', 'chain'],
			plugins: [SwaggerUIBundle['plugins'].DownloadUrl],
			requestInterceptor: (request) => {
				if (this.accessToken) {
					request['headers'].Authorization = 'Bearer ' + this.accessToken;
				}
				request['headers']['Client-Context'] = cCtx;
				return request;
			},
		});

		setTimeout(() => {
			this.startWatchingRenderedNodes();
		}, 100);
		this.resetReloadFlag.emit(false);
	}

	/**
	 * set up url and load swagger and paginator
	 * @param { number } pageNumber  The page number
	 */
	private loadSwagger(pageNumber: number): void {
		this.newApiLink = this.webApiHelpService.searchUrl;
		this.newApiLink =
			this.newApiLink +
			this.searchData +
			this.searchChar.Page +
			pageNumber +
			this.searchChar.reload +
			this.reloadFlagData;
		this.dataGetFromPageNumber(pageNumber);
	}

	/**
	 * Subscribe the getDatafromPageNumber and get the total number of page count for paginator
	 * @param { number} pageNumber The page number
	 */
	public dataGetFromPageNumber(pageNumber: number): void {
		this.ribDocDataSubscription$ = this.webApiHelpService.getDataFromPageNumber(
			this.searchData,
			pageNumber,
			this.reloadFlagData,
		).subscribe(
			(res: ISwaggerData) => {
				const response = JSON.stringify(res);
				const convertedRes: ISwaggerData = JSON.parse(response);
				this.swaggerData = convertedRes;
				this.loadSwaggerUi(convertedRes);
				this.ribDocTotalPage = convertedRes.RIBDocTotalPage;
				this.resetReloadFlag.emit(false);
			},
			(error) => {
				throw new Error(error);
			},
		);
	}

	/**
	 * Change the page number
	 * @param { number } pageNumber The page number
	 */
	public changePage(pageNumber: number): void {
		this.pageNumber = pageNumber;
		this.loadSwagger(pageNumber);
	}



	/**
	 *  Function to call changes in swagger rendered nodes 
	 */
	public startWatchingRenderedNodes(): void {
		this.attachTagSelectiOnEvent();
		this.attachApiEvents();
	}

	/**
	 *  For event call on tag selection in swagger nodes
	 */
	public attachTagSelectiOnEvent() {
		const elementContainer = this.apicontainer?.nativeElement.querySelectorAll(
			'div.opblock-tag-section'
		) as HTMLElement[];
		elementContainer?.forEach((ele) => {
			ele.addEventListener('click', () => {
				setTimeout(() => {
					this.attachApiEvents();
				}, 100);
			});
		});
	}

	/**
	 * Added some styling and events call on APi events in swagger
	 */
	public attachApiEvents() {
		const displayTitle = document.getElementsByClassName('information-container');
		const displaySchems = document.getElementsByClassName('scheme-container');
		displayTitle[0].classList.add('display');
		displaySchems[0].classList.add('display');
		const elementContainer = this.apicontainer.nativeElement.querySelectorAll(
			'div.opblock-summary',
		) as HTMLElement[];
		elementContainer.forEach((ele) => {
			if (ele.classList.contains('hit') === false) {
				ele.addEventListener('click', () => {
					const contianerele = ele.parentNode;
					setTimeout(() => {
						this.displayObsoleteForApi(contianerele!);
					}, 30);
					this.render.addClass(ele, 'hit');
				});
			}
			const bodyele = ele.nextElementSibling as unknown as HTMLElement;

			if (bodyele.querySelector('div.opblock-body')) {
				const contianerele = ele.parentNode;
				setTimeout(() => {
					this.displayObsoleteForApi(contianerele!);
				}, 30);
			}
		});
	}

	/**
	 * Attached some styling changes and event calls in swagger nodes
	 * @param { ParentNode } parent 
	 */
	public displayObsoleteForApi(parent: ParentNode) {

		const parentElement = parent as HTMLElement;
		const bodynode = parentElement.querySelector('div.opblock-body');

		if (bodynode) {
			if (bodynode.getAttribute('data-event-bind') !== 'true') {
				const codeElemArr = bodynode.querySelectorAll('code');
				codeElemArr.forEach((codeElem) => {
					if (codeElem) {
						codeElem.className = 'language-json';
					}
					const blockNodesArr = bodynode.querySelectorAll('div.markdown > blockquote');
					blockNodesArr.forEach((blockNodes, i) => {
						if (i > 0) {
							blockNodes?.classList.add('expand');
							const opblockSection = bodynode.getElementsByClassName('opblock-section');

							if (codeElem && blockNodes) {
								const button = document.createElement('a');
								button.classList.add('copy-code');
								button.innerHTML = 'Copy';
								button.addEventListener('click', () => {
									navigator.clipboard.writeText(codeElem!.innerText);
								});

								const codeParentEle = codeElem.parentElement as HTMLElement;
								codeParentEle.style.position = 'relative';
								codeParentEle.appendChild(button);
								codeParentEle.append(button);

								const topButton = document.createElement('a');
								const bottomButton = document.createElement('a');
								topButton.className = 'content-switcher top collapsed';
								topButton.title = 'Collapsed/Expand';
								bottomButton.className = 'content-switcher bottom collapsed';
								bottomButton.title = 'Collapsed';

								blockNodes.appendChild(topButton);
								topButton.addEventListener('click', () => {
									if (blockNodes.classList.contains('collapsed')) {
										blockNodes.classList.remove('collapsed');
										blockNodes.className = 'expand';
										topButton.classList.remove('expand');
										topButton.className = 'content-switcher top collapsed';
									} else if (blockNodes.classList.contains('expand')) {
										blockNodes.classList.remove('expand');
										blockNodes.className = 'collapsed';
										topButton.classList.remove('collapsed');
										topButton.className = 'content-switcher top expand';
									}
								});
								if (blockNodes.scrollHeight && blockNodes.scrollHeight > 200) {
									blockNodes.appendChild(bottomButton);
									bottomButton.addEventListener('click', () => {
										if (blockNodes.classList.contains('collapsed')) {
											blockNodes.classList.remove('collapsed');
											blockNodes.classList.add('expand');
											topButton.classList.remove('expand');
											topButton.classList.add('collapsed');
										} else if (blockNodes.classList.contains('expand')) {
											blockNodes.classList.remove('expand');
											blockNodes.classList.add('collapsed');
											topButton.classList.remove('collapsed');
											topButton.classList.add('expand');
										}
									});
								}
								bodynode.setAttribute('data-event-bind', 'true');
							}

							if (opblockSection.length > 0) {
								if (codeElem) {
									codeElem!.innerHTML = this.jsonFormat(codeElem!.innerText);
								}
							}
						}
					});
				});
			}
		}
	}

	/**
	 * to check json format
	 * @param {string} str 
	 * @returns JSON format
	 */
	public isJsonLike(str: string) {
		const JSON_START = /^\[|^{(?!{)/;
		const JSON_ENDS = {
			'[': /]$/,
			'{': /}$/,
		};
		const temp = str.replace(/^\s/, '').replace(/\s*$/, '');
		const jsonStart = temp.match(JSON_START);
		return jsonStart && JSON_ENDS[jsonStart[0] as keyof typeof JSON_ENDS].test(temp);
	}

	/**
	 * Convert string into json format
	 * @param {string} json 
	 * @returns Json formated string or Json
	 */
	public jsonFormat(json: string) {
		try {
			const queryRegex = /(\w+)=([^&]+)/gi;
			if (!this.isJsonLike(json) && json.match(queryRegex)) {
				return json.replace(queryRegex, (match: string) => {
					const m = /(\w+)=(.*)/gi.exec(match);
					return m
						? '<span class="key">' +
						m[1] +
						'</span>=<span class="number">' +
						m[2] +
						'</span>'
						: '<span class="key">' +
						+'</span>=<span class="number">' +
						'</span>';
				});
			}

			return json.replace(
				/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
				(match: string) => {
					let cls = 'number';
					if (/^"/.test(match)) {
						if (/:$/.test(match)) {
							cls = 'key';
						} else {
							cls = 'string';
						}
					} else if (/true|false/.test(match)) {
						cls = 'boolean';
					} else if (/null/.test(match)) {
						cls = 'null';
					}
					return '<span class="' + cls + '">' + match + '</span>';
				},
			);
		} catch (e) {
			return json;
		}
	}

	public ngOnDestroy(): void {
		if (this.ribDocDataSubscription$) {
			this.ribDocDataSubscription$.unsubscribe();
		}
		if (this.reloadButtonSubscription$) {
			this.reloadButtonSubscription$.unsubscribe();
		}
		if (this.accessTokenSubscribtion$) {
			this.accessTokenSubscribtion$.unsubscribe();
		}
	}
}
