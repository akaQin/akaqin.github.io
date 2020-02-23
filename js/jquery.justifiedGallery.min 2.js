/*!
 * justifiedGallery - v4.0.0-alpha
 * http://miromannino.github.io/Justified-Gallery/
 * Copyright (c) 2019 Miro Mannino
 * Licensed under the MIT license.
 */

!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=function(t,i){return void 0===i&&(i="undefined"!=typeof window?require("jquery"):require("jquery")(t)),e(i),i}:e(jQuery)}(function(l){var r=function(t,i){this.settings=i,this.checkSettings(),this.imgAnalyzerTimeout=null,this.entries=null,this.buildingRow={entriesBuff:[],width:0,height:0,aspectRatio:0},this.lastFetchedEntry=null,this.lastAnalyzedIndex=-1,this.yield={every:2,flushed:0},this.border=0<=i.border?i.border:i.margins,this.maxRowHeight=this.retrieveMaxRowHeight(),this.suffixRanges=this.retrieveSuffixRanges(),this.offY=this.border,this.rows=0,this.spinner={phase:0,timeSlot:150,$el:l('<div class="spinner"><span></span><span></span><span></span></div>'),intervalId:null},this.scrollBarOn=!1,this.checkWidthIntervalId=null,this.galleryWidth=t.width(),this.$gallery=t};r.prototype.getSuffix=function(t,i){var e,s;for(e=i<t?t:i,s=0;s<this.suffixRanges.length;s++)if(e<=this.suffixRanges[s])return this.settings.sizeRangeSuffixes[this.suffixRanges[s]];return this.settings.sizeRangeSuffixes[this.suffixRanges[s-1]]},r.prototype.removeSuffix=function(t,i){return t.substring(0,t.length-i.length)},r.prototype.endsWith=function(t,i){return-1!==t.indexOf(i,t.length-i.length)},r.prototype.getUsedSuffix=function(t){for(var i in this.settings.sizeRangeSuffixes)if(this.settings.sizeRangeSuffixes.hasOwnProperty(i)){if(0===this.settings.sizeRangeSuffixes[i].length)continue;if(this.endsWith(t,this.settings.sizeRangeSuffixes[i]))return this.settings.sizeRangeSuffixes[i]}return""},r.prototype.newSrc=function(t,i,e,s){var n;if(this.settings.thumbnailPath)n=this.settings.thumbnailPath(t,i,e,s);else{var r=t.match(this.settings.extension),o=null!==r?r[0]:"";n=t.replace(this.settings.extension,""),n=this.removeSuffix(n,this.getUsedSuffix(n)),n+=this.getSuffix(i,e)+o}return n},r.prototype.showImg=function(t,i){this.settings.cssAnimation?(t.addClass("jg-entry-visible"),i&&i()):(t.stop().fadeTo(this.settings.imagesAnimationDuration,1,i),t.find(this.settings.imgSelector).stop().fadeTo(this.settings.imagesAnimationDuration,1,i))},r.prototype.extractImgSrcFromImage=function(t){var i=t.data("safe-src"),e="date-safe-src";return void 0===i&&(i=t.attr("src"),e="src"),t.data("jg.originalSrc",i),t.data("jg.src",i),t.data("jg.originalSrcLoc",e),i},r.prototype.imgFromEntry=function(t){var i=t.find(this.settings.imgSelector);return 0===i.length?null:i},r.prototype.captionFromEntry=function(t){var i=t.find("> .caption");return 0===i.length?null:i},r.prototype.displayEntry=function(t,i,e,s,n,r){t.width(s),t.height(r),t.css("top",e),t.css("left",i);var o=this.imgFromEntry(t);if(null!==o){o.css("width",s),o.css("height",n),o.css("margin-left",-s/2),o.css("margin-top",-n/2);var a=o.data("jg.src");if(a){a=this.newSrc(a,s,n,o[0]),o.one("error",function(){this.resetImgSrc(o)});var h=function(){o.attr("src",a)};"skipped"===t.data("jg.loaded")?this.onImageEvent(a,function(){this.showImg(t,h),t.data("jg.loaded",!0)}.bind(this)):this.showImg(t,h)}}else this.showImg(t);this.displayEntryCaption(t)},r.prototype.displayEntryCaption=function(t){var i=this.imgFromEntry(t);if(null!==i&&this.settings.captions){var e=this.captionFromEntry(t);if(null===e){var s=i.attr("alt");this.isValidCaption(s)||(s=t.attr("title")),this.isValidCaption(s)&&(e=l('<div class="caption">'+s+"</div>"),t.append(e),t.data("jg.createdCaption",!0))}null!==e&&(this.settings.cssAnimation||e.stop().fadeTo(0,this.settings.captionSettings.nonVisibleOpacity),this.addCaptionEventsHandlers(t))}else this.removeCaptionEventsHandlers(t)},r.prototype.isValidCaption=function(t){return void 0!==t&&0<t.length},r.prototype.onEntryMouseEnterForCaption=function(t){var i=this.captionFromEntry(l(t.currentTarget));this.settings.cssAnimation?i.addClass("caption-visible").removeClass("caption-hidden"):i.stop().fadeTo(this.settings.captionSettings.animationDuration,this.settings.captionSettings.visibleOpacity)},r.prototype.onEntryMouseLeaveForCaption=function(t){var i=this.captionFromEntry(l(t.currentTarget));this.settings.cssAnimation?i.removeClass("caption-visible").removeClass("caption-hidden"):i.stop().fadeTo(this.settings.captionSettings.animationDuration,this.settings.captionSettings.nonVisibleOpacity)},r.prototype.addCaptionEventsHandlers=function(t){var i=t.data("jg.captionMouseEvents");void 0===i&&(i={mouseenter:l.proxy(this.onEntryMouseEnterForCaption,this),mouseleave:l.proxy(this.onEntryMouseLeaveForCaption,this)},t.on("mouseenter",void 0,void 0,i.mouseenter),t.on("mouseleave",void 0,void 0,i.mouseleave),t.data("jg.captionMouseEvents",i))},r.prototype.removeCaptionEventsHandlers=function(t){var i=t.data("jg.captionMouseEvents");void 0!==i&&(t.off("mouseenter",void 0,i.mouseenter),t.off("mouseleave",void 0,i.mouseleave),t.removeData("jg.captionMouseEvents"))},r.prototype.clearBuildingRow=function(){this.buildingRow.entriesBuff=[],this.buildingRow.aspectRatio=0,this.buildingRow.width=0},r.prototype.prepareBuildingRow=function(t){var i,e,s,n,r,o=!0,a=0,h=this.galleryWidth-2*this.border-(this.buildingRow.entriesBuff.length-1)*this.settings.margins,g=h/this.buildingRow.aspectRatio,l=this.settings.rowHeight,d=this.buildingRow.width/h>this.settings.justifyThreshold;if(t&&"hide"===this.settings.lastRow&&!d){for(i=0;i<this.buildingRow.entriesBuff.length;i++)e=this.buildingRow.entriesBuff[i],this.settings.cssAnimation?e.removeClass("jg-entry-visible"):(e.stop().fadeTo(0,.1),e.find("> img, > a > img").fadeTo(0,0));return-1}for(t&&!d&&"justify"!==this.settings.lastRow&&"hide"!==this.settings.lastRow&&(o=!1,0<this.rows&&(o=(l=(this.offY-this.border-this.settings.margins*this.rows)/this.rows)*this.buildingRow.aspectRatio/h>this.settings.justifyThreshold)),i=0;i<this.buildingRow.entriesBuff.length;i++)s=(e=this.buildingRow.entriesBuff[i]).data("jg.width")/e.data("jg.height"),o?(n=i===this.buildingRow.entriesBuff.length-1?h:g*s,r=g):(n=l*s,r=l),h-=Math.round(n),e.data("jg.jwidth",Math.round(n)),e.data("jg.jheight",Math.ceil(r)),(0===i||r<a)&&(a=r);return this.buildingRow.height=a,o},r.prototype.flushRow=function(t){var i,e,s,n=this.settings,r=this.border;if(e=this.prepareBuildingRow(t),t&&"hide"===n.lastRow&&-1===e)this.clearBuildingRow();else{if(this.maxRowHeight&&this.maxRowHeight<this.buildingRow.height&&(this.buildingRow.height=this.maxRowHeight),t&&("center"===n.lastRow||"right"===n.lastRow)){var o=this.galleryWidth-2*this.border-(this.buildingRow.entriesBuff.length-1)*n.margins;for(s=0;s<this.buildingRow.entriesBuff.length;s++)o-=(i=this.buildingRow.entriesBuff[s]).data("jg.jwidth");"center"===n.lastRow?r+=o/2:"right"===n.lastRow&&(r+=o)}var a=this.buildingRow.entriesBuff.length-1;for(s=0;s<=a;s++)i=this.buildingRow.entriesBuff[this.settings.rtl?a-s:s],this.displayEntry(i,r,this.offY,i.data("jg.jwidth"),i.data("jg.jheight"),this.buildingRow.height),r+=i.data("jg.jwidth")+n.margins;this.galleryHeightToSet=this.offY+this.buildingRow.height+this.border,this.setGalleryTempHeight(this.galleryHeightToSet+this.getSpinnerHeight()),(!t||this.buildingRow.height<=n.rowHeight&&e)&&(this.offY+=this.buildingRow.height+n.margins,this.rows+=1,this.clearBuildingRow(),this.settings.triggerEvent.call(this,"jg.rowflush"))}};var i=0;r.prototype.rememberGalleryHeight=function(){i=this.$gallery.height(),this.$gallery.height(i)},r.prototype.setGalleryTempHeight=function(t){i=Math.max(t,i),this.$gallery.height(i)},r.prototype.setGalleryFinalHeight=function(t){i=t,this.$gallery.height(t)},r.prototype.checkWidth=function(){this.checkWidthIntervalId=setInterval(l.proxy(function(){if(this.$gallery.is(":visible")){var t=parseFloat(this.$gallery.width());Math.abs(t-this.galleryWidth)>this.settings.refreshSensitivity&&(this.galleryWidth=t,this.rewind(),this.rememberGalleryHeight(),this.startImgAnalyzer(!0))}},this),this.settings.refreshTime)},r.prototype.isSpinnerActive=function(){return null!==this.spinner.intervalId},r.prototype.getSpinnerHeight=function(){return this.spinner.$el.innerHeight()},r.prototype.stopLoadingSpinnerAnimation=function(){clearInterval(this.spinner.intervalId),this.spinner.intervalId=null,this.setGalleryTempHeight(this.$gallery.height()-this.getSpinnerHeight()),this.spinner.$el.detach()},r.prototype.startLoadingSpinnerAnimation=function(){var t=this.spinner,i=t.$el.find("span");clearInterval(t.intervalId),this.$gallery.append(t.$el),this.setGalleryTempHeight(this.offY+this.buildingRow.height+this.getSpinnerHeight()),t.intervalId=setInterval(function(){t.phase<i.length?i.eq(t.phase).fadeTo(t.timeSlot,1):i.eq(t.phase-i.length).fadeTo(t.timeSlot,0),t.phase=(t.phase+1)%(2*i.length)},t.timeSlot)},r.prototype.rewind=function(){this.lastFetchedEntry=null,this.lastAnalyzedIndex=-1,this.offY=this.border,this.rows=0,this.clearBuildingRow()},r.prototype.getAllEntries=function(){return this.$gallery.children(this.settings.selector).toArray()},r.prototype.updateEntries=function(t){var i;return t&&null!=this.lastFetchedEntry?i=l(this.lastFetchedEntry).nextAll(this.settings.selector).toArray():(this.entries=[],i=this.getAllEntries()),0<i.length&&(l.isFunction(this.settings.sort)?i=this.sortArray(i):this.settings.randomize&&(i=this.shuffleArray(i)),this.lastFetchedEntry=i[i.length-1],this.settings.filter?i=this.filterArray(i):this.resetFilters(i)),this.entries=this.entries.concat(i),!0},r.prototype.insertToGallery=function(t){var i=this;l.each(t,function(){l(this).appendTo(i.$gallery)})},r.prototype.shuffleArray=function(t){var i,e,s;for(i=t.length-1;0<i;i--)e=Math.floor(Math.random()*(i+1)),s=t[i],t[i]=t[e],t[e]=s;return this.insertToGallery(t),t},r.prototype.sortArray=function(t){return t.sort(this.settings.sort),this.insertToGallery(t),t},r.prototype.resetFilters=function(t){for(var i=0;i<t.length;i++)l(t[i]).removeClass("jg-filtered")},r.prototype.filterArray=function(t){var e=this.settings;if("string"===l.type(e.filter))return t.filter(function(t){var i=l(t);return i.is(e.filter)?(i.removeClass("jg-filtered"),!0):(i.addClass("jg-filtered").removeClass("jg-visible"),!1)});if(l.isFunction(e.filter)){for(var i=t.filter(e.filter),s=0;s<t.length;s++)-1===i.indexOf(t[s])?l(t[s]).addClass("jg-filtered").removeClass("jg-visible"):l(t[s]).removeClass("jg-filtered");return i}},r.prototype.resetImgSrc=function(t){"src"==t.data("jg.originalSrcLoc")?t.attr("src",t.data("jg.originalSrc")):t.attr("src","")},r.prototype.destroy=function(){clearInterval(this.checkWidthIntervalId),this.stopImgAnalyzerStarter(),l.each(this.getAllEntries(),l.proxy(function(t,i){var e=l(i);e.css("width",""),e.css("height",""),e.css("top",""),e.css("left",""),e.data("jg.loaded",void 0),e.removeClass("jg-entry jg-filtered jg-entry-visible");var s=this.imgFromEntry(e);s&&(s.css("width",""),s.css("height",""),s.css("margin-left",""),s.css("margin-top",""),this.resetImgSrc(s),s.data("jg.originalSrc",void 0),s.data("jg.originalSrcLoc",void 0),s.data("jg.src",void 0)),this.removeCaptionEventsHandlers(e);var n=this.captionFromEntry(e);e.data("jg.createdCaption")?(e.data("jg.createdCaption",void 0),null!==n&&n.remove()):null!==n&&n.fadeTo(0,1)},this)),this.$gallery.css("height",""),this.$gallery.removeClass("justified-gallery"),this.$gallery.data("jg.controller",void 0),this.settings.triggerEvent.call(this,"jg.destroy")},r.prototype.analyzeImages=function(t){for(var i=this.lastAnalyzedIndex+1;i<this.entries.length;i++){var e=l(this.entries[i]);if(!0===e.data("jg.loaded")||"skipped"===e.data("jg.loaded")){var s=this.galleryWidth-2*this.border-(this.buildingRow.entriesBuff.length-1)*this.settings.margins,n=e.data("jg.width")/e.data("jg.height");if(this.buildingRow.entriesBuff.push(e),this.buildingRow.aspectRatio+=n,this.buildingRow.width+=n*this.settings.rowHeight,this.lastAnalyzedIndex=i,s/(this.buildingRow.aspectRatio+n)<this.settings.rowHeight&&(this.flushRow(!1),++this.yield.flushed>=this.yield.every))return void this.startImgAnalyzer(t)}else if("error"!==e.data("jg.loaded"))return}0<this.buildingRow.entriesBuff.length&&this.flushRow(!0),this.isSpinnerActive()&&this.stopLoadingSpinnerAnimation(),this.stopImgAnalyzerStarter(),this.settings.triggerEvent.call(this,t?"jg.resize":"jg.complete"),this.setGalleryFinalHeight(this.galleryHeightToSet)},r.prototype.stopImgAnalyzerStarter=function(){this.yield.flushed=0,null!==this.imgAnalyzerTimeout&&(clearTimeout(this.imgAnalyzerTimeout),this.imgAnalyzerTimeout=null)},r.prototype.startImgAnalyzer=function(t){var i=this;this.stopImgAnalyzerStarter(),this.imgAnalyzerTimeout=setTimeout(function(){i.analyzeImages(t)},.001)},r.prototype.onImageEvent=function(t,i,e){if(i||e){var s=new Image,n=l(s);i&&n.one("load",function(){n.off("load error"),i(s)}),e&&n.one("error",function(){n.off("load error"),e(s)}),s.src=t}},r.prototype.init=function(){var a=!1,h=!1,g=this;l.each(this.entries,function(t,i){var e=l(i),s=g.imgFromEntry(e);if(e.addClass("jg-entry"),!0!==e.data("jg.loaded")&&"skipped"!==e.data("jg.loaded"))if(null!==g.settings.rel&&e.attr("rel",g.settings.rel),null!==g.settings.target&&e.attr("target",g.settings.target),null!==s){var n=g.extractImgSrcFromImage(s);if(!1===g.settings.waitThumbnailsLoad||!n){var r=parseFloat(s.attr("width")),o=parseFloat(s.attr("height"));if("svg"===s.prop("tagName")&&(r=parseFloat(s[0].getBBox().width),o=parseFloat(s[0].getBBox().height)),!isNaN(r)&&!isNaN(o))return e.data("jg.width",r),e.data("jg.height",o),e.data("jg.loaded","skipped"),h=!0,g.startImgAnalyzer(!1),!0}e.data("jg.loaded",!1),a=!0,g.isSpinnerActive()||g.startLoadingSpinnerAnimation(),g.onImageEvent(n,function(t){e.data("jg.width",t.width),e.data("jg.height",t.height),e.data("jg.loaded",!0),g.startImgAnalyzer(!1)},function(){e.data("jg.loaded","error"),g.startImgAnalyzer(!1)})}else e.data("jg.loaded",!0),e.data("jg.width",e.width()|parseFloat(e.css("width"))|1),e.data("jg.height",e.height()|parseFloat(e.css("height"))|1)}),a||h||this.startImgAnalyzer(!1),this.checkWidth()},r.prototype.checkOrConvertNumber=function(t,i){if("string"===l.type(t[i])&&(t[i]=parseFloat(t[i])),"number"!==l.type(t[i]))throw i+" must be a number";if(isNaN(t[i]))throw"invalid number for "+i},r.prototype.checkSizeRangesSuffixes=function(){if("object"!==l.type(this.settings.sizeRangeSuffixes))throw"sizeRangeSuffixes must be defined and must be an object";var t=[];for(var i in this.settings.sizeRangeSuffixes)this.settings.sizeRangeSuffixes.hasOwnProperty(i)&&t.push(i);for(var e={0:""},s=0;s<t.length;s++)if("string"===l.type(t[s]))try{e[parseInt(t[s].replace(/^[a-z]+/,""),10)]=this.settings.sizeRangeSuffixes[t[s]]}catch(t){throw"sizeRangeSuffixes keys must contains correct numbers ("+t+")"}else e[t[s]]=this.settings.sizeRangeSuffixes[t[s]];this.settings.sizeRangeSuffixes=e},r.prototype.retrieveMaxRowHeight=function(){var t=null,i=this.settings.rowHeight;if("string"===l.type(this.settings.maxRowHeight))t=this.settings.maxRowHeight.match(/^[0-9]+%$/)?i*parseFloat(this.settings.maxRowHeight.match(/^([0-9]+)%$/)[1])/100:parseFloat(this.settings.maxRowHeight);else{if("number"!==l.type(this.settings.maxRowHeight)){if(!1===this.settings.maxRowHeight||null==this.settings.maxRowHeight)return null;throw"maxRowHeight must be a number or a percentage"}t=this.settings.maxRowHeight}if(isNaN(t))throw"invalid number for maxRowHeight";return t<i&&(t=i),t},r.prototype.checkSettings=function(){this.checkSizeRangesSuffixes(),this.checkOrConvertNumber(this.settings,"rowHeight"),this.checkOrConvertNumber(this.settings,"margins"),this.checkOrConvertNumber(this.settings,"border");var t=["justify","nojustify","left","center","right","hide"];if(-1===t.indexOf(this.settings.lastRow))throw"lastRow must be one of: "+t.join(", ");if(this.checkOrConvertNumber(this.settings,"justifyThreshold"),this.settings.justifyThreshold<0||1<this.settings.justifyThreshold)throw"justifyThreshold must be in the interval [0,1]";if("boolean"!==l.type(this.settings.cssAnimation))throw"cssAnimation must be a boolean";if("boolean"!==l.type(this.settings.captions))throw"captions must be a boolean";if(this.checkOrConvertNumber(this.settings.captionSettings,"animationDuration"),this.checkOrConvertNumber(this.settings.captionSettings,"visibleOpacity"),this.settings.captionSettings.visibleOpacity<0||1<this.settings.captionSettings.visibleOpacity)throw"captionSettings.visibleOpacity must be in the interval [0, 1]";if(this.checkOrConvertNumber(this.settings.captionSettings,"nonVisibleOpacity"),this.settings.captionSettings.nonVisibleOpacity<0||1<this.settings.captionSettings.nonVisibleOpacity)throw"captionSettings.nonVisibleOpacity must be in the interval [0, 1]";if(this.checkOrConvertNumber(this.settings,"imagesAnimationDuration"),this.checkOrConvertNumber(this.settings,"refreshTime"),this.checkOrConvertNumber(this.settings,"refreshSensitivity"),"boolean"!==l.type(this.settings.randomize))throw"randomize must be a boolean";if("string"!==l.type(this.settings.selector))throw"selector must be a string";if(!1!==this.settings.sort&&!l.isFunction(this.settings.sort))throw"sort must be false or a comparison function";if(!1!==this.settings.filter&&!l.isFunction(this.settings.filter)&&"string"!==l.type(this.settings.filter))throw"filter must be false, a string or a filter function"},r.prototype.retrieveSuffixRanges=function(){var t=[];for(var i in this.settings.sizeRangeSuffixes)this.settings.sizeRangeSuffixes.hasOwnProperty(i)&&t.push(parseInt(i,10));return t.sort(function(t,i){return i<t?1:t<i?-1:0}),t},r.prototype.updateSettings=function(t){this.settings=l.extend({},this.settings,t),this.checkSettings(),this.border=0<=this.settings.border?this.settings.border:this.settings.margins,this.maxRowHeight=this.retrieveMaxRowHeight(),this.suffixRanges=this.retrieveSuffixRanges()},r.prototype.defaults={sizeRangeSuffixes:{},thumbnailPath:void 0,rowHeight:120,maxRowHeight:!1,margins:1,border:-1,lastRow:"nojustify",justifyThreshold:.9,waitThumbnailsLoad:!0,captions:!0,cssAnimation:!0,imagesAnimationDuration:500,captionSettings:{animationDuration:500,visibleOpacity:.7,nonVisibleOpacity:0},rel:null,target:null,extension:/\.[^.\\/]+$/,refreshTime:200,refreshSensitivity:0,randomize:!1,rtl:!1,sort:!1,filter:!1,selector:"a, div:not(.spinner)",imgSelector:"> img, > a > img, > svg, > a > svg",triggerEvent:function(t){this.$gallery.trigger(t)}},l.fn.justifiedGallery=function(n){return this.each(function(t,i){var e=l(i);e.addClass("justified-gallery");var s=e.data("jg.controller");if(void 0===s){if(null!=n&&"object"!==l.type(n)){if("destroy"===n)return;throw"The argument must be an object"}s=new r(e,l.extend({},r.prototype.defaults,n)),e.data("jg.controller",s)}else if("norewind"===n);else{if("destroy"===n)return void s.destroy();s.updateSettings(n),s.rewind()}s.updateEntries("norewind"===n)&&s.init()})}});