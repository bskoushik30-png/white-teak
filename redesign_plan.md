# White Teak Website Redesign Plan & Sequence

This document details the step-by-step implementation plan for the new scroll-triggered storyline and architectural updates to the White Teak website.

## 1. Architectural Changes
*   **Remove the Right-Side Container:** The separate section/border currently holding the animated assets will be completely removed.
*   **Floating Assets Pattern:** All animated assets will be integrated directly over the main website sections using `fixed` positioning with `z-index`. They will hover, float, and morph on top of the actual page layout instead of being confined to a split-screen or separate border area.
*   **Consistent Asset Sizing:** All generated assets (green bean, red cherry, white bean, roasted bean, espresso machine, droplet, cup) must share exactly uniform dimensions or viewport scaling so that transitions between them feel seamless without jarring jumps. If current assets differ in base sizes, we will regenerate them or normalize them via CSS.

## 2. Scroll-Triggered Color Journey
The website's background color will smoothly transition between sections as the user scrolls, reflecting the changing states of the coffee journey.

*   **Hero Section:** Very light shade of greenish-white.
*   **Catalog Section:** Transitioning to complement the Red Bean.
*   **Our Story Section:** Transitioning to complement the White Bean.
*   **Why People Choose Us Section:** Earthy, roasted tones.
*   **Follow the Journey / Social Media:** Sleek tones to complement the Espresso Machine.
*   **Testimonials Section:** Warm, inviting color suited for enjoying a final cup of coffee.

## 3. Scroll Animation Storyline Sequence
We will implement a timeline-based scroll animation (using GSAP + ScrollTrigger, Framer Motion, or custom React hooks) that perfectly syncs the central asset with the user's scroll position.

### • Sequence 1: The Raw Bean (Hero -> Catalog)
*   **Start:** A floating Green Coffee Bean in the Hero Section.
*   **Scroll Event:** As the user scrolls into the **Catalog** section, the Green Bean transforms (fade morph/color change) into a **Red Coffee Bean**.

### • Sequence 2: Processing (Catalog -> Our Story)
*   **Start:** Red Coffee Bean.
*   **Scroll Event:** As the user scrolls into the **Our Story** section, the Red Bean transforms into a **White Coffee Bean** (processed, unroasted).

### • Sequence 3: Roasting (Our Story -> Why People Choose Us)
*   **Start:** White Coffee Bean.
*   **Scroll Event:** As the user scrolls into the **Why People Choose Us** section, the White Bean goes through a roasting transition, turning into a **Light Roasted**, and then a **Medium Roasted Coffee Bean**.

### • Sequence 4: Extraction (Why People Choose Us -> Social Media)
*   **Start:** Medium Roasted Coffee Bean.
*   **Scroll Event:** As the user scrolls into the **Social Media (Follow the Journey)** section, the roasted bean falls or moves into a sleek **Espresso Machine**.

### • Sequence 5: The Pour (Social Media -> Testimonials)
*   **Start:** Espresso Machine.
*   **Scroll Event:** Upon reaching the **Testimonials** section, the machine is out of focus or gone, and **Droplets of Coffee** begin to fall. With each minor scroll down through the testimonials, droplets fall into a waiting **Coffee Cup**, representing the final enjoyable product.

## 4. Implementation Steps
1.  **Refactoring Layout (Cleanup):** Remove existing right-border layout constraints in the main `page.tsx` and related CSS layout wrappers. Make the main layout full-width.
2.  **Asset Normalization:** Regenerate or strictly resize all required sequence images to a standard dimension (e.g., `500x500`).
3.  **Scroll Container Setup:** Implement the scroll-tracking structure. The assets will live in a single fixed viewport-centered container with `pointer-events-none` so users can still interact with buttons underneath.
4.  **Background Color Timeline:** Wire up scroll listeners to interpolate the `<main>` background color based on scroll depth.
5.  **Animation Logic:**
    *   Map scroll progression percentages to opacity fades and scale transforms to smoothly swap the bean images.
    *   Set up the complex multi-stage animation for the Machine -> Droplet -> Cup sequence at the end.
6.  **Refinement:** Tweak easing curves, timing intervals, and intersection observer thresholds so the transitions happen precisely when the content of each new section becomes the main focus.
