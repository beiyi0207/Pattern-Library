$(document).ready(function(){
  responsive();
  skipLinks();
  mainNavKeyboardSupport();
  dropdownMenu();
});

$(window).resize(function(){
  responsive();
  location.reload();
});


/* Shared functions */
function _closeMainNavDrawer() {
  $('.app-container').removeClass('app-container--drawer-open'); // Close the drawer
  $('.main-nav__mobile-toggle').attr('aria-expanded', false); // Set aria-expanded value of mobile toggle to false
  $('.main-nav').hide() // Hide the drawer after it is fully closed. This will ensure it doesn't receive focus
  $('.main-nav').attr('aria-hidden', true); // Set aria-hidden value of main-nav to true

  $('.main-nav__link--dropdown-expanded').toggleClass('main-nav__link--dropdown main-nav__link--dropdown-expanded'); // Change all dropdown link statuses to closed
  $('.main-nav__link--dropdown').attr('aria-expanded', false); // Set aria-exanded value of all dropdown anchor links to false

  $('.dropdown-nav__list').hide(); // Hide all dropdown menus
  $('.dropdown-nav__list').attr('aria-hidden', true) // Set aria-hidden value of all dropdown menu to true
}

function _openMainNavDrawer() {
  $('.app-container').addClass('app-container--drawer-open'); // Open the drawer
  $('.main-nav__mobile-toggle').attr('aria-expanded', true); // Change aria-expanded value of mobile toggle to true

  $('.main-nav').show().attr('aria-hidden', false); // Show the main nav in the drawer and change its aria-hidden to false

  // If a dropdown menu has a current link, expand that dropdown menu by default.
  if ($('.main-nav').has('.dropdown-nav__link--current')) {
    var currentDropdownList = $('.dropdown-nav__link--current').parents('.dropdown-nav__list');
    $(currentDropdownList).show().attr('aria-hidden', false); // Show the dropdown menu containing the current link, and set its aria-hidden value to false
    $(currentDropdownList).prev().toggleClass('main-nav__link--dropdown main-nav__link--dropdown-expanded').attr('aria-expanded', true); // Change the icon on the dropdown anchor link to indicate that the dropdown menu is open, and set its aria-expanded value to true
  }
}

function _toggleDropdownMenus(target) {
  if ($(target).hasClass('main-nav__link--dropdown')) {
    $(target).removeClass('main-nav__link--dropdown').addClass('main-nav__link--dropdown-expanded').attr('aria-expanded', true);
    $(target).next().slideDown(200).attr('aria-hidden', false).delay(500).find('.dropdown-nav__item:first .dropdown-nav__link').focus();
    $('.main-nav__item--dropdown .main-nav__link').not(target).removeClass('main-nav__link--dropdown-expanded').addClass('main-nav__link--dropdown').attr('aria-expanded', false);
    $('.main-nav__item--dropdown .main-nav__link').not(target).next().slideUp(200).attr('aria-hidden', true);
  } else if ($(target).hasClass('main-nav__link--dropdown-expanded')) {
    $(target).removeClass('main-nav__link--dropdown-expanded').addClass('main-nav__link--dropdown').attr('aria-expanded', false);
    $(target).next().slideUp(200).attr('aria-hidden', true);
  }
}

/*************************************************************************************/

function responsive() {
  if ($('.main-nav__mobile-toggle').is(':visible')) { // Detect if it is default/mobile View
    $('.main-nav__mobile-toggle').attr('aria-hidden', false); // Set aria-hidden value of mobile toggle to false
    if ($('.app-container').hasClass('app-container--drawer-open')) {
      $('.main-nav').attr('aria-hidden', false)
    } else {
      $('.main-nav').attr('aria-hidden', true)
    }
    mainNavToggle();
  } else { // Large Screen View
    $('.main-nav__mobile-toggle').attr('aria-hidden', true); // Set aria-hidden value of mobile toggler to true
    $('.main-nav').show().attr('aria-hidden', false);
    $('.main-nav__item .main-nav__link').removeClass('.main-nav__link--dropdown-expanded').addClass('main-nav__item--dropdown').attr('aria-expanded', false); // Set all dropdown anchor links to collapsed and set their aria-expanded values to false
    $('.dropdown-nav__list').hide().attr('aria-hidden', true); // Hide all dropdown menus and set aria-hidden values to true
    $('.dropdown-nav__link--current').closest('.dropdown-nav__list').prev().addClass('main-nav__link--current'); // Indicate which dropdown anchor contains the dropdown link for the current page
  }
}

function skipLinks() {
  // Skiplinks are never hidden with "display: none", so they don't need aria-hidden.
  $('.skiplinks').focusin(function() {
    $(this).addClass('skiplinks--focused');
  })

  $('.skiplinks').focusout(function() {
    $(this).removeClass('skiplinks--focused');
  })

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

      // When the user press Enter on "To Main Menu", open the main-nav drawer and set focus on the first main menu link.
    if (e.keyCode == 13 && $this.attr('href') == '#main-nav') {
      if (($('.main-nav__mobile-toggle').is(':visible') && $('.app-container').hasClass('app-container--drawer-open') == false) || $('.main-nav__mobile-toggle').is(':hidden')) {
        _openMainNavDrawer();
        $('#main-nav').find('.main-nav__item').first().find('.main-nav__link:first').focus();
      }
    }
  })
}

function mainNavToggle() {
  // Click event
  $('.main-nav__mobile-toggle').click(function() {
    if ($('.app-container').hasClass('app-container--drawer-open')) {
      _closeMainNavDrawer();
    } else {
      _openMainNavDrawer();
    }
  })

  $('.page-header__wrapper, .main, .page-footer').click(function() {
    if ($('.app-container').hasClass('app-container--drawer-open')) {
      _closeMainNavDrawer();
    }
  })

  // Keyboard event
  $('.main-nav__mobile-toggle').keydown(function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      if ($('.app-container').hasClass('app-container--drawer-open')) {
        _closeMainNavDrawer();
        $('.main-nav__mobile-toggle').focus();
      } else {
        _openMainNavDrawer();
        $('#main-nav').find('.main-nav__item').first().find('.main-nav__link:first').focus();
      }
    }
  })
}

function mainNavKeyboardSupport() {
  $('.main-nav__link').keydown(function(e) {
    var $this = $(this);

    // Default view (screen-width < 1024px), if the main-nav drawer is open, enable navigation with Down and Up Keys
    if ($('.main-nav__mobile-toggle').is(':visible') && $('.app-container').hasClass('app-container--drawer-open')) {
      if (e.keyCode == 40 || e.keyCode == 38) {
        e.preventDefault(); // Prevent scrolling the page when press Up or Down key
      }

      // Down Arrow Key
      // If at the anchor link of an open dropdown menu, press Down to navigate to the first link of that dropdown menu
      if (e.keyCode == 40 && $this.hasClass('main-nav__link--dropdown-expanded')) {
        $this.next().find('.dropdown-nav__item:first-child .dropdown-nav__link').focus();

      // If already at the last link of the last main-nav list, press Down to navigate to the mobile toggle
      } else if (e.keyCode == 40 && $this.parent().is(':last-child') && $this.closest('.main-nav__list').is(':last-child')) {
        $('.main-nav__mobile-toggle').focus();

        // Otherwise if already at last link, press Down to navigate to the first link of the next main-nav list.
      } else if (e.keyCode == 40 && $this.parent().is(':last-child')) {
        $this.closest('.main-nav__list').next().find('.main-nav__link').first().focus();

        // Otherwise, press Down to navigate to the next main-nav link
      } else if (e.keyCode == 40) {
        $this.parent().next().find('.main-nav__link').focus();
      }

      // Up Arrow Key
      // If already at the first link of the first main-nav list, press Up to navigate to the mobile toggle
      if (e.keyCode == 38 && $this.parent().is(':first-child') && $this.closest('.main-nav__list').is(':first-child')) {
        $('.main-nav__mobile-toggle').focus();

        // Otherwise if already at first link, press Up to navigate to the last link of the previous main-nav list.
      } else if (e.keyCode == 38 && $this.parent().is(':first-child')) {
        $this.closest('.main-nav__list').prev().find('.main-nav__item').last().find('.main-nav__link').focus();

        // Otherwise, press Up to navigate to the previous main-nav link
      } else if (e.keyCode == 38) {
        $this.parent().prev().find('.main-nav__link').focus();
      }


    // Larger Screen (screen width >= 1024px), enable navigation with Left and Right Keys
    } else if ($('.main-nav__mobile-toggle').is(':hidden')) {

      if (e.keyCode == 37 || e.keyCode == 39) {
        e.preventDefault(); // Prevent scrolling the page when press arrow keys
      }

      // Right Arrow Key
      // If already at the last link of the last main-nav list, press Right to navigate to the first link in the first main-nav list
      if (e.keyCode == 39 && $this.parent().is(':last-child') && $this.closest('.main-nav__list').is(':last-child')) {
        $('.main-nav__list:first-child .main-nav__item:first-child .main-nav__link').focus();

        // Otherwise if already at last link, press Down to navigate to the first link of the next main-nav list.
      } else if (e.keyCode == 39 && $this.parent().is(':last-child')) {
        $this.closest('.main-nav__list').next().find('.main-nav__link').first().focus();

        // Otherwise, press Down to navigate to the next main-nav link
      } else if (e.keyCode == 39) {
        $this.parent().next().find('.main-nav__link').focus();
      }

      // Left Arrow Key
      // If already at the first link of the first main-nav list, press Left to navigate to the last link in the last main-nav list
      if (e.keyCode == 37 && $this.parent().is(':first-child') && $this.closest('.main-nav__list').is(':first-child')) {
        $('.main-nav__list:last-child .main-nav__item:last-child .main-nav__link').focus();

        // Otherwise if already at first link, press Left to navigate to the last link of the previous main-nav list.
      } else if (e.keyCode == 37 && $this.parent().is(':first-child')) {
        $this.closest('.main-nav__list').prev().find('.main-nav__item').last().find('.main-nav__link').focus();

        // Otherwise, press Up to navigate to the previous main-nav link
      } else if (e.keyCode == 37) {
        $this.parent().prev().find('.main-nav__link').focus();
      }
    }
  });
}

function dropdownMenu() {
  $('.main-nav__item--dropdown .main-nav__link').click(function() {
    _toggleDropdownMenus(this);

    // Close dropdown menus and set aria labels accordingly when it no longer has focus
    if ($('.main-nav__mobile-toggle').is(':hidden')) {
      $('.main-nav__link--dropdown-expanded ~ .dropdown-nav__list').focusout(function() {
        $(this).slideUp(200).attr('aria-hidden', true);
        $(this).prev().removeClass('main-nav__link--dropdown-expanded').addClass('main-nav__link--dropdown').attr('aria-expanded', false);
      })
    }
  })

  $('.main-nav__link').keydown(function(e) {
    if ($(this).hasClass('.main-nav__link--dropdown') && e.keyCode == 13) {
      var $this = $(this);

      e.preventDefault();
      _toggleDropdownMenus(this);
      setTimeout(function() {
        if ($this.hasClass('main-nav__link--dropdown-expanded')) {
          alert('what');
          $this.next().find('.dropdown-nav__item:first-child .dropdown-nav__link').focus(); // If a dropdown menu is open, set focus on its first menu link
        }
      }, 250)
    }
  })

  $('.dropdown-nav__link').keydown(function(e) {
    var $this = $(this);

    // Down Arrow Key
      // If already at the last link of the last dropdown menu of the last main-nav list, press Down to navigate to the mobile toggle
      if (e.keyCode == 40 && $this.parent().is(':last-child') && $this.closest('.main-nav__item').is(':last-child') && $this.closest('.main-nav__list').is(':last-child')) {
        e.preventDefault(); // Prevent scrolling the page when press down key
        $('.main-nav__mobile-toggle').focus();

        // Otherwise if already at last link of the last dropwdown menu, press Down to navigate to the first link of the next main-nav list.
      } else if (e.keyCode == 40 && $this.parent().is(':last-child') && $this.closest('.main-nav__item').is(':last-child')) {
        e.preventDefault();
        $this.closest('.main-nav__list').next().find('.main-nav__link').first().focus();

        // Otherwise if already at last link of the dropwdown menu, press Down to navigate to the next main-nav link.
      } else if (e.keyCode == 40 && $this.parent().is(':last-child')) {
        e.preventDefault();
        $this.closest('.main-nav__item').next().find('.main-nav__link').focus();

        // Otherwise, press Down to navigate to the next dropdown link
      } else if (e.keyCode == 40) {
        e.preventDefault();
        $this.parent().next().find('.dropdown-nav__link').focus();
      }

      // Up Arrow Key
      // If already at first link, press Up to navigate to the dropdown menu anchor link.
      if (e.keyCode == 38 && $this.parent().is(':first-child')) {
        e.preventDefault();
        $this.closest('.dropdown-nav__list').prev().focus();

        // Otherwise, press Up to navigate to the main-nav link
      } else if (e.keyCode == 38) {
        e.preventDefault();
        $this.parent().prev().find('.dropdown-nav__link').focus();
      }
  })
}