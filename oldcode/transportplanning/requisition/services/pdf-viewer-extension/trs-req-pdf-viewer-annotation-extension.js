(angular => {
	'use strict';
	/* global globals */

	const moduleName = 'transportplanning.requisition';
	angular.module(moduleName).service('trsReqPDFViewerAnnotationExtension', TrsReqPDFViewerAnnotationExtension);
	TrsReqPDFViewerAnnotationExtension.$inject = [
		'$injector',
		'$http',
		'modelWdeViewerMarkupService',
		'ppsCommonDocumentAnnotationExtension',
		'trsReqPDFViewerMarkupSelectionRecordService'
	];

	function TrsReqPDFViewerAnnotationExtension(
		$injector,
		$http,
		modelWdeViewerMarkupService,
		ppsCommonDocumentAnnotationExtension,
		markupSelectionRecordService) {
		let scopeFn = null;
		const HIGH_LIGHT_COLOR = '#0080FF';
		const DEFAULT_COLOR = '#FF0000FF';
		const productGoodsType = $injector.get('trsGoodsTypes').Product;

		const recordSelectionBtnConfig = {
			id: 'recordSelection',
			caption: moduleName + '.pdfViewer.recordSelections',
			iconClass: 'tlb-icons ico-view-select',
			type: 'check',
			value: markupSelectionRecordService.isRecording(),
			fn: () => {
				const records = markupSelectionRecordService.getRecords();
				markupSelectionRecordService.toggleRecordState();

				if (!markupSelectionRecordService.isRecording()) {
					resetRecordedMarkups(records);
				} else {
					const selectedMarkupId = getCurrentHighlightMarkupId();
					markupSelectionRecordService.record(selectedMarkupId);
				}
			},
			disabled: () => {
				return !scopeFn.isLoaded() || !getSelectedTrsReq();
			},
		};
		const linkToTrsReqBtnConfig = {
			id: 'linkToTrsReq',
			caption: moduleName + '.pdfViewer.linkMarkupToTrsReq',
			iconClass: 'tlb-icons ico-assign-bundle',
			type: 'item',
			fn: () => {
				assignRecordedMarkupsToSelectedTrsReq();
			},
			disabled: () => {
				return !scopeFn.isLoaded() || !getSelectedTrsReq() || !markupSelectionRecordService.isRecording();
			},
		};

		Object.assign(this, ppsCommonDocumentAnnotationExtension);

		// region Extension
		const baseBuildToolItems = this.buildToolItems;
		this.buildToolItems = function (toolItems){
			baseBuildToolItems(toolItems, true);

			toolItems.unshift(recordSelectionBtnConfig);
			toolItems.unshift(linkToTrsReqBtnConfig);
		};

		const baseShowAnnoMarker = this.showAnnoMarker;
		this.showAnnoMarker = (filedKey, isShow) => {
			baseShowAnnoMarker(filedKey, isShow);
			if (!filedKey && isShow) {
				highlightAllRecordedMarkups(); // re-set color after annotations show again
			}
		};

		this.onMarkupSelect = markup => {
			if (!markupSelectionRecordService.isRecording()) {
				if (this.setMarkupSelect) { // see model-wdeviewer-markup-service.js.setMarkupSelect
					this.setMarkupSelect(markup.id);
				}
				return;
			}

			// recording selection
			markupSelectionRecordService.record(markup.id);
			highlightAllRecordedMarkups();
		};

		const baseSetScopeFn = this.setScopeFn;
		this.setScopeFn = fn => {
			baseSetScopeFn(fn);
			scopeFn = fn;
		};

		const baseInitMarkItemData = this.initMarkItemData;
		this.initMarkItemData = function (annoMarkItems) {
			baseInitMarkItemData.call(this, annoMarkItems);
		};

		this.getPpsItem = function () {
			const ppsItem = { Id: -1 };

			const selectedReq = $injector.get('transportplanningRequisitionMainService').getSelected();
			if (!selectedReq) {
				return ppsItem;
			}

			ppsItem.Id = selectedReq.PpsItemFk;
			return ppsItem;
		};
		// end region

		this.clearRecordedSelections = () => markupSelectionRecordService.clear();

		function getCurrentHighlightMarkupId() {
			const selected = modelWdeViewerMarkupService.getCommentMarkups().filter(i => i.isCurrentHighlight);
			return selected.length > 0 ? selected[0].MarkerId : null;
		}

		function highlightAllRecordedMarkups() {
			const recordedMarkUpIds = markupSelectionRecordService.getRecords();
			modelWdeViewerMarkupService.updateColors(recordedMarkUpIds, HIGH_LIGHT_COLOR);
		}

		function resetRecordedMarkups(recordedMarkUpIds) {
			modelWdeViewerMarkupService.updateColors(recordedMarkUpIds, DEFAULT_COLOR);
			modelWdeViewerMarkupService.getCommentMarkups().forEach(marker => {
				marker.isSelect = false;
				marker.isCurrentHighlight = false;
			});
		}

		function getSelectedTrsReq() {
			return $injector.get('transportplanningRequisitionMainService').getSelected();
		}

		function getProductsByAnnotation(annotationIds) {
			return $http.post(globals.webApiBaseUrl + 'productionplanning/common/product2annotation/getbyannotations', annotationIds)
				.then(res => res.data.map(i => i.PpsProductFk))
				.then(productIds => $http.post(globals.webApiBaseUrl + 'productionplanning/common/product/getproductsbyids', productIds))
				.then(res => res.data);
		}

		function getAssignedProductIds(goods) {
			return goods.filter(i => i.TrsGoodsTypeFk === productGoodsType).map(i => i.Good);
		}

		function filterAssignedProducts(products) {
			const goodsService = getGoodsDataService();
			const existing = goodsService.getList();

			if (existing.length > 0) {
				const assigned = getAssignedProductIds(existing);
				const unassigned = products.filter(i => !assigned.includes(i.Id));
				return Promise.resolve(unassigned);
			}

			// request
			const selectedTrsReqId = getSelectedTrsReq().Id;
			const url = globals.webApiBaseUrl + 'transportplanning/requisition/trsgoods/listForTrsRequisition?TrsRequisitionId=' + selectedTrsReqId;
			return new Promise((resolve, reject) => {
				$http.get(url).then(res => {
					const assigned = [];
					if (res.data) {
						assigned.push(...getAssignedProductIds(res.data));
					}
					resolve(products.filter(i => !assigned.includes(i.Id)));
				},
				res => reject(res.data));
			});
		}

		function getGoodsDataService() {
			const options = {
				moduleName: moduleName,
				parentService: $injector.get('transportplanningRequisitionMainService'),
				UIStandardServiceFactory: 'transportplanningRequisitionTrsGoodsUIStandardServiceFactory',
				validationServiceFactory: 'transportplanningRequisitionTrsGoodValidationFactory',
			};
			return $injector.get('transportplanningRequisitionTrsGoodDataServiceFactory').getService(options);
		}

		function createProductTypeGoods(products) {
			getGoodsDataService().createItems(products, productGoodsType);
		}

		function assignRecordedMarkupsToSelectedTrsReq() {
			const selectedTrsReq = getSelectedTrsReq();
			if (!markupSelectionRecordService.hasAnyRecord() || !selectedTrsReq) {
				return;
			}

			const recordedMarkupIds = markupSelectionRecordService.getRecords();
			const annotationIds = modelWdeViewerMarkupService.getCommentMarkups()
				.filter(markup => recordedMarkupIds.includes(markup.MarkerId))
				.map(markup => markup.AnnotationFk);

			if (annotationIds.length === 0) {
				return;
			}

			getProductsByAnnotation(annotationIds)
				.then(products => {
					return filterAssignedProducts(products);
				})
				.then(unassignedProducts => {
					createProductTypeGoods(unassignedProducts, productGoodsType);
				})
				.finally(() => {
					markupSelectionRecordService.clear();
					resetRecordedMarkups(recordedMarkupIds);
				})
				.catch(err => {
					throw new Error(err);
				});
		}
	}
})(angular);