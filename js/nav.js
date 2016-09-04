$(document).ready(function(){
  skipLinks();
  mainNav();
  hideMainNavWhenDrawerClose();
  keyboardNav();
  changeAriaValue();
});

$(window).resize(function(){
  skipLinks();
  mainNav();
  hideMainNavWhenDrawerClose();
  keyboardNav();
  changeAriaValue();
});

function skipLinks() {
  /* Use class "skiplinks--focused" to show skiplinks when receive focus, and hide skiplinks
  when they no longer receive focus. */
  $('.skiplinks').focusin(function() {
    $(this).addClass('skiplinks--focused');
  })

  $('.skiplinks').focusout(function() {
    $(this).removeClass('skiplinks--focused');
  })
}

function mainNav() {
  $('.main-nav__mobile-toggle, .main-nav__item--dropdown .main-nav__link').click(function(event) {
    event.preventDefault();
  })

  // Show/Hide Main Navigation as a drawer.
  $('.main-nav__mobile-toggle').click(function() {
    $('.app-container').toggleClass('app-container--drawer-open');
      hideMainNavWhenDrawerClose();

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

    // Accessibility: change aria value
    changeAriaValue();
  })

  // Click main content to close the drawer. Using '.main' as an example here.
  $('.main').click(function() {
    if ($('.app-container').hasClass('app-container--drawer-open')) {
        $('.app-container').removeClass('app-container--drawer-open');
      }
    $('.dropdown-nav__list').hide();
    $('.main-nav__link--dropdown-expanded').toggleClass('main-nav__link--dropdown main-nav__link--dropdown-expanded');

    // Accessibility: change aria value
    changeAriaValue();
    hideMainNavWhenDrawerClose();
  });

  // Switch between dropdown links
  $('.main-nav__item--dropdown .main-nav__link').click(function() {
    toggleDropdownMenus(this);

    // Accessibility: change aria value
    changeAriaValue();
  })
}

function hideMainNavWhenDrawerClose() {
  if ($('.app-container').hasClass('app-container--drawer-open') == false && $('.main-nav__mobile-toggle').is(':visible')) {
    $('.main-nav').delay(1000).queue(function() {
      $('.main-nav').hide();
    });
    $('.main-nav').attr('aria-hidden', true); // Change the value of aria-hidden of .main-nav
  } else {
    $('.main-nav').show().attr('aria-hidden', false); // Change the value of aria-hidden of .main-nav
  }
}

function toggleDropdownMenus(target) {
  if ($('.main-nav__item--dropdown .main-nav__link').not(target).hasClass('main-nav__link--dropdown-expanded')) {
    $('.main-nav__item--dropdown .main-nav__link').not(target).removeClass('main-nav__link--dropdown-expanded').addClass('main-nav__link--dropdown');
    $('.main-nav__item--dropdown .main-nav__link').not(target).next().slideUp(200);
  }
  $(target).toggleClass('main-nav__link--dropdown main-nav__link--dropdown-expanded');
  $(target).next().slideToggle(200);
}


function keyboardNav() {
  // Skiplinks keyboard accessibility
  $('.skiplinks__link').keydown(function(e) {
    var $this = $(this);

    // On right arrow, set focus on next skiplink link. If the focus is already on the last skiplink, jump to the first skiplink.
    if (e.keyCode == 39 && $this.parent().is(':last-child')) {
      $this.parent().siblings().first().find('.skiplinks__link').focus();
    } else if (e.keyCode == 39) {
      $this.parent().next().find('.skiplinks__link').focus();
    }

    // On left arrow, set focus on previous skiplink link. If the focus is already on the first skiplink, jump to the last skiplink.
    if (e.keyCode == 37 && $this.parent().is(':first-child')) {
      $this.parent().siblings().last().find('.skiplinks__link').focus();
    } else if (e.keyCode == 37) {
      $this.parent().prev().find('.skiplinks__link').focus();
    }

      // When the user click Enter on "To Main Menu", open the main-nav drawer and set focus on the first main menu link.
    if (e.keyCode == 13 && $this.filter('[href="#main-nav"]')) {
      $('.app-container').toggleClass('app-container--drawer-open').queue(function() {
        hideMainNavWhenDrawerClose();
        // Accessibility: change aria value
        changeAriaValue();
      });
      $('#main-nav').find('.main-nav__item').first().find('.main-nav__link:first').focus();
    }
  })

  // Main Nav Toggle keyboard accessibility
  $('.main-nav__mobile-toggle').keydown(function(e) {

    // Press Enter on Main Nav Toggle to open drawer and set focus on the first Main Nav link
    if (e.keyCode == 13) {
      $('.app-container').toggleClass('app-container--drawer-open').queue(function() {
        hideMainNavWhenDrawerClose();
        // Accessibility: change aria value
        changeAriaValue();
      });
      $('#main-nav').find('.main-nav__item').first().find('.main-nav__link:first').focus();
    }
  })

  // Main Nav keyboard accessibility
  $('.main-nav__link').keydown(function(e) {
    var $this = $(this);

    // Default view (screen-width < 1024px), if the main-nav drawer is open, enable navigation with Down and Up Keys
    if ($('.main-nav__mobile-toggle').is(':visible') && $('.app-container').hasClass('app-container--drawer-open')) {

      // Down Arrow Key
      // If already at the last link of the last main-nav list, press Down to navigate to the mobile toggle
      if (e.keyCode == 40 && $this.parent().is(':last-child') && $this.closest('.main-nav__list').is(':last-child')) {
        e.preventDefault(); // Prevent scrolling the page when press down key
        $('.main-nav__mobile-toggle').focus();

        // Otherwise if already at last link, press Down to navigate to the first link of the next main-nav list.
      } else if (e.keyCode == 40 && $this.parent().is(':last-child')) {
        e.preventDefault();
        $this.closest('.main-nav__list').next().find('.main-nav__link').first().focus();

        // Otherwise, press Down to navigate to the next main-nav link
      } else if (e.keyCode == 40) {
        e.preventDefault();
        $this.parent().next().find('.main-nav__link').focus();
      }

      // Up Arrow Key
      // If already at the first link of the first main-nav list, press Up to navigate to the mobile toggle
      if (e.keyCode == 38 && $this.parent().is(':first-child') && $this.closest('.main-nav__list').is(':first-child')) {
        e.preventDefault(); // Prevent scrolling the page when press up key
        $('.main-nav__mobile-toggle').focus();

        // Otherwise if already at first link, press Up to navigate to the last link of the previous main-nav list.
      } else if (e.keyCode == 38 && $this.parent().is(':first-child')) {
        e.preventDefault();
        $this.closest('.main-nav__list').prev().find('.main-nav__item').last().find('.main-nav__link').focus();

        // Otherwise, press Up to navigate to the previous main-nav link
      } else if (e.keyCode == 38) {
        e.preventDefault();
        $this.parent().prev().find('.main-nav__link').focus();
      }

    // Larger Screen (screen width >= 1024px), enable navigation with Left and Right Keys
    } else if ($('.main-nav__mobile-toggle').is(':hidden')) {
      // Right Arrow Key
      // If already at the last link of the last main-nav list, press Right to navigate to the first link in the first main-nav list
      if (e.keyCode == 39 && $this.parent().is(':last-child') && $this.closest('.main-nav__list').is(':last-child')) {
        e.preventDefault();
        $('.main-nav__list:first-child .main-nav__item:first-child .main-nav__link').focus();

        // Otherwise if already at last link, press Down to navigate to the first link of the next main-nav list.
      } else if (e.keyCode == 39 && $this.parent().is(':last-child')) {
        e.preventDefault();
        $this.closest('.main-nav__list').next().find('.main-nav__link').first().focus();

        // Otherwise, press Down to navigate to the next main-nav link
      } else if (e.keyCode == 39) {
        e.preventDefault();
        $this.parent().next().find('.main-nav__link').focus();
      }

      // Left Arrow Key
      // If already at the first link of the first main-nav list, press Left to navigate to the last link in the last main-nav list
      if (e.keyCode == 37 && $this.parent().is(':first-child') && $this.closest('.main-nav__list').is(':first-child')) {
        e.preventDefault();
        $('.main-nav__list:last-child .main-nav__item:last-child .main-nav__link').focus();

        // Otherwise if already at first link, press Left to navigate to the last link of the previous main-nav list.
      } else if (e.keyCode == 37 && $this.parent().is(':first-child')) {
        e.preventDefault();
        $this.closest('.main-nav__list').prev().find('.main-nav__item').last().find('.main-nav__link').focus();

        // Otherwise, press Up to navigate to the previous main-nav link
      } else if (e.keyCode == 37) {
        e.preventDefault();
        $this.parent().prev().find('.main-nav__link').focus();
      }
    }

    // If the main-nav link has a closed dropdown menu
    if ($this.hasClass('main-nav__link--dropdown')) {
      // Press Enter to open dropdown menu and set focus on the first dropdown menu link
      if (e.keyCode == 13) {
        e.preventDefault();
        toggleDropdownMenus(this);
        changeAriaValue();
      }
    }
  });
}

function changeAriaValue() {
  // change aria-expanded value of main-nav__mobile-toggle
  if ($('.app-container').hasClass('app-container--drawer-open')) {
    $('.main-nav__mobile-toggle').attr('aria-expanded', true);
  } else {
    $('.main-nav__mobile-toggle').attr('aria-expanded', false);
  }

  // change aria-expanded value of main-nav__link--dropdown
  $('.main-nav__item--dropdown .main-nav__link').each(function() {
    if ($(this).hasClass('main-nav__link--dropdown-expanded')) {
      $(this).attr('aria-expanded', true);
      // change aria-hidden value of dropdown menu
      $(this).next().attr('aria-hidden', false)
    } else if ($('.main-nav__link').hasClass('main-nav__link--dropdown')) {
      $(this).attr('aria-expanded', 'false');
      // change aria-hidden value of dropdown menu
      $(this).next().attr('aria-hidden', true)
    }
  })

  // change aria-hidden value of .main-nav__mobile-toggle on large screens
  if ($('.main-nav__mobile-toggle').is(':hidden')) {
    $('.main-nav__mobile-toggle').attr('aria-hidden', 'true');
  } else {
    $('.main-nav__mobile-toggle').attr('aria-hidden', 'false');
  }
}