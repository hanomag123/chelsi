document.addEventListener("DOMContentLoaded", () => {

  const xl = matchMedia('(max-width: 1024px)');

  class Menu {
    constructor(menuElement, buttonElement) {
      this.header = document.querySelector('header');
      this.menu = typeof menuElement === "string" ? document.querySelector(menuElement) : menuElement;
      this.button = typeof buttonElement === "string" ? document.querySelector(buttonElement) : buttonElement;
      this.overlay = document.createElement('div');
      this.overlay.hidden = true;
      this._init();
    };

    _init() {
      document.body.appendChild(this.overlay);
      this.overlay.classList.add('overlay');

      this.overlay.addEventListener('click', this.toggleMenu.bind(this));
      this.button.addEventListener('click', this.toggleMenu.bind(this));
    };

    toggleMenu() {
      this.menu.classList.toggle('menu--open');
      this.button.classList.toggle('menu-button--active');
      this.overlay.hidden = !this.overlay.hidden;

      if (this.isMenuOpen()) {
        this.header.classList.add('header--menu');
        this.disableScroll();
      } else {
        this.enableScroll();
        if (this.header.classList.contains('header--menu')) {
          this.menu.addEventListener('transitionend', this.bindFunc);
        };
      };
    };

    bindFunc = () => {
      this.hideaftertransition();
    };

    hideaftertransition() {
      if (this.header.classList.contains('header--menu') && !this.isMenuOpen()) {
        this.header.classList.remove('header--menu');
      };
      this.menu.removeEventListener('transitionend', this.bindFunc);

    };
    closeMenu() {
      this.menu.classList.remove('header__nav--active');
      this.button.classList.remove('header__menu-button--active');
      this.overlay.hidden = true;
      this.enableScroll();
    };

    isMenuOpen() {
      return this.menu.classList.contains('menu--open');
    };

    disableScroll() {
      document.documentElement.classList.add('no-scroll');
    };

    enableScroll() {
      document.documentElement.classList.remove('no-scroll');
    };
  };

  const menu = document.querySelector('.menu');
  const menuButton = document.querySelector('.menu-button');

  if (menu && menuButton) {
    new Menu(menu, menuButton);
  }

  const header = document.querySelector('header');

  let handler;

  function scrollAdd(){
      /* ... */
      handler = throttle(function(event){
          scrollHeader();
      }, 500);
      document.addEventListener('scroll', handler, false);
  }
  
  function scrollRemove(){
      /* ... */
      document.removeEventListener('scroll', handler, false);
  }
  
  if (xl.matches) {
    scrollAdd()
    document.removeEventListener('scroll', scrollHeader)
  } else {
    document.addEventListener('scroll', scrollHeader)
    scrollRemove()
  }
  
    xl.addEventListener('change', () => {
      if (xl.matches) {
        document.removeEventListener('scroll', scrollHeader);
        scrollAdd()
      } else {
        document.addEventListener('scroll', scrollHeader)
        scrollRemove()
      }
    })
  
    function disableScroll() {
      // Get the current page scroll position
      const scrollTop = window.pageYOffset  || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset  || document.documentElement.scrollLeft;
      document.documentElement.style.setProperty('scroll-behavior', 'auto')
    
          // if any scroll is attempted, set this to the previous value
          window.onscroll = function() {
              window.scrollTo(scrollLeft, scrollTop);
          };
  }
  
   function enableScroll() {
    document.documentElement.style.setProperty('scroll-behavior', null)
    window.onscroll = function() {};
  }
  
  var prevScrollpos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  function scrollHeader() {
    var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScrollPos < 0) {
      currentScrollPos = 0;
      prevScrollpos = 0;
    };
    if (prevScrollpos < 0) {
      prevScrollpos = 0;
      currentScrollPos = 0;
    };
    const num = xl.matches ? 50 : 100;
    if (currentScrollPos > num) {
      header.classList.add('header--active');
    } else {
      header.classList.remove('header--active');
    };
    if (prevScrollpos >= currentScrollPos) {
      header.classList.remove('out');
    } else {
      header.classList.add('out');
    };
    prevScrollpos = currentScrollPos;
  };

  function initHeader () {
    var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const num = xl.matches ? 50 : 150;
    if (currentScrollPos > num) {
      header.classList.add('header--active');
    } else {
      header.classList.remove('header--active');
    }
  }

  initHeader();

  function throttle(func, ms) {
    let isThrottled = false,
      savedArgs,
      savedThis;

    function wrapper() {

      if (isThrottled) { // (2);
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments); // (1);

      isThrottled = true;

      setTimeout(function () {
        isThrottled = false; // (3);
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  }


  const numberOfSlides = document.querySelectorAll('.grid-block__swiper .swiper-slide').length;

  function updSwiperNumericPagination() {
    const index = this.realIndex + 1;
    this.el.querySelector(".swiper-counter").innerHTML = '<span class="count">' + (index < 10 ? '0' + index : index) + '</span><span class="total">/' + (numberOfSlides < 10 ? '0' + numberOfSlides : numberOfSlides) + "</span>";
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
      slideChange: updSwiperNumericPagination,
    }
  });

  const swiper3 = new Swiper('.hit-swiper', {
    loop: true,
    spaceBetween: 10,
    navigation: {
      nextEl: '.hit .next',
      prevEl: '.hit .prev',
    },
  });

  const swiper2 = new Swiper('.magazine-swiper', {
    loop: true,
    effect: "creative",
    speed: 400,
    creativeEffect: {
      next: {
        translate: [0, 0, -400],
        opacity: 0,
      },
      prev: {
        translate: ["-100%", 0, 0],
        opacity: 0,
      },
    },
    on: {
      slideChangeTransitionEnd: function () {
        const nextText = this.el.querySelectorAll('.swiper-slide-next')[0];
        const prevText = this.el.querySelectorAll('.swiper-slide-prev')[0]
        const next = this.el.querySelector('.next .swiper-title-text');
        const prev = this.el.querySelector('.prev .swiper-title-text');
        if (nextText && prevText) {
          if (nextText.dataset.title === prevText.dataset.title) {
            const nextTextNew = this.el.querySelectorAll('.swiper-slide-duplicate-active')[0].nextElementSibling;
            const prevTextNew = this.el.querySelectorAll('.swiper-slide-duplicate-active')[0].previousElementSibling;
            if (next && prev && nextTextNew && prevTextNew) {
              next.innerHTML = `<span>${nextTextNew.dataset.title}</span>`;
              prev.innerHTML = `<span>${prevTextNew.dataset.title}</span>`;
            }
            return;
          }
        }
        if (nextText && next) {
          next.innerHTML = `<span>${nextText.dataset.title}</span>`
        }
        if (prevText && prev) {
          prev.innerHTML = `<span>${prevText.dataset.title}</span>`
        }
      }
    },
    navigation: {
      nextEl: '.magazine-swiper .next',
      prevEl: '.magazine-swiper .prev',
    },
  });

  const mobileSwipers = document.querySelectorAll('.services-swiper');
  if (mobileSwipers.length) {
    if (xl.matches) {
      mobileSwipers.forEach(el => {
        let swiper4 = null;
        swiper4 = new Swiper(el, {
          loop: true,
          slidesPerView: 'auto',
          spaceBetween: 0,
        });

        xl.addEventListener('change', () => {
          if (xl.matches) {
            swiper4 = new Swiper(el, {
              loop: true,
              slidesPerView: 'auto',
              spaceBetween: 0,
            });
          } else {
            if (swiper4) {
              console.log(swiper4);
              swiper4.destroy(true, true);
            }
          };
        });
      });
    }
  }

  function modalHandler() {
    const modal = document.querySelector(`${this.dataset?.modal}`) || this;
    const isVacation = this.dataset.vacname;
    if (isVacation && modal) {
      const vacText = modal.querySelector('.vacnameText');
      const vacInput = modal.querySelector('.vacnameInput');
      if (vacText && vacInput) {
        vacText.innerHTML = isVacation;
        vacInput.value = isVacation;
      }
    }
    if (modal.classList.contains('regModal') && modal.hidden) {
      disableScroll();
    } else {
      enableScroll();
    }
    if (modal) {
      if (modal.hidden) {
        modal.hidden = !modal.hidden;
        modal.style.setProperty('pointer-events', 'auto');
        setTimeout(() => {
          modal.style.opacity = 1;
        }, 10);
      } else {
        modal.style.opacity = 0;
        modal.style.setProperty('pointer-events', null);
        const numb = Number(getComputedStyle(modal).transitionDuration.match(/(\d+\.\d+)|(\d+)/g)[0]);
        if (numb > 0) {
          modal.addEventListener('transitionend', hideaftertransition);
        } else {
          modal.hidden = true;
        }
      }
    }
  }

  function disableScroll() {
    // Get the current page scroll position;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    document.documentElement.style.setProperty('scroll-behavior', 'auto');

    // if any scroll is attempted, set this to the previous value;
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  function enableScroll() {
    document.documentElement.style.setProperty('scroll-behavior', null);
    window.onscroll = function () { };
  }


  const regModal = document.querySelectorAll('.regModal');

  if (regModal) {
    regModal.forEach(el => {
      el.addEventListener('click', function () {
        if (event.target.classList.contains('regModal')) {
          modalHandler.apply(this);
        }
      });
      const closeButton = el.querySelector('.close-button');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          modalHandler.apply(el);
        });
      }
    });
  }

  const buttonsModal = document.querySelectorAll('[data-modal]');

  function hideaftertransition() {
    this.hidden = true;
    this.removeEventListener('transitionend', hideaftertransition);
  }

  if (buttonsModal.length) {
    buttonsModal.forEach(el => el.addEventListener('click', modalHandler));
  }


  const inputs = document.querySelectorAll('input,textarea');
  if (inputs.length) {
    inputs.forEach(el => {
      el.value ? el.classList.add('havetext') : el.classList.remove('havetext');
      el.addEventListener('input', function () {
        this.value ? this.classList.add('havetext') : this.classList.remove('havetext');
      });
    });
  }

  const dates = document.querySelectorAll('.date-input');

  if (dates.length) {
    dates.forEach(el => {
      const date = new AirDatepicker(el, {
        container: xl.matches ? '' : el.parentElement,
        isMobile: xl.matches,
        autoClose: true,
        onShow: () => {
          date.$el.classList.add('havetext');
        },
        onHide: () => {          
          if (!date.$el.value) {
            date.$el.classList.remove('havetext');
          } else {
            date.$el.classList.add('havetext');
          }
        },
        onSelect: () => {
          if (!date.$el.value) {
            date.$el.classList.remove('havetext');
          } else {
            date.$el.classList.add('havetext');
          }
        }
      });
    });

  }
  const timePickers = document.querySelectorAll('.only-time');

  if (timePickers) {
    timePickers.forEach(timepicker => {
      const airPick = new AirDatepicker(timepicker, {
        container: xl.matches ? '' : timepicker.parentElement,
        isMobile: xl.matches,
        dateFormat: ' ',
        timepicker: true,
        minutesStep: 10,
        classes: 'only-timepicker',
        onShow: () => {
          airPick.$el.classList.add('havetext');
        },
        onHide: () => {          
          if (!airPick.$el.value) {
            airPick.$el.classList.remove('havetext');
          }
        }
      });
    });
  }

  const magazineButtons = document.querySelectorAll('.magazine-buttons button');
  const magazineMain = document.querySelector('.magazine-main');

  if (magazineButtons.length && magazineMain) {
    magazineButtons.forEach(button => {
      button.addEventListener('click', function () {
        magazineButtons.forEach(el => {
          el.classList.remove('active');
        });
        this.classList.add('active');
        magazineMain.innerHTML = this.innerHTML;
        filterItems(this.dataset.filterbutton);
      });

      if (button.classList.contains('active')) {
        magazineMain.innerHTML = button.innerHTML;
      }
    });
  }

  function filterItems(filterName) {
    const items = document.querySelectorAll('[data-filtername]');
    if (!items.length) {
      return;
    }
    if (filterName === 'all') {
      items.forEach(el => el.hidden = false);
    } else {
      items.forEach(el => {
        if (el.dataset.filtername === filterName) {
          el.hidden = false;
        } else {
          el.hidden = true;
        }
      });
    }
  }

  const fileinput = document.querySelectorAll('.file-input');

  if (fileinput.length) {
    fileinput.forEach(el => {
      const inputText = el.parentElement.querySelector('.file-text');
      el.addEventListener('change', function () {
        if (this.value) {
          if (inputText) {
            inputText.innerHTML = this.value.replace('C:\\fakepath\\', '');
          }
        }
      });
    });
  }



});

let menuBtns = document.querySelectorAll('.filter-btn');
let menuItemsContainer = document.querySelector('.menuPage-menuContent__menuItemsContainer');
let menuLeft = document.querySelector('.menuPage-menuContent__leftBlock');
let menuRight = document.querySelector('.menuPage-menuContent__rightBlock');
let hiddenBlock = document.querySelector('.menuPage-menuContent__hiddenHelpBlock');
let menuPageLeftBlock = document.querySelector('.menuPage-menuContent_leftBlock');
let counter = 0;

if (window.matchMedia("(min-width: 1024px)").matches) {
  menuBtns.forEach(e => {
    e.addEventListener('click', function () {
      menuBtns.forEach(menuBtn => {
        menuBtn.classList.remove('active');
      });
      this.classList.add('active');
      menuPageLeftBlock.innerHTML = this.innerHTML;
      let menuItems = this.nextElementSibling.querySelectorAll('.menuPage-menuContent__menuItem');
      counter = 0;
      menuLeft.innerHTML = ''
      menuRight.innerHTML = ''
  
      menuItems.forEach((e, id) => {
  
        if (id % 2 == 0 && counter < menuItems.length - 1) {
          let a = document.createElement('div');
          a.classList.add('helperContainer');
          a.innerHTML = e.innerHTML;
          menuLeft.appendChild(a);
          counter + 1;
        } else if (id % 2 != 0 && counter < menuItems.length - 1) {
          let a = document.createElement('div');
          a.classList.add('helperContainer');
          a.innerHTML = e.innerHTML;
          menuRight.appendChild(a);
          counter + 1;
        }
  
      });

      let menuContentSwiper = new Swiper(".menuPage-menuContent__swiper", {
        grabCursor: true,
        loop: true,
        navigation: {
          nextEl: ".menuPage-menuContent__next",
          prevEl: ".menuPage-menuContent__prev",
        },
      });
  
    });
  
  
  });
}

if (window.matchMedia("(max-width: 1024px)").matches) {
  menuBtns.forEach(e => {
    e.addEventListener('click', el => {

      menuBtns.forEach(el => {
        el.classList.remove('activeBreadCrumbs');
      });
      e.classList.add('activeBreadCrumbs');
      
      menuItemsContainer.innerHTML = e.nextElementSibling.innerHTML;


      let menuContentSwiper = new Swiper(".menuPage-menuContent__swiper", {
        grabCursor: true,
        loop: true,
        navigation: {
          nextEl: ".menuPage-menuContent__next",
          prevEl: ".menuPage-menuContent__prev",
        },
      });
    });
  
  
  });
}



if (menuBtns.length) {
  menuBtns[0].click();
}