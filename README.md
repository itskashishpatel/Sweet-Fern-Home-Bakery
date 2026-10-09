Sweet Fern — Home Bakery Website

A responsive, six-page website for Sweet Fern, a home bakery based in Surat, Gujarat, India. Built with semantic HTML5, modular CSS3, and vanilla JavaScript, the website showcases bakery products, custom cake enquiries, the brand story, and contact information.

Overview

Sweet Fern is a lightweight, mobile-first website designed to provide a clear and accessible browsing experience without requiring a JavaScript framework, build tools, or a backend.

Technology stack

HTML5
CSS3 with modular stylesheets and design tokens
Vanilla JavaScript
WebP, PNG, and JPEG image assets
WhatsApp and email for customer enquiries
Features
Home: Brand introduction and featured products.
Menu: Bakery product categories and pricing.
Custom Cakes: Custom cake information and enquiry form.
Gallery: Image gallery with lightbox functionality.
About: Brand story, preparation process, and FAQs.
Contact: Contact information, business hours, location, and enquiry form.
Responsive design: Mobile-first layouts for different screen sizes.
Accessibility: Semantic HTML, keyboard-friendly navigation, labelled forms, and reduced-motion support.
Progressive enhancement: Core content remains readable without JavaScript.
Project Structure
sweet-fern/
├── index.html
├── menu.html
├── custom-cakes.html
├── gallery.html
├── about.html
├── contact.html
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── motion.css
├── js/
│   └── main.js
├── images/
├── robots.txt
├── sitemap.xml
└── README.md
Architecture

The website uses a modular stylesheet structure:

File	Responsibility
tokens.css	Colour palette, typography, spacing, radii, and shadows
base.css	Resets, typography, default elements, and accessibility foundations
layout.css	Page containers, sections, grids, header, and footer
components.css	Buttons, cards, forms, gallery, and overlays
motion.css	Scroll-reveal effects and reduced-motion handling
main.js	Navigation, forms, FAQs, gallery interactions, and other client-side behaviour

Stylesheet order matters: Load the stylesheets in the order listed above so design tokens are available to the styles that depend on them.

Design System

The visual system is centralised in css/tokens.css to maintain consistent styling throughout the website.

Colours: Forest green, warm cream, cocoa, antique gold, and ink.
Typography: Fraunces for headings and Inter for body text.
Spacing: A reusable spacing scale.
Components: Shared radius and shadow values.
Responsive layouts: Mobile-first styles with breakpoints at 560px, 768px, 1024px, and 1280px.

Update the design tokens centrally when adjusting the brand's visual identity.

JavaScript Functionality

The js/main.js file contains the website's interactive behaviour, including:

Header scroll state.
Accessible mobile navigation drawer.
Optional visitor personalisation.
Enquiry form validation and message composition.
FAQ accordion.
Gallery lightbox.
Business-hours display.
Automatic copyright year.
Scroll-reveal effects with reduced-motion support.
Customer Enquiries

The website does not use a backend or database. Enquiry forms validate the submitted information in the browser and prepare a message for WhatsApp or the visitor's email client.

Visitors review and send the message themselves. No server-side message processing is provided.

Before deployment, replace all demonstration contact details and configuration values with verified business information.

Configuration and Pre-Deployment Checklist

Review the following items before publishing the website:

Replace placeholder WhatsApp numbers and displayed phone numbers.

Replace placeholder email addresses.

Add the correct Instagram profile URL.

Add the verified Google Maps embed and business location.

Verify business hours and product pricing.

Replace sample testimonials with genuine testimonials used with permission.

Add the correct FSSAI registration or licence details where applicable.

Update canonical URLs, Open Graph URLs, sitemap.xml, and robots.txt.

Test navigation, gallery interactions, forms, and responsive layouts.

Check all internal links and image paths before deployment.

Accessibility

The website is designed with accessibility best practices in mind, with a target of WCAG 2.2 AA.

Implemented considerations include semantic landmarks, skip navigation links, labelled form controls, keyboard interaction, accessible error announcements, suitable touch-target sizes, and support for reduced-motion preferences.

The target is not a substitute for a formal accessibility audit; the deployed website should be tested against the applicable WCAG criteria.

Performance and Assets

The website uses optimised image assets and avoids a framework or build pipeline. Images are stored locally in the images/ directory.

Keep asset paths, image dimensions, and references consistent when updating or replacing images. Recheck performance and image quality after making changes.

Deployment

The site can be deployed to a static hosting provider, including GitHub Pages, Netlify, or Cloudflare Pages.

Upload the website files to the hosting provider.
Configure the deployment source and domain.
Update canonical URLs and sitemap references.
Verify the robots.txt configuration.
Test the deployed pages, forms, links, and images.
Submit the sitemap to Google Search Console if search indexing is desired.

No compilation or build step is required.

Ownership and Usage

Sweet Fern website source code and project assets are intended for authorised use only.

Unauthorised copying, redistribution, modification, or commercial reuse is not permitted without the owner's permission. Ownership of third-party materials, if any, remains subject to their respective terms.

This notice expresses the intended usage policy. Repository access controls and applicable legal protections must be used to enforce it; this README alone does not technically restrict copying or modification.

Sweet Fern — Home Bakery · Surat, Gujarat, India
