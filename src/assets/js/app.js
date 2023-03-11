document.addEventListener("DOMContentLoaded", () => {

  const xl = matchMedia('(max-width: 1024px)')

  class Menu {
    constructor(menuElement, buttonElement, logo) {
      this.menu = typeof menuElement === "string" ? document.querySelector(menuElement) : menuElement;
      this.button = typeof buttonElement === "string" ? document.querySelector(buttonElement) : buttonElement;
      this.overlay = document.createElement('div');
      this.overlay.hidden = true;
      this.buttons = this.menu.querySelectorAll('a')
      this.logo = logo
      this._init()
    }

    _init() {
      document.body.appendChild(this.overlay)
      this.overlay.classList.add('overlay')

      if (this.buttons.length) {
        this.buttons.forEach(el => {
          el.addEventListener('click', this.closeMenu.bind(this))
        })
      }
      if (this.logo) {
        this.logo.addEventListener('click', this.closeMenu.bind(this))
      }
      this.overlay.addEventListener('click', this.toggleMenu.bind(this))
      this.button.addEventListener('click', this.toggleMenu.bind(this))
    }

    toggleMenu() {
      this.menu.classList.toggle('menu--open')
      this.button.classList.toggle('menu-button--active')
      this.overlay.hidden = !this.overlay.hidden

      if (this.isMenuOpen()) {
        this.disableScroll()
      } else {
        this.enableScroll()
      }
    }

    closeMenu() {
      this.menu.classList.remove('menu--open')
      this.button.classList.remove('menu-button--active')
      this.overlay.hidden = true

      this.enableScroll()
    }

    isMenuOpen() {
      return this.menu.classList.contains('menu--open')
    }

    disableScroll() {
        // Get the current page scroll position
        const scrollTop = window.pageYOffset  || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset  || document.documentElement.scrollLeft;
      
            // if any scroll is attempted, set this to the previous value
            window.onscroll = function() {
                window.scrollTo(scrollLeft, scrollTop);
            };
    }

    enableScroll() {
      window.onscroll = function() {};
    }
  }

  const menu = document.querySelector('.menu')
  const menuButton = document.querySelector('.menu-button')

  if (menu && menuButton) {
    new Menu(menu, menuButton)
  }

  const header = document.querySelector('header')

  let handler;

  function scrollAdd() {
    /* ... */
    handler = throttle(function (event) {
      scrollHeader();
    }, 500);
    document.addEventListener('scroll', handler, false);
  }

  scrollAdd()

  var prevScrollpos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  function scrollHeader() {
    var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScrollPos < 0) {
      currentScrollPos = 0
      prevScrollpos = 0
    }
    if (prevScrollpos < 0) {
      prevScrollpos = 0
      currentScrollPos = 0
    }
    const num = xl.matches ? 50 : 150
    if (currentScrollPos > num) {
      header.classList.add('header--active')
    } else {
      header.classList.remove('header--active')
    }
    if (prevScrollpos >= currentScrollPos) {
      header.classList.remove('out')
    } else {
      header.classList.add('out')
    }
    prevScrollpos = currentScrollPos;
  }

  function throttle(func, ms) {
    let isThrottled = false,
      savedArgs,
      savedThis;

    function wrapper() {

      if (isThrottled) { // (2)
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments); // (1)

      isThrottled = true;

      setTimeout(function () {
        isThrottled = false; // (3)
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  }


  const numberOfSlides = document.querySelectorAll('.grid-block__swiper .swiper-slide').length

  function updSwiperNumericPagination() {
    const index = this.realIndex + 1
    this.el.querySelector(".swiper-counter").innerHTML = '<span class="count">' + (index < 10 ? '0' + index : index) + '</span>/<span class="total">/' + (numberOfSlides < 10 ? '0' + numberOfSlides : numberOfSlides) + "</span>";
  }

  const swiper = new Swiper('.grid-block__swiper', {
    loop: true,
    spaceBetween: 10,
    navigation: {
      nextEl: '.grid-block__swiper .next',
      prevEl: '.grid-block__swiper .prev',
    },
    on: {
      init: updSwiperNumericPagination,
      slideChange: updSwiperNumericPagination
    }
  });

    const swiper2 = new Swiper('.magazine-swiper', {
    loop: true,
    effect: "creative",
    speed: 400,
    creativeEffect: {
      prev: {
        translate: [0, 0, -400],
        opacity: 0,
      },
      next: {
        translate: ["100%", 0, 0],
        opacity: 0,
      },
    },
    navigation: {
      nextEl: '.magazine-swiper .next',
      prevEl: '.magazine-swiper .prev',
    },
});


})











