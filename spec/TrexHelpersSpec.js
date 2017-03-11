describe("TrexHelpers", function() {
    var helpers, windowHeighIs;

    windowHeighIs = function (height) {
        var heightOriginal = $.prototype.height;

        spyOn($.prototype, 'height').and.callFake(function () {
            var original = $.prototype.height;
            if (this[0] === window) {
                return height;
            } else {
                return heightOriginal.apply(this, arguments);
            }
        });
    };

    beforeEach(function() {
        helpers = trex.helpers;
    });

    describe("when there is a element with vcenter-abs class", function () {
        beforeEach(function () {
            affix('.vcenter-abs#test');
        });
        it("should have position absolute and the parent position relative", function() {
            helpers.refresh();
            expect($('#test').css('position')).toBe('absolute');
            expect($('#test').parent().css('position')).toBe('relative');
        });
    });
    describe("when there is a element with vcenter-abs class, 250px height and it doesn't have parent and window.height = 500", function () {
        beforeEach(function () {
            var parentOriginal = $.prototype.parent,
                testElement;

            affix('.vcenter-abs#test');
            $('#test').css('height', "250px");
            testElement = $('#test')[0];
            spyOn($.prototype , 'parent').and.callFake(function () {
                if (this[0] == testElement) {
                    return $(document.body);
                } else {
                    return parentOriginal.apply(this, arguments);
                }
            });
            windowHeighIs(500);
        });

        it("should have top position in 125px", function() {
            helpers.refresh();
            expect($('#test').css('top')).toEqual('125px');
        });
    });

    describe("when there is a element with vcenter-abs class 220px height inside another", function () {
        beforeEach(function () {
            affix('#parent .vcenter-abs#test');
            $('#test').css('height', "220px");
        });

        describe('and their parent has a window-height class, and window height is 500px', function () {
            beforeEach(function () {
                $('#parent').addClass('window-height');
                windowHeighIs(500);
            });

            it('should have top position 140px', function () {
                helpers.refresh();
                expect($('#test').css('top')).toEqual('140px');
            });
        });
        describe('and their parent height is 400px', function () {
            beforeEach(function () {
                $('#parent').css('height', "400px");
            });

            it("should have top position = 90px", function() {
                helpers.refresh();
                expect($('#test').css('top')).toEqual('90px');
            });
        });

        describe('and their parent height is 100px', function () {
            beforeEach(function () {
                $('#parent').css('height', "100px");
            });

            it("should have top position = 0px because the parent height is smaller", function() {
                helpers.refresh();
                expect($('#test').css('top')).toEqual('0px');
            });
        });
    });

    describe('when there is a elements with window-height class', function () {
        beforeEach(function () {
            affix('.window-height#id1');
            affix('#id2 .window-height');
            windowHeighIs(100);
        });

        it('should have the same height that window as minimum height', function () {
            helpers.refresh();
            expect($('.window-height#id1').outerHeight()).toEqual(100);
            expect($('#id2 > .window-height').outerHeight()).toEqual(100);
        });

        describe('and also there is a fixed element', function () {
            beforeEach(function () {
                affix('.fixed');
                $('.fixed').css('height', '10px');
            });

            it('should be the window height minus fixed element', function () {
                helpers.refresh();
                expect($('.window-height#id1').outerHeight()).toEqual(90);
                expect($('#id2 > .window-height').outerHeight()).toEqual(90);
            });
        });

        describe('and this element has padding', function () {
            beforeEach(function () {
                $('#id1').css('padding', '20px 0px 10px 0px');
            });

            it('should be the window height too', function () {
                helpers.refresh();
                expect($('#id1').outerHeight()).toEqual(100);
            });
        });
    });

    describe("when there is a element with vcenter-margin class, 250px height and it doesn't have parent and window.height = 500", function () {
        beforeEach(function () {
            var parentOriginal = $.prototype.parent,
                testElement;

            affix('.vcenter-margin#test');
            $('#test').css('height', "250px");
            testElement = $('#test')[0];
            spyOn($.prototype , 'parent').and.callFake(function () {
                if (this[0] == testElement) {
                    return $(document.body);
                } else {
                    return parentOriginal.apply(this, arguments);
                }
            });
            windowHeighIs(500);
        });

        it("should have margin-top and margin-bottom 125px", function() {
            helpers.refresh();
            expect($('#test').css('margin-top')).toEqual('125px');
            expect($('#test').css('margin-bottom')).toEqual('125px');
        });
    });
});
