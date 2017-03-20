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

            describe('and the element has paddings (10px top, 20px bottom)', function () {
                beforeEach(function () {
                    $('#test').css('padding-top', '10px');
                    $('#test').css('padding-bottom', '20px');
                });

                it('should have top position = 75px', function () {
                    helpers.refresh();
                    expect($('#test').css('top')).toEqual('75px');
                });
            });

            describe('and the element has excedent paddings (100px top, 100px bottom)', function () {
                beforeEach(function () {
                    $('#test').css('padding-top', '100px');
                    $('#test').css('padding-bottom', '100px');
                });

                it('should have top position = 0px', function () {
                    helpers.refresh();
                    expect($('#test').css('top')).toEqual('0px');
                });
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

            $('.window-height#id1').append('<div style="height: 200px"></div>');
            expect($('.window-height#id1').outerHeight()).toEqual(200);
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

        describe('and also have forced and slideshow class element', function () {
            beforeEach(function () {
                $('#id1').addClass('forced');
            });

            it('should have height css value setted only when forced is setted', function () {
                helpers.refresh();
                expect($('.window-height#id1')[0].style.height).toEqual('100px');
                expect($('#id2 > .window-height')[0].style.height).toBe("");
            });

            describe('also with slideshow class', function () {
                beforeEach(function () {
                    $('#id1').removeClass('forced');
                    $('#id1').addClass('slideshow');
                });

                it('should have height css value setted only when forced is setted', function () {
                    helpers.refresh();
                    expect($('.window-height#id1')[0].style.height).toEqual('100px');
                    expect($('#id2 > .window-height')[0].style.height).toBe("");
                });
            });

            describe('also with fixed position', function () {
                beforeEach(function () {
                    $('#id1').removeClass('forced');
                    $('#id1').css('position', 'fixed');
                });

                it('should have height css value setted only when forced is setted', function () {
                    helpers.refresh();
                    expect($('.window-height#id1')[0].style.height).toEqual('100px');
                    expect($('#id2 > .window-height')[0].style.height).toBe("");
                });
            });

            describe('and also have fixed element', function () {
                beforeEach(function () {
                    affix('.fixed');
                    $('.fixed').css('height', '15px');
                });

                it('should have height css value setted minus fixed only when forced is setted', function () {
                    helpers.refresh();
                    expect($('.window-height#id1')[0].style.height).toEqual('85px');
                    expect($('#id2 > .window-height')[0].style.height).toBe("");
                });
            });

            describe('and also have #wpadminbar element and #page-header element', function () {
                beforeEach(function () {
                    affix('#wpadminbar');
                    $('#wpadminbar').css('height', '5px');

                    affix('#page-header');
                    $('#page-header').css('height', '15px');
                });

                it('should have height css value setted minus wpadminbar height only when forced is setted', function () {
                    helpers.refresh();
                    expect($('.window-height#id1')[0].style.height).toEqual('95px');
                    expect($('#id2 > .window-height')[0].style.height).toBe("");

                    $('#page-header').css('position', 'fixed');
                    helpers.refresh();
                    expect($('.window-height#id1')[0].style.height).toEqual('80px');
                    expect($('#id2 > .window-height')[0].style.height).toBe("");

                    $('#wpadminbar').remove();

                    helpers.refresh();
                    expect($('.window-height#id1')[0].style.height).toEqual('85px');
                    expect($('#id2 > .window-height')[0].style.height).toBe("");
                });
            });
        });

        describe('and also there are #page-header element', function () {
            beforeEach(function () {
                var $page;

                affix('#page-header');
                $page = $('#page-header');
                $page.css('height', '10px');

            });

            it('should be the window height', function () {
                helpers.refresh();
                expect($('.window-height#id1').outerHeight()).toEqual(100);
                expect($('#id2 > .window-height').outerHeight()).toEqual(100);
            });

            describe('and the #page-header has fixed position', function () {
                beforeEach(function () {
                    $('#page-header').css('position', 'fixed');
                });

                afterEach(function () {
                    $('#page-header').css('position', 'auto');
                });

                it('should be the window height minus header element', function () {
                    helpers.refresh();
                    expect($('.window-height#id1').outerHeight()).toEqual(90);
                    expect($('#id2 > .window-height').outerHeight()).toEqual(90);
                });

                describe('and also there is a #wpadminbar element', function () {
                    beforeEach(function () {
                        var $adminbar;

                        affix('#wpadminbar');
                        $adminbar = $('#wpadminbar');
                        $adminbar.css('height', '15px');
                    });

                    it('should be the window height minus header element and wpadminbar element', function () {
                        helpers.refresh();
                        expect($('.window-height#id1').outerHeight()).toEqual(75);
                        expect($('#id2 > .window-height').outerHeight()).toEqual(75);
                    });
                });
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

    describe("when there is a element with vcenter-margin class, 200px height and it doesn't have parent and window.height = 500", function () {
        beforeEach(function () {
            var parentOriginal = $.prototype.parent,
                testElement;

            affix('.vcenter-margin#test');
            $('#test').css('height', "200px");
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

        it("should have margin-top and margin-bottom 150px", function() {
            helpers.refresh();
            expect($('#test').css('margin-top')).toEqual('150px');
            expect($('#test').css('margin-bottom')).toEqual('150px');
        });

        describe('if the element has 20 top padding and 30 bottom padding', function () {
            beforeEach(function () {
                $('#test').css('padding-top', "20px");
                $('#test').css('padding-bottom', "30px");
            });

            it("should have margin-top 130px and margin-bottom 120px", function() {
                helpers.refresh();
                expect($('#test').css('margin-top')).toEqual('130px');
                expect($('#test').css('margin-bottom')).toEqual('120px');
            });
        });
    });

    describe('when there is a element with percent-window class and window height is 600px', function () {
        beforeEach(function () {
            windowHeighIs(600);
            affix('.percent-window#test');
        });

        describe('and this element has content with 20px height but has not data-percent', function () {
            beforeEach(function () {
                $('#test').html('<div style="height: 20px">My content</div>');
            });
            it('should have 20px height', function () {
                helpers.refresh();
                expect($('#test').height()).toEqual(20);
            });
        });

        describe('and this element has data-percent=40', function () {
            beforeEach(function () {
                $('#test').data('percent', '40');
            });

            it('should have 240px height', function () {
                helpers.refresh();
                expect($('#test').height()).toEqual(240);
            });

            describe('and there is a vcenter-abs element inside', function () {
                beforeEach(function () {
                    $('#test').append('<div class="vcenter-abs"></div>');
                    $('#test .vcenter-abs').css('height', '50px');
                });

                it('should have top position > 0', function () {
                    helpers.refresh();
                    expect($('#test .vcenter-abs').css('top').replace('px', '')).toBeGreaterThan(0);
                });
            });

            describe('and there is another percent-window with data-percent=50', function () {
                beforeEach(function () {
                    affix('.percent-window#test2');
                    $('#test2').data('percent', '50');
                });

                it('should have 240px height the first element and 300px the second element', function () {
                    helpers.refresh();
                    expect($('#test').height()).toEqual(240);
                    expect($('#test2').height()).toEqual(300);
                });
            });
        });
    });

    describe('when there is a goto element with data-target in another element', function () {
        var animateArguments;

        afterEach(function () {
            animateArguments = undefined;
        });

        beforeEach(function() {
            var targetElement, offsetOriginal, animateOriginal;
            affix('a.goto#test');
            affix('#target');
            $('#test').data('target', '#target');
            targetElement = $('#target')[0];
            offsetOriginal = $.prototype.offset;
            animateOriginal = $.prototype.animate;
            spyOn($.prototype , 'offset').and.callFake(function () {
                if (this[0] == targetElement) {
                    return {
                        top: 2800
                    }
                } else {
                    return offsetOriginal.apply(this, arguments);
                }
            });

            spyOn($.prototype , 'animate').and.callFake(function () {
                if (this.selector == "html, body") {
                    animateArguments = arguments;
                } else {
                    return offsetOriginal.apply(this, arguments);
                }
            });
        });

        it('should animate scroll on goto element click to the top position of target', function () {
            helpers.refresh();
            $('#test').trigger('click');
            expect(animateArguments).not.toBeUndefined();
            expect(animateArguments[0].scrollTop).toEqual(2800);
        });

        describe('when there is fixed elements', function () {
            beforeEach(function() {
                affix('.fixed#fixed');
                $('#fixed').css('height', '50px');
            });

            it('should animate scroll on goto element click to the top position of target minus fixed element height', function () {
                helpers.refresh();
                $('#test').trigger('click');
                expect(animateArguments).not.toBeUndefined();
                expect(animateArguments[0].scrollTop).toEqual(2750);
            });
        });
    });

    describe("when there is a element with sync-property class, and other element as data-target", function () {
        beforeEach(function () {
            affix('#target');
            affix('.sync-property#test');
            $('#test').data('target', '#target');
        });

        describe("and the data-from is height and data-to is height", function () {
            beforeEach(function () {
                var $test = $('#test'), $target = $('#target').css('height', '250px');
                $test.data('from', 'height');
                $test.data('to', 'padding-top');

            });

            it('should have the same properties values', function () {
                helpers.refresh();

                expect($('#test').css('padding-top')).toEqual('250px');
            });
        });
    });
});
