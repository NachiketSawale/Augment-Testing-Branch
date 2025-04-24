/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

import * as _ from 'lodash';
import { CloudDesktopSvgIconService } from '../../../../common/src/lib/services/desktop-svgicon/cloud-desktop-svg-icon.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * @ngdoc directive
 * @name rib-cloudDesktopSvgImage
 * @element svg
 * @restrict A
 * @priority default value
 * @description
 * Insert a svg image from a svg sprite.
 * @example
 * <doc:example>
 * <doc:source>
 * <svg rib-cloudDesktopSvgImage data-sprite ="tlb-icons" data-image="ico-save" data-replace>
 * </doc:source>
 * </doc:example>
 */

@Directive({
	selector: '[uiCommonSvgimage]',
	inputs: ['svgImage']
})
export class SvgImageDirective {
	sprite: any = '@';
	image!: string;
	color: any = '@?';
	colorNr: any = '@?';
	replace = false;
	tools: any = [];
	navbarActions: any = [];
	svg: SafeHtml = '';
	watch: any;

	@Input() set svgImage(value: string) {
		if (this.image !== value) {
			this.image = value;
			this.init();
		}
	}
	constructor(private elem: ElementRef, private cloudDesktopSvgIconService: CloudDesktopSvgIconService, private sanitizer: DomSanitizer) {
	}

	ngOnInit() {
		this.sprite = this.elem.nativeElement.getAttribute('sprite');
		this.color = this.elem.nativeElement.getAttribute('color');
		this.colorNr = this.elem.nativeElement.getAttribute('colorNr');
		this.watch = this.elem.nativeElement.getAttribute('watch');

		this.replace = Object.prototype.hasOwnProperty.call(this.elem, 'replace');

		if (!this.sprite || !this.image || _.isUndefined(this.image)) {
			try {
				console.log('No sprite or image specified sprite:' + this.sprite + ' image:' + this.image);
			} catch (e) {
				console.log(e);
			}
		}
		this.init();
	}


	getSvgTemplate(sprite: any, image: any, color: any, colorNr: any) {
		const svgPath = this.cloudDesktopSvgIconService.getIconUrl(sprite, image);
		let template;

		if (this.replace) {
			const colorStyleString = color ? ` style='--icon-color-${colorNr || 1}: ${color}'` : '';
			template = `<svg xmlns="http://www.w3.org/2000/svg" ${colorStyleString}>
                   <use href="${svgPath}"/>
        </svg>`;
			const parser = new DOMParser();
			const doc = parser.parseFromString(template, 'text/html');
			this.svg = this.sanitizer.bypassSecurityTrustHtml(doc.body.innerHTML);

			return this.svg;
		} else {
			if (color) {
				this.elem.nativeElement.setAttribute('style', `--icon-color-${colorNr || 1}: ${color}'`);
			}

			template = `<use xlink:href="${svgPath}"/>`;
			const parser = new DOMParser();
			const doc = parser.parseFromString(template, 'text/html');
			this.svg = this.sanitizer.bypassSecurityTrustHtml(doc.body.innerHTML);
		}
		return this.svg;
	}

	init() {
		const template = this.getSvgTemplate(this.sprite, this.image, this.color, this.colorNr);
		if (this.replace) {
			this.elem.nativeElement.replaceWith(template);
		} else {
			this.elem.nativeElement.innerHTML = template;
		}
	}
}
