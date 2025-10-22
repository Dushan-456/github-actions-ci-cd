document.addEventListener("DOMContentLoaded", () => {
   const menuButton = document.getElementById("mobile-menu-button");
   const mobileMenu = document.getElementById("mobile-menu");
   const cartCountEl = document.getElementById("cart-count");
   const cartButton = document.getElementById("cart-button");
   const hero = document.getElementById("hero");
   let cartCount = 0;

   // Smooth parallax using requestAnimationFrame with lerp
   if (hero) {
      const parallaxElements = Array.from(
         document.querySelectorAll("[data-depth]")
      );
      const shapes = Array.from(document.querySelectorAll(".shape"));

      // targets
      let targetMouseX = 0,
         targetMouseY = 0;
      let currentMouseX = 0,
         currentMouseY = 0;
      let targetScroll = window.pageYOffset || 0;
      let currentScroll = targetScroll;

      let centerX = window.innerWidth / 2;
      let centerY = window.innerHeight / 2;

      const isReducedMotion = window.matchMedia(
         "(prefers-reduced-motion: reduce)"
      ).matches;
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // clamp helper
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

      // lerp helper
      const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

      if (!isTouch && !isReducedMotion) {
         document.addEventListener("mousemove", (e) => {
            targetMouseX = e.clientX - centerX;
            targetMouseY = e.clientY - centerY;
         });
      }

      window.addEventListener(
         "scroll",
         () => {
            targetScroll = window.pageYOffset || 0;
         },
         { passive: true }
      );

      window.addEventListener("resize", () => {
         centerX = window.innerWidth / 2;
         centerY = window.innerHeight / 2;
      });

      // animation loop - smooths mouse and scroll values and applies transforms
      const animate = () => {
         // smooth the mouse and scroll
         currentMouseX = lerp(currentMouseX, targetMouseX, 0.09);
         currentMouseY = lerp(currentMouseY, targetMouseY, 0.09);
         currentScroll = lerp(currentScroll, targetScroll, 0.08);

         const normX = currentMouseX / centerX; // -1..1
         const normY = currentMouseY / centerY;

         // apply transforms to parallax elements
         parallaxElements.forEach((el) => {
            const depth = parseFloat(el.getAttribute("data-depth")) || 0;
            // combine scroll and mouse influence
            const scrollOffset = -(currentScroll * depth * 0.6);
            const mouseXMove = normX * depth * 28;
            const mouseYMove = normY * depth * 28;

            // apply with subtle rotation for depth
            const rot = normX * depth * 6;
            el.style.transform = `translate3d(${mouseXMove}px, ${
               mouseYMove + scrollOffset
            }px, 0) rotate(${rot}deg)`;
         });

         // shapes move more pronouncedly
         shapes.forEach((shape, i) => {
            const depth =
               parseFloat(shape.getAttribute("data-depth")) || 0.06 + i * 0.02;
            const sx = normX * (i + 1) * 34 * depth * 2;
            const sy =
               normY * (i + 1) * 34 * depth * 2 - currentScroll * depth * 0.08;
            shape.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
         });

         requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
   }

   if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", () => {
         // Toggle the 'hidden' class on the mobile menu
         mobileMenu.classList.toggle("hidden");
      });
   }

   // Handle add-to-cart buttons
   document.querySelectorAll('[data-action="add-to-cart"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
         const target = e.currentTarget;
         const name = target.dataset.name || "Item";
         const price = target.dataset.price || "0";
         const img = target.dataset.img;

         // increment count and update UI
         cartCount += 1;
         if (cartCountEl) cartCountEl.textContent = String(cartCount);

         // animate flying image if image provided and cart button present
         if (img && cartButton) {
            const flying = document.createElement("img");
            flying.src = img;
            flying.className = "flying-img";
            document.body.appendChild(flying);

            // start position: center of the product image/button
            const rect = target.getBoundingClientRect();
            flying.style.left = rect.left + "px";
            flying.style.top = rect.top + "px";
            flying.style.width = rect.width + "px";
            flying.style.height = rect.height + "px";

            // force layout then animate to cart button
            requestAnimationFrame(() => {
               const cartRect = cartButton.getBoundingClientRect();
               const dx =
                  cartRect.left +
                  cartRect.width / 2 -
                  (rect.left + rect.width / 2);
               const dy =
                  cartRect.top +
                  cartRect.height / 2 -
                  (rect.top + rect.height / 2);
               flying.style.transform = `translate(${dx}px, ${dy}px) scale(0.22)`;
               flying.style.opacity = "0.02";
            });

            // cleanup after animation
            setTimeout(() => {
               flying.remove();
               // small bounce effect on cart
               cartButton.animate(
                  [
                     { transform: "translateY(0)" },
                     { transform: "translateY(-6px)" },
                     { transform: "translateY(0)" },
                  ],
                  { duration: 350, easing: "cubic-bezier(.2,.9,.2,1)" }
               );
            }, 700);
         }

         // Optionally show a toast or message (simple alert here could be replaced)
         // console.log(`${name} added to cart - $${price}`);
      });
   });
});
