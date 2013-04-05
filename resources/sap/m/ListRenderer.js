/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.ListRenderer");sap.m.ListRenderer={};
sap.m.ListRenderer.render=function(r,c){if(!c.getVisible()){return}var I=c.getInset();r.write("<div");r.addClass("sapMList");if(I){r.addClass("sapMListInsetBG")}r.writeClasses();r.writeControlData(c);if(c.getWidth()){r.addStyle("width",c.getWidth());r.writeStyles()}r.write(">");if(c.getHeaderText()){r.write("<header");if(I)r.addClass("sapMListHdrInset");else r.addClass("sapMListHdr");r.writeClasses();r.write(">");r.writeEscaped(c.getHeaderText());r.write("</header>")}r.write("<ul");r.addClass("sapMListUl");if(I){r.addClass("sapMListInset");if(c.getHeaderText()){r.addClass("sapMListInsetHdr")}if(c.getFooterText()){r.addClass("sapMListInsetFtr")}}r.writeClasses();r.write(">");if(c._mode!=sap.m.ListMode.None&&c._mode!=c.getMode()){c._removeCurrentSelection()}if(c._includeItemInSelection!=c.getIncludeItemInSelection()){c._removeCurrentSelection();c._includeItemInSelection=c.getIncludeItemInSelection()};c._previousSingleSelect=null;c._mode=c.getMode();var a=c.getItems();for(var i=0;i<a.length;i++){a[i]._mode=c.getMode();a[i]._includeItemInSelection=c.getIncludeItemInSelection();a[i]._select=c._select;a[i]._delete=c._delete;a[i]._listId=c.getId();r.renderControl(a[i])}r.write("</ul>");if(c.getFooterText()){r.write("<footer");if(I)r.addClass("sapMListFtrInset");else r.addClass("sapMListFtr");r.writeClasses();r.write(">");r.writeEscaped(c.getFooterText());r.write("</footer>")}r.write("</div>")};