/**
 * Highlighter module for Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Depends on Rangy core, TextRange and CssClassApplier modules.
 *
 * Copyright 2013, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3alpha.738
 * Build date: 21 January 2013
 */
rangy.createModule("Highlighter",function(a,b){function e(a,b){return a.characterRange.start-b.characterRange.start}function h(a,b,c,d){d?(this.id=d,g=Math.max(g,d+1)):this.id=g++,this.characterRange=b,this.doc=a,this.classApplier=c,this.applied=!1}function i(a){var b=this;b.doc=a||document,b.classAppliers={},b.highlights=[]}a.requireModules(["TextRange","CssClassApplier"]);var c=a.dom,d=c.arrayContains,f=[].forEach?function(a,b){a.forEach(b)}:function(a,b){for(var c=0,d=a.length;c<d;++c)b(a[c])},g=1;h.prototype={getRange:function(){var b=a.createRange(this.doc);return b.selectCharacters(this.doc.body,this.characterRange.start,this.characterRange.end),b},containsElement:function(a){return this.getRange().containsNodeContents(a.firstChild)},unapply:function(){this.classApplier.undoToRange(this.getRange()),this.applied=!1},apply:function(){this.classApplier.applyToRange(this.getRange()),this.applied=!0},toString:function(){return"[Highlight(ID: "+this.id+", class: "+this.classApplier.cssClass+", character range: "+this.characterRange.start+" - "+this.characterRange.end+")]"}},i.prototype={addClassApplier:function(a){this.classAppliers[a.cssClass]=a},getHighlightForElement:function(a){var b=this.highlights;for(var c=0,d=b.length;c<d;++c)if(b[c].containsElement(a))return b[c];return null},removeHighlights:function(a){for(var b=0,c=this.highlights.length,e;b<c;++b)e=this.highlights[b],d(a,e)&&(e.unapply(),this.highlights.splice(b--,1))},getIntersectingHighlights:function(b){var c=[],e=this.highlights;return a.noMutation(function(){f(b,function(a){var b=a.toCharacterRange();f(e,function(a){highlightCharRange=a.characterRange,b.intersects(highlightCharRange)&&!d(c,a)&&c.push(a)})})}),c},highlightSelection:function(b,c){var d,e,g;c=c||a.getSelection();var i=this.classAppliers[b],j=this.highlights,k=this.doc,l=k.body;if(!i)throw new Error("No class applier found for class '"+b+"'");var m=c.saveCharacterRanges(l),n=[];a.noMutation(function(){for(d=0,g=c.rangeCount;d<g;++d)n[d]=c.getRangeAt(d).toCharacterRange(l)});var o=[],p,q,r;for(d=0,g=n.length;d<g;++d){p=n[d],r=!1;for(e=0;e<j.length;++e)q=j[e].characterRange,q.intersects(p)&&(o.push(j[e]),j[e]=new h(k,q.union(p),i));r||j.push(new h(k,p,i))}return f(o,function(a){a.unapply()}),f(j,function(a){a.applied||a.apply()}),c.restoreCharacterRanges(l,m),j},unhighlightSelection:function(b){b=b||a.getSelection();var c=this.getIntersectingHighlights(b.getAllRanges());f(c,function(a){a.unapply()}),b.removeAllRanges()},selectionOverlapsHighlight:function(b){return b=b||a.getSelection(),this.getIntersectingHighlights(b.getAllRanges()).length>0},serialize:function(){var a=this.highlights;a.sort(e);var b=[];return f(a,function(a){var c=a.characterRange;b.push([c.start,c.end,a.id,a.classApplier.cssClass].join("$"))}),b.join("|")},deserialize:function(b){var c=b.split("|"),d=[],e=this.doc.body;for(var f=c.length,g,i,j,k;f-->0;)i=c[f].split("$"),g=a.createRange(this.doc),g.selectCharacters(e,+i[0],+i[1]),j=this.classAppliers[i[3]],k=new h(this.doc,new a.CharacterRange(+i[0],+i[1]),j,i[2]),k.apply(),d.push(k);this.highlights=d}},a.Highlighter=i,a.createHighlighter=function(a){return new i(a)}})