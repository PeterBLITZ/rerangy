xn.test.suite("CSS Class Applier module tests", function(s) {
    s.tearDown = function() {
        document.getElementById("test").innerHTML = "";
    };

    s.test("isAppliedToRange tests", function(t) {
        var applier = rangy.createCssClassApplier("test");

        var testEl = document.getElementById("test");
        testEl.innerHTML = 'Test <span id="one" class="test">One</span> x <span id="two" class="test">Two <span id="three">Three</span> two</span> test';
        var oneEl = document.getElementById("one"), twoEl = document.getElementById("two"), threeEl = document.getElementById("three");
        var range = rangy.createRangyRange();

        range.selectNode(oneEl);
        t.assert(applier.isAppliedToRange(range));

        range.selectNodeContents(oneEl);
        t.assert(applier.isAppliedToRange(range));

        range.selectNode(twoEl);
        t.assert(applier.isAppliedToRange(range));

        range.selectNode(threeEl);
        t.assert(applier.isAppliedToRange(range));

        range.selectNode(testEl);
        t.assertFalse(applier.isAppliedToRange(range));

        range.selectNodeContents(testEl);
        t.assertFalse(applier.isAppliedToRange(range));

        range.setStart(testEl.firstChild, 4);
        range.setEndAfter(oneEl);
        t.assertFalse(applier.isAppliedToRange(range));

        range.setStart(testEl.firstChild, 5);
        t.assert(applier.isAppliedToRange(range));

        range.setEnd(oneEl.nextSibling, 0);
        t.assert(applier.isAppliedToRange(range));

        range.setEnd(oneEl.nextSibling, 1);
        t.assertFalse(applier.isAppliedToRange(range));
    });

    s.test("toggleRange simple test 1", function(t) {
        var applier = rangy.createCssClassApplier("test", true);
        var testEl = document.getElementById("test");
        testEl.innerHTML = 'Test <span id="one" class="test">One</span> test';
        var oneEl = document.getElementById("one");
        var range = rangy.createRangyRange();
        range.selectNodeContents(oneEl);
        applier.toggleRange(range);

        t.assertEquals(testEl.childNodes.length, 3);
        t.assertEquals(testEl.firstChild.data, "Test ");
        t.assertEquals(testEl.lastChild.data, " test");
        t.assertEquals(testEl.childNodes[1].tagName, "SPAN");
        t.assertEquals(testEl.childNodes[1].id, "one");
        t.assertEquals(testEl.childNodes[1].className, "");
        t.assertEquals(testEl.childNodes[1].childNodes.length, 1);
        t.assertEquals(testEl.childNodes[1].firstChild.data, "One");

        applier.toggleRange(range);
        t.assertEquals(testEl.childNodes.length, 3);
        t.assertEquals(testEl.firstChild.data, "Test ");
        t.assertEquals(testEl.lastChild.data, " test");
        t.assertEquals(testEl.childNodes[1].tagName, "SPAN");
        t.assertEquals(testEl.childNodes[1].id, "one");
        t.assertEquals(testEl.childNodes[1].className, "test");
        t.assertEquals(testEl.childNodes[1].childNodes.length, 1);
        t.assertEquals(testEl.childNodes[1].firstChild.data, "One");
    });

    s.test("toggleRange simple test 2", function(t) {
        var applier = rangy.createCssClassApplier("test", true);
        var testEl = document.getElementById("test");
        testEl.innerHTML = 'Test <span id="one" class="test other">One</span> test';
        var oneEl = document.getElementById("one");
        var range = rangy.createRangyRange();
        range.selectNodeContents(oneEl);
        applier.toggleRange(range);

        t.assertEquals(testEl.childNodes.length, 3);
        t.assertEquals(testEl.firstChild.data, "Test ");
        t.assertEquals(testEl.lastChild.data, " test");
        t.assertEquals(testEl.childNodes[1].tagName, "SPAN");
        t.assertEquals(testEl.childNodes[1].id, "one");
        t.assertEquals(testEl.childNodes[1].className, "other");
        t.assertEquals(testEl.childNodes[1].childNodes.length, 1);
        t.assertEquals(testEl.childNodes[1].firstChild.data, "One");

        applier.toggleRange(range);
        t.assertEquals(testEl.childNodes.length, 3);
        t.assertEquals(testEl.firstChild.data, "Test ");
        t.assertEquals(testEl.lastChild.data, " test");
        t.assertEquals(testEl.childNodes[1].tagName, "SPAN");
        t.assertEquals(testEl.childNodes[1].id, "one");
        t.assertEquals(testEl.childNodes[1].className, "other test");
        t.assertEquals(testEl.childNodes[1].childNodes.length, 1);
        t.assertEquals(testEl.childNodes[1].firstChild.data, "One");
    });

    s.test("toggleRange nested in other class test", function(t) {
        var applier = rangy.createCssClassApplier("test", true);
        var testEl = document.getElementById("test");
        testEl.innerHTML = 'Before <span id="one" class="other">One</span> after';
        var oneEl = document.getElementById("one");
        var range = rangy.createRangyRange();
        range.setStart(oneEl.firstChild, 1);
        range.setEnd(oneEl.firstChild, 2);
        applier.toggleRange(range);

        t.assertEquals(oneEl.childNodes.length, 3);
        t.assertEquals(oneEl.className, "other");
        t.assertEquals(oneEl.firstChild.data, "O");
        t.assertEquals(oneEl.lastChild.data, "e");
        t.assertEquals(oneEl.childNodes[1].tagName, "SPAN");
        t.assertEquals(oneEl.childNodes[1].className, "test");
        t.assertEquals(oneEl.childNodes[1].childNodes.length, 1);
        t.assertEquals(oneEl.childNodes[1].firstChild.data, "n");

        //t.assertEquals(testEl.innerHTML, 'Before <span id="one" class="other">O<span class="test">n</span>e</span> after');
    });

    s.test("toggleRange range inside class test", function(t) {
        var applier = rangy.createCssClassApplier("test", true);
        var testEl = document.getElementById("test");
        testEl.innerHTML = 'Before <span id="one" class="test">One</span> after';
        var oneEl = document.getElementById("one");
        var range = rangy.createRangyRange();
        range.setStart(oneEl.firstChild, 1);
        range.setEnd(oneEl.firstChild, 2);
        applier.toggleRange(range);

        t.assertEquals(oneEl.childNodes.length, 1);
        t.assertEquals(oneEl.className, "test");
        t.assertEquals(oneEl.firstChild.data, "O");
        //alert(testEl.innerHTML);
        t.assertEquals(oneEl.nextSibling.data, "n");
        t.assertEquals(oneEl.nextSibling.nextSibling.tagName, "SPAN");
        t.assertEquals(oneEl.nextSibling.nextSibling.className, "test");
        t.assertEquals(oneEl.nextSibling.nextSibling.childNodes.length, 1);
        t.assertEquals(oneEl.nextSibling.nextSibling.firstChild.data, "e");

        //t.assertEquals(testEl.innerHTML, 'Before <span id="one" class="test">O</span>n<span class="test">e</span> after');
    });

    function iterateNodes(node, func, includeSelf) {
        if (includeSelf) {
            func(node);
        }
        for (var i = 0, children = node.childNodes, len = children.length; i < len; ++i) {
            iterateNodes(children[i], func, true);
        }
    }

    function RangeInfo() {

    }

    RangeInfo.prototype = {
        setStart: function(node, offset) {
            this.sc = node;
            this.so = offset;
        },
        setEnd: function(node, offset) {
            this.ec = node;
            this.eo = offset;
        }
    };

    function createRangeInHtml(containerEl, html) {
        containerEl.innerHTML = html;
        var range = rangy.createRange(), foundStart = false;
        var rangeInfo = new RangeInfo();
        iterateNodes(containerEl, function(node) {
            if (node.nodeType == 3) {
                var openBracketIndex = node.data.indexOf("[");
                if (openBracketIndex != -1) {
                    node.data = node.data.slice(0, openBracketIndex) + node.data.slice(openBracketIndex + 1);
                    rangeInfo.setStart(node, openBracketIndex);
                    foundStart = true;
                }

                var pipeIndex = node.data.indexOf("|");
                if (pipeIndex == 0) {
                    node.data = node.data.slice(1);
                    rangeInfo[foundStart ? "setEnd" : "setStart"](node.parentNode, rangy.dom.getNodeIndex(node));
                    foundStart = true;
                } else if (pipeIndex == node.length - 1) {
                    node.data = node.data.slice(0, -1);
                    rangeInfo[foundStart ? "setEnd" : "setStart"](node.parentNode, rangy.dom.getNodeIndex(node) + 1);
                    foundStart = true;
                }

                var closeBracketIndex = node.data.indexOf("]");
                if (closeBracketIndex != -1) {
                    node.data = node.data.slice(0, closeBracketIndex) + node.data.slice(closeBracketIndex + 1);
                    rangeInfo.setEnd(node, closeBracketIndex);
                }

                pipeIndex = node.data.indexOf("|");
                if (pipeIndex == 0) {
                    node.data = node.data.slice(1);
                    rangeInfo.setEnd(node.parentNode, rangy.dom.getNodeIndex(node));
                } else if (pipeIndex == node.length - 1) {
                    node.data = node.data.slice(0, -1);
                    rangeInfo.setEnd(node.parentNode, rangy.dom.getNodeIndex(node) + 1);
                }

                // Clear empty text node
                if (node.data.length == 0) {
                    node.parentNode.removeChild(node);
                }
            }
        }, false);

        range.setStart(rangeInfo.sc, rangeInfo.so);
        range.setEnd(rangeInfo.ec, rangeInfo.eo);

        return range;
    }

    function getSortedClassName(el) {
        return el.className.split(/\s+/).sort().join(" ");
    }

    function htmlAndRangeToString(containerEl, range) {
        function isElementRangeBoundary(el, offset, range, isStart) {
            var prefix = isStart ? "start" : "end";
            return (el == range[prefix + "Container"] && offset == range[prefix + "Offset"]);
        }

        function getHtml(node, includeSelf) {
            var html = "";
            if (node.nodeType == 1) {
                if (includeSelf) {
                    html = "<" + node.tagName.toLowerCase();
                    if (node.id) {
                        html += ' id="' + node.id + '"';
                    }
                    if (node.className) {
                        html += ' class="' + getSortedClassName(node) + '"';
                    }
                    if (node.href) {
                        html += ' href="' + node.href + '"';
                    }
                    html += ">";
                }

                for (var i = 0, children = node.childNodes, len = children.length; i <= len; ++i) {
                    if (isElementRangeBoundary(node, i, range, true)) {
                        html += "|";
                    }
                    if (isElementRangeBoundary(node, i, range, false)) {
                        html += "|";
                    }
                    if (i != len) {
                        html += getHtml(children[i], true);
                    }
                }

                if (includeSelf) {
                    html += "</" + node.tagName.toLowerCase() + ">";
                }
            } else if (includeSelf && node.nodeType == 3) {
                var text = node.data;
                if (node == range.endContainer) {
                    text = text.slice(0, range.endOffset) + "]" + text.slice(range.endOffset);
                }
                if (node == range.startContainer) {
                    text = text.slice(0, range.startOffset) + "[" + text.slice(range.startOffset);
                }

                html += text;
            }
            return html;
        }

        return getHtml(containerEl, false);
    }

    function testRangeHtml(testEl, html, t) {
        var range = createRangeInHtml(testEl, html);
        var newHtml = htmlAndRangeToString(testEl, range);
        t.assertEquals(html, newHtml);
    }


    s.test("Test the Range/HTML test functions", function(t) {
        var testEl = document.getElementById("test");
        testRangeHtml(testEl, 'Before <span class="test">[One]</span> after', t);
        testRangeHtml(testEl, 'Before <span class="test">|On]e</span> after', t);
        testRangeHtml(testEl, 'Before <span class="test">|One|</span> after', t);
        testRangeHtml(testEl, 'Bef[ore <span class="test">One</span> af]ter', t);
        testRangeHtml(testEl, 'Bef[ore <span class="test">|One</span> after', t);
        testRangeHtml(testEl, '1[2]3', t);
    });

    /*
    See http://jsfiddle.net/QTs5U/
    and http://aryeh.name/spec/editcommands/autoimplementation.html
     */


    s.test("Test unapply to range spanning two blocks", function(t) {
        var applier = rangy.createCssClassApplier("c1", true);

        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, '<p>[One</p><div class="key">Two]</div>');

        applier.applyToRange(range);
        t.assertEquals('<p><span class="c1">[One</span></p><div class="key"><span class="c1">Two]</span></div>', htmlAndRangeToString(testEl, range));

        applier.undoToRange(range);
        t.assertEquals('<p>[One</p><div class="key">Two]</div>', htmlAndRangeToString(testEl, range));
    });

    s.test("Test multiple classes", function(t) {
        var applier1 = rangy.createCssClassApplier("c1"),
            applier2 = rangy.createCssClassApplier("c2");

        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, "1[234]5");

        applier1.applyToRange(range);
        t.assertEquals('1<span class="c1">[234]</span>5', htmlAndRangeToString(testEl, range));

        range.setStart(range.startContainer, range.startOffset + 1);
        range.setEnd(range.endContainer, range.endOffset - 1);
        applier2.applyToRange(range);
        t.assertEquals('1<span class="c1">2</span><span class="c1 c2">[3]</span><span class="c1">4</span>5', htmlAndRangeToString(testEl, range));
    });

    s.test("Test multiple classes 2", function(t) {
        var applier1 = rangy.createCssClassApplier1("c1"),
            applier2 = rangy.createCssClassApplier1("c2");

        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, "1[234]5");

        applier1.applyToRange(range);
        t.assertEquals('1<span class="c1 rangy_1">[234]</span>5', htmlAndRangeToString(testEl, range));

        range.setStart(range.startContainer, range.startOffset + 1);
        range.setEnd(range.endContainer, range.endOffset - 1);
        applier2.applyToRange(range);
        t.assertEquals('1<span class="c1 rangy_1">2</span><span class="c1 c2 rangy_1 rangy_2">[3]</span><span class="c1 rangy_1">4</span>5', htmlAndRangeToString(testEl, range));
    });

    s.test("Test issue 50 (Mac double click)", function(t) {
        var applier = rangy.createCssClassApplier("c1");

        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, "<b>[one</b>] two");

        applier.applyToRange(range);
        t.assertEquals('<b><span class="c1">[one]</span></b> two', htmlAndRangeToString(testEl, range));
    });

    s.test("Test issue 54 (two appliers, apply first then apply second to subrange then toggle first on same range)", function(t) {
        var applier1 = rangy.createCssClassApplier("c1");

        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, 'T<span class="c1">h<span class="c2">[r]</span>e</span>e');

        applier1.toggleRange(range);
        t.assertEquals('T<span class="c1">h</span><span class="c2">[r]</span><span class="c1">e</span>e', htmlAndRangeToString(testEl, range));
    });

    s.test("Test issue 54 (two appliers, apply first then apply second to subrange then toggle first on same range, more nodes)", function(t) {
        var applier1 = rangy.createCssClassApplier("c1");

        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, '<b>One</b> T<span class="c1">h<span class="c2">[r]</span>e</span>e');

        applier1.toggleRange(range);
        t.assertEquals('<b>One</b> T<span class="c1">h</span><span class="c2">[r]</span><span class="c1">e</span>e', htmlAndRangeToString(testEl, range));
    });

    s.test("Test issue 54 related (last step toggles subrange of subrange)", function(t) {
        var applier1 = rangy.createCssClassApplier("c1");

        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, 'T<span class="c1">h<span class="c2">r[r]r</span>e</span>e');

        applier1.toggleRange(range);
        t.assertEquals('T<span class="c1">h<span class="c2">r</span></span><span class="c2">[r]</span><span class="c1"><span class="c2">r</span>e</span>e', htmlAndRangeToString(testEl, range));
    });

    s.test("Test issue 57 (isAppliedToRange on empty range)", function(t) {
        var applier = rangy.createCssClassApplier("c1");

        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, '<span class="c1">te[]st</span>');
        t.assert(applier.isAppliedToRange(range));

        range = createRangeInHtml(testEl, 'te[]st');
        t.assertFalse(applier.isAppliedToRange(range));
    });

    s.test("Test whitespace 1 (non-ignorable whitespace)", function(t) {
        var applier = rangy.createCssClassApplier("c1");

        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, 'x[<b>1</b> <i>2</i>]x');
        applier.applyToRange(range);
        t.assertEquals('x<b><span class="c1">[1</span></b><span class="c1"> </span><i><span class="c1">2]</span></i>x', htmlAndRangeToString(testEl, range));
    });

    s.test("Test whitespace 2 (ignorable whitespace)", function(t) {
        var applier = rangy.createCssClassApplier("c1");

        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, 'x[<p>1</p> <p>2</p>]x');
        applier.applyToRange(range);
        t.assertEquals('x<p><span class="c1">[1</span></p> <p><span class="c1">2]</span></p>x', htmlAndRangeToString(testEl, range));
    });

    s.test("Test whitespace 3 (ignorable whitespace, ignore option disabled)", function(t) {
        var applier = rangy.createCssClassApplier("c1", {ignoreWhiteSpace: false});

        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, 'x[<p>1</p> <p>2</p>]x');
        applier.applyToRange(range);
        t.assertEquals('x<p><span class="c1">[1</span></p><span class="c1"> </span><p><span class="c1">2]</span></p>x', htmlAndRangeToString(testEl, range));
    });

    s.test("Test link", function(t) {
        var applier = rangy.createCssClassApplier("c1", {
            elementTagName: "a",
            elementProperties: {
                "href": "http://www.google.com/"
            }
        });

        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, 't[es]t');
        applier.applyToRange(range);
        t.assertEquals('t<a class="c1" href="http://www.google.com/">[es]</a>t', htmlAndRangeToString(testEl, range));
    });
}, false);