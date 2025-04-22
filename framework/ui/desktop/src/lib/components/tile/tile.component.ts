/*
 * Copyright(c) RIB Software GmbH
 */
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RGBColor } from 'd3';
import { CloudDesktopSvgIconService } from '@libs/ui/common';
import { IGroup } from '../../models/interfaces/group.interface';
import { ITilesData } from '../../models/interfaces/tile.interface';
import { DrawingUtilsService } from '../../services/drawing-utils.service';
import { TranslatePipe, Translatable } from '@libs/platform/common';
import { BasicsCommonUtilities } from '../../constants/BasicsCommonUtilities';

@Component({
	selector: 'ui-desktop-tile',
	templateUrl: './tile.component.html',
	styleUrls: ['./tile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Component for tiles.
 */
export class UiDesktopTileComponent implements OnInit {
	/**
	 * Variable for Tiles.
	 */
	@Input() tile!: ITilesData;
	/**
	 * Variable for group.
	 */
	@Input() group!: IGroup;
	/**
	 * Variable for index of tiles.
	 */
	@Input() i!: number;
	/**
	 * Variable for template for tile.
	 */
	template!: string;
	/**
	 * Variable for svg.
	 */
	svg!: HTMLInputElement | SafeHtml;

	/**
	 * Variable for tile name.
	 */
	tileDisplayName!: Translatable;
	/**
	 * Variable for tile description.
	 */
	tileDescription!: Translatable;

	colorStyleString!: string;

	private basicsCommonUtilities = new BasicsCommonUtilities();

	constructor(private router: Router, private sanitizer: DomSanitizer, public cloudDesktopSvgIconService: CloudDesktopSvgIconService, public drawingUtilsService: DrawingUtilsService, public translate: TranslatePipe) {}

	ngOnInit(): void {}

	/**
	 * To get the data of tiles.
	 * @param tile accepts object of ITilesData.
	 */
	getTiles(tile: ITilesData): void {
		const targetRoute = tile.targetRoute;
		this.router.navigate([targetRoute]);
	}

	/**
	 * To get the template for icon.
	 * @param tile accepts object of ITilesData.
	 * @returns {string}
	 */
	getIconTemplate(tile: ITilesData): string {
		let url: string | undefined = '';
		if (tile.type === 1 && 'image' in tile) {
			url = this.basicsCommonUtilities.toImage(tile.image);
		} else if (tile.type === 2 && 'icon' in tile) {
			if (url) {
				url = tile.icon;
			}
		}
		return url !== ''
			? '<img src="' +
					url +
					'" /><div><h5 style="font: 13px / normal "source_sans", Microsoft YaHei, STHeiti">' +
					tile.displayName +
					'</h5><span style="font: 13px / normal "source_sans", Microsoft YaHei, STHeiti">' +
					tile.description +
					'</span></div>'
			: '';
	}

	/**
	 * To get the template for svg.
	 * @param sprite accepts string for sprite.
	 * @param image accepts string for image.
	 * @param color accepts string for color.
	 * @param colorNr accepts number for colorNr.
	 * @param tile accepts object of ITilesData.
	 * @returns {SafeHtml}
	 */
	getSvgTemplate(sprite: string, image: string, color: string, colorNr: number, tile: ITilesData): SafeHtml {
		this.tileDisplayName = tile.displayName ? this.translate.transform(tile.displayName) : '';
		this.tileDescription = tile.description ? this.translate.transform(tile.description) : '';
		const svgPath: string | undefined = this.cloudDesktopSvgIconService.getIconUrl(sprite, image);
		this.colorStyleString = color ? ` [style]='--icon-color-${colorNr || 1}: ${color}'` : '';
		this.template = `<svg xmlns="http://www.w3.org/2000/svg" ${this.colorStyleString}><use href="${svgPath}"/></svg><div><h5 style="font: 13px / normal 'source_sans', Microsoft YaHei, STHeiti">${this.tileDisplayName}</h5><span style="font: 13px / normal 'source_sans', Microsoft YaHei, STHeiti">${this.tileDescription}</span></div>`;

		const parser: DOMParser = new DOMParser();
		const doc: Document = parser.parseFromString(this.template, 'text/html');
		this.svg = this.sanitizer.bypassSecurityTrustHtml(doc.body.innerHTML);
		return this.svg;
	}

	/**
	 * To get color for tile.
	 * @param intColor accepts number for color.
	 * @param opacity accepts number for opacity.
	 * @returns {string}
	 */
	getColor(intColor: number, opacity: number): string {
		const color: RGBColor = this.drawingUtilsService.intToRgbColor(intColor, opacity);

		let rgbValue: string = 'rgb(' + color.r + ',' + color.g + ',' + color.b;
		if (opacity) {
			rgbValue += ',' + opacity;
		}
		rgbValue += ')';

		return rgbValue;
	}

	/**
	 * To get style for tile.
	 * @param item accepts object of ITilesData.
	 * @returns {string}
	 */
	getStyle(item: ITilesData): string {
		const opacity = item.disabled ? 0.3 : item.tileOpacity;
		return 'background-color:' + this.getColor(item.tileColor, opacity) + '; color: ' + this.getColor(item.textColor, opacity) + '; outline-color: ' + this.getMouseOverColor(item.tileColor) + ';';
	}

	/**
	 * to get color on mouse hover.
	 * @param color accepts color as number.
	 * @returns {string}
	 */
	getMouseOverColor(color: number): string {
		return this.drawingUtilsService.IntColor(color);
	}
}
