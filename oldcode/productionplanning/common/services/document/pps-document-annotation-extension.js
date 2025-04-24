(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonDocumentAnnotationExtension', ['$','$injector', '$http', '$q',
		'platformRuntimeDataService', 'basicsLookupdataLookupFilterService', 'modelWdeViewerMarkupService', 'modelWdeViewerAnnotationService',
		'basicsLookupdataLookupDescriptorService', 'productionplanningCommonProductItemDataService', 'ppsInstallSequenceStatus',
		'trsReqPDFViewerMarkupSelectionRecordService', 'basicsCommonDrawingUtilitiesService', 'transportplanningTransportUtilService',
		function ($, $injector, $http, $q,
			platformRuntimeDataService, basicsLookupdataLookupFilterService, modelWdeViewerMarkupService, modelWdeViewerAnnotationService,
			lookupDescriptorService, productItemDataService, ppsInstallSequenceStatus, markupSelectionRecordService, drawingUtil, trsUtil) {
			let service = {};
			let projectFk = -1;
			let jobFk = -1;
			let productDescriptionFk = -1;
			let engDrawingFk = -1;
			let engDrawingCode = '';
			let product2Stack = {};
			const DEFAULT_HIGHLIGHT_COLOR = '#0080FF';
			const DEFAULT_DEC_COLOR = 16711680; //red
			const FONT_SIZE = 10;
			let pinProductIds = [];
			let localtoolItems = [];
			let installSequenceStatus = ppsInstallSequenceStatus.Nothing;  //add checked: 1, append checked: 2, delete checked: 2
			let currentInstallSequence = 0;
			let stackId4InsertBefore = null;
			let scopeFn = null;
			let productAnnoRelation = {annotation2Product: {}, product2AnnoStatus: {} };
			let productInfos = null;  // productInfos = {productId: {AnnoStatusInfos, ProductDesId, ProductCode}}
			let currentPpsItemFk = -1;
			let currentDocFk = -1;
			let annotationShow = false;
			let linkingProductIds = []; // required for highlight products that linking to trs route in trs req module.
			let issyncMarkupWithProductInfo = false;
			let LINE_THICKNESS = 3;  //lineThickness

			service.setProjectFk = projectId => projectFk = projectId;
			service.setJobFk = jobId => jobFk = jobId;
			service.setEngDrawingFk = engDrawingId => engDrawingFk = engDrawingId;

			service.getEngDrawing = function () {
				return engDrawingFk;
			};

			service.setScopeFn = fn => scopeFn = fn;

			function getHighlightColor(){
				let viewSetting = $injector.get('modelWdeViewerIgeService').getViewSetting(modelWdeViewerMarkupService.scopeOptions.viewerId);
				return viewSetting && viewSetting.highlightColor?  drawingUtil.decToHexColor(viewSetting.highlightColor) : DEFAULT_HIGHLIGHT_COLOR;
			}

			function addPPSGroup(formConfiguration) {
				formConfiguration.showGrouping = true;
				formConfiguration.groups.push({
					gid: 'pps',
					header$tr$: 'productionplanning.common.product.productionSetProductDetailTitle',
					isOpen: true,
					sortOrder: 100
				});
			}
			function inputCheckboxField(text, isSelect, disabled) {
				return {
					Description: text,
					Selected: isSelect,
					Disabled: disabled
				};
			}
			function setTempComment(entity, field) {
				service.tempComment = service.tempComment || [];
				service.tempCommentSelect = service.tempCommentSelect || [];
				const fieldItem = entity[field];
				if (!fieldItem) {
					return;
				}
				if (!service.tempComment.includes(fieldItem.Description)) {
					service.tempComment.push(fieldItem.Description);
				}
				if (fieldItem.Selected && !service.tempCommentSelect.includes(fieldItem.Description)) {
					service.tempCommentSelect.push(fieldItem.Description);
				}
			}
			service.setMarkupComment = function(entity) {
				service.tempCommentSelect = [];
				setTempComment(entity, 'ProductTemplateInput');
				setTempComment(entity, 'DeliveryDateInput');
				if (service.tempComment.length > 0) {
					_.forEach(service.tempComment, function (item) {
						entity.Comment = entity.Comment.replace(item, '');
						entity.Comment = entity.Comment.replace('\n', '');
					});
				}
				const pushComment = service.tempCommentSelect.join('\n');
				entity.Comment = (entity.Comment && entity.Comment.length > 0) ?
					(entity.Comment.trim() + '\n' + pushComment) : pushComment;
			};

			service.getPPSConfigDialog = function (rows) {
				if (_.isNil(rows) || !_.isArray(rows)) {
					return;
				}
				rows.push({
					gid: 'pps',
					label: '*Product',
					label$tr$: 'model.wdeviewer.product',
					model: 'Product',
					sortOrder: 100,
					type: 'directive',
					directive: 'productionplanning-common-product-lookup-new',
					visible: true,
					readonly: true,
					options: {
						showClearButton: true,
						additionalFilters: [{
							getAdditionalEntity: function () {
								return {
									ProjectId: projectFk
								};
							},
							ProjectId: 'ProjectId'
						}, {
							getAdditionalEntity: function () {
								return {
									JobId: jobFk
								};
							},
							JobId: 'JobId'
						}, {
							getAdditionalEntity: function () {
								return {
									DrawingId: engDrawingFk
								};
							},
							DrawingId: 'DrawingId'
						}],
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									if (args.selectedItem) {
										// pd and drawing of selected product
										productDescriptionFk = args.selectedItem.ProductDescriptionFk;
										engDrawingFk = args.selectedItem.EngDrawingFk;
										platformRuntimeDataService.readonly(args.entity, [{
											field: 'Stacking',
											readonly: false
										}]);
									} else {
										productDescriptionFk = -1;
										args.entity.Stacking = -1;
										platformRuntimeDataService.readonly(args.entity, [{
											field: 'Stacking',
											readonly: true
										}]);
									}
								}
							}
						]
					}
				}, {
					gid: 'pps',
					label$tr$: 'model.wdeviewer.stacking',
					model: 'Stacking',
					type: 'directive',
					directive: 'productionplanning-drawing-stack-lookup',
					visible: true,
					sortOrder: 100,
					readonly: true,
					options: {
						filterKey: 'productionplanning-drawing-stack-filter-by-drawing',
						showAddButton: true,
						createOptions: $injector.get('ppsDrawingCreateStackOption'),
					}
				}, {
					gid: 'pps',
					label$tr$: 'productionplanning.common.product.installSequence',
					model: 'InstallSequence',
					type: 'integer',
					visible: true,
					sortOrder: 100,
					readonly: true
				}, {
					gid: 'pps',
					label$tr$: 'productionplanning.common.product.productDescriptionFk',
					model: 'ProductTemplateInput',
					type: 'directive',
					directive: 'form-field-input-checkbox',
					change: function(entity, field){
						service.setMarkupComment(entity);
					},
					visible: true,
					sortOrder: 100,
					readonly: true
				}, {
					gid: 'pps',
					label$tr$: 'productionplanning.common.product.productDescriptionFk',
					model: 'DeliveryDateInput',
					type: 'directive',
					directive: 'form-field-input-checkbox',
					change: function(entity, field){
						service.setMarkupComment(entity);
					},
					visible: true,
					sortOrder: 100,
					readonly: true
				});
			};

			service.registerFilterKey = function () {
				let filters = [
					{
						key: 'productionplanning-drawing-stack-filter-by-drawing',
						fn: function (item) {
							return item && (item.EngDrawingFk === engDrawingFk);

						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			function updateProductInfos(annoId, productId,currentDoc){
				if(productInfos[productId].AnnoStatusInfos === null){
					productInfos[productId].AnnoStatusInfos = [];
					productInfos[productId].AnnoStatusInfos.push({DocId: currentDoc.FileArchiveDocFk, DocFileName: currentDoc.OriginFileName,  AnnotationIds: [annoId]});
				} else {
					let currentInfo = _.find(productInfos[productId].AnnoStatusInfos, {DocId: currentDoc.FileArchiveDocFk});
					if(currentInfo){
						let annoIds = currentInfo.AnnotationIds;
						annoIds.push(annoId);
						currentInfo.AnnotationIds = annoIds;
					} else{
						productInfos[productId].AnnoStatusInfos.push({DocId: currentDoc.FileArchiveDocFk, DocFileName: currentDoc.OriginFileName,  AnnotationIds: [annoId]});
					}
				}
			}

			service.editDialogCallBack = function (markerId, result) {
				let productId = _.isNil(result.Product)? 0 : result.Product;
				let stackingId = result.Stacking;
				let findMarkerItem = _.find(modelWdeViewerMarkupService.commentMarkups, {MarkerId: markerId});
				if (findMarkerItem && findMarkerItem.AnnotationFk) { // product is add/changed/delete (1:Add, 2:Update, 0:Delete)
					let annotationId = findMarkerItem.AnnotationFk;
					let originalP = productAnnoRelation.annotation2Product[annotationId];
					if ((originalP > 0 && originalP !== productId) || (_.isNil(originalP) && productId > 0)) {
						let currentDoc = getSelectedDoc();
						$http.get(globals.webApiBaseUrl + 'productionplanning/common/product2annotation/updateproduct2annotation?annotationFk=' + annotationId + '&productFk=' + productId + '&docId' + currentDoc.FileArchiveDocFk + '&docFileName' + currentDoc.OriginFileName).then(function (result) {
							productAnnoRelation.annotation2Product[annotationId] = result.data;
							updateProductInfos(annotationId, result.data,currentDoc);
						});
					}
					if (stackingId > 0) {
						// only update and add
						let stack2ProdDesc = product2Stack[originalP];
						let updateNew = product2Stack[productId];
						let updateData;
						let needUpdate = false;
						productDescriptionFk = getProductDescriptionByProductId(productId);
						if (_.isNil(updateNew) && _.isNil(stack2ProdDesc)) {
							updateData = {
								Id: -1,
								PpsProductFk: productId,
								EngStackFk: stackingId,
								PpsProductdescriptionFk: productDescriptionFk,
								EngDrawingFk: engDrawingFk
							};
							needUpdate = true;
						} else {
							updateData = !_.isNil(updateNew) ? updateNew : stack2ProdDesc;
							if (updateData.PpsProductFk !== productId || updateData.EngStackFk !== stackingId) {
								updateData.PpsProductFk = productId;
								updateData.PpsProductdescriptionFk = productDescriptionFk;
								updateData.EngStackFk = stackingId;
								updateData.EngDrawingFk = engDrawingFk;
								needUpdate = true;
							}
						}
						if (needUpdate === true) {
							$http.post(globals.webApiBaseUrl + 'productionplanning/drawing/stack2proddesc/updatestack2proddesc', updateData).then(function (result) {
								product2Stack[result.data.PpsProductFk] = result.data;
							});
						}
					}
				}
			};

			service.readonlyFields = function (dataItem) {
				if (dataItem && (_.isNil(dataItem.Product) || dataItem.Product <= 0)) {
					platformRuntimeDataService.readonly(dataItem, [{field: 'Stacking', readonly: true}]);
				}
				platformRuntimeDataService.readonly(dataItem, [{field: 'Color', readonly: true}]);
				platformRuntimeDataService.readonly(dataItem, [{field: 'FillColor', readonly: true}]);
			};

			service.additionConfigDialogOption = function (options) {
				addPPSGroup(options.formConfiguration);
				service.getPPSConfigDialog(options.formConfiguration.rows);
				service.readonlyFields(options.dataItem);
				service.registerFilterKey();
			};

			service.additionParamEditDialog = function (markerParam) {
				if (productItemDataService.isPinForMarkups && pinProductIds.length > 0){
					markerParam.Product = pinProductIds[0];
				} else {
					let findMarkerItem = _.find(modelWdeViewerMarkupService.commentMarkups, {MarkerId: markerParam.id});
					markerParam.Product = findMarkerItem && findMarkerItem.AnnotationFk ? productAnnoRelation.annotation2Product[findMarkerItem.AnnotationFk] : -1;
				}
				const productItem = product2Stack[markerParam.Product];
				markerParam.Stacking = productItem ? productItem.EngStackFk : -1;
				markerParam.InstallSequence = productItem?.InstallSequence;
				markerParam.ProductTemplateInput = inputCheckboxField('template',true,false);
				markerParam.DeliveryDateInput = inputCheckboxField('30/12/2024',true,false);
			};

			service.onItemSelectionChanged = () => {
				productItemDataService.isPinForMarkups = false;
				productItemDataService.firePinForMarkupStateChanged(false);
				pinProductIds = [];
				let itemDataService = $injector.get('productionplanningItemDataService');
				let selectedPpsItem = itemDataService.getSelected();
				if (!selectedPpsItem) {
					return;
				}
				projectFk = selectedPpsItem.ProjectFk;
				jobFk = selectedPpsItem.LgmJobFk;
				productDescriptionFk = selectedPpsItem.ProductDescriptionFk;
				engDrawingFk = selectedPpsItem.EngDrawingDefFk;
			};

			service.initMarkItemData = function (annoMarkItems) {
				issyncMarkupWithProductInfo = false;
				productAnnoRelation = {annotation2Product: {}, product2AnnoStatus: {} };
				let annoIds = _.map(annoMarkItems, 'AnnotationFk');
				let currentDocId = getSelectedDoc().FileArchiveDocFk;
				let promises = [getAnno2ProductRelation(annoIds), this.prepareProductInfos()];
				$q.all(promises).then(function (result){
					if(currentDocId !== currentDocFk && annotationShow === true){
						syncMarkupWithProductInfo();
					}
					currentDocFk = currentDocId;
				});
				productItemDataService.refreshAllAnnoStatus(currentDocId);
			};

			function getAnno2ProductRelation(annoIds){
				let defer = $q.defer();
				if (annoIds.length > 0) {
					$http.post(globals.webApiBaseUrl + 'productionplanning/common/product2annotation/getbyannotations', annoIds).then(function (response) {
						linkingProductIds = [...new Set(response.data.map(i => i.PpsProductFk))];
						_.forEach(response.data, function (item) {
							productAnnoRelation.annotation2Product[item.MdlAnnotationFk] = item.PpsProductFk;
						});
						defer.resolve('true');
					});
				} else {
					defer.resolve('true');
				}
				return defer.promise;
			}

			service.getPpsItem = function() {
				return $injector.get('productionplanningItemDataService').getSelected();
			};

			service.prepareProductInfos = function () {
				let defer = $q.defer();
				productInfos = {};

				let ppsItem = this.getPpsItem();
				if (!ppsItem) {
					defer.resolve('false');
					return defer.promise;
				}

				//get product-stack-info and product-annotationstatus-info
				currentPpsItemFk = ppsItem.Id;
				engDrawingFk = ppsItem.EngDrawingDefFk? ppsItem.EngDrawingDefFk : -1;
				productDescriptionFk = ppsItem.ProductDescriptionFk? ppsItem.ProductDescriptionFk : -1;
				$http.get(globals.webApiBaseUrl + 'productionplanning/common/product/getProductInfos?ppsItemFk=' + ppsItem.Id + '&drawingFk=' + engDrawingFk + '&prodescriptionFk' + productDescriptionFk).then(function (respond){
					productInfos = respond.data.ProductInfos;
					engDrawingFk = respond.data.DrawingFk;
					engDrawingCode = respond.data.DrawingCode;
					if(engDrawingFk > 0){
						$http.get(globals.webApiBaseUrl + 'productionplanning/drawing/stack2proddesc/getbydrawing?engDrawingFk='+ engDrawingFk).then(function (respone) {
							_.forEach(respone.data, function (item) {
								if(item.PpsProductFk > 0){
									product2Stack[item.PpsProductFk] = item;
								}
							});
							defer.resolve('true');
						});
					} else {
						defer.resolve('false');
					}
				});

				return defer.promise;
			};

			function syncMarkupWithProductInfo(){
				_.forEach(modelWdeViewerMarkupService.commentMarkups, function (markupItem){
					let annoId = markupItem.AnnotationFk;
					let text = '';
					let product = null;
					if(productAnnoRelation.annotation2Product[annoId] > 0){
						let productId  = productAnnoRelation.annotation2Product[annoId];
						if(productInfos[productId]) {
							let productCode = productInfos[productId].ProductCode;
							text = engDrawingCode + '\n' + productCode;
							let installSequence = product2Stack[productId]? product2Stack[productId].InstallSequence : 0;
							if(installSequence > 0) {
								text = text + '\n' + installSequence.toString();
							}
							markupItem.Description = text;
							modelWdeViewerMarkupService.igeCtrl.updateMarkupText(markupItem.MarkerId, text, FONT_SIZE);
						}
						let productBackgroundColor = productInfos[productId]? productInfos[productId].BackgroundColor : null;
						if(productBackgroundColor && productBackgroundColor !== markupItem.Color){
							let color = drawingUtil.decToHexColor(productBackgroundColor);
							modelWdeViewerMarkupService.updateColor(markupItem.MarkerId, color, false, true);
							markupItem.Color = markupItem.defaultColor = productBackgroundColor;
						} else {
							markupItem.defaultColor = markupItem.Color;
						}
					} else {
						markupItem.Description = text;
						modelWdeViewerMarkupService.igeCtrl.updateMarkupText(markupItem.MarkerId, text, FONT_SIZE);
					}
				});
				issyncMarkupWithProductInfo = true;
			}
			function updateStackInfo(productIds){
				if (productIds.length > 0) {
					$http.post(globals.webApiBaseUrl + 'productionplanning/drawing/stack2proddesc/getbyproducts', productIds).then(function (respone) {
						_.forEach(respone.data, function (item) {
							product2Stack[item.PpsProductFk] = item;
						});
						getCurrentInstallSequence();
					});
				}
			}

			function getCurrentInstallSequence(){
				//reset currentInstallSequence
				currentInstallSequence = 0;
				_.forEach(product2Stack, function (stack){
					currentInstallSequence = _.max([currentInstallSequence, stack.InstallSequence]);
				});
			}

			function syncMarkupAndProductUI(markupIds){
				let resultInfo = getMarkupIdsAndProductIdsByMarkupIds(markupIds);
				let relateMarkupIds = resultInfo.markupIds;
				let productIds = resultInfo.productIds;
				let excludeMarkupIds = _.map(modelWdeViewerMarkupService.commentMarkups.filter(item => !relateMarkupIds.includes(item.MarkerId)), 'MarkerId');
				productItemDataService.handleProductChanged = false;
				highlightMarkupColors(relateMarkupIds);
				resetMarkupColors(excludeMarkupIds);
				reSelectProducts(productIds);
				productItemDataService.handleProductChanged = true;
			}
			function highlightMarkupColors(markupIds){
				let highLightColor = getHighlightColor();
				_.forEach(markupIds, function (markupId){
					let markupItem = _.find(modelWdeViewerMarkupService.commentMarkups, {'MarkerId' : markupId});
					modelWdeViewerMarkupService.updateColor(markupId, highLightColor);
					markupItem.isSelect = true;
				});
			}

			function resetMarkupColors(markupIds){
				_.forEach(markupIds, function (markupId){
					let markupItem = _.find(modelWdeViewerMarkupService.commentMarkups, {'MarkerId' : markupId});
					let color = markupItem.defaultColor? markupItem.defaultColor : DEFAULT_DEC_COLOR;
					modelWdeViewerMarkupService.updateColor(markupId, drawingUtil.decToHexColor(color));
					markupItem.isSelect = false;
					markupItem.isCurrentHighlight = false;
				});
			}
			function handleInstallSequence(markupId){
				if(installSequenceStatus === ppsInstallSequenceStatus.Append ||installSequenceStatus === ppsInstallSequenceStatus.Insert || installSequenceStatus === ppsInstallSequenceStatus.Remove) {
					let productId = findProduct4Markup(markupId);
					if (productId < 1) {
						return;
					}
					let stackItem = product2Stack[productId];
					let updateData = {
						AddItems: [],
						UpdateItems: []
					};

					switch (installSequenceStatus) {
						case ppsInstallSequenceStatus.Append:
							if (_.isNil(stackItem)) {
								productDescriptionFk = getProductDescriptionByProductId(productId);
								updateData.AddItems.push({
									PpsProductFk: productId,
									PpsProductdescriptionFk: productDescriptionFk,
									EngDrawingFk: engDrawingFk,
									InstallSequence: ++currentInstallSequence
								});
							} else if (stackItem.InstallSequence < 1) {
								stackItem.InstallSequence = ++currentInstallSequence;
								updateData.UpdateItems.push(stackItem);
							}
							break;
						case ppsInstallSequenceStatus.Insert:
							if( stackId4InsertBefore === null ){
								if(stackItem && stackItem.InstallSequence > 0){
									stackId4InsertBefore = stackItem.Id;
								} else {
									// show message "Please select a markup which has install sequence"
									$injector.get('platformModalService').showMsgBox('Please select a markup which has install sequence', 'info', 'info');
								}

							} else if (_.isNil(stackItem) || stackItem.InstallSequence < 1) {
								let stack2InsertBefore = _.find(product2Stack, {Id: stackId4InsertBefore});
								let insetNo = stack2InsertBefore.InstallSequence;
								let increaseItems = _.filter(product2Stack, function (stack){
									return stack.InstallSequence >= insetNo;
								});
								_.forEach(increaseItems, function (stack){
									stack.InstallSequence++;
									updateData.UpdateItems.push(stack);
								});
								if(_.isNil(stackItem)){
									productDescriptionFk = getProductDescriptionByProductId(productId);
									updateData.AddItems.push({
										PpsProductFk: productId,
										PpsProductdescriptionFk: productDescriptionFk,
										EngDrawingFk: engDrawingFk,
										InstallSequence: insetNo
									});
								} else {
									stackItem.InstallSequence = insetNo;
									updateData.UpdateItems.push(stackItem);
								}
								currentInstallSequence++;
								// stackId4InsertBefore = stackItem.Id;
							}
							break;
						case ppsInstallSequenceStatus.Remove:
							if (stackItem && stackItem.InstallSequence > 0) {

								var discreaseItems = _.filter(product2Stack, function (stack) {
									return stack.InstallSequence > stackItem.InstallSequence;
								});
								_.forEach(discreaseItems, function (stack) {
									stack.InstallSequence = stack.InstallSequence - 1;
									updateData.UpdateItems.push(stack);
								});
								stackItem.InstallSequence = null;
								updateData.UpdateItems.push(stackItem);
								--currentInstallSequence;
							}
							break;
					}
					if (updateData.AddItems.length > 0 || updateData.UpdateItems.length > 0) {
						$http.post(globals.webApiBaseUrl + 'productionplanning/drawing/stack2proddesc/updateInstallSequence', updateData).then(function (respond) {
							// update product2Stack and markups and refreash pdf viewer
							let updateStacks = respond.data;
							let originId = modelWdeViewerMarkupService.lockMarkupUpdateId;
							modelWdeViewerMarkupService.lockMarkupUpdateId = 'noSelectMarkup';
							_.forEach(updateStacks, function (updateItem) {
								product2Stack[updateItem.PpsProductFk] = updateItem;
								let annoIds = getAnnoIdsByProductId(updateItem.PpsProductFk);
								if (annoIds.length > 0) {
									let productCode = productInfos[updateItem.PpsProductFk]? productInfos[updateItem.PpsProductFk].ProductCode : '';
									let text = engDrawingCode + '\n' + productCode;
									if(updateItem.InstallSequence > 0){
										text = text + '\n' + updateItem.InstallSequence.toString();
									}
									_.forEach(annoIds, function (annoId){
										updateMarkupTextByAnno(annoId, text);
									});
								}
							});
							productItemDataService.fireInstallSequenceChanged(updateStacks);
							modelWdeViewerMarkupService.lockMarkupUpdateId = originId;
						});
					}
				}
			}

			function findProduct4Markup(markupId){
				let findMarkerItem = _.find(modelWdeViewerMarkupService.commentMarkups, {MarkerId: markupId});
				let annoId = findMarkerItem.AnnotationFk;
				let productId = annoId && productAnnoRelation.annotation2Product[annoId] > 1? productAnnoRelation.annotation2Product[annoId] : -1;
				if(productId < 1){
					$injector.get('platformModalService').showMsgBox('the markup cannot be appended/inserted No. for no product is linked', 'header', 'info');
				}
				return productId;
			}

			function getProductDescriptionByProductId(productId){
				return  productInfos[productId]? productInfos[productId].ProductDesId : -1;
			}

			service.setMarkupsColor = function (isCheck){
				if(!annotationShow){
					return;
				}
				if(isCheck === true){
					let productIds = [];
					if (productItemDataService.getList().length > 0) {
						productIds = _.map(productItemDataService.getList(), 'Id');
					} else {
						productIds = linkingProductIds; // for trs req module
					}

					$http.post(globals.webApiBaseUrl + 'transportplanning/requisition/trsgoods/getLinkReqProductIds', productIds).then(function (result){
						let linkProductIds = result.data;
						var linkMarkupIds = [];
						_.forEach(modelWdeViewerMarkupService.commentMarkups, function (markup){
							if(linkProductIds.includes((productAnnoRelation.annotation2Product[markup.AnnotationFk]))){
								linkMarkupIds.push(markup.MarkerId);
							}
						});
						highlightMarkupColors(linkMarkupIds);
					});
				} else if (isCheck === false) {
					let markupIds = [];
					_.forEach(modelWdeViewerMarkupService.commentMarkups, function (item){
						markupIds.push(item.MarkerId);
					});
					resetMarkupColors(markupIds);
				}
			};

			service.buildToolItems = function (toolItems, fromReq){
				let showLinkRouteMarkers = {
					id: 'markers-linkto-route',
					caption: 'productionplanning.common.product.highlightProductsLinkedToTransport',
					iconClass: 'tlb-icons ico-view-shaded',
					type: 'check',
					value: false,
					fn: function (id, item) {
						service.setMarkupsColor(item.value);
					},
					disabled: function () {
						return !scopeFn.isLoaded();
					}
				};
				toolItems.push(showLinkRouteMarkers);
				if(fromReq === true){
					return;
				}

				let selectMultipleMarkups = {
					id: 'selectMultipleMarkups',
					caption: moduleName + '.pdf.selectMultipleMarkups',
					iconClass: 'tlb-icons ico-view-select',
					type: 'check',
					value: markupSelectionRecordService.isRecording(),
					fn: () => {
						const records = markupSelectionRecordService.getRecords();
						markupSelectionRecordService.toggleRecordState();
						if (!markupSelectionRecordService.isRecording()) {
							let relatedMarkupIds = getMarkupIdsAndProductIdsByMarkupIds(records).markupIds;
							resetMarkupColors(relatedMarkupIds);
							reSelectProducts([]);
						} else {
							const selectedMarkupId = getCurrentHighlightMarkupId();
							markupSelectionRecordService.record(selectedMarkupId);
						}
					},
					disabled: () => {
						return !scopeFn.isLoaded();
					},
				};
				toolItems.unshift(selectMultipleMarkups);

				let installSquenceManager = {
					id: 'install.sequence.manager',
					caption: 'productionplanning.common.product.installSequence',
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-sort',
					list: {
						showImages: true,
						listCssClass: 'dropdown-menu-right',
						items: [{
							id: 'install.sequence.append',
							caption: 'productionplanning.common.pdf.appendInstallSequence',
							iconClass: 'tlb-icons ico-view-rdl-circle',
							type: 'check',
							fn: function (id, item) {
								uncheckInstallSequenceBtn(installSequenceStatus);
								installSequenceStatus = item.value === true ? ppsInstallSequenceStatus.Append : ppsInstallSequenceStatus.Nothing;
								getCurrentInstallSequence();
							},
							disabled: function () {
								return !scopeFn.isLoaded();
							}
						}, {
							id: 'install.sequence.insert',
							caption: 'productionplanning.common.pdf.insertInstallSequence',
							iconClass: 'tlb-icons ico-workflow',
							type: 'check',
							fn: function (id, item) {
								uncheckInstallSequenceBtn(installSequenceStatus);
								installSequenceStatus = item.value === true ? ppsInstallSequenceStatus.Insert : ppsInstallSequenceStatus.Nothing;
								getCurrentInstallSequence();
								if(item.value === true){
									$injector.get('platformModalService').showMsgBox('Please first select one markup, and then select markups which need to insert before it', 'header', 'info');
								}
							},
							disabled: function () {
								return !scopeFn.isLoaded();
							}
						}, {
							id: 'install.sequence.remove',
							caption: 'productionplanning.common.pdf.deleteInstallSequence',
							iconClass: 'tlb-icons ico-workflow-cancel',
							type: 'check',
							fn: function (id, item) {
								uncheckInstallSequenceBtn(installSequenceStatus);
								installSequenceStatus = item.value === true ? ppsInstallSequenceStatus.Remove : ppsInstallSequenceStatus.Nothing;
								getCurrentInstallSequence();
							},
							disabled: function () {
								return !scopeFn.isLoaded();
							}
						}]
					}

				};
				toolItems.push(installSquenceManager);
				localtoolItems = toolItems;
			};

			function getCurrentHighlightMarkupId() {
				const selected = modelWdeViewerMarkupService.getCommentMarkups().filter(i => i.isCurrentHighlight);
				return selected.length > 0 ? selected[0].MarkerId : null;
			}

			function uncheckInstallSequenceBtn(status){
				stackId4InsertBefore = null;
				let btnId = '';
				switch (status){
					case 1: // unckeck append
						btnId = 'install.sequence.append';
						break;
					case 2: // unckeck insert
						btnId = 'install.sequence.insert';
						break;
					case 3: // unckeck remove
						btnId = 'install.sequence.remove';
						break;
					default:
						break;
				}
				if(!_.isEmpty(btnId)){
					let installManagerGroup = _.find(localtoolItems, {id : 'install.sequence.manager'});
					if(installManagerGroup){
						let button = _.find(installManagerGroup.list.items, function (item){
							return item.id === btnId;
						});
						if(button){
							button.value = false;
						}
					}
				}
			}

			service.handleProductChanged = (selectedProductIds) => {
				if(selectedProductIds.length < 0){
					return;
				}
				let markupIds = getRelateMarkupIdsByProductIds(selectedProductIds);
				let excludeMarkupIds = _.map(modelWdeViewerMarkupService.commentMarkups.filter(item => !markupIds.includes(item.MarkerId)), 'MarkerId');
				highlightMarkupColors(markupIds);
				resetMarkupColors(excludeMarkupIds);
			};

			service.pinForMarkups = (bPin) => {
				if(bPin){
					productAnnoRelation.product2AnnoStatus = {};
					let selectEntities = productItemDataService.getSelectedEntities();
					if(selectEntities.length === 0){
						selectEntities = [productItemDataService.getSelected()];
						productItemDataService.setSelectedEntities(selectEntities);
					}
					_.forEach(selectEntities, function (item){
						pinProductIds.push(item.Id);
						productAnnoRelation.product2AnnoStatus[item.Id] = item.LinkProductIcon;
					});
					//refresh annotation status column
					let tickIds = pinProductIds.length === 1? [] : pinProductIds.slice(1);
					productItemDataService.refreshAnnoStatus([], [pinProductIds[0]], tickIds);
				} else {
					//restore the remaining products' annotation status
					let products = productItemDataService.getList();
					_.forEach(pinProductIds, function (pinProductId){
						let product = _.find(products, {Id: pinProductId});
						product.LinkProductIcon = productAnnoRelation.product2AnnoStatus[pinProductId];
					});
					//reselect the product
					let selectIds = _.map(productItemDataService.getSelectedEntities(), 'Id');
					let finalIds = selectIds.filter(e => !pinProductIds.includes(e));
					reSelectProducts(finalIds);
					pinProductIds = [];
					productItemDataService.gridRefresh();
				}
			};

			function reSelectProducts(pinProductIds){
				if(_.isArray(pinProductIds)){
					productItemDataService.fireAnnotationStatusChanged(pinProductIds);
				}
			}

			service.showAnnoMarker = (filedKey, isShow) => {
				if(filedKey === null){
					annotationShow = isShow;
					if(isShow  && !issyncMarkupWithProductInfo){
						let currentDocId = getSelectedDoc().FileArchiveDocFk;
						if(currentDocFk === currentDocId){
							syncMarkupWithProductInfo();
						}
					}
				}
			};

			service.onMarkupSelect = (markUp) => {
				if (modelWdeViewerMarkupService.lockMarkupUpdateId !== 'noSelectMarkup') {
					if((markupSelectionRecordService.isRecording())){
						let resultInfo = getMarkupIdsAndProductIdsByMarkupIds([ markUp.id]);
						let relateMarkupIds = resultInfo.markupIds;
						let records = markupSelectionRecordService.getRecords();
						let selectedRecords = records.filter(e => relateMarkupIds.includes(e));
						if(selectedRecords.length > 0){
							_.forEach(selectedRecords, function (markupId){
								markupSelectionRecordService.deleteRecord(markupId);
							});
						} else {
							markupSelectionRecordService.record(markUp.id);
						}
					} else {
						let markupItem = _.find(modelWdeViewerMarkupService.commentMarkups, {MarkerId : markUp.id});
						markupItem.isCurrentHighlight = true;
					}
					handleInstallSequence(markUp.id);
					let markupIds = markupSelectionRecordService.isRecording()? markupSelectionRecordService.getRecords() : [markUp.id];
					syncMarkupAndProductUI(markupIds);
				}
			};

			service.onMarkupChange = (markup) => {
				if(modelWdeViewerMarkupService.lockMarkupUpdateId === 'createMarkup'){
					if(pinProductIds.length > 0){
						let productId = pinProductIds[0];
						setMarkupCreationColor(productId);
						if(MarkupType && MarkupType.value === 0){ //markupType === Module.MarkupType.Point  //Point, Tick, and Cross will have focus mistakes in continuous mode, so use once to done
							Document.addEventListener('mouseup', function () {
								IgeInstance.createMarkup(MarkupType, DefaultMarkupSetting);
							}, {once: true});
						} else {
							IgeInstance.createMarkup(MarkupType, DefaultMarkupSetting);
						}
					} else {
						productItemDataService.isPinForMarkups = false;
						productItemDataService.firePinForMarkupStateChanged(false);
					}
				}
			};
			function setMarkupCreationColor(productId){
				let product = _.find(productItemDataService.getList(), {Id: productId});
				if(product.BackgroundColor){
					DefaultMarkupSetting.colour = DefaultMarkupSetting.fillColour =  drawingUtil.decToHexColor(product.BackgroundColor);
				}
				DefaultMarkupSetting.decColor = product.BackgroundColor? product.BackgroundColor : DEFAULT_DEC_COLOR;
			}

			let IgeInstance = null;
			let MarkupType = null;
			let DefaultMarkupSetting = null;
			let Document = null;

			service.onMarkupCreate = (layoutId, markup) =>{
				if(productItemDataService.isPinForMarkups){
					let markupJson = markup.serialize();
					modelWdeViewerAnnotationService.saveMultipleMarkup(modelWdeViewerAnnotationService.modelId, layoutId, ' ', [' '], DefaultMarkupSetting.decColor, [markupJson]).then(function (res) {
						modelWdeViewerAnnotationService.addInMarkupComment(res.data);
						let createdMarkup = _.find(modelWdeViewerMarkupService.commentMarkups, {MarkerId : markup.id});
						createdMarkup.defaultColor = DefaultMarkupSetting.decColor;
						let productId = pinProductIds.shift();
						let product = _.find(productItemDataService.getList(), {Id: productId});
						let annoId = res.data[0].Id;
						let currentDoc = getSelectedDoc();
						let postData = {productIds: [productId], annotationIds: [annoId], docId: currentDoc.FileArchiveDocFk, docFileName: currentDoc.OriginFileName};
						$http.post(globals.webApiBaseUrl + 'productionplanning/common/product2annotation/updatemultipleproduct2annotation', postData).then(function (res){
							productAnnoRelation.annotation2Product[annoId] = productId;
							updateProductInfos(annoId, productId, currentDoc);

							let originId = modelWdeViewerMarkupService.lockMarkupUpdateId;
							modelWdeViewerMarkupService.lockMarkupUpdateId = 'createMarkup';
							let text = engDrawingCode + '\n' + product.Code;
							if(product2Stack[product.Id] && product2Stack[product.Id].InstallSequence > 0){
								text = text + '\n' + product2Stack[product.Id].InstallSequence.toString();
							}
							modelWdeViewerMarkupService.igeCtrl.updateMarkupText(markup.id, text, FONT_SIZE);
							modelWdeViewerMarkupService.lockMarkupUpdateId = originId;
							let arrowIds = pinProductIds.length > 0? [pinProductIds[0]] : [];
							productItemDataService.refreshAnnoStatus([productId],arrowIds,[], annoId, currentDoc);
							reSelectProducts(pinProductIds);
						});
					});
					return true;
				}
				return false;
			};

			service.onMarkupUpdateRequest = (document) => {
				if(productItemDataService.isPinForMarkups){
					Document = document;
					return true; // didn't show edit dialog when create markup in PU module while "pin" button is checked
				}
				return false;
			};

			service.createMarkup = (igeInstance, markupType, defaultMarkupSetting) =>{
				if(productItemDataService.isPinForMarkups){
					IgeInstance = igeInstance;
					MarkupType = markupType;
					DefaultMarkupSetting = defaultMarkupSetting;
					DefaultMarkupSetting.lineThickness = LINE_THICKNESS;
					setMarkupCreationColor(pinProductIds[0]);
				}
				igeInstance.createMarkup(markupType, DefaultMarkupSetting);
			};

			function updateMarkupTextByAnno(annoId, text){
				let markupItem = _.find(modelWdeViewerMarkupService.commentMarkups, {AnnotationFk: annoId});
				if(markupItem){
					modelWdeViewerMarkupService.igeCtrl.updateMarkupText(markupItem.MarkerId, text, FONT_SIZE);
				}
			}

			service.synInstallSequenceData = (products) => {
				//syn product2Stack
				updateStackInfo(_.map(products, 'Id'));
				//updateMarkuptext
				let currentDoc = getSelectedDoc();
				_.forEach(products, function (product){
					let annoStatusInfos = productInfos[product.Id].AnnoStatusInfos;
					if(annoStatusInfos && _.find(annoStatusInfos, {DocId: currentDoc.FileArchiveDocFk})){
						let annoIds = _.find(annoStatusInfos, {DocId: currentDoc.FileArchiveDocFk}).AnnotationIds;
						let text = engDrawingCode + '\n' + product.Code;
						if(product.InstallSequence > 0){
							text = text + '\n' + product.InstallSequence.toString();
						}
						_.forEach(annoIds, function (annoId){
							updateMarkupTextByAnno(annoId, text);
						});
					}
				});
			};
			function getAnnoIdsByAnnoId(annoId){
				if(annoId > 0){
					let productId = productAnnoRelation.annotation2Product[annoId];
					return getAnnoIdsByProductId(productId);
				}
				return [];
			}
			function getAnnoIdsByProductId(productId){
				if(productId > 0 && modelWdeViewerMarkupService.currentPreviewDataService){
					let selected = getSelectedDoc();
					if(selected && selected .FileArchiveDocFk && productInfos){
						let currectDocId = selected .FileArchiveDocFk;
						let annoStatusInfo4Product = productInfos[productId]? productInfos[productId].AnnoStatusInfos : null;
						if(annoStatusInfo4Product){
							let annoStatus = _.find(annoStatusInfo4Product, {DocId: currectDocId});
							return  annoStatus? annoStatus.AnnotationIds : [];
						}
					}
					return [];
				}
				return [];
			}
			function getRelateMarkupIdsByProductIds(productIds){
				if(productIds.length > 0 && modelWdeViewerMarkupService.currentPreviewDataService){
					let annoIds = [];
					let selected = getSelectedDoc();
					if(selected && selected .FileArchiveDocFk && productInfos){
						let currectDocId = selected .FileArchiveDocFk;
						_.forEach(productIds, function (productId){
							let annoStatusInfo4Product = productInfos[productId]? productInfos[productId].AnnoStatusInfos : null;
							if(annoStatusInfo4Product){
								let annoStatus = _.find(annoStatusInfo4Product, {DocId: currectDocId});
								if(annoStatus && annoStatus.AnnotationIds ){
									annoIds = annoIds.concat(annoStatus.AnnotationIds);
								}
							}
						});
					}
					return annoIds.length > 0? _.uniq(_.map(modelWdeViewerMarkupService.commentMarkups.filter(item => annoIds.includes(item.AnnotationFk)), 'MarkerId')) : [];
				}
				return [];
			}
			function getMarkupIdsAndProductIdsByMarkupIds(markupIds){
				let result = {'markupIds': [], 'productIds': []};
				if(markupIds.length > 0 && modelWdeViewerMarkupService.currentPreviewDataService){
					let selectedMarkerItems = modelWdeViewerMarkupService.commentMarkups.filter(item => markupIds.includes(item.MarkerId));
					let annoIds = _.map(selectedMarkerItems, 'AnnotationFk');
					let productIds = [];
					_.forEach(annoIds, function (annoId){
						if(productAnnoRelation.annotation2Product[annoId]){
							productIds.push(productAnnoRelation.annotation2Product[annoId]);
						}
					});
					if(productIds.length > 0){
						let markupIdsWithProduct = getRelateMarkupIdsByProductIds(productIds);
						result.markupIds = _.uniq(markupIds.concat(markupIdsWithProduct));
						result.productIds = productIds;
					} else {
						result.markupIds = markupIds;
					}
					return result;
				}
				return result;
			}

			function getSelectedDoc() {
				const selected = modelWdeViewerMarkupService.currentPreviewDataService.getSelected();
				if (!selected) {
					return {
						FileArchiveDocFk: -1,
						OriginFileName: '',
					};
				}
				return selected;
			}

			return service;
		}]);
})(angular);