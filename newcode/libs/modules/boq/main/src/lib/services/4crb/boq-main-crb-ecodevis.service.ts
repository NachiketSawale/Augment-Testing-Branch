import { find, forEach, orderBy, some } from 'lodash';
import { Injectable, inject } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ColumnDef, FieldType, UiCommonGridDialogService, UiCommonLongTextDialogService, TextDisplayType, UiCommonMessageBoxService, IGridDialogOptions } from '@libs/ui/common';
import { BoqItemTreeHelper, BoqLineType} from '../../model/boq-main-boq-constants';
import { BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { ICrbBoqItemEntity } from '../../model/entities/crb-boq-item-entity.interface';

@Injectable({providedIn: 'root'})
export class CrbEcoDevisService {
	private http = inject(PlatformHttpService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly msgBoxService = inject(UiCommonMessageBoxService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly longTextDialogService = inject(UiCommonLongTextDialogService);
	private readonly baseRoute = 'boq/main/crb/ecodevis/';

	public setEcoDevisMarks(boqItemDataService: BoqItemDataServiceBase): void {
		let hasEcodevisMarks: boolean = false;
		const boqitemList = BoqItemTreeHelper.flatten(boqItemDataService.rootEntities());
		const boqChapter = CrbEcoDevisService.getBoqChapter(boqItemDataService);

		this.http.get$(this.baseRoute+'contextdatapositionsforchapter' + CrbEcoDevisService.getQueryPart(boqItemDataService, true)).subscribe(response => {
			const ecoDevisPositions: EcoDevisPosition[] = response as EcoDevisPosition[];
			if (ecoDevisPositions) {
				const orderedBoqItems: ICrbBoqItemEntity[] = orderBy(boqitemList, 'Reference');

				// Resets
				forEach(orderedBoqItems, function(boqItem) {
					boqItem.EcoDevisMark  = '';
					boqItem.EcoDevisInfoMap = new Map<string,string>;
				});

				for (const ecoDevisPosition of ecoDevisPositions) {
					const ecoDevisPositionReference: string = boqChapter?.Reference + ecoDevisPosition.referencPart;

					const boqItem = find(orderedBoqItems, aBoqItem=>aBoqItem.Reference===ecoDevisPositionReference) as ICrbBoqItemEntity;

					if (boqItem && boqItem.BoqLineTypeFk!==BoqLineType.DivisionLevelFirst) {
						hasEcodevisMarks = true;
						boqItem.EcoDevisMark = ecoDevisPosition.mark;
						boqItem.EcoDevisInfoMap = new Map([
							['',                                ecoDevisPositionReference],
							['crbEcodevisInfoShortDescription', ecoDevisPosition.shortDescription],
							['crbEcodevisInfoNote',             ecoDevisPosition.note],
							['crbEcodevisInfoEcoText',          ecoDevisPosition.ecoText]
						]);
					}
				}

				// TODO-FWK-DEV-7051: boqItemDataService.gridRefresh();
			}

			this.msgBoxService.showInfoBox('boq.main.' + (hasEcodevisMarks ? 'crbEcodevisMarksUpdated' : 'crbEcodevisMarksUnavailable'), 'info', false);
		});
	}

	public showEcoDevisInformation(boqItemDataService: BoqItemDataServiceBase): void {
		const currentBoqItem = boqItemDataService.getSelectedEntity() as ICrbBoqItemEntity;
		let infoText = '';

		if (currentBoqItem && currentBoqItem.EcoDevisInfoMap) {
			for (const ecoDevisInfo of currentBoqItem.EcoDevisInfoMap) {
				infoText += (ecoDevisInfo[0] ? (this.translate.instant('boq.main.' + ecoDevisInfo[0]).text + ': ') : '') + (ecoDevisInfo[1] ? ecoDevisInfo[1] : '') + '\n';
			}
		}

		if (infoText) {
			this.longTextDialogService.show({headerText:'boq.main.crbEcodevisInfo', text:infoText, type:TextDisplayType.Plain});
		} else {
			this.msgBoxService.showInfoBox('boq.main.crbEcodevisInfoUnavailable', 'info', false);
		}
	}

	public showEcoDevisRating(boqItemDataService: BoqItemDataServiceBase): void {
		this.http.get$(this.baseRoute+'ecodataratingforposition' + CrbEcoDevisService.getQueryPart(boqItemDataService,false)).subscribe(response => {
			const rating: [string,string][] = response as [string,string][];
			if (rating) {
				const gridDialogData: IGridDialogOptions<EcoDataRating> = {
					width: '70%',
					headerText: 'boq.main.crbEcodevisRating',
					windowClass: 'grid-dialog',
					gridConfig: {
						uuid: '86300f03f9fe4c2e98e345e35b72a058',
						columns: CrbEcoDevisService.getGridColumns(),
					},
					items: this.getRatingGridRows(boqItemDataService, rating, false),
					selectedItems: [],
					resizeable: true
				};
				this.gridDialogService.show(gridDialogData);
			} else {
				this.msgBoxService.showInfoBox('boq.main.crbEcodevisRatingUnavailable', 'info', false);
			}
		});
	}

	public showEcoDevisComparison(boqItemDataService:BoqItemDataServiceBase): void {
		const gridColumns = CrbEcoDevisService.getGridColumns();
		let gridRows: EcoDataRating[];
		let id = 1000;

		this.http.get$(this.baseRoute+'ecodataratingforposition' + CrbEcoDevisService.getQueryPart(boqItemDataService,false)).subscribe(response => {
			const rating: [string,string][] = response as [string,string][];
			if (rating) {
				gridRows = this.getRatingGridRows(boqItemDataService, rating, true);

				this.http.get$(this.baseRoute+'ecodatcomparisonforposition' + CrbEcoDevisService.getQueryPart(boqItemDataService,false)).subscribe(response => {
					const comparisons: [string,string][][] = response as [string,string][][];
					if (comparisons) {				
						forEach(comparisons, (comparison : [string,string][] ) => {
							const gridRow = new EcoDataRating;
							gridRow.Id = id++;

							const getPropValue = (propName: string): string => {
								const comparisonProperty = find(comparison, c=>c[0]===propName);
								return comparisonProperty ? comparisonProperty[1] : '';
							};

							if (comparison != null) {
								forEach(EcoDataRating.getPropNames(), propName => {
									if ('Reference' === propName) { 
										gridRow.Reference = getPropValue(propName);
									} else if ('EcoDevisMark' === propName) {
										gridRow.EcoDevisMark = getPropValue(propName);
									} else if ('Material' === propName) {
										gridRow.Material = getPropValue(propName);
									} else if (propName.includes('Graue_Energie')) {
										gridRow.Graue_Energie = getPropValue('IST_' + propName);
									} else if (propName.includes('Loesemittelemission')) {
										gridRow.Loesemittelemission = getPropValue('IST_' + propName);
									} else if (propName.includes('Emissionen_aus_Schwermetallen')) {
										gridRow.Emissionen_aus_Schwermetallen = getPropValue('IST_' + propName);
									} else if (propName.includes('Formaldehydemissionen')) {
										gridRow.Formaldehydemissionen = getPropValue('IST_' + propName);
									} else if (propName.includes('Biozide')) {
										gridRow.Biozide = getPropValue('IST_' + propName);
									} else if (propName.includes('Emissionsstandard')) {
										gridRow.Emissionsstandard = getPropValue('IST_' + propName);
									} else if (propName.includes('Entsorgung')) {
										gridRow.Entsorgung = getPropValue('IST_' + propName);
									} else if (propName.includes('Umwelt_und_gesundheitsrelevante_Bestandteile')) {
										gridRow.Umwelt_und_gesundheitsrelevante_Bestandteile = getPropValue('IST_' + propName);
									}
								});
							}

							gridRows.push(gridRow);
						});

						const gridDialogData: IGridDialogOptions<EcoDataRating> = {
							width: '70%',
							headerText: 'boq.main.crbEcodevisComparison',
							windowClass: 'grid-dialog',
							gridConfig: {
								uuid: '72b52bd10c9647b4987f43d0281c5f90',
								columns: gridColumns,
							},
							items: gridRows,
							selectedItems: [],
							resizeable: true
						};
						this.gridDialogService.show(gridDialogData);
					} else {
						this.msgBoxService.showInfoBox('boq.main.crbEcodevisComparisonUnavailable', 'info', false);
					}
				});
			}
		});
	}

	public showEcoDevisFiles(boqItemDataService: BoqItemDataServiceBase): void {
		this.http.get$(this.baseRoute+'contextfilemetadataforposition' + CrbEcoDevisService.getQueryPart(boqItemDataService,false)).subscribe(response => {
			const files = response as [{ Name: string, Uri: string }];
			if (some(files)) {
				forEach(files, file => {
					const ecoDevislink = document.createElement('a');
					document.body.appendChild(ecoDevislink);
					ecoDevislink.setAttribute('display', 'none');
					ecoDevislink.href     = file.Uri;
					ecoDevislink.download = file.Name;
					ecoDevislink.type     = 'application/octet-stream';
					ecoDevislink.click();
				});
			} else {
				this.msgBoxService.showInfoBox('boq.main.crbEcodevisFilesUnavailable', 'info', false);
			}
		});
	}

	public showEcoDevisLinks(boqItemDataService: BoqItemDataServiceBase): void {
		this.http.get$(this.baseRoute+'contextdatalinksforposition' + CrbEcoDevisService.getQueryPart(boqItemDataService,false)).subscribe(response => {
			const links = response as [{ description:string, link:string }];
			if (some(links)) {
				forEach(links, link => {
					window.open(link.link);
				});
			} else {
				this.msgBoxService.showInfoBox('boq.main.crbEcodevisLinksUnavailable', 'info', false);
			}
		});
	}

	private static getBoqChapter(boqItemDataService:BoqItemDataServiceBase): ICrbBoqItemEntity | undefined {
		const boqitemList = BoqItemTreeHelper.flatten(boqItemDataService.rootEntities());
		return find(boqitemList, bi=>bi.BoqLineTypeFk===BoqLineType.DivisionLevelFirst);
	}

	private static getQueryPart(boqItemDataService:BoqItemDataServiceBase, isForChapter:boolean): string {
		const boqItem = boqItemDataService.getSelectedEntity() as ICrbBoqItemEntity;
		const boqChapter = CrbEcoDevisService.getBoqChapter(boqItemDataService);
		return (isForChapter ? '?chapterReference='+boqChapter?.Reference : '?boqItemReference='+boqItem.Reference) + '&version='+boqChapter?.Reference2 + '&stand='+boqChapter?.Stand;
	}

	private static getGridColumns(): ColumnDef<EcoDataRating>[] {
		const columns: ColumnDef<EcoDataRating>[] = [];

		forEach(EcoDataRating.getPropNames(), columnId => {
			const column: ColumnDef<EcoDataRating> = {
				id:    columnId,
				model: columnId,
				type: FieldType.Description,
				visible: true,
				sortable: true,
			};

			switch (columnId) {
				case 'Reference':
					column.label = { key: 'boq.main.Reference' };
					column.width = 120;
				break;
				case 'EcoDevisMark':
					column.label = { key: 'boq.main.crbEcodevisMark1' };
					column.width = 30;
				break;
				default:
					column.label = { key: 'boq.main.crbEcodevis' + columnId };
					column.width = 120;
				break;
			}

			columns.push(column);
		});

		return columns;
	}

	private getRatingGridRows(boqItemDataService:BoqItemDataServiceBase, rating:[string,string][], hasEmptyRows:boolean) {
		const rowActual = new EcoDataRating, rowTargetE = new EcoDataRating, rowTargete = new EcoDataRating;
		const currentBoqItem = boqItemDataService.getSelectedEntity() as ICrbBoqItemEntity;
		let id = 0;

		if (rating === null) {
			return [];
		}

		const getPropValue = (propName: string): string => {
			const ratingProperty = find(rating, r=>r[0]===propName);
			return ratingProperty ? ratingProperty[1] : '';
      };

		forEach(EcoDataRating.getPropNames(), propName => {
			if ('Reference' === propName) {
				rowActual. Reference = currentBoqItem.Reference || '';
				rowTargetE.Reference = this.translate.instant('boq.main.crbEcodevisProE').text;
				rowTargete.Reference = this.translate.instant('boq.main.crbEcodevisProe').text;
			} else if ('EcoDevisMark' === propName) {
				rowActual. EcoDevisMark = currentBoqItem.EcoDevisMark || '';
				rowTargetE.EcoDevisMark = 'E';
				rowTargete.EcoDevisMark = 'e';
			} else if ('Material' === propName) {
				rowActual.Material = getPropValue(propName);
			} else if (propName.includes('Graue_Energie')) {
				rowActual. Graue_Energie = getPropValue('IST_'    + propName);
				rowTargetE.Graue_Energie = getPropValue('E_SOLL_' + propName);
				rowTargete.Graue_Energie = getPropValue('e_SOLL_' + propName);
			} else if (propName.includes('Loesemittelemission')) {
				rowActual. Loesemittelemission = getPropValue('IST_'    + propName);
				rowTargetE.Loesemittelemission = getPropValue('E_SOLL_' + propName);
				rowTargete.Loesemittelemission = getPropValue('e_SOLL_' + propName);
			} else if (propName.includes('Emissionen_aus_Schwermetallen')) {
				rowActual. Emissionen_aus_Schwermetallen = getPropValue('IST_'    + propName);
				rowTargetE.Emissionen_aus_Schwermetallen = getPropValue('E_SOLL_' + propName);
				rowTargete.Emissionen_aus_Schwermetallen = getPropValue('e_SOLL_' + propName);
			} else if (propName.includes('Formaldehydemissionen')) {
				rowActual. Formaldehydemissionen = getPropValue('IST_'    + propName);
				rowTargetE.Formaldehydemissionen = getPropValue('E_SOLL_' + propName);
				rowTargete.Formaldehydemissionen = getPropValue('e_SOLL_' + propName);
			} else if (propName.includes('Biozide')) {
				rowActual. Biozide = getPropValue('IST_'    + propName);
				rowTargetE.Biozide = getPropValue('E_SOLL_' + propName);
				rowTargete.Biozide = getPropValue('e_SOLL_' + propName);
			} else if (propName.includes('Emissionsstandard')) {
				rowActual. Emissionsstandard = getPropValue('IST_'    + propName);
				rowTargetE.Emissionsstandard = getPropValue('E_SOLL_' + propName);
				rowTargete.Emissionsstandard = getPropValue('e_SOLL_' + propName);
			} else if (propName.includes('Entsorgung')) {
				rowActual. Entsorgung = getPropValue('IST_'    + propName);
				rowTargetE.Entsorgung = getPropValue('E_SOLL_' + propName);
				rowTargete.Entsorgung = getPropValue('e_SOLL_' + propName);
			} else if (propName.includes('Umwelt_und_gesundheitsrelevante_Bestandteile')) {
				rowActual. Umwelt_und_gesundheitsrelevante_Bestandteile = getPropValue('IST_'    + propName);
				rowTargetE.Umwelt_und_gesundheitsrelevante_Bestandteile = getPropValue('E_SOLL_' + propName);
				rowTargete.Umwelt_und_gesundheitsrelevante_Bestandteile = getPropValue('e_SOLL_' + propName);
			}
		});

		const rows = [rowTargetE,rowTargete,rowActual];
		if (hasEmptyRows) {
			rows.splice(2, 0, new EcoDataRating);
			rows.splice(4, 0, new EcoDataRating);
		}
		forEach(rows, row => {
			row.Id = id++;
		});

		return rows;
	}
}

// TODO-BOQ-DEV-7051-HTTP
interface EcoDevisPosition {
	referencPart: string;
	npkHPosition?: number;
	npkUPosition?: number;
	npkVariable?: number;
	shortDescription: string;
	type: string;
	mark: string;
	note: string;    // origin type is 'Object'
	ecoText: string; // origin type is 'Object'
}

// TODO-BOQ-DEV-7051-HTTP
class EcoDataRating {
	public Id?: number;
	public Reference: string = '';
	public EcoDevisMark: string = '';
	public Material: string = '';
	public Graue_Energie: string = '';
	public Loesemittelemission: string = '';
	public Emissionen_aus_Schwermetallen: string = '';
	public Formaldehydemissionen: string = '';
	public Biozide: string = '';
	public Emissionsstandard: string = '';
	public Entsorgung: string = '';
	public Umwelt_und_gesundheitsrelevante_Bestandteile?: string;

	public static getPropNames(): readonly string[] {
		return Object.getOwnPropertyNames(new EcoDataRating());
	}

	public static getSafePropName(propName:string): keyof EcoDataRating {
		// The 1st try of the implementation of the bracket notation
		const dummyEcoDataRating = new EcoDataRating();
		type EcoDataRatingKey = keyof typeof dummyEcoDataRating;
		return propName as EcoDataRatingKey;
	}
}


