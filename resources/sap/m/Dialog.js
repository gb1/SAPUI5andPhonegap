/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.Dialog");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.Dialog",{metadata:{publicMethods:["open","close"],library:"sap.m",properties:{"icon":{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},"title":{type:"string",group:"Appearance",defaultValue:null}},defaultAggregation:"content",aggregations:{"content":{type:"sap.ui.core.Control",multiple:true,singularName:"content"}},associations:{"leftButton":{type:"sap.m.Button",multiple:false},"rightButton":{type:"sap.m.Button",multiple:false}},events:{"beforeOpen":{},"afterOpen":{},"beforeClose":{},"afterClose":{}}}});sap.m.Dialog.M_EVENTS={'beforeOpen':'beforeOpen','afterOpen':'afterOpen','beforeClose':'beforeClose','afterClose':'afterClose'};jQuery.sap.require("sap.ui.core.Popup");jQuery.sap.require("sap.m.Bar");jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");
sap.m.Dialog.prototype.init=function(){var t=this;this._$window=jQuery(window);this.oPopup=new sap.ui.core.Popup();this.oPopup.setShadow(true);this.oPopup.setModal(true);this.oPopup.setAnimations(this._openAnimation,this._closeAnimation);this._fOrientationChange=jQuery.proxy(this._reposition,this);this.oPopup._applyPosition=function(p){t._setDimensions();t._adjustScrollingPane();sap.ui.core.Popup.prototype._applyPosition.call(this,p)};this.oPopup._showBlockLayer=function(){sap.ui.core.Popup.prototype._showBlockLayer.call(this);var $=jQuery("#sap-ui-blocklayer-popup");if(jQuery.device.is.iphone){$.addClass("sapMDialogTransparentBlk")}else{$.addClass("sapMDialogBlockLayerAnimation");setTimeout(function(){$.addClass("sapMDialogBlockLayer")},0)}};this.oPopup._hideBlockLayer=function(){var $=jQuery("#sap-ui-blocklayer-popup"),t=this;if(jQuery.device.is.iphone){$.removeClass("sapMDialogTransparentBlk");sap.ui.core.Popup.prototype._hideBlockLayer.call(this)}else{$.bind("webkitTransitionEnd",function(){$.unbind("webkitTransitionEnd");sap.ui.core.Popup.prototype._hideBlockLayer.call(t);$.removeClass("sapMDialogBlockLayerAnimation")});$.removeClass("sapMDialogBlockLayer")}};this._oScroller=new sap.ui.core.delegate.ScrollEnablement(this,this.getId()+"-scroll",{horizontal:false,vertical:true,zynga:false,preventDefault:false,nonTouchScrolling:true})};
sap.m.Dialog.prototype.exit=function(){this.oPopup.close();this.oPopup.destroy();this.oPopup=null;if(this._oScroller){this._oScroller.destroy();this._oScroller=null}if(this._header){this._header.destroy();this._header=null}if(this._iconImage){this._iconImage.destroy();this._iconImage=null}this._$window.unbind("resize",this._fOrientationChange)};
sap.m.Dialog.prototype.open=function(){var p=this.oPopup;if(p.isOpen()){return this}this.fireBeforeOpen();p.attachEvent(sap.ui.core.Popup.M_EVENTS.opened,this._handleOpened,this);p.setContent(this);if(jQuery.device.is.iphone){p.setPosition("center top","center bottom",document,"0 0","fit")}else{p.setPosition("center center","center center",document,"0 0","fit")}p.open();return this};
sap.m.Dialog.prototype.close=function(){var p=this.oPopup;var e=this.oPopup.getOpenState();if(!(e===sap.ui.core.OpenState.CLOSED||e===sap.ui.core.OpenState.CLOSING)){this.fireBeforeClose();p.attachEvent(sap.ui.core.Popup.M_EVENTS.closed,this._handleClosed,this);p.close()}return this};
sap.m.Dialog.prototype._handleOpened=function(){this.oPopup.detachEvent(sap.ui.core.Popup.M_EVENTS.opened,this._handleOpened,this);this._$window.bind("resize",this._fOrientationChange);this.fireAfterOpen()};
sap.m.Dialog.prototype._handleClosed=function(){this.oPopup.detachEvent(sap.ui.core.Popup.M_EVENTS.closed,this._handleClosed,this);this._$window.unbind("resize",this._fOrientationChange);this.fireAfterClose()};
sap.m.Dialog.prototype._openAnimation=function(r,R,o){r.css("display","block");if(jQuery.device.is.iphone){r.addClass("sapMDialogBottom").removeClass("sapMDialogHidden");window.setTimeout(function(){r.bind("webkitTransitionEnd",function(){r.unbind("webkitTransitionEnd");r.removeClass("sapMDialogSliding");o()});r.addClass("sapMDialogSliding").removeClass("sapMDialogBottom")},60)}else{r.bind("webkitAnimationEnd",function(){r.unbind("webkitAnimationEnd");o();r.removeClass("sapMDialogOpening")});r.addClass("sapMDialogOpening")}};
sap.m.Dialog.prototype._closeAnimation=function(r,R,c){if(jQuery.device.is.iphone){r.bind("webkitTransitionEnd",function(){r.unbind("webkitTransitionEnd");r.addClass("sapMDialogHidden").removeClass("sapMDialogBottom").removeClass("sapMDialogSliding");c()});r.addClass("sapMDialogSliding").addClass("sapMDialogBottom")}else{r.bind("webkitAnimationEnd",function(){r.unbind("webkitAnimationEnd");c();r.removeClass("sapMDialogClosing")});r.addClass("sapMDialogTransparent sapMDialogClosing")}};
sap.m.Dialog.prototype._setDimensions=function(){this._$window=jQuery(window);var w=this._$window.width(),W=this._$window.height(),m=w-32,M=W-16,i,h,f,$=this.$(),a=jQuery.sap.byId(this.getId()+"-cont");$.css({"width":"","height":"","min-width":"","max-width":"","left":"0px","top":"0px","max-height":""});if(jQuery.device.is.tablet){$.css({"min-width":"300px","max-width":m+"px","max-height":M+"px"})}else{if(jQuery.device.is.iphone){$.css({width:"100%",height:"100%"})}else{if(jQuery.device.is.portrait){$.css({"width":m+"px","max-height":M+"px"})}else{i=W;$.css({"min-width":i+"px","max-width":m+"px","max-height":M+"px"})}}}};
sap.m.Dialog.prototype._adjustScrollingPane=function(){var w=this._$window.width(),W=this._$window.height(),m=jQuery.device.is.iphone?W:W-16,h,f,$=this.$(),a=jQuery.sap.byId(this.getId()+"-cont");if(jQuery.os.ios){h=$.children(".sapMBar").outerHeight();f=0}else{h=$.children("header").outerHeight();f=$.children("footer").outerHeight()}a.css(jQuery.device.is.iphone?"height":"max-height",m-h-f);this._oScroller.refresh()};
sap.m.Dialog.prototype._reposition=function(){var e=this.oPopup.getOpenState();if(!(e===sap.ui.core.OpenState.OPEN)){return}this.oPopup._applyPosition(this.oPopup._oLastPosition)};
sap.m.Dialog.prototype._createHeader=function(){if(jQuery.os.ios){if(!this._header){this._header=new sap.m.Bar(this.getId()+"-header").setParent(this,null,false)}}};
sap.m.Dialog.prototype._getHeader=function(){this._createHeader();return this._header.addStyleClass("sapMHeader-CTX",true)};
sap.m.Dialog.prototype.setLeftButton=function(b){if(typeof(b)==="string"){b=sap.ui.getCore().byId(b)}var o=this.getLeftButton();if(o===b.getId()){return this}if(jQuery.os.ios){this._createHeader();if(b){if(o){this._header.removeAggregation("contentLeft",o,true)}this._header.addAggregation("contentLeft",b,true);this._header.invalidate()}else{this._header.removeContentLeft(o)}}this.setAssociation("leftButton",b,jQuery.os.ios);return this};
sap.m.Dialog.prototype.setRightButton=function(b){if(typeof(b)==="string"){b=sap.ui.getCore().byId(b)}var o=this.getRightButton();if(o===b.getId()){return this}if(jQuery.os.ios){this._createHeader();if(b){if(o){this._header.removeAggregation("contentRight",o,true)}this._header.addAggregation("contentRight",b,true);this._header.invalidate()}else{this._header.removeContentRight(o)}}this.setAssociation("rightButton",b,jQuery.os.ios);return this};
sap.m.Dialog.prototype.setTitle=function(t){if(t){this.setProperty("title",t,true);if(this._headerTitle){this._headerTitle.setText(t)}else{this._headerTitle=new sap.m.Label(this.getId()+"-title",{text:t})}if(jQuery.os.ios){this._createHeader();this._header.addContentMiddle(this._headerTitle)}}return this};
sap.m.Dialog.prototype.setIcon=function(i){if(!jQuery.os.ios){if(i){if(i!==this.getIcon()){if(this._iconImage){this._iconImage.setSrc(i)}else{this._iconImage=new sap.m.Image(this.getId()+"-icon",{src:i})}}}else{if(this._iconImage){this._iconImage.destroy();this._iconImage=null}}}this.setProperty("icon",i,true);return this};