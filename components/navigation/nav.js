$(document).ready(function(){
  // Show/Hide Main Navigation as a drawer.
	$('.main-nav__drawer-knob').each(function() {
		$(this).click(function() {
			$(this).parents('.app-container').toggleClass('app-container--drawer-open');

			// If a dropdown menu has a current link, expand that dropdown menu by default.
			var mainNav = $(this).parents('.app-container').find('.main-nav');
			if ($(mainNav).has('.dropdown-nav__link--current')) {
				var currentDropdownList = $(mainNav).find('.dropdown-nav__link--current').parents('.dropdown-nav__list');
				$(currentDropdownList).show();
        $(currentDropdownList).prev().toggleClass('main-nav__link--dropdown main-nav__link--dropdown-expanded');
			}

      // If the drawer is closed, close all dropdown menus.
      if ($(this).parents('.app-container').hasClass('app-container--drawer-open') == false) {
        $('.dropdown-nav__list').hide();
        $('.main-nav__link--dropdown-expanded').toggleClass('main-nav__link--dropdown main-nav__link--dropdown-expanded');
      }
		})
	})

	// Click main content to close the drawer. Using '.main' as an example here.
	$('.main').click(function() {
    	if ($('.app-container').hasClass('app-container--drawer-open')) {
        	$('.app-container').removeClass('app-container--drawer-open');
      	}
      $('.dropdown-nav__list').hide();
      $('.main-nav__link--dropdown-expanded').toggleClass('main-nav__link--dropdown main-nav__link--dropdown-expanded');
    });

  // Switch between dropdown links by either clicking or hovering
	$('.main-nav__item--dropdown .main-nav__link').each(function() {
		$(this).click(function() {
      if ($('.main-nav__item--dropdown .main-nav__link').not(this).hasClass('main-nav__link--dropdown-expanded')) {
        $('.main-nav__item--dropdown .main-nav__link').not(this).toggleClass('main-nav__link--dropdown-expanded').addClass('main-nav__link--dropdown');
        $('.main-nav__item--dropdown .main-nav__link').not(this).next().slideUp(200);
      }
			$(this).toggleClass('main-nav__link--dropdown main-nav__link--dropdown-expanded');
      $(this).next().slideToggle(200);
		})
	})

});