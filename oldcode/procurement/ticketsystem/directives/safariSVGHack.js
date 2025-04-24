/*****
 * by alina
 * date:2017.2.7
 * solve safari bugs svg/fullheight
 ***/
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,$ */

	var isSafari = navigator.vendor && navigator.vendor.indexOf( 'Apple' ) > - 1 && navigator.userAgent && !navigator.userAgent.match( 'CriOS' );
	// var isSafari=true;
	if(isSafari) {
		// for svg sprite img hack slove
		var requestMap={};
		var requestDom={};
		var svgService={
			getSvg:function(_http,_log,url){
				var tempRequest={};
				var domSvg=requestDom[url];
				var requestSvg=requestMap[url];
				if(requestSvg.domCachs.length>0){
					if(domSvg) {
						this.addSvg(url);
					}
					else if(!tempRequest[url]){
						_http.get(url,{cache: true}).then(function successCallback(response){
							var domSvg=requestDom[url]=document.implementation.createHTMLDocument('');
							requestDom[url].body.innerHTML =response.data;
							domSvg._cachedTarget={};
							svgService.addSvg(url);
						}, function errorCallback() {
							_log.error('img not found from server');
						});
					}
				}
			},
			addSvg:function(key){
				var domSvg=requestDom[key];
				var domCachs=requestMap[key].domCachs;
				var domLen=domCachs.length;
				var index=0;
				var cloneDomCachs=domCachs.slice(0);
				while(index<domLen){
					var domItem=cloneDomCachs[index];
					var id=domItem.id;
					var attrs=domItem.attrs;
					var svgNode=domItem.svgNode;
					var arrSvg=[];
					$(svgNode).empty();
					var target = domSvg._cachedTarget[id];
					if (!target) {
						target = domSvg._cachedTarget[id] = domSvg.getElementById(id);
					}
					if(target){
						var cloneTarget=target.cloneNode(true);
						cloneTarget.removeAttribute('id');
						if (attrs.length>0) {
							for(var j=0; j<attrs.length; j++){
								var attrobj=attrs[j];
								cloneTarget.setAttribute(attrobj.key,attrobj.attr);
							}
						}
						arrSvg.push(cloneTarget);
					}
					$(svgNode).append(arrSvg);
					domCachs.splice(index,1);
					index++;
				}
				requestMap[key].domcachs=domCachs;
			}
		};
		var  ticketModule = 'procurement.ticketsystem';
		var ticketsystemModule=angular.module(ticketModule);
		ticketsystemModule.directive('img',['$http','$log',function ($http,$log) {
			var imgObject= {
				restrict: 'E',
				replace:false,
				link: function (scope, elem, attrs) {
					var srcpath = attrs.src ? attrs.src : attrs.ngSrc;
					if (!srcpath) {
						return;
					}
					var isBase64=srcpath.indexOf('data:image/png;base64')>-1;
					if(isBase64){
						return;
					}
					var svgsrc=elem.attr('src');
					var moresrc=elem.attr('data-ng-src');
					var isNgSrc=svgsrc?svgsrc:moresrc;
					if(isNgSrc){
						var srcSplit = srcpath.split('#');
						var url = srcSplit.shift();
						var id = srcSplit.join('#');
						var _attrs=[];
						for(var key in attrs.$attr){
							if('ngSrc'===key||'src'===key) {
								continue;
							}
							var attrObj=attrs[key];
							_attrs.push({key:attrs.$attr[key],attr:attrObj});
						}
						var regExp=/(\.*)\{\{(.+)\}\}/;
						var svgExp=/\w+.svg#\w*/;
						var regExp1=/(\.*)\{{2}(.+)[?(.+):(.+)]?\}{2}/;
						var arrResult=[];
						if(svgExp.test(isNgSrc)||regExp.test(isNgSrc)){
							var svgNode=document.createElement('span');
							$(svgNode).replaceAll(elem);
							if(!requestMap[url]){
								requestMap[url]={};
								requestMap[url].domCachs=[];
							}
							if(regExp.test(isNgSrc)){// have express
								arrResult=isNgSrc.replace(regExp1,'$1,$2').split(',');
								var modelStr=arrResult.pop();
								scope.$watch(modelStr,function(body){
									if(body){
										var isBase64=body.indexOf('data:image/png;base64')>-1;
										var urlSvg=svgExp.test(body);
										if(isBase64){
											$(elem).replaceAll(svgNode);
											return;
										}
										else if(urlSvg){
											var arrSvg=body.split('#');
											arrSvg.shift();
											body=arrSvg.join('#');
										}
										requestMap[url].domCachs.push({attrs:_attrs,svgNode:svgNode,id:body});
										svgService.getSvg($http,$log,url);
									}
								});
							}
							else{
								requestMap[url].domCachs.push({attrs:_attrs,svgNode:svgNode,id:id});
							}
							svgService.getSvg($http,$log,url);
						}


					}

				}
			};
			return imgObject;
		}]);
		// for height 100% width overflow-y:auto  hack slove
		// ms-sv-search-view ts-cart-item-panel ticket-system-order-list-div
		/*
         var arrTicksystemCls=["msSvSearchView","tsCartItemPanel","ticketSystemOrderListDiv"];
         function heightHack(_dirStr) {
         ticketsystemModule.directive(_dirStr, function () {
         return {
         restrict: 'C',
         replace: false,
         link: function (scope, elem, attrs) {
         elem.css({"height": "100vh"});
         }

         }

         });
         }

         for(var j=0;j<arrTicksystemCls.length;j++){
         var dirStr=arrTicksystemCls[j];
         heightHack(dirStr);
         }
         */

	}

})(angular);