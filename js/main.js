(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });

     // Populate Category Dropdown
     const categories = [
        "Science", "Technology", "Health and Medicine", "Arts and Humanities", "Social Sciences",
        "Business", "Education", "Law", "Engineering", "Agriculture", "Environmental Studies",
        "Mathematics", "Information Technology", "Psychology", "Journalism and Media", "Architecture",
        "Fashion Design", "Public Policy", "Veterinary Science", "Chemistry", "Biology", "Physics",
        "Nursing", "Public Health", "Finance", "Marketing", "Entrepreneurship", "Graphic Design",
        "Performing Arts", "Literature", "History", "Philosophy", "Sociology", "Political Science",
        "Economics", "Criminal Justice", "Environmental Law", "Computer Engineering", "Software Development",
        "Data Science", "Speech and Language Pathology", "Family and Consumer Sciences", "Media Studies",
        "Industrial Design", "Game Design", "Music", "Theatre Arts", "Digital Marketing", "Community Development"
    ];

    function populateCategoryDropdown() {
        const categorySelect = document.getElementById('category');
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.toLowerCase().replace(/\s+/g, '_');  // Example: "Health and Medicine" -> "health_and_medicine"
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Run the populate function when the DOM is fully loaded
    $(document).ready(populateCategoryDropdown);
    
})(jQuery);

