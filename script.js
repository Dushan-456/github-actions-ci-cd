document.addEventListener("DOMContentLoaded", () => {
   const menuButton = document.getElementById("mobile-menu-button");
   const mobileMenu = document.getElementById("mobile-menu");
   const cartCountEl = document.getElementById("cart-count");
   const cartButton = document.getElementById("cart-button");
   let cartCount = 0;

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
