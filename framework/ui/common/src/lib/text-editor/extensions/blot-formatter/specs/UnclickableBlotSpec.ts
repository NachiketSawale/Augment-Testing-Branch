/*
 * Copyright(c) RIB Software GmbH
 */

import BlotSpec from './BlotSpec';
import BlotFormatter from '../BlotFormatter';

const PROXY_IMAGE_CLASS = 'blot-formatter__proxy-image';

/**
 * Unclickable Proxy
 */
type UnclickableProxy = {
	/**
	 * unclickable element
	 */
	unclickable: HTMLElement;

	/**
	 * proxyImage element
	 */
	proxyImage: HTMLElement;
};

/**
 * Unclickable Proxies Record
 */
type UnclickableProxies = Record<string, UnclickableProxy>;

/**
 * Unclickable Blot Spec
 */

export default class UnclickableBlotSpec extends BlotSpec {
	/**
	 * unclickable element
	 */
	public unclickable: HTMLElement | null;

	/**
	 * proxyContainer
	 */
	public proxyContainer: HTMLElement;

	/**
	 * unclickableProxies
	 */
	public unclickableProxies: UnclickableProxies;

	/**
	 * isUnclickable
	 */
	public override isUnclickable: boolean = true;

	public constructor(formatter: BlotFormatter) {
		super(formatter);
		this.unclickable = null;
		this.proxyContainer = this.createProxyContainer();
		this.unclickableProxies = {};
	}

	/**
	 * create unclickable proxies, position proxies over unclickables
	 */
	public override init() {
		// create unclickable proxies, position proxies over unclickables
		this.formatter.quill.on('text-change', this.onTextChange);
		// reposition proxy image if quill root scrolls (only if target is child of quill root)
		this.formatter.quill.root.addEventListener('scroll', () => {
			this.repositionProxyImages();
		});
		this.observeEditorResize();
	}

	/**
	 * reposition proxies if editor dimensions change (e.g. screen resize or editor grow/shrink)
	 */
	public observeEditorResize() {
		// reposition proxies if editor dimensions change (e.g. screen resize or editor grow/shrink)
		let resizeTimeout: number | null = null;
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				// Clear the previous timeout if there was one
				if (resizeTimeout && entry) {
					clearTimeout(resizeTimeout);
				}
				// Set a new timeout to run after 200ms
				resizeTimeout = window.setTimeout(() => {
					this.repositionProxyImages();
				}, 200);
			}
		});
		// Start observing the element for size changes
		resizeObserver.observe(this.formatter.quill.root);
	}

	/**
	 * Manually scroll the quill root element if proxy receives wheel event
	 *
	 * @param event WheelEvent
	 */
	public passWheelEventThrough = (event: WheelEvent) => {
		// Manually scroll the quill root element if proxy receives wheel event
		this.formatter.passWheelEventThrough(event);
		this.repositionProxyImages();
	};

	/**
	 * get the unclickable element
	 *
	 * @returns html element
	 */
	public override getTargetElement(): HTMLElement | null {
		return this.unclickable;
	}

	/**
	 * get the overlay element
	 *
	 * @returns html element
	 */
	public override getOverlayElement(): HTMLElement | null {
		return this.unclickable;
	}

	/**
	 * check if any unclickable has been deleted, remove proxy if so
	 */
	public onTextChange = () => {
		// check if any unclickable has been deleted, remove proxy if so
		Object.entries(this.unclickableProxies).forEach(([key, { unclickable, proxyImage }]) => {
			try {
				if (!this.formatter.quill.root.contains(unclickable)) {
					proxyImage.remove();
					delete this.unclickableProxies[key];
				}
			} catch (e: unknown) {
				console.error('error', e);
			}
		});

		this.repositionProxyImages();
	};

	/**
	 * create transparent image to overlay unclickable (unclickable) and
	 * proxies linked via random id used as key in this.unclickableProxies record set
	 *
	 * @param unclickable HTMLElement
	 */
	public createUnclickableProxyImage(unclickable: HTMLElement): void {
		// create transparent image to overlay unclickable (unclickable)
		// proxies linked via random id used as key in this.unclickableProxies record set
		const id = Array.from(crypto.getRandomValues(new Uint8Array(5)), (n) => String.fromCharCode(97 + (n % 26))).join('');
		unclickable.dataset['blotFormatterId'] = id;

		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (context) {
			context.globalAlpha = 0;
			context.fillRect(0, 0, 1, 1);
		}

		const proxyImage = document.createElement('img');
		proxyImage.src = canvas.toDataURL('image/png');
		proxyImage.classList.add(PROXY_IMAGE_CLASS);
		proxyImage.dataset['blotFormatterId'] = id;

		const mergedStyle: Record<string, unknown> = {
			...{
				position: 'absolute',
				margin: '0',
				userSelect: 'none',
			},
		};

		Object.assign(proxyImage.style, mergedStyle);

		proxyImage.style.setProperty('-webkit-user-select', 'none');
		proxyImage.style.setProperty('-moz-user-select', 'none');
		proxyImage.style.setProperty('-ms-user-select', 'none');

		this.proxyContainer.appendChild(proxyImage);

		// on click, hide proxy, show overlay
		proxyImage.addEventListener('click', this.onProxyImageClick);
		// disable context menu on proxy
		proxyImage.addEventListener('contextmenu', (event) => {
			event.stopPropagation();
			event.preventDefault();
		});
		// scroll the quill root on pointer wheel event & touch scroll
		proxyImage.addEventListener('wheel', this.formatter.passWheelEventThrough);
		proxyImage.addEventListener('touchstart', this.formatter.onTouchScrollStart, { passive: false });
		proxyImage.addEventListener('touchmove', this.formatter.onTouchScrollMove, { passive: false });

		// used to reposition proxy and identify target unclickable
		this.unclickableProxies[id] = {
			unclickable: unclickable,
			proxyImage: proxyImage,
		};
	}

	/**
	 * this function used for reposition Proxy images
	 */
	public repositionProxyImages(): void {
		if (Object.keys(this.unclickableProxies).length > 0) {
			const containerRect: DOMRect = this.formatter.quill.container.getBoundingClientRect();
			const containerScrollLeft: number = this.formatter.quill.container.scrollLeft;
			const containerScrollTop: number = this.formatter.quill.container.scrollTop;

			Object.entries(this.unclickableProxies).forEach(([key, { unclickable, proxyImage }]) => {
				try {
					// Calculate the unclickable's position relative to the container
					const unclickableRect: DOMRect = unclickable.getBoundingClientRect();
					Object.assign(proxyImage.style, {
						// display: 'block',
						left: `${unclickableRect.left - containerRect.left - 1 + containerScrollLeft}px`,
						top: `${unclickableRect.top - containerRect.top + containerScrollTop}px`,
						width: `${unclickableRect.width}px`,
						height: `${unclickableRect.height}px`,
					});
				} catch (error) {
					const msg: string = `Error positioning proxy image with id ${key}: `;
					console.error(msg, `${error instanceof Error ? error.message : error}`);
				}
			});
		}
	}

	/**
	 * get target unclickable (unclickable), show overlay
	 *
	 * @param event MouseEvent
	 */
	public onProxyImageClick = (event: MouseEvent) => {
		// get target unclickable (unclickable), show overlay
		const targetElement = event.target as HTMLElement;
		const id = targetElement.dataset['blotFormatterId'];
		this.unclickable = this.unclickableProxies[`${id}`].unclickable;
		this.formatter.show(this);
	};

	/**
	 * create a child div on quill.container to hold all the proxy images
	 * @returns HTMLElement
	 */
	public createProxyContainer(): HTMLElement {
		// create a child div on quill.container to hold all the proxy images
		const proxyContainer = document.createElement('div');
		proxyContainer.classList.add('proxy-container');
		this.formatter.quill.container.appendChild(proxyContainer);
		return proxyContainer;
	}
}
