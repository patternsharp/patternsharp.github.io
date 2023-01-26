'use strict';

var Mi = {
    init: function() {

        this.Basic.init();
        this.Components.init();  

    },
    Basic: {
        init: function() {

            var self = this;

            Pace.on('done', function(){
                $('#page-loader').fadeOut(200);
                self.animations();
            });
            
            self.backgrounds();
            self.scroller();
            self.masonry();
            self.ajaxLoader();
            self.mobileNav();
            self.forms();

        },
        mobileDetector: function () {

            var isMobile = {
                Android: function() {
                    return navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function() {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function() {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                },
                Opera: function() {
                    return navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function() {
                    return navigator.userAgent.match(/IEMobile/i);
                },
                any: function() {
                    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
                }
            };

            window.trueMobile = isMobile.any();

            if (trueMobile) {
                $('audio').remove();
            }

        },
        backgrounds: function() {

            // Images 
            $('.bg-image').each(function(){
                var src = $(this).children('img').attr('src');
                $(this).css('background-image','url('+src+')').children('img').hide();
            });

            // Slideshow 
            $('.bg-slideshow').owlCarousel({
                singleItem: true,
                autoPlay: 4000,
                pagination: false,
                navigation: false,
                navigationText: false,
                slideSpeed: 1500,
                transitionStyle: 'fade',
                mouseDrag: false,
                touchDrag: false
            });

        },
        animations: function() {
            // Animation - hover 
            $('.animated-hover')
                .on('mouseenter', function(){
                    var animation = $(this).data('hover-animation');
                    var duration = $(this).data('hover-animation-duration');
                    $(this).stop().css({
                        '-webkit-animation-duration': duration+'ms',
                        'animation-duration': duration+'ms'
                    }).addClass(animation);
                })
                .on('mouseleave', function(){
                    var $self = $(this);
                    var animation = $(this).data('hover-animation');
                    var duration = $(this).data('hover-animation-duration');
                    $(this).stop().removeAttr('style').removeClass(animation); 
                });

            // Animation - appear 
            $('.animated').appear(function() {
                $(this).each(function(){ 
                    var $target =  $(this);
                    var delay = 200 + $(this).data('animation-delay');
                    setTimeout(function() {
                        $target.addClass($target.data('animation')).addClass('visible')
                    }, delay);
                });
            });

        },
        scroller: function() {

            var $header = $('#header');
            var headerHeight = $('#header').height();
            var $mobileNav = $('#mobile-nav');
            var $section = $('.section','#content');
            var $body = $('body');
            var scrollOffset = 0;
            if ($body.hasClass('header-horizontal')) scrollOffset = -headerHeight;

            var $scrollers = $('#header, #mobile-nav, [data-target="local-scroll"]');
            $scrollers.find('a').on('click', function(){
                $(this).blur();
            });
            $scrollers.localScroll({
                offset: scrollOffset,
                duration: 800,
                easing: $('#content').data('scroll-easing')
            });

            var $menuItem = $('#main-menu li > a, #mobile-nav li > a');
            var checkMenuItem = function(id) {
                $menuItem.each(function(){
                    var link = $(this).attr('href');
                    if(id==link) $(this).addClass('active');
                    else $(this).removeClass('active');
                });
            }
            $section.waypoint({
                handler: function(direction) {
                    if(direction=='up') {
                        var id = '#'+this.element.id;
                        checkMenuItem(id);
                    }
                },
                offset: function() {
                    if ($body.hasClass('header-horizontal')) return -this.element.clientHeight+headerHeight+2;
                    else return -this.element.clientHeight+2;
                }
            });
            $section.waypoint({
                handler: function(direction) {
                    if(direction=='down') {
                        var id = '#'+this.element.id;
                        checkMenuItem(id);
                    }
                },
                offset: function() {
                    if ($body.hasClass('header-horizontal')) return headerHeight+1;
                    else return 1;
                }
            });
            $(window).resize(function(){
                setTimeout(function(){
                    Waypoint.refreshAll()
                },600);
            });
        },
        masonry: function() {

            var $grid = $('.masonry');

            $grid.masonry({
                columnWidth: '.masonry-sizer',
                itemSelector: '.masonry-item',
                percentPosition: true
            });

            $grid.imagesLoaded().progress(function() {
                $grid.masonry('layout');
            });

            $grid.on('layoutComplete', Waypoint.refreshAll());

        },
        ajaxLoader: function() {

            var toLoad;
            var offsetTop;

            var $ajaxLoader = $('#ajax-loader');
            var $ajaxModal = $('#ajax-modal');
            var isAjaxModal = false;

            function showNewContent() {
                $ajaxModal.fadeIn(200, function(){
                    $('html').addClass('locked-scrolling');
                });
            }
            
            function loadContent() {　
               $ajaxModal.load(toLoad);
        　  }
            
            $('[data-target="ajax-modal"]').on('click', function() {
                isAjaxModal = true;
                offsetTop = $(document).scrollTop();
                toLoad = $(this).attr('href');　
                loadContent();
                $('body').addClass('ajax-modal-opened');
                return false; 
            });

            $(document).ajaxStart(function() {
                if(isAjaxModal) $ajaxLoader.fadeIn(200);
            });
            $(document).ajaxStop(function() {
                if(isAjaxModal) $ajaxLoader.fadeOut(200, function(){
                    showNewContent();
                });
            });

            function closeDetails() {
                isAjaxModal = false;
                $('html').removeClass('locked-scrolling');
                $('body').removeClass('ajax-modal-opened');
                $(document).scrollTop(offsetTop)
                $ajaxModal.fadeOut(200).scrollTop(0);
            }

            $ajaxModal.delegate('*[data-dismiss="close"]','click', function(){
                closeDetails();
                return false;
            });

        },
        mobileNav: function() {
            $('[data-target="mobile-nav"]').on('click', function(){
                $('body').toggleClass('mobile-nav-open');
                return false;
            });
        },
        forms: function() {

            var $formAlert, $formError;

            // Basic Form 

            var $basicForm  = $('.basic-form');
            $basicForm.validate({
                errorPlacement: function(error, element) { }
            });
            $basicForm.submit(function() {
                $formAlert = $(this).find('.form-alert');
                $formError = $(this).find('.form-error');
                if(!$basicForm.valid()) $formError.show();
            });

            // Contact Form

            var $contactForm  = $('#contact-form');
    
            $contactForm.validate({
                errorElement: 'span',
                errorContainer: $contactForm.find('.form-error'),
                errorLabelContainer: $contactForm.find('.form-error ul'),
                wrapper: "li",
                rules: {
                    name: {
                        required    : true,
                        minlength   : 2
                    },
                    email: {
                        required    : true,
                        email       : true
                    },
                    message: {
                        required    : true,
                        minlength   : 10
                    }
                },
                messages: {
                    name: {
                        required    : "Please enter your name.",
                        minlength   : "Your name needs to be at least 2 characters"
                    },
                    email: {
                        required    : "Please enter your email address.",
                        minlength   : "You entered an invalid email address."
                    },
                    message: {
                        required    : "Please enter a message.",
                        minlength   : "Your message needs to be at least 10 characters"
                    }
                }
            });
        
            $contactForm.submit(function() {
                $formAlert = $(this).find('.form-alert');
                $formError = $(this).find('.form-error');
                var response;
                $formAlert.hide().html();
                if ($contactForm.valid()){
                    // $.ajax({
                    //     type: "POST",
                    //     url: "https://",
                    //     data: $(this).serialize(),
                    //     success: function(msg) {
                    //         if (msg === 'SEND') {
                    //             response = '<div class="alert alert-success">Done! Thank you for your message - You will get an answer as soon as possible.';
                    //         }
                    //         else {
                    //             response = '<div class="alert alert-danger">Ooops... It seems that we have a problem.';
                    //         }
                    //         $formAlert.html(response);
                    //         $formAlert.show();
                    //     }
                    //  });
                    setTimeout(() => {
                        response = '<div class="alert alert-success">Done! Thank you for your message.';
                        $formAlert.html(response);
                        $formAlert.show();
                    }, 1000);
                    return false;
                }
                return false;
            });

        }
    },
    Components: {
        init: function() {  

            this.carousel();   
            this.modal(); 
            this.chart();
            this.progressBar();
            this.tooltip(); 
            this.popover();
            this.messenger();
            this.videoPlayer();
            this.navToggleable();
            this.navFilter();

        },
        modal: function() {

            $('.modal').on('show.bs.modal', function () {
                $('body').addClass('modal-opened');
            });

            $('.modal').on('hide.bs.modal', function () {
                $('body').removeClass('modal-opened');
            });
        },
        chart: function() {

            $('.chart').each(function(){ 

                var size = $(this).data('size');

                $(this)
                    .easyPieChart({
                        barColor: $(this).data('bar-color'),
                        trackColor: $(this).data('track-color'),
                        scaleColor: $(this).data('scale-color'),
                        size: size,
                        lineWidth: $(this).data('line-width'),
                        animate: 1000,
                        onStep: function(from, to, percent) {
                            $(this.el).find('.percent').text(Math.round(percent));
                        }
                    })
                    .css({
                        'width': size+'px',
                        'height': size+'px'
                    })
                    .children('.percent').css('line-height',size+'px');

            });

            $('.chart').appear(function() {
                $(this).each(function(){
                    var $chart = $(this);
                    if (!$chart.hasClass('visible')) $chart.addClass('visible');
                    var value = $(this).data('value');
                    setTimeout(function(){
                        $chart.data('easyPieChart').update(value);
                    },200);
                });
            });
        },
        progressBar: function() {

            $('.progress-animated').appear(function() {
                var $bar = $(this).find('.progress-bar');
                $bar.each(function(){ 
                    setTimeout(function() {
                        var value = $bar.attr('aria-valuenow');
                        var i=0;
                        setInterval(function() {
                            i++;
                            if(i<=value) {
                                $bar.children('span').text(i+'%');
                            };
                        }, 15);
                        $bar.css('width',value+'%');
                    },300)
                });
            });
        },
        carousel: function() {
            $('.carousel').owlCarousel({
                items : $(this).data('items'),
                itemsDesktop : $(this).data('items-desktop'),
                itemsDesktopSmall : false,
                itemsTablet : $(this).data('items-tablet'),
                itemsMobile : $(this).data('items-mobile'),
                singleItem : $(this).data('single-item'),
                autoPlay : $(this).data('auto-play'),
                pagination : $(this).data('pagination'),
                stopOnHover: true
            });
        },
        tooltip: function() {
            $("[data-toggle='tooltip']").tooltip();
        },
        popover: function() {
            $("[rel='popover']").popover();
        },
        videoPlayer: function() {
            var $videoPlayer = $('.video-player');
            if($videoPlayer) {
                $videoPlayer.YTPlayer();
            }
            // if(trueMobile && $videoPlayer.hasClass('bg-video')) {
            //     $videoPlayer.prev('.bg-video-placeholder').show();
            //     $videoPlayer.remove()
            // } 
        },
        messenger: function() {
            $('[data-target="messenger"]').on('click',function(){
                var $messenger = $('#messenger'),
                    $messengerBox = $('#messenger-box');

                if($messenger.hasClass('active')) {
                    $messengerBox.find('.messenger-box-content').fadeOut();
                    $messenger.fadeOut(300).removeClass('active');
                } else {
                    $messenger.fadeIn(300, function(){
                        $messengerBox.find('.messenger-box-content').fadeIn(400);
                    }).addClass('active');
                }
                return false;
            });
        },
        navToggleable: function() {
            $('.nav-toggleable > li.dropdown > a').on('click', function(){
                $(this).parent('li').toggleClass('active');
                return false;
            })
        },
        navFilter: function() {
            var $navFiltering = $('.nav-filter');
            $navFiltering.on('click', 'a', function(){
                var $grid = $($(this).parents('.nav-filter').data('filter-grid'));
                var filterValue = $(this).attr('data-filter');
                $grid.isotope({
                    filter: filterValue
                })
                $(this).parents('.nav').find('.active').removeClass('active');
                $(this).parent('li').addClass('active');
                return false;
            });
        }
    }
};

$(document).ready(function (){

    Mi.init();

});
