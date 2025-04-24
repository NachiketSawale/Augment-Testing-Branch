(function () {
	/* global _ */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainTextComplementHelperService', [
		function () {

			var service = {};

			service.getHtmlComplementPhrase = function (caption, body, tail, complType, sorting) {
				function maskHtmlChars(string) {
					string = string||'';
					string = string.replaceAll('<', '&#x3C;');
					string = string.replaceAll('>', '&#x3E;');
					return string;
				}

				caption = maskHtmlChars(caption);
				body    = maskHtmlChars(body);
				tail    = maskHtmlChars(tail);

				const kind = complType === 1 ? 'Owner' : 'Bidder';
				const s = '<TextComplement Kind="'+kind+ '" MarkLbl="'+sorting+'"><ComplCaption>'+(caption)+'</ComplCaption><ComplBody>\''+(body)+'\'</ComplBody><ComplTail>'+(tail)+'</ComplTail></TextComplement>';

				return s;
			};

			service.findTextComplement = function(htmlText, markLbl) {
				const textComplements = htmlText.match(/<TextComplement[\s\S]*?<\/TextComplement>/gi);

				const ret = _.find(textComplements, function(textComplement)
				{
					var found = textComplement.toLowerCase().includes('marklbl="'+markLbl+'"');

					// BRE: Fix of DEV-2146
					// The GAEB import creates redundant data of text complements. One record of type 'BlobsEntity' and one of type 'BoqTextComplementEntity' which might be different like
					// '<TextComplement MarkLbl="01">' <=> 'BoqTextComplementEntity.Sorting==1' (Sorting is an integer).
					// Therfor this 2nd try is an ugly workaround.
					if (!found && markLbl.toString().length===1) {
						found = textComplement.toLowerCase().includes('marklbl="0'+markLbl+'"');
					}

					return found;
				});

				return ret;
			};

			service.adjustHtmlContent = function (content) {

				if (content === null) {
					return content;
				}

				// 1. step: remove incomplete textcomplement nodes (may occur?)
				content = content.replace(/<textcomplement><complcaption>[\s\S]*?<\/complcaption><\/textcomplement>/gi, function () {
					return '';
				});
				content = content.replace(/<textcomplement><complbody>[\s\S]*?<\/complbody><\/textcomplement>/gi, function () {
					return '';
				});
				content = content.replace(/<textcomplement><compltail>[\s\S]*?<\/compltail><\/textcomplement>/gi, function () {
					return '';
				});

				// 2. step: remove empty text complements surroundings
				content = content.replace(/<span[^>]*? class="selectable textcomplement_(bidder|owner)"><\/span>/gi, function () {
					return '';
				});

				// 3. step: remove all other text complements surroundings
				content = content.replace(/<span[^>]*? class="selectable textcomplement.*?">([\s\S]*?<\/TextComplement>)<\/span>/gi, function (match, group) {
					return group;
				});

				// 4. step: remove empty tags
				content = content.replace(/<div><\/div>/gi, function () {
					return '';
				});
				content = content.replace(/<span><\/span>/gi, function () {
					return '';
				});

				return content;
			};

			service.addHtmlAttributes = function (textComplement) {

				// Not used since formatting of elements is not possible! Editing of complements will be prevented by catching key events!
				// return '<span contenteditable="true" class="selectable textcomplement">' + textComplement + '</span>';
				if (textComplement.match(/Kind="Owner"/gi)) {
					return '<span class="selectable textcomplement_owner">' + textComplement + '</span>';
				} else {
					return '<span class="selectable textcomplement_bidder">' + textComplement + '</span>';
				}
			};

			return service;

		}]);
})(angular);
